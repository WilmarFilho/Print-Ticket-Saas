import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient } from '@supabase/supabase-js';
import { CreateTecnicoDto } from './dto/create-tecnico.dto';
import { UpdateTecnicoDto } from './dto/update-tecnico.dto';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class TecnicosService {
  constructor(
    private readonly supabase: SupabaseService,
    private readonly configService: ConfigService,
  ) {}

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

  async create(createTecnicoDto: CreateTecnicoDto) {
    const adminClient = this.getAdminClient();

    const { data: authData, error: authError } =
      await adminClient.auth.admin.createUser({
        email: createTecnicoDto.email,
        password: createTecnicoDto.password,
        email_confirm: true,
        user_metadata: {
          tenant_id: createTecnicoDto.tenant_id,
          tipo_usuario: 'tecnico',
        },
      });

    if (authError)
      throw new BadRequestException(
        `Erro ao criar login: ${authError.message}`,
      );

    try {
      const { data: tecnicoData, error: tecnicoError } = await adminClient
        .from('tecnicos')
        .insert({
          tenant_id: createTecnicoDto.tenant_id,
          status: createTecnicoDto.status || 'ativo',
        })
        .select()
        .single();

      if (tecnicoError)
        throw new Error(`Erro tabela tecnicos: ${tecnicoError.message}`);

      const { error: profileError } = await adminClient
        .from('profiles')
        .insert({
          id: authData.user.id,
          tenant_id: createTecnicoDto.tenant_id,
          tecnico_id: tecnicoData.id,
          nome: createTecnicoDto.nome,
          email: createTecnicoDto.email,
          tipo_usuario: 'tecnico',
        });

      if (profileError)
        throw new Error(`Erro tabela profiles: ${profileError.message}`);

      return {
        ...tecnicoData,
        profiles: [
          { nome: createTecnicoDto.nome, email: createTecnicoDto.email },
        ],
      };
    } catch (error: any) {
      await adminClient.auth.admin.deleteUser(authData.user.id);
      throw new BadRequestException(error.message);
    }
  }

  async findAll() {
    const { data, error } = await this.supabase.getClient().from('tecnicos')
      .select(`
        *,
        profiles (
          nome,
          email
        )
      `);

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
          id,
          nome,
          email
        )
      `,
      )
      .eq('id', id)
      .single();

    if (error) throw new BadRequestException(error.message);
    return data;
  }

  async update(id: string, updateTecnicoDto: UpdateTecnicoDto) {
    const adminClient = this.getAdminClient();

    const { data: profileData, error: findError } = await adminClient
      .from('profiles')
      .select('id, email')
      .eq('tecnico_id', id)
      .single();

    if (findError || !profileData) {
      throw new NotFoundException('Perfil do técnico não encontrado.');
    }

    const authUserId = profileData.id;

    if (updateTecnicoDto.status) {
      const { error: techError } = await adminClient
        .from('tecnicos')
        .update({ status: updateTecnicoDto.status })
        .eq('id', id);

      if (techError)
        throw new BadRequestException(
          `Erro ao atualizar status: ${techError.message}`,
        );
    }

    if (updateTecnicoDto.nome || updateTecnicoDto.email) {
      const { error: profileError } = await adminClient
        .from('profiles')
        .update({
          nome: updateTecnicoDto.nome,
          email: updateTecnicoDto.email,
        })
        .eq('id', authUserId);

      if (profileError)
        throw new BadRequestException(
          `Erro ao atualizar perfil: ${profileError.message}`,
        );
    }

    if (
      updateTecnicoDto.email &&
      updateTecnicoDto.email !== profileData.email
    ) {
      const { error: authError } = await adminClient.auth.admin.updateUserById(
        authUserId,
        {
          email: updateTecnicoDto.email,
          email_confirm: true,
        },
      );

      if (authError)
        throw new BadRequestException(
          `Erro ao atualizar login (Auth): ${authError.message}`,
        );
    }

    if (updateTecnicoDto.password) {
      const { error: authError } = await adminClient.auth.admin.updateUserById(
        authUserId,
        {
          password: updateTecnicoDto.password,
        },
      );

      if (authError)
        throw new BadRequestException(
          `Erro ao atualizar login (Auth): ${authError.message}`,
        );
    }

    return this.findOne(id);
  }

  async remove(id: string) {
    const { error } = await this.supabase
      .getClient()
      .from('tecnicos')
      .delete()
      .eq('id', id);

    if (error) throw new BadRequestException(error.message);
    return { message: 'Técnico removido com sucesso' };
  }
}
