import {Plus} from 'lucide-react';
import { useAtomValue } from 'jotai'; 
import { searchTermAtom } from '../../state/atoms';
import styles from './Clients.module.css';
import { PageHeader } from '../../components/ui/PageHeader'; 
import { ClientCard } from '../../components/cards/ClientCard';

const MOCK_CLIENTES = [
  // ... MOCK_CLIENTES continua o mesmo ...
  {
    id: '1',
    nome: 'TechSolutions Ltda',
    documento: '12.345.678/0001-90',
    endereco: 'Av. Paulista, 1000 - SP',
    telefone: '(11) 99999-8888',
    ativos: 12,
    ticketsAbertos: 3
  },
  {
    id: '1111',
    nome: 'TechSolutions Ltda',
    documento: '12.345.678/0001-90',
    endereco: 'Av. Paulista, 1000 - SP',
    telefone: '(11) 99999-8888',
    ativos: 12,
    ticketsAbertos: 3
  },
  {
    id: '331',
    nome: 'TechSolutions Ltda',
    documento: '12.345.678/0001-90',
    endereco: 'Av. Paulista, 1000 - SP',
    telefone: '(11) 99999-8888',
    ativos: 12,
    ticketsAbertos: 3
  },
  {
    id: '21',
    nome: 'TechSolutions Ltda',
    documento: '12.345.678/0001-90',
    endereco: 'Av. Paulista, 1000 - SP',
    telefone: '(11) 99999-8888',
    ativos: 12,
    ticketsAbertos: 3
  },
  {
    id: '121',
    nome: 'TechSolutions Ltda',
    documento: '12.345.678/0001-90',
    endereco: 'Av. Paulista, 1000 - SP',
    telefone: '(11) 99999-8888',
    ativos: 12,
    ticketsAbertos: 3
  },
  {
    id: '111',
    nome: 'TechSolutions Ltda',
    documento: '12.345.678/0001-90',
    endereco: 'Av. Paulista, 1000 - SP',
    telefone: '(11) 99999-8888',
    ativos: 12,
    ticketsAbertos: 3
  },
  {
    id: '13',
    nome: 'TechSolutions Ltda',
    documento: '12.345.678/0001-90',
    endereco: 'Av. Paulista, 1000 - SP',
    telefone: '(11) 99999-8888',
    ativos: 12,
    ticketsAbertos: 3
  },
  {
    id: '12',
    nome: 'TechSolutions Ltda',
    documento: '12.345.678/0001-90',
    endereco: 'Av. Paulista, 1000 - SP',
    telefone: '(11) 99999-8888',
    ativos: 12,
    ticketsAbertos: 3
  },
  {
    id: '11',
    nome: 'TechSolutions Ltda',
    documento: '12.345.678/0001-90',
    endereco: 'Av. Paulista, 1000 - SP',
    telefone: '(11) 99999-8888',
    ativos: 12,
    ticketsAbertos: 3
  },
  {
    id: '2',
    nome: 'Hospital Santa Clara',
    documento: '98.765.432/0001-10',
    endereco: 'Rua das Flores, 500 - RJ',
    telefone: '(21) 3333-2222',
    ativos: 45,
    ticketsAbertos: 1
  },
  {
    id: '3',
    nome: 'Escola Futuro do Saber',
    documento: '45.123.890/0001-55',
    endereco: 'Alameda Santos, 40 - SP',
    telefone: '(11) 3030-4040',
    ativos: 5,
    ticketsAbertos: 0
  },
  {
    id: '4',
    nome: 'Advocacia Mendes & Filhos',
    documento: '11.222.333/0001-00',
    endereco: 'Centro Civico, Sala 12 - PR',
    telefone: '(41) 98888-7777',
    ativos: 2,
    ticketsAbertos: 0
  },
];

export function Clients() {
  const searchTerm = useAtomValue(searchTermAtom);

  const filteredClients = MOCK_CLIENTES.filter(client => {
    const searchLower = searchTerm.toLowerCase();
    if (!searchLower) return true;
    return (
      client.nome.toLowerCase().includes(searchLower) ||
      client.documento.includes(searchLower)
    );
  });

  const handleNewClient = () => {
    alert("Modal de Novo Cliente");
  };

  return (
    <section className={styles.wrapper}>

      <PageHeader
        title="Meus Clientes"
        description="Gerencie sua carteira de empresas"
        actionIcon={<Plus size={20} />}
        actionLabel="Novo Cliente"
        onActionClick={handleNewClient}
        searchPlaceholder="Buscar empresa ou CNPJ..."
        pageKey="clients"
      />

      <div className={styles.gridContainer}>
        {filteredClients.length === 0 && (
          <div style={{ gridColumn: '1/-1', textAlign: 'center', color: '#94a3b8', marginTop: '2rem' }}>
            Nenhum cliente encontrado para "{searchTerm}"
          </div>
        )}

        {filteredClients.map(client => (
          <ClientCard key={client.id} data={client} />
        ))}
      </div>
    </section>
  );
}