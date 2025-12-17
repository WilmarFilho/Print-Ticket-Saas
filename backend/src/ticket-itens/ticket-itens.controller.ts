import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { TicketItensService } from './ticket-itens.service';
import { CreateTicketItenDto } from './dto/create-ticket-iten.dto';

@Controller('ticket-itens')
export class TicketItensController {
  constructor(private readonly service: TicketItensService) {}

  @Post()
  create(@Body() createDto: CreateTicketItenDto) {
    return this.service.create(createDto);
  }

  // Endpoint especial: GET /ticket-itens/ticket/UUID-DO-TICKET
  @Get('ticket/:ticketId')
  findByTicket(@Param('ticketId') ticketId: string) {
    return this.service.findByTicket(ticketId);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
