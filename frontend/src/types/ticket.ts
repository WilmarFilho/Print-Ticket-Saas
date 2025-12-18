export default interface TicketData {
  id: string;
  tenant_id: string;
  cliente_id: string;
  ativo_id: string;
  tecnico_id: string;
  titulo: string;
  descricao: string;
  prioridade: string;
  status: string;
  created_at: string;
  updated_at: string;
  clientes: {
    razao_social: string
  }
  ativos: {
    modelo: string;
    serial_number: string
  }
  tecnicos: {
    id: string;
    profiles: {
      email: string;
      nome: string;
    }
  }
}
