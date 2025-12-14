import { atom } from 'jotai';

// 1. Estado da Busca
export const searchTermAtom = atom('');

// 2. Estado do Modal
export const createTicketModalAtom = atom(false);

// 3. Estado da Página Atual
export const currentPageAtom = atom('tickets');