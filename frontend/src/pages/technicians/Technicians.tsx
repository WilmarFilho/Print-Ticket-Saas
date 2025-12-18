import { UserPlus } from 'lucide-react';
import { useAtomValue } from 'jotai';
import { searchTermAtom, techniciansAtom } from '../../state/atoms';
import styles from './Technicians.module.css';
import { PageHeader } from '../../components/ui/PageHeader';
import { TechnicianCard } from '../../components/cards/TechnicianCard';

export function Technicians() {
  const searchTerm = useAtomValue(searchTermAtom);
  const rawTechnicians = useAtomValue(techniciansAtom); 
  console.log(rawTechnicians)

  const filteredTechnicians = rawTechnicians.filter(tech => {
    const searchLower = searchTerm.toLowerCase();
    if (!searchLower) return true;
    return (
        tech.profiles[0].nome.toLowerCase().includes(searchLower) ||
        tech.profiles[0].email.toLowerCase().includes(searchLower)
    );
  });

  const handleNewTechnician = () => {
    alert("Em breve: Modal de Cadastro integrado ao Backend");
  };

  return (
    <section className={styles.wrapper}>
      
      <PageHeader
        title="Equipe Técnica"
        description="Gerencie os técnicos e permissões"
        actionIcon={<UserPlus size={20} />}
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