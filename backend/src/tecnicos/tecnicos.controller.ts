import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { TecnicosService } from './tecnicos.service';
import { CreateTecnicoDto } from './dto/create-tecnico.dto';
import { UpdateTecnicoDto } from './dto/update-tecnico.dto';

@Controller('tecnicos')
export class TecnicosController {
  constructor(private readonly tecnicosService: TecnicosService) {}

  @Post()
  create(@Body() createTecnicoDto: CreateTecnicoDto) {
    return this.tecnicosService.create(createTecnicoDto);
  }

  @Get()
  findAll() {
    return this.tecnicosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tecnicosService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTecnicoDto: UpdateTecnicoDto) {
    return this.tecnicosService.update(id, updateTecnicoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tecnicosService.remove(id);
  }
}
