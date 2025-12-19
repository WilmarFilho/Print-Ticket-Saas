import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config'; // <--- Importante
import { createClient } from '@supabase/supabase-js';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class ClientesService {
  constructor(
    private readonly supabase: SupabaseService,
    private readonly configService: ConfigService, // <--- Injeção necessária para updates administrativos
  ) {}

  // Cliente Admin para operações sensíveis (Auth/Profile de terceiros)
  private getAdminClient() {
    return createClient(
      this.configService.get<string>('SUPABASE_URL')!,
      this.configService.get<string>('SUPABASE_KEY')!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      },
    );
  }

  async create(createClienteDto: CreateClienteDto) {
    const client = this.supabase.getClient(); // Usa o cliente do usuário logado (RLS)

    // 1. Criar a Empresa (Cliente)
    // Nota: Como o usuário logado (Admin) tem permissão RLS para criar, usamos 'client' normal aqui.
    // Se der erro de permissão no futuro, mude para adminClient.
    const { data: clienteData, error: clienteError } = await client
      .from('clientes')
      .insert({
        tenant_id: createClienteDto.tenant_id,
        razao_social: createClienteDto.razao_social,
        documento: createClienteDto.documento,
        endereco: createClienteDto.endereco,
        telefone: createClienteDto.telefone,
      })
      .select()
      .single();

    if (clienteError)
      throw new BadRequestException(
        `Erro ao criar empresa: ${clienteError.message}`,
      );

    const adminClient = this.getAdminClient(); // Necessário para criar Usuários no Auth

    try {
      // 2. Criar Auth
      const { data: authData, error: authError } =
        await adminClient.auth.admin.createUser({
          email: createClienteDto.email,
          password: createClienteDto.password,
          email_confirm: true,
          user_metadata: {
            tenant_id: createClienteDto.tenant_id,
            tipo_usuario: 'cliente',
          },
        });

      if (authError)
        throw new Error(`Erro ao criar login: ${authError.message}`);

      // 3. Criar Profile vinculado ao Cliente
      const { error: profileError } = await adminClient
        .from('profiles')
        .insert({
          id: authData.user.id,
          tenant_id: createClienteDto.tenant_id,
          cliente_id: clienteData.id,
          nome: createClienteDto.nome_responsavel,
          email: createClienteDto.email,
          tipo_usuario: 'cliente',
        });

      if (profileError) {
        await adminClient.auth.admin.deleteUser(authData.user.id);
        throw new Error(`Erro ao criar perfil: ${profileError.message}`);
      }

      return {
        ...clienteData,
        usuario_criado: {
          id: authData.user.id,
          nome: createClienteDto.nome_responsavel,
          email: createClienteDto.email,
        },
      };
    } catch (error: any) {
      // Rollback: apaga a empresa se falhar a criação do usuário
      await client.from('clientes').delete().eq('id', clienteData.id);
      throw new BadRequestException(error.message);
    }
  }

  async findAll() {
    const { data, error } = await this.supabase
      .getClient()
      .from('clientes')
      .select(
        `
        *,
        profiles (
          id,
          nome,
          email,
          avatar_url
        )
      `,
      )
      .order('razao_social', { ascending: true });

    if (error) throw new BadRequestException(error.message);
    return data;
  }

  async findOne(id: string) {
    console.log(id);
    const { data, error } = await this.supabase
      .getClient()
      .from('clientes')
      .select(
        `
        *,
        profiles (
          id,
          nome,
          email,
          avatar_url
        )
      `,
      )
      .eq('id', id)
      .single();

    if (error) throw new NotFoundException('Cliente não encontrado');
    return data;
  }

  async update(id: string, updateClienteDto: UpdateClienteDto) {
    const adminClient = this.getAdminClient();

    // 1. Atualizar dados da EMPRESA (Tabela clientes)
    // Filtramos apenas os campos que pertencem à tabela clientes
    const dadosEmpresa = {
      razao_social: updateClienteDto.razao_social,
      documento: updateClienteDto.documento,
      endereco: updateClienteDto.endereco,
      telefone: updateClienteDto.telefone, // Telefone da empresa
    };

    // Remove chaves undefined/null para não apagar dados sem querer
    const dadosEmpresaLimpos = Object.fromEntries(
      Object.entries(dadosEmpresa).filter(
        ([_, v]) => v !== undefined && v !== null && v !== '',
      ),
    );

    if (Object.keys(dadosEmpresaLimpos).length > 0) {
      const { error: updateError } = await this.supabase
        .getClient() // Pode usar client normal aqui se tiver RLS configurado
        .from('clientes')
        .update(dadosEmpresaLimpos)
        .eq('id', id);

      if (updateError)
        throw new BadRequestException(
          `Erro ao atualizar empresa: ${updateError.message}`,
        );
    }

    // 2. Atualizar dados do GESTOR (Profiles e Auth)
    // Se houver campos de perfil/auth para atualizar
    if (
      updateClienteDto.nome_responsavel ||
      updateClienteDto.email ||
      updateClienteDto.password
    ) {
      // Descobrir quem é o gestor dessa empresa
      const { data: profileData, error: findError } = await adminClient
        .from('profiles')
        .select('id, email')
        .eq('cliente_id', id)
        .single();

      // Se não achar perfil (ex: empresa sem dono), loga aviso mas não falha o update da empresa
      if (findError || !profileData) {
        console.warn(`Perfil de gestor não encontrado para cliente ${id}`);
      } else {
        const authUserId = profileData.id;

        // 2a. Atualizar Tabela Profiles
        if (updateClienteDto.nome_responsavel || updateClienteDto.email) {
          const { error: profileError } = await adminClient
            .from('profiles')
            .update({
              nome: updateClienteDto.nome_responsavel, // Mapeia DTO -> Coluna Banco
              email: updateClienteDto.email,
            })
            .eq('id', authUserId);

          if (profileError)
            throw new BadRequestException(
              `Erro ao atualizar perfil do gestor: ${profileError.message}`,
            );
        }

        // 2b. Atualizar Auth (Login/Senha)
        if (
          (updateClienteDto.email &&
            updateClienteDto.email !== profileData.email) ||
          updateClienteDto.password
        ) {
          const { error: authError } =
            await adminClient.auth.admin.updateUserById(authUserId, {
              email: updateClienteDto.email,
              email_confirm: true,
              password: updateClienteDto.password,
            });

          if (authError)
            throw new BadRequestException(
              `Erro ao atualizar credenciais: ${authError.message}`,
            );
        }
      }
    }

    // Retorna o objeto completo atualizado
    return this.findOne(id);
  }

  async remove(id: string) {
    const { error } = await this.supabase
      .getClient()
      .from('clientes')
      .delete()
      .eq('id', id);
    if (error) throw new BadRequestException(error.message);
    return { message: 'Cliente removido' };
  }
}
