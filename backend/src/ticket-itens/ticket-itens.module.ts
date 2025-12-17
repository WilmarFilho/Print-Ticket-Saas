import { Module } from '@nestjs/common';
import { TicketItensService } from './ticket-itens.service';
import { TicketItensController } from './ticket-itens.controller';

@Module({
  controllers: [TicketItensController],
  providers: [TicketItensService],
})
export class TicketItensModule {}
