import { Printer as PrinterIcon } from 'lucide-react';
import { useAtomValue } from 'jotai';
import { searchTermAtom } from '../../state/atoms';
import styles from './Printers.module.css';
import { PageHeader } from '../../components/ui/PageHeader';
import { PrinterCard } from '../../components/cards/PrinterCard';
import type PrinterData from '../../types/printer';

// Mock de dados
const MOCK_PRINTERS: PrinterData[] = [
  { id: '1', modelo: 'Kyocera Ecosys M2040', serial: 'VXC829921', contador: 14502, status: 'online' },
  { id: '2', modelo: 'HP LaserJet Pro M428', serial: 'PHJ102399', contador: 5890, status: 'online' },
  { id: '3', modelo: 'Brother DCP-L2540', serial: 'BR9928110', contador: 89000, status: 'offline'},
  { id: '4', modelo: 'Ricoh MP 301', serial: 'RC301922', contador: 120, status: 'warning'},
  { id: '5', modelo: 'Samsung Xpress M2020', serial: 'Z3D912K', contador: 1200, status: 'online'},
  { id: '11', modelo: 'Kyocera Ecosys M2040', serial: 'VXC829921', contador: 14502, status: 'online' },
  { id: '22', modelo: 'HP LaserJet Pro M428', serial: 'PHJ102399', contador: 5890, status: 'online' },
  { id: '31', modelo: 'Brother DCP-L2540', serial: 'BR9928110', contador: 89000, status: 'offline'},
  { id: '41', modelo: 'Ricoh MP 301', serial: 'RC301922', contador: 120, status: 'warning'},
  { id: '51', modelo: 'Samsung Xpress M2020', serial: 'Z3D912K', contador: 1200, status: 'online'},
];

export function Printers() {
  const searchTerm = useAtomValue(searchTermAtom);

  const filteredPrinters = MOCK_PRINTERS.filter(printer => {
    const searchLower = searchTerm.toLowerCase();
    if (!searchLower) return true;
    return (
        printer.modelo.toLowerCase().includes(searchLower) ||
        printer.serial.toLowerCase().includes(searchLower) 
    );
  });

  const handleNewPrinter = () => {
    alert("Modal de Nova Impressora");
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