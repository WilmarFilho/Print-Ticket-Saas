import { useState, useEffect } from 'react';
import { X, Save, Loader2 } from 'lucide-react';
import styles from './PrinterModal.module.css';
import type PrinterData from '../../types/printer';
import type ClientData from '../../types/client';

interface PrinterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<PrinterData>) => Promise<void>;
  clients: ClientData[];
  initialData?: PrinterData | null; // Se vier preenchido, é Edição
}

export function PrinterModal({ isOpen, onClose, onSave, clients, initialData }: PrinterModalProps) {
  const [loading, setLoading] = useState(false);
  
  // Estado do formulário
  const [formData, setFormData] = useState({
    modelo: '',
    serial_number: '',
    cliente_id: '',
    status: 'online',
    contador_atual: 0
  });

  // Preenche o formulário quando abre para edição
  useEffect(() => {
    if (initialData) {
      setFormData({
        modelo: initialData.modelo,
        serial_number: initialData.serial_number,
        cliente_id: initialData.cliente_id,
        status: initialData.status,
        contador_atual: initialData.contador_atual
      });
    } else {
      // Reseta se for criação
      setFormData({ modelo: '', serial_number: '', cliente_id: '', status: 'online', contador_atual: 0 });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSave(formData as unknown as Partial<PrinterData>);
      onClose();
    } catch (error) {
      console.error(error);
      alert('Erro ao salvar impressora');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2 className={styles.title}>
            {initialData ? 'Editar Impressora' : 'Nova Impressora'}
          </h2>
          <button onClick={onClose} className={styles.closeBtn}><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className={styles.body}>
            
            <div className={styles.formGroup}>
              <label className={styles.label}>Modelo</label>
              <input 
                required
                className={styles.input} 
                placeholder="Ex: Kyocera Ecosys M2040"
                value={formData.modelo}
                onChange={e => setFormData({...formData, modelo: e.target.value})}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Serial Number</label>
              <input 
                required
                className={styles.input} 
                placeholder="Ex: VXC829921"
                value={formData.serial_number}
                onChange={e => setFormData({...formData, serial_number: e.target.value.toUpperCase()})}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Cliente Responsável</label>
              <select 
                required
                className={styles.select}
                value={formData.cliente_id}
                onChange={e => setFormData({...formData, cliente_id: e.target.value})}
              >
                <option value="">Selecione um cliente...</option>
                {clients.map(client => (
                  <option key={client.id} value={client.id}>{client.razao_social}</option>
                ))}
              </select>
            </div>

            <div style={{display: 'flex', gap: '1rem'}}>
              <div className={styles.formGroup} style={{flex: 1}}>
                <label className={styles.label}>Status</label>
                <select 
                  className={styles.select}
                  value={formData.status}
                  onChange={e => setFormData({...formData, status: e.target.value})}
                >
                  <option value="online">Online</option>
                  <option value="offline">Offline</option>
                  <option value="instavel">Alerta</option>
                </select>
              </div>

              <div className={styles.formGroup} style={{flex: 1}}>
                <label className={styles.label}>Contador Atual</label>
                <input 
                  type="number"
                  className={styles.input} 
                  value={formData.contador_atual}
                  onChange={e => setFormData({...formData, contador_atual: Number(e.target.value)})}
                />
              </div>
            </div>

          </div>

          <div className={styles.footer}>
            <button type="button" onClick={onClose} className={styles.cancelBtn}>Cancelar</button>
            <button type="submit" disabled={loading} className={styles.saveBtn}>
              {loading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}