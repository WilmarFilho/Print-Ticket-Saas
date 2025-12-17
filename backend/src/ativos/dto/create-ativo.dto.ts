export class CreateAtivoDto {
  tenant_id: string; // Temporário
  cliente_id?: string | null; // Opcional (pode ser null se estiver em estoque)
  modelo: string;
  serial_number: string;
  status?: 'online' | 'offline' | 'instavel' | 'desconhecido'; // Opcional, default é 'offline'
  contador_atual?: number; // Opcional, default é 0
}
