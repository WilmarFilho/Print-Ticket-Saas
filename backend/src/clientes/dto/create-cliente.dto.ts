export class CreateClienteDto {
  tenant_id: string;
  // Dados da Empresa (Tabela clientes)
  razao_social: string;
  documento: string;
  endereco?: string;
  telefone?: string;
  // Dados do Usuário Responsável (Auth + Profile)
  nome_responsavel: string;
  email: string;
  password: string;
}
