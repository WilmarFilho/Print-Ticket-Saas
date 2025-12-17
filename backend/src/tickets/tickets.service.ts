import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class TicketsService {
  constructor(private readonly supabase: SupabaseService) {}

  async create(createTicketDto: CreateTicketDto) {
    const { data, error } = await this.supabase
      .getClient()
      .from('tickets')
      .insert(createTicketDto)
      .select()
      .single();

    if (error) throw new BadRequestException(error.message);
    return data;
  }

  async findAll() {
    // AQUI A MÁGICA ACONTECE:
    // Trazemos Cliente (razão social), Ativo (modelo) e Técnico -> Profile (nome)
    const { data, error } = await this.supabase
      .getClient()
      .from('tickets')
      .select(
        `
        *,
        clientes (razao_social),
        ativos (modelo, serial_number),
        tecnicos (
          id,
          profiles (nome, email)
        )
      `,
      )
      .order('created_at', { ascending: false });

    if (error) throw new BadRequestException(error.message);
    return data;
  }

  async findOne(id: string) {
    const { data, error } = await this.supabase
      .getClient()
      .from('tickets')
      .select(
        `
        *,
        clientes (*),
        ativos (*),
        tecnicos (
          *,
          profiles (nome, email, telefone)
        )
      `,
      )
      .eq('id', id)
      .single();

    if (error) throw new NotFoundException(`Ticket ${id} não encontrado`);
    return data;
  }

  async update(id: string, updateTicketDto: UpdateTicketDto) {
    const { data, error } = await this.supabase
      .getClient()
      .from('tickets')
      .update(updateTicketDto)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new BadRequestException(error.message);
    return data;
  }

  async remove(id: string) {
    const { error } = await this.supabase
      .getClient()
      .from('tickets')
      .delete()
      .eq('id', id);

    if (error) throw new BadRequestException(error.message);
    return { message: 'Ticket removido com sucesso' };
  }
}
