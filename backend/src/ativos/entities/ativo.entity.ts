export class Ativo {
  id: string;
  tenant_id: string;
  cliente_id: string | null;
  modelo: string;
  serial_number: string;
  status: string;
  contador_atual: number;
  created_at: string;
  updated_at: string;
}
