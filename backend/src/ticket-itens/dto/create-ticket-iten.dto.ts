export class CreateTicketItenDto {
  ticket_id: string;
  peca_id: string; // ID da peça criada anteriormente
  quantidade?: number; // Default 1
}
