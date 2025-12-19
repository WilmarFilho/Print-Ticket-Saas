import { useState, useEffect } from 'react';
import { X, Save, Loader2 } from 'lucide-react';
import styles from './ClientModal.module.css';
import type ClientData from '../../types/client';
import type { PayloadClient } from '../../types/client';

interface ClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: PayloadClient) => Promise<void>;
  initialData?: ClientData | null;
}

export function ClientModal({ isOpen, onClose, onSave, initialData }: ClientModalProps) {
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    // Dados da Empresa
    razao_social: '',
    documento: '', // CNPJ
    endereco: '',
    telefone: '',

    // Dados do Responsável (Apenas Criação)
    nome_responsavel: '',
    email: '',
    password: ''
  });

  useEffect(() => {
    if (initialData) {
      // MODO EDIÇÃO: Preenchemos dados da empresa
      setFormData({
        razao_social: initialData.razao_social,
        documento: initialData.documento,
        endereco: initialData.endereco,
        telefone: initialData.telefone,
        // Limpamos auth na edição (foca apenas na empresa)
        nome_responsavel: initialData.profiles[0].nome,
        email: initialData.profiles[0].email,
        password: ''
      });
    } else {
      // MODO CRIAÇÃO: Limpa tudo
      setFormData({
        razao_social: '',
        documento: '',
        endereco: '',
        telefone: '',
        nome_responsavel: '',
        email: '',
        password: ''
      });
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
      // Erro tratado na página pai
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2 className={styles.title}>
            {initialData ? 'Editar Empresa' : 'Novo Cliente'}
          </h2>
          <button onClick={onClose} className={styles.closeBtn}><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className={styles.body}>

            <div className={styles.sectionTitle}>Dados da Empresa</div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Razão Social</label>
              <input
                required
                className={styles.input}
                placeholder="Ex: Tech Solutions Ltda"
                value={formData.razao_social}
                onChange={e => setFormData({ ...formData, razao_social: e.target.value })}
              />
            </div>

            <div className={styles.row}>
              <div className={styles.formGroup}>
                <label className={styles.label}>CNPJ / Documento</label>
                <input
                  required
                  className={styles.input}
                  placeholder="00.000.000/0001-00"
                  value={formData.documento}
                  onChange={e => setFormData({ ...formData, documento: e.target.value })}
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Telefone</label>
                <input
                  required
                  className={styles.input}
                  placeholder="(11) 99999-9999"
                  value={formData.telefone}
                  onChange={e => setFormData({ ...formData, telefone: e.target.value })}
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Endereço Completo</label>
              <input
                required
                className={styles.input}
                placeholder="Rua Exemplo, 1000 - Bairro, Cidade - UF"
                value={formData.endereco}
                onChange={e => setFormData({ ...formData, endereco: e.target.value })}
              />
            </div>


            <div className={styles.sectionTitle} style={{ marginTop: '1rem' }}>
              Gestor da Conta
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Nome do Responsável</label>
              <input
                required
                className={styles.input}
                placeholder="Ex: Maria Silva"
                value={formData.nome_responsavel}
                onChange={e => setFormData({ ...formData, nome_responsavel: e.target.value })}
              />
            </div>

            <div className={styles.row}>
              <div className={styles.formGroup}>
                <label className={styles.label}>E-mail de Acesso</label>
                <input
                  type="email"
                  required
                  className={styles.input}
                  placeholder="maria@empresa.com"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Senha Inicial</label>
                <input
                  type="password"
                  required={!initialData}
                  className={styles.input}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={e => setFormData({ ...formData, password: e.target.value })}
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