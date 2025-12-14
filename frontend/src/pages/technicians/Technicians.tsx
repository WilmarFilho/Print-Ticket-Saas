import { UserPlus } from 'lucide-react';
import { useAtomValue } from 'jotai';
import { searchTermAtom } from '../../state/atoms';
import styles from './Technicians.module.css';
import { PageHeader } from '../../components/ui/PageHeader';
import { TechnicianCard } from '../../components/cards/TechnicianCard';
import type TechnicianData from '../../types/techinicians';

// Mock de dados
const MOCK_TECNICOS: TechnicianData[] = [
  { id: '12', nome: 'Carlos Souza', email: 'carlos.souza@nkw.com', status: 'ativo' },
  { id: '22', nome: 'Ana Paula', email: 'ana.paula@nkw.com', status: 'ativo' },
  { id: '32', nome: 'Roberto Alves', email: 'roberto.alves@nkw.com', status: 'inativo' },
  { id: '42', nome: 'Fernanda Lima', email: 'fernanda.lima@nkw.com', status: 'ativo' },
  { id: '52', nome: 'João Pedro', email: 'joao.pedro@nkw.com', status: 'ativo' },
  { id: '1', nome: 'Carlos Souza', email: 'carlos.souza@nkw.com', status: 'ativo' },
  { id: '2', nome: 'Ana Paula', email: 'ana.paula@nkw.com', status: 'ativo' },
  { id: '3', nome: 'Roberto Alves', email: 'roberto.alves@nkw.com', status: 'inativo' },
  { id: '4', nome: 'Fernanda Lima', email: 'fernanda.lima@nkw.com', status: 'ativo' },
  { id: '5', nome: 'João Pedro', email: 'joao.pedro@nkw.com', status: 'ativo' },
];

export function Technicians() {
  const searchTerm = useAtomValue(searchTermAtom);

  const filteredTechnicians = MOCK_TECNICOS.filter(tech => {
    const searchLower = searchTerm.toLowerCase();
    if (!searchLower) return true;
    return (
        tech.nome.toLowerCase().includes(searchLower) ||
        tech.email.toLowerCase().includes(searchLower)
    );
  });

  const handleNewTechnician = () => {
    alert("Modal de Cadastro de Técnico");
  };

  return (
    <section className={styles.wrapper}>
      
      <PageHeader
        title="Equipe Técnica"
        description="Gerencie os técnicos e permissões"
        actionIcon={<UserPlus size={20} />} // Ícone específico de add user
        actionLabel="Novo Técnico"
        onActionClick={handleNewTechnician}
        searchPlaceholder="Buscar por nome ou email..."
        pageKey="technicians"
      />

      <div className={styles.gridContainer}>
        {filteredTechnicians.length === 0 && (
            <div style={{gridColumn: '1/-1', textAlign: 'center', color: '#94a3b8', marginTop: '2rem'}}>
                Nenhum técnico encontrado.
            </div>
        )}

        {filteredTechnicians.map(tech => (
            <TechnicianCard key={tech.id} data={tech} />
        ))}
      </div>

    </section>
  );
}