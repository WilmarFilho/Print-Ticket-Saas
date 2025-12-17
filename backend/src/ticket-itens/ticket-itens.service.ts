import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateTicketItenDto } from './dto/create-ticket-iten.dto';
import { UpdateTicketItenDto } from './dto/update-ticket-iten.dto';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class TicketItensService {
  constructor(private readonly supabase: SupabaseService) {}

  async create(createDto: CreateTicketItenDto) {
    const { data, error } = await this.supabase
      .getClient()
      .from('ticket_itens')
      .insert(createDto)
      .select()
      .single();

    if (error) throw new BadRequestException(error.message);
    return data;
  }

  // Busca itens de UM ticket específico
  async findByTicket(ticketId: string) {
    const { data, error } = await this.supabase
      .getClient()
      .from('ticket_itens')
      .select('*, pecas(nome, codigo_sku, valor_venda)')
      .eq('ticket_id', ticketId);

    if (error) throw new BadRequestException(error.message);
    return data;
  }
  // Métodos padrão (update, remove) seguem a mesma lógica...
  async remove(id: string) {
    const { error } = await this.supabase
      .getClient()
      .from('ticket_itens')
      .delete()
      .eq('id', id);
    if (error) throw new BadRequestException(error.message);
    return { message: 'Item removido' };
  }
}
