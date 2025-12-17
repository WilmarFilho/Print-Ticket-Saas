export class CreateTecnicoDto {
  tenant_id: string;
  // Dados Pessoais (vão para Auth e Profile)
  nome: string;
  email: string;
  password: string;
  // Dados Operacionais (vão para Tecnicos)
  status?: 'ativo' | 'inativo' | 'ferias'; // Opcional, default é 'ativo'
}
