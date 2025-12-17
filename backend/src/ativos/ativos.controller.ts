import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AtivosService } from './ativos.service';
import { CreateAtivoDto } from './dto/create-ativo.dto';
import { UpdateAtivoDto } from './dto/update-ativo.dto';

@Controller('ativos')
export class AtivosController {
  constructor(private readonly ativosService: AtivosService) {}

  @Post()
  create(@Body() createAtivoDto: CreateAtivoDto) {
    return this.ativosService.create(createAtivoDto);
  }

  @Get()
  findAll() {
    return this.ativosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ativosService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAtivoDto: UpdateAtivoDto) {
    return this.ativosService.update(id, updateAtivoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ativosService.remove(id);
  }
}
