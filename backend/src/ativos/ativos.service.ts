import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { CreateAtivoDto } from './dto/create-ativo.dto';
import { UpdateAtivoDto } from './dto/update-ativo.dto';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class AtivosService {
  constructor(private readonly supabase: SupabaseService) {}

  async create(createAtivoDto: CreateAtivoDto) {
    const { data, error } = await this.supabase
      .getClient()
      .from('ativos')
      .insert(createAtivoDto)
      .select()
      .single();

    if (error) {
      // Tratamento especial para erro de duplicidade (Serial Number único)
      if (error.code === '23505') {
        throw new BadRequestException(
          'Já existe um ativo com este Serial Number.',
        );
      }
      throw new BadRequestException(error.message);
    }
    return data;
  }

  async findAll() {
    // Trazemos os dados do Ativo + Dados do Cliente (Join)
    // Sintaxe: *, clientes(*) -> Traz tudo de ativos e tudo de clientes
    const { data, error } = await this.supabase
      .getClient()
      .from('ativos')
      .select('*, clientes(id, razao_social)')
      .order('created_at', { ascending: false });

    if (error) throw new BadRequestException(error.message);
    return data;
  }

  async findOne(id: string) {
    const { data, error } = await this.supabase
      .getClient()
      .from('ativos')
      .select('*, clientes(*)')
      .eq('id', id)
      .single();

    if (error) throw new NotFoundException(`Ativo com ID ${id} não encontrado`);
    return data;
  }

  async update(id: string, updateAtivoDto: UpdateAtivoDto) {
    const { data, error } = await this.supabase
      .getClient()
      .from('ativos')
      .update(updateAtivoDto)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new BadRequestException(error.message);
    return data;
  }

  async remove(id: string) {
    const { error } = await this.supabase
      .getClient()
      .from('ativos')
      .delete()
      .eq('id', id);

    if (error) throw new BadRequestException(error.message);
    return { message: 'Ativo removido com sucesso' };
  }
}
