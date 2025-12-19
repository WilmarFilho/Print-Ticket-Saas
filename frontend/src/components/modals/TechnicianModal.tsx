import { useState, useEffect } from 'react';
import { X, Save, Loader2 } from 'lucide-react';
import styles from './TechnicianModal.module.css';
import type TechnicianData from '../../types/techinicians';
import type { PayloadTecnico } from '../../types/techinicians';

interface TechnicianModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: PayloadTecnico) => Promise<void>;
  initialData?: TechnicianData | null;
}

export function TechnicianModal({ isOpen, onClose, onSave, initialData }: TechnicianModalProps) {
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    password: '',
    status: 'ativo'
  });

  useEffect(() => {
    if (initialData) {
      // EDICAO: Pega dados do profile (array)
      const profile = initialData.profiles?.[0] || { nome: '', email: '' };
      setFormData({
        nome: profile.nome,
        email: profile.email,
        password: '', // Não preenchemos a senha na edição por segurança
        status: initialData.status
      });
    } else {
      // CRIACAO
      setFormData({ nome: '', email: '', password: '', status: 'ativo' });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error(error);
      // O tratamento de erro (alert) pode ser feito aqui ou na Page
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2 className={styles.title}>
            {initialData ? 'Editar Técnico' : 'Novo Técnico'}
          </h2>
          <button onClick={onClose} className={styles.closeBtn}><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className={styles.body}>

            <div className={styles.formGroup}>
              <label className={styles.label}>Nome Completo</label>
              <input
                required
                className={styles.input}
                placeholder="Ex: João da Silva"
                value={formData.nome}
                onChange={e => setFormData({ ...formData, nome: e.target.value })}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>E-mail de Acesso</label>
              <input
                type="email"
                required
                className={styles.input}
                placeholder="Ex: joao@empresa.com"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            {/* Senha só aparece na criação (ou se quiser implementar troca de senha, muda a lógica) */}

            <div className={styles.formGroup}>
              <label className={styles.label}>Senha</label>
              <input
                type="password"
                required 
                className={styles.input}
                placeholder="••••••••"
                value={formData.password}
                onChange={e => setFormData({ ...formData, password: e.target.value })}
              />
            </div>



            <div className={styles.formGroup}>
              <label className={styles.label}>Status</label>
              <select
                className={styles.select}
                value={formData.status}
                onChange={e => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="ativo">Ativo (Permitir acesso)</option>
                <option value="inativo">Inativo (Bloquear acesso)</option>
              </select>
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