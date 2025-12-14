import { atom } from 'recoil';

export const searchTermState = atom<string>({
  key: 'searchTermState', 
  default: '',
});

export const createTicketModalState = atom<boolean>({
  key: 'createTicketModalState',
  default: false,
});

export const currentPageState = atom<string>({
  key: 'currentPageState',
  default: '',
});