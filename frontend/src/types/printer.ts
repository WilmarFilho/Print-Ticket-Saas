export default interface PrinterData {
  id: string;
  tenant_id: string;
  cliente_id: string;
  modelo: string;
  serial_number: string;
  status: 'online' | 'offline' | 'instavel' | 'desconhecido';
  contador_atual: number;
  created_at: string;
  updated_at: string;
  clientes: {
    id: string;
    razao_social: string;
  }
}
