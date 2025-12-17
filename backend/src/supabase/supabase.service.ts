import { Inject, Injectable, Scope } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { REQUEST } from '@nestjs/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import express from 'express';

@Injectable({ scope: Scope.REQUEST }) // <--- ISSO É CRUCIAL! Uma instância por requisição
export class SupabaseService {
  private client: SupabaseClient;

  constructor(
    @Inject(REQUEST) private readonly request: express.Request, // Injetamos a requisição atual
    private readonly configService: ConfigService,
  ) {}

  getClient() {
    if (this.client) {
      return this.client;
    }

    // Pega o Token que veio no Header do Frontend (Bearer eyJ...)
    const authHeader = this.request.headers.authorization;

    if (authHeader) {
      // CENÁRIO 1: Tem usuário logado
      // Criamos o cliente usando o token do usuário. O RLS vai funcionar!
      this.client = createClient(
        this.configService.get<string>('SUPABASE_URL')!,
        this.configService.get<string>('SUPABASE_KEY')!, // Use a ANON KEY aqui, não a SERVICE_ROLE
        {
          global: {
            headers: { Authorization: authHeader }, // Repassa o token pro Supabase
          },
        },
      );
    } else {
      // CENÁRIO 2: Ninguém logado ou uso interno (ex: criar tenant)
      // Aqui usamos a chave de ADMIN (Service Role) se precisar ignorar RLS
      // Mas cuidado!
      this.client = createClient(
        this.configService.get<string>('SUPABASE_URL')!,
        this.configService.get<string>('SUPABASE_KEY')!, // ANON KEY por padrão
      );
    }

    return this.client;
  }
}
