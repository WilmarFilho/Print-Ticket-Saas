import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class ClientesService {
  constructor(private readonly supabase: SupabaseService) {}

  async create(createClienteDto: CreateClienteDto) {
    const client = this.supabase.getClient();

    // 1. Criar a Empresa (Cliente) na tabela 'clientes'
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
      // 2. Criar o Usuário no Supabase Auth
      // Usamos admin.createUser para criar sem deslogar o admin atual e já confirmar o email
      const { data: authData, error: authError } =
        await client.auth.admin.createUser({
          email: createClienteDto.email,
          password: createClienteDto.password,
          email_confirm: true, // Já cria confirmado
          user_metadata: {
            tenant_id: createClienteDto.tenant_id,
            tipo_usuario: 'cliente',
          },
        });

      if (authError)
        throw new Error(`Erro ao criar login: ${authError.message}`);

      // 3. Criar o Perfil na tabela 'profiles' vinculado ao Auth e ao Cliente
      const { error: profileError } = await client.from('profiles').insert({
        id: authData.user.id, // ID que veio do Auth
        tenant_id: createClienteDto.tenant_id,
        cliente_id: clienteData.id, // ID da empresa criada no passo 1
        nome: createClienteDto.nome_responsavel,
        email: createClienteDto.email,
        tipo_usuario: 'cliente',
      });

      if (profileError) {
        // Se falhar no profile, precisamos apagar o usuário do Auth para não ficar órfão
        await client.auth.admin.deleteUser(authData.user.id);
        throw new Error(`Erro ao criar perfil: ${profileError.message}`);
      }

      // Sucesso total: Retorna os dados combinados
      return {
        ...clienteData,
        usuario_criado: {
          id: authData.user.id,
          email: authData.user.email,
          nome: createClienteDto.nome_responsavel,
        },
      };
    } catch (error) {
      // ROLLBACK: Se deu erro na etapa de usuário ou perfil, apagamos a empresa criada no passo 1
      await client.from('clientes').delete().eq('id', clienteData.id);
      throw new BadRequestException(error.message);
    }
  }

  // ... (Manter findAll, findOne, update, remove iguais ou ajustar conforme necessidade)

  async findAll() {
    const { data, error } = await this.supabase
      .getClient()
      .from('clientes')
      .select('*')
      .order('razao_social', { ascending: true });

    if (error) throw new BadRequestException(error.message);
    return data;
  }

  async findOne(id: string) {
    const { data, error } = await this.supabase
      .getClient()
      .from('clientes')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw new BadRequestException(error.message);
    return data;
  }

  // Update e Remove continuam focados apenas na tabela Clientes por enquanto
  // (Pode expandir depois se quiser alterar email/senha por aqui)

  async update(id: string, updateClienteDto: UpdateClienteDto) {
    // Implementação padrão...
    return { message: 'Update simplificado por enquanto' };
  }

  async remove(id: string) {
    // Implementação padrão...
    return { message: 'Remove simplificado por enquanto' };
  }
}
