export class CreateTicketDto {
  tenant_id: string;
  cliente_id: string;
  ativo_id: string;
  tecnico_id: string;
  titulo: string;
  descricao?: string;
  prioridade?: 'baixa' | 'media' | 'alta' | 'critica';
  status?:
    | 'aberto'
    | 'em_andamento'
    | 'aguardando_peca'
    | 'resolvido'
    | 'cancelado';
}
