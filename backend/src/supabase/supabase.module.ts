import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SupabaseService } from './supabase.service';

@Global() // Importante: Isso torna o Supabase disponível no app todo
@Module({
  imports: [ConfigModule], // Precisa disso para ler o .env
  providers: [SupabaseService],
  exports: [SupabaseService],
})
export class SupabaseModule {}
