import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateTecnicoDto } from './dto/create-tecnico.dto';
import { UpdateTecnicoDto } from './dto/update-tecnico.dto';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class TecnicosService {
  constructor(private readonly supabase: SupabaseService) {}

  async create(createTecnicoDto: CreateTecnicoDto) {
    const client = this.supabase.getClient();

    // 1. PRIMEIRO PASSO: Criar o Técnico (para gerar o ID que o profile exige)
    const { data: tecnicoData, error: tecnicoError } = await client
      .from('tecnicos')
      .insert({
        tenant_id: createTecnicoDto.tenant_id,
        status: createTecnicoDto.status || 'ativo',
      })
      .select()
      .single();

    if (tecnicoError)
      throw new BadRequestException(
        `Erro ao iniciar cadastro do técnico: ${tecnicoError.message}`,
      );

    // --- Bloco de Criação de Usuário (Auth + Profile) ---
    try {
      // 2. Criar Usuário no Auth
      const { data: authData, error: authError } =
        await client.auth.admin.createUser({
          email: createTecnicoDto.email,
          password: createTecnicoDto.password,
          email_confirm: true,
          user_metadata: {
            tenant_id: createTecnicoDto.tenant_id,
            tipo_usuario: 'tecnico',
            nome: createTecnicoDto.nome,
          },
        });

      if (authError)
        throw new Error(`Erro ao criar login: ${authError.message}`);

      // 3. Criar o Perfil (Agora sim temos o tecnicoData.id para preencher a FK)
      const { error: profileError } = await client.from('profiles').insert({
        id: authData.user.id, // ID do Auth
        tenant_id: createTecnicoDto.tenant_id,
        tecnico_id: tecnicoData.id,
        cliente_id: null, // Garantir que é null
        nome: createTecnicoDto.nome,
        email: createTecnicoDto.email,
        tipo_usuario: 'tecnico',
      });

      if (profileError) {
        // Se falhar no profile, deleta o usuário do Auth para não ficar órfão
        await client.auth.admin.deleteUser(authData.user.id);
        throw new Error(`Erro ao criar perfil: ${profileError.message}`);
      }

      // Sucesso Total
      return {
        ...tecnicoData,
        profile: {
          nome: createTecnicoDto.nome,
          email: createTecnicoDto.email,
        },
      };
    } catch (error) {
      // ROLLBACK: Se deu erro no Auth ou no Profile, precisamos apagar o técnico criado no passo 1
      // Senão teremos um técnico "fantasma" sem usuário associado.
      await client.from('tecnicos').delete().eq('id', tecnicoData.id);

      throw new BadRequestException(
        error instanceof Error ? error.message : 'Erro desconhecido',
      );
    }
  }

  async findAll() {
    // Busca na tabela profiles filtrando por tipo (trazendo o ID do tecnico junto)
    // É mais fácil consultar 'profiles' pois lá tem os nomes, e fazemos o join inverso se precisar
    // Mas para manter a consistência do endpoint /tecnicos, vamos consultar a tabela tecnicos e trazer o profile associado.

    const { data, error } = await this.supabase
      .getClient()
      .from('tecnicos')
      .select(
        `
          *,
          profiles (
            nome,
            email,
            avatar_url
          )
        `,
      )
      .order('created_at', { ascending: false });

    if (error) throw new BadRequestException(error.message);
    return data;
  }

  async findOne(id: string) {
    const { data, error } = await this.supabase
      .getClient()
      .from('tecnicos')
      .select(
        `
        *,
        profiles (
          nome,
          email,
          telefone
        )
      `,
      )
      .eq('id', id)
      .single();

    if (error) throw new BadRequestException(error.message);
    return data;
  }

  async update(id: string, updateTecnicoDto: UpdateTecnicoDto) {
    // Atualiza status na tabela tecnicos
    const { data, error } = await this.supabase
      .getClient()
      .from('tecnicos')
      .update({
        status: updateTecnicoDto.status,
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw new BadRequestException(error.message);
    return data;
  }

  async remove(id: string) {
    // Ao deletar o técnico, a constraint 'on delete set null' no profile vai disparar?
    // Seu SQL diz: tecnico_id uuid references tecnicos(id) on delete set null
    // Então se deletarmos o técnico, o profile perde o vínculo mas continua existindo como usuário.
    // Isso é o comportamento desejado? Geralmente sim, para histórico.

    const { error } = await this.supabase
      .getClient()
      .from('tecnicos')
      .delete()
      .eq('id', id);

    if (error) throw new BadRequestException(error.message);
    return { message: 'Técnico removido com sucesso' };
  }
}
