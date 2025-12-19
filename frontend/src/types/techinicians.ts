import type ProfileData from "./profile";

export default interface TechnicianData {
  id: string;
  tenant_id: string;
  status: 'ativo' | 'inativo';
  created_at: string;
  updated_at: string;
  profiles: ProfileData[]
}

export interface PayloadTecnico {
    nome: string;
    email: string;
    password: string;
    status: string;
}
