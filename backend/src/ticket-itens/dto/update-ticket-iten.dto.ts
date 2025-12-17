import { PartialType } from '@nestjs/mapped-types';
import { CreateTicketItenDto } from './create-ticket-iten.dto';

export class UpdateTicketItenDto extends PartialType(CreateTicketItenDto) {}
