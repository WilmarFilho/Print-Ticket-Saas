import {
  Plus, Building2, MoreVertical,
  MapPin, Phone, Printer, Ticket
} from 'lucide-react';
import { useAtomValue } from 'jotai'; // Novos hooks do Jotai
import { searchTermAtom } from '../../state/atoms';
import styles from './Clients.module.css';
import { PageHeader } from '../../components/ui/PageHeader'; // Importa Header componentizado

// Mock de dados (MANTÉM IGUAL)
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
  // Recoil: Lê o estado de busca
  const searchTerm = useAtomValue(searchTermAtom);

  // Lógica de Filtragem agora usa o Recoil
  const filteredClients = MOCK_CLIENTES.filter(client => {
    const searchLower = searchTerm.toLowerCase();
    // Apenas filtra se o estado da busca não estiver vazio
    if (!searchLower) return true;

    return (
      client.nome.toLowerCase().includes(searchLower) ||
      client.documento.includes(searchLower)
    );
  });

  // Função Placeholder para o modal de Clientes (pode criar depois)
  const handleNewClient = () => {
    alert("Abrir modal de Novo Cliente");
    // Ou criar um estado Recoil específico: setNewClientModalState(true)
  };

  return (
    <div className={styles.container}>

      {/* HEADER COMPONENTIZADO */}
      <PageHeader
        title="Meus Clientes"
        description="Gerencie sua carteira de empresas"
        actionIcon={<Plus size={20} />}
        actionLabel="Novo Cliente"
        onActionClick={handleNewClient} // Ação específica
        searchPlaceholder="Buscar empresa ou CNPJ..."
        pageKey="clients" // Define a página atual
      />

      {/* Grid de Cards com Scroll */}
      <div className={styles.gridContainer}>

        {filteredClients.length === 0 && (
          <div style={{ gridColumn: '1/-1', textAlign: 'center', color: '#94a3b8', marginTop: '2rem' }}>
            Nenhum cliente encontrado para "{searchTerm}"
          </div>
        )}

        {filteredClients.map(client => (
          <div key={client.id} className={styles.clientCard}>

            {/* ... Conteúdo do Card de Cliente (MANTÉM IGUAL) ... */}
            <div className={styles.cardHeader}>
              <div className={styles.iconBox}>
                <Building2 size={24} />
              </div>
              <div className={styles.cardInfo}>
                <h3>{client.nome}</h3>
                <p className={styles.docText}>{client.documento}</p>
              </div>
              <button className={styles.optionsBtn}>
                <MoreVertical size={18} />
              </button>
            </div>

            <div className={styles.cardBody}>
              <div className={styles.contactRow}>
                <MapPin size={14} />
                <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '220px' }}>
                  {client.endereco}
                </span>
              </div>
              <div className={styles.contactRow}>
                <Phone size={14} /> {client.telefone}
              </div>
            </div>

            <div className={styles.cardFooter}>
              <div className={styles.statBadge}>
                <Printer size={14} color="#64748b" />
                {client.ativos} Ativos
              </div>

              <div
                className={styles.statBadge}
                style={client.ticketsAbertos > 0 ? { background: '#fee2e2', color: '#ef4444' } : {}}
              >
                <Ticket size={14} />
                {client.ticketsAbertos} Chamados
              </div>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}