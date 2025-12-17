import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SupabaseModule } from './supabase/supabase.module';
import { TenantsModule } from './tenants/tenants.module';
import { ClientesModule } from './clientes/clientes.module';
import { AtivosModule } from './ativos/ativos.module';
import { PecasModule } from './pecas/pecas.module';
import { TecnicosModule } from './tecnicos/tecnicos.module';
import { TicketsModule } from './tickets/tickets.module';
import { TicketItensModule } from './ticket-itens/ticket-itens.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    SupabaseModule,
    TenantsModule,
    ClientesModule,
    AtivosModule,
    PecasModule,
    TecnicosModule,
    TicketsModule,
    TicketItensModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
