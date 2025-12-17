export class Ticket {
  id: string;
  tenant_id: string;
  cliente_id: string;
  ativo_id: string;
  tecnico_id: string;
  titulo: string;
  descricao: string | null;
  prioridade: string;
  status: string;
  created_at: string;
  updated_at: string;
}
