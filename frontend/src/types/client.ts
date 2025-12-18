import type ProfileData from "./profile";

export default interface ClientData {
  id: string;
  tenant_id: string;
  razao_social: string;
  documento: string;
  endereco: string;
  profiles: ProfileData[];
  telefone: string;
  ativos: number;
  ticketsAbertos: number;
  created_at: string;
  updated_at: string;
}