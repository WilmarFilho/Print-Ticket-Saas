export class CreateTenantDto {
  // Segurança
  saas_api_key: string;

  // Dados da Empresa
  nome_empresa: string;
  documento: string; // CNPJ

  // Dados do Primeiro Administrador (Dono)
  nome_admin: string;
  email_admin: string;
  password_admin: string;
}
