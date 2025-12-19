import { useState } from 'react';
import { Printer as PrinterIcon } from 'lucide-react';
import { useAtom, useAtomValue } from 'jotai';
import { 
  searchTermAtom, 
  printersAtom, 
  clientsAtom, 
  sessionAtom // <--- 1. Importamos a sessão
} from '../../state/atoms';
import styles from './Printers.module.css';
import { PageHeader } from '../../components/ui/PageHeader';
import { PrinterCard } from '../../components/cards/PrinterCard';
import { PrinterModal } from '../../components/modals/PrinterModal';
import api from '../../services/api';
import type PrinterData from '../../types/printer';

export function Printers() {
  const searchTerm = useAtomValue(searchTermAtom);
  const [printers, setPrinters] = useAtom(printersAtom);
  const clients = useAtomValue(clientsAtom);
  const session = useAtomValue(sessionAtom); // <--- 2. Lemos a sessão atual

  // Estado do Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPrinter, setEditingPrinter] = useState<PrinterData | null>(null);

  // Filtra impressoras
  const filteredPrinters = printers.filter(printer => {
    const searchLower = searchTerm.toLowerCase();
    if (!searchLower) return true;
    return (
        printer.modelo.toLowerCase().includes(searchLower) ||
        printer.serial_number.toLowerCase().includes(searchLower) 
    );
  });

  const handleNewPrinter = () => {
    setEditingPrinter(null);
    setIsModalOpen(true);
  };

  const handleEditPrinter = (printer: PrinterData) => {
    setEditingPrinter(printer);
    setIsModalOpen(true);
  };

  // Salvar (Criar ou Atualizar)
  const handleSavePrinter = async (formData: Partial<PrinterData>) => {
    // <--- 3. Pulo do gato: Pegamos o tenant_id do usuário logado
    const tenantId = session?.user?.user_metadata?.tenant_id;

    if (!tenantId) {
      alert("Erro de Segurança: Sessão inválida (sem tenant_id). Faça login novamente.");
      return;
    }

    // Injetamos o tenant_id nos dados que serão enviados
    const payload = { ...formData, tenant_id: tenantId };

    try {
      if (editingPrinter) {
        // ATUALIZAR (PUT/PATCH)
        const { data } = await api.patch(`/ativos/${editingPrinter.id}`, payload);
        setPrinters(prev => prev.map(p => p.id === editingPrinter.id ? data : p));
      } else {
        // CRIAR (POST)
        const { data } = await api.post('/ativos', payload);
        setPrinters(prev => [data, ...prev]);
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Erro ao salvar:", error);
      alert(error.response?.data?.message || "Erro ao salvar impressora.");
      throw error; // Re-lança para o modal saber que deu erro e não fechar (se tiver try/catch lá)
    }
  };

  return (
    <section className={styles.wrapper}>
      
      <PageHeader
        title="Impressoras"
        description="Monitoramento de parque de impressão"
        actionIcon={<PrinterIcon size={20} />}
        actionLabel="Nova Impressora"
        onActionClick={handleNewPrinter}
        searchPlaceholder="Buscar por modelo ou serial..."
        pageKey="printers"
      />

      <div className={styles.gridContainer}>
        {filteredPrinters.length === 0 && (
            <div style={{gridColumn: '1/-1', textAlign: 'center', color: '#94a3b8', marginTop: '2rem'}}>
                Nenhuma impressora encontrada.
            </div>
        )}

        {filteredPrinters.map(printer => (
            <PrinterCard 
              key={printer.id} 
              data={printer} 
              onEdit={handleEditPrinter} 
            />
        ))}
      </div>

      <PrinterModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSavePrinter}
        clients={clients}
        initialData={editingPrinter}
      />

    </section>
  );
}