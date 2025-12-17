import { atom } from 'jotai';
// CORREÇÃO AQUI: Adicionado 'type' antes das chaves ou dentro delas
import type { Session } from '@supabase/supabase-js'; 

import type ClientData from '../types/client';
import type PrinterData from '../types/printer';
import type TechnicianData from '../types/techinicians';
import type TicketData from '../types/ticket';

// --- ESTADO DE SESSÃO ---
export const sessionAtom = atom<Session | null>(null);
export const userProfileAtom = atom<unknown>(null); // Para guardar dados extras do usuário (nome, avatar)

// --- ESTADO DA APLICAÇÃO (CACHE GLOBAL) ---
export const clientsAtom = atom<ClientData[]>([]);
export const printersAtom = atom<PrinterData[]>([]);
export const techniciansAtom = atom<TechnicianData[]>([]);
export const ticketsAtom = atom<TicketData[]>([]);

// --- ESTADO DE INTERFACE ---
export const searchTermAtom = atom('');
export const createTicketModalAtom = atom(false);
export const currentPageAtom = atom('dashboard');
export const isLoadingDataAtom = atom(false); // Para mostrar loading geral