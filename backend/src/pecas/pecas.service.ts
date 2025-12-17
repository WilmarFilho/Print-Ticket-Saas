import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { CreatePecaDto } from './dto/create-peca.dto';
import { UpdatePecaDto } from './dto/update-peca.dto';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class PecasService {
  constructor(private readonly supabase: SupabaseService) {}

  async create(createPecaDto: CreatePecaDto) {
    const { data, error } = await this.supabase
      .getClient()
      .from('pecas')
      .insert(createPecaDto)
      .select()
      .single();

    if (error) throw new BadRequestException(error.message);
    return data;
  }

  async findAll() {
    const { data, error } = await this.supabase
      .getClient()
      .from('pecas')
      .select('*')
      .order('nome', { ascending: true }); // Ordenar alfabeticamente ajuda no frontend

    if (error) throw new BadRequestException(error.message);
    return data;
  }

  async findOne(id: string) {
    const { data, error } = await this.supabase
      .getClient()
      .from('pecas')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw new NotFoundException(`Peça com ID ${id} não encontrada`);
    return data;
  }

  async update(id: string, updatePecaDto: UpdatePecaDto) {
    const { data, error } = await this.supabase
      .getClient()
      .from('pecas')
      .update(updatePecaDto)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new BadRequestException(error.message);
    return data;
  }

  async remove(id: string) {
    const { error } = await this.supabase
      .getClient()
      .from('pecas')
      .delete()
      .eq('id', id);

    if (error) throw new BadRequestException(error.message);
    return { message: 'Peça removida com sucesso' };
  }
}
