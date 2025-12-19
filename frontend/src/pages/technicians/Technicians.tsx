import { useState } from 'react';
import { UserPlus } from 'lucide-react';
import { useAtom, useAtomValue } from 'jotai';
import { 
    searchTermAtom, 
    techniciansAtom, 
    sessionAtom 
} from '../../state/atoms';
import styles from './Technicians.module.css';
import { PageHeader } from '../../components/ui/PageHeader';
import { TechnicianCard } from '../../components/cards/TechnicianCard';
import { TechnicianModal } from '../../components/modals/TechnicianModal';
import api from '../../services/api';
import type TechnicianData from '../../types/techinicians';
import type { PayloadTecnico } from '../../types/techinicians';

export function Technicians() {
  const searchTerm = useAtomValue(searchTermAtom);
  const [technicians, setTechnicians] = useAtom(techniciansAtom);
  const session = useAtomValue(sessionAtom);

  // Estados do Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTech, setEditingTech] = useState<TechnicianData | null>(null);

  const filteredTechnicians = technicians.filter(tech => {
    const searchLower = searchTerm.toLowerCase();
    const profile = tech.profiles?.[0];
    if (!searchLower || !profile) return true;
    
    return (
        profile.nome.toLowerCase().includes(searchLower) ||
        profile.email.toLowerCase().includes(searchLower)
    );
  });

  const handleNewTechnician = () => {
    setEditingTech(null);
    setIsModalOpen(true);
  };

  const handleEditTechnician = (tech: TechnicianData) => {
    setEditingTech(tech);
    setIsModalOpen(true);
  };

  const handleSaveTechnician = async (formData: PayloadTecnico) => {
    const tenantId = session?.user?.user_metadata?.tenant_id;

    if (!tenantId) {
      alert("Sessão inválida. Faça login novamente.");
      return;
    }

    // Payload para o Backend
    const payload = { ...formData, tenant_id: tenantId };

    try {
      if (editingTech) {
        // ATUALIZAR (PATCH)
        console.log(payload)
        const { data } = await api.patch(`/tecnicos/${editingTech.id}`, payload);
        
        // Atualiza estado local
        setTechnicians(prev => prev.map(t => t.id === editingTech.id ? data : t));
      } else {
        // CRIAR (POST)
        const { data } = await api.post('/tecnicos', payload);
        
        // Adiciona ao estado local
        setTechnicians(prev => [data, ...prev]);
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Erro ao salvar técnico:", error);
      alert(error.response?.data?.message || "Erro ao salvar técnico.");
      throw error;
    }
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
            <TechnicianCard 
                key={tech.id} 
                data={tech} 
                onEdit={handleEditTechnician}
            />
        ))}
      </div>

      <TechnicianModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveTechnician}
        initialData={editingTech}
      />

    </section>
  );
}
