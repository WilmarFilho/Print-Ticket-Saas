import { Module } from '@nestjs/common';
import { PecasService } from './pecas.service';
import { PecasController } from './pecas.controller';

@Module({
  controllers: [PecasController],
  providers: [PecasService],
})
export class PecasModule {}
