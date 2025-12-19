import type ProfileData from "./profile";

export default interface ClientData {
  id: string;
  tenant_id: string;
  razao_social: string;
  documento: string;
  endereco: string;
  telefone: string;
  created_at: string;
  updated_at: string;
  profiles: ProfileData[];
  ativos: number;
  ticketsAbertos: number;
}

export interface PayloadClient {
  razao_social: string;
  documento: string;
  endereco?: string;
  telefone?: string;
  // Dados do Usuário Responsável (Auth + Profile)
  nome_responsavel: string;
  email: string;
  password: string;
}