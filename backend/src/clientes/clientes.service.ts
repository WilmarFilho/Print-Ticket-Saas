import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class ClientesService {
  constructor(private readonly supabase: SupabaseService) {}

  async create(createClienteDto: CreateClienteDto) {
    const client = this.supabase.getClient();

    // 1. Criar a Empresa (Cliente)
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

    // --- Início da criação do Usuário ---
    try {
      // 2. Criar Auth
      const { data: authData, error: authError } =
        await client.auth.admin.createUser({
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
      const { error: profileError } = await client.from('profiles').insert({
        id: authData.user.id,
        tenant_id: createClienteDto.tenant_id,
        cliente_id: clienteData.id, // VÍNCULO IMPORTANTE
        nome: createClienteDto.nome_responsavel,
        email: createClienteDto.email,
        tipo_usuario: 'cliente',
      });

      if (profileError) {
        await client.auth.admin.deleteUser(authData.user.id);
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
    } catch (error) {
      await client.from('clientes').delete().eq('id', clienteData.id);
      throw new BadRequestException(
        error instanceof Error ? error.message : 'Erro desconhecido',
      );
    }
  }

  async findAll() {
    // JOIN: Trazemos todos os campos de clientes (*) e campos específicos de profiles
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

    // DICA: O Supabase retorna 'profiles' como um ARRAY [].
    // Se você quiser facilitar pro frontend, pode mapear aqui, mas geralmente tratamos no front.
    return data;
  }

  async findOne(id: string) {
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
          telefone
        )
      `,
      )
      .eq('id', id)
      .single();

    if (error) throw new NotFoundException('Cliente não encontrado');
    return data;
  }

  // ... (manter update e remove)
  async update(id: string, updateClienteDto: UpdateClienteDto) {
    const { data, error } = await this.supabase
      .getClient()
      .from('clientes')
      .update(updateClienteDto) // Cuidado: updateClienteDto não deve ter email/senha
      .eq('id', id)
      .select()
      .single();

    if (error) throw new BadRequestException(error.message);
    return data;
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
