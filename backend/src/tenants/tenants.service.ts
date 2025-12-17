import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config'; // Importante para ler o .env
import { CreateTenantDto } from './dto/create-tenant.dto';
import { UpdateTenantDto } from './dto/update-tenant.dto';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class TenantsService {
  constructor(
    private readonly supabase: SupabaseService,
    private readonly configService: ConfigService, // Injeção do Config
  ) {}

  async create(createTenantDto: CreateTenantDto) {
    // 0. VERIFICAÇÃO DE SEGURANÇA
    const secretKey = this.configService.get<string>('SAAS_ADMIN_KEY');
    if (createTenantDto.saas_api_key !== secretKey) {
      throw new UnauthorizedException(
        'Chave de API do SaaS inválida. Você não tem permissão para criar Tenants.',
      );
    }

    const client = this.supabase.getClient();

    // 1. CRIAR A EMPRESA (TENANT)
    const { data: tenantData, error: tenantError } = await client
      .from('tenants')
      .insert({
        nome_empresa: createTenantDto.nome_empresa,
        documento: createTenantDto.documento,
      })
      .select()
      .single();

    if (tenantError)
      throw new BadRequestException(
        `Erro ao criar empresa: ${tenantError.message}`,
      );

    // --- Bloco de Criação do Usuário Admin ---
    try {
      // 2. CRIAR USUÁRIO NO AUTH
      const { data: authData, error: authError } =
        await client.auth.admin.createUser({
          email: createTenantDto.email_admin,
          password: createTenantDto.password_admin,
          email_confirm: true,
          user_metadata: {
            tenant_id: tenantData.id,
            tipo_usuario: 'admin', // Flag importante para o Frontend
            nome: createTenantDto.nome_admin,
          },
        });

      if (authError)
        throw new Error(`Erro ao criar login admin: ${authError.message}`);

      // 3. CRIAR O PERFIL (PROFILE) DO ADMIN
      // Nota: Admins não precisam de cliente_id nem tecnico_id, então mandamos null ou omitimos
      const { error: profileError } = await client.from('profiles').insert({
        id: authData.user.id,
        tenant_id: tenantData.id,
        nome: createTenantDto.nome_admin,
        email: createTenantDto.email_admin,
        tipo_usuario: 'admin',
        // Constraints do banco: cliente_id e tecnico_id ficarão NULL, o que é válido para admin
      });

      if (profileError) {
        // Se falhar o profile, apaga o Auth User
        await client.auth.admin.deleteUser(authData.user.id);
        throw new Error(`Erro ao criar perfil admin: ${profileError.message}`);
      }

      // SUCESSO!
      return {
        message: 'Tenant criado com sucesso!',
        tenant: tenantData,
        admin: {
          id: authData.user.id,
          email: authData.user.email,
          nome: createTenantDto.nome_admin,
        },
      };
    } catch (error) {
      // ROLLBACK MASTER: Se qualquer coisa falhar após a criação do tenant, DELETAMOS O TENANT.
      // Isso é crucial para não deixar empresas "zumbis" sem admin no banco.
      await client.from('tenants').delete().eq('id', tenantData.id);

      throw new BadRequestException(
        error instanceof Error ? error.message : 'Erro desconhecido',
      );
    }
  }

  // --- MÉTODOS DE LEITURA (Pode manter simples ou proteger também) ---

  async findAll() {
    // Listar todos os tenants geralmente é coisa de Super Admin
    const { data, error } = await this.supabase
      .getClient()
      .from('tenants')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw new BadRequestException(error.message);
    return data;
  }

  async findOne(id: string) {
    const { data, error } = await this.supabase
      .getClient()
      .from('tenants')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw new BadRequestException(error.message);
    return data;
  }

  async update(id: string, updateTenantDto: UpdateTenantDto) {
    const { data, error } = await this.supabase
      .getClient()
      .from('tenants')
      .update({
        nome_empresa: updateTenantDto.nome_empresa,
        documento: updateTenantDto.documento,
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw new BadRequestException(error.message);
    return data;
  }

  async remove(id: string) {
    // Deletar um tenant deve ser cascading no banco (apagar users, profiles, clientes, etc)
    const { error } = await this.supabase
      .getClient()
      .from('tenants')
      .delete()
      .eq('id', id);

    if (error) throw new BadRequestException(error.message);
    return { message: 'Tenant e todos os seus dados foram removidos.' };
  }
}
