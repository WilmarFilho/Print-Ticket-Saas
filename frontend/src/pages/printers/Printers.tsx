import { Printer as PrinterIcon } from 'lucide-react';
import { useAtomValue } from 'jotai';
import { searchTermAtom, printersAtom } from '../../state/atoms'; // Importando atom real
import styles from './Printers.module.css';
import { PageHeader } from '../../components/ui/PageHeader';
import { PrinterCard } from '../../components/cards/PrinterCard';

export function Printers() {
  const searchTerm = useAtomValue(searchTermAtom);
  const rawPrinters = useAtomValue(printersAtom); // Dados vindos da API (via Layout)

  // Filtra usando os dados formatados
  const filteredPrinters = rawPrinters.filter(printer => {
    const searchLower = searchTerm.toLowerCase();
    if (!searchLower) return true;
    return (
        printer.modelo.toLowerCase().includes(searchLower) ||
        printer.serial_number.toLowerCase().includes(searchLower) 
    );
  });

  const handleNewPrinter = () => {
    alert("Em breve: Modal de Nova Impressora integrado ao Backend");
  };

  return (
    <section className={styles.wrapper}>
      
      <PageHeader
        title="Impressoras"
        description="Monitoramento de parque de impressão"
        actionIcon={<PrinterIcon size={20} />}
        actionLabel="Nova Impressora"
        onActionClick={handleNewPrinter}
        searchPlaceholder="Buscar modelo, serial ou IP..."
        pageKey="printers"
      />

      <div className={styles.gridContainer}>
        {filteredPrinters.length === 0 && (
            <div style={{gridColumn: '1/-1', textAlign: 'center', color: '#94a3b8', marginTop: '2rem'}}>
                Nenhuma impressora encontrada.
            </div>
        )}

        {filteredPrinters.map(printer => (
            <PrinterCard key={printer.id} data={printer} />
        ))}
      </div>

    </section>
  );
}
