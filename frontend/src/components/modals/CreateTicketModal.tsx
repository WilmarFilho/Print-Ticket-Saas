import { useState } from 'react';
import { X, ArrowRight, CheckCircle, ArrowLeft } from 'lucide-react';
import styles from './CreateTicketModal.module.css';

interface CreateTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateTicketModal({ isOpen, onClose }: CreateTicketModalProps) {
  const [currentStep, setCurrentStep] = useState(0); // 0, 1, 2
  
  // State básico do formulário
  const [formData, setFormData] = useState({
    cliente: '',
    ativo: '',
    titulo: '',
    descricao: '',
    prioridade: 'baixa'
  });

  if (!isOpen) return null;

  const handleNext = () => {
    if (currentStep < 2) setCurrentStep(curr => curr + 1);
  };

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep(curr => curr - 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Enviando ticket:", formData);
    // Aqui chamaria a API
    onClose();
    setTimeout(() => setCurrentStep(0), 300); // Reseta depois de fechar
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        
        {/* Header */}
        <div className={styles.header}>
          <h2 className={styles.title}>Novo Chamado</h2>
          <button onClick={onClose} className={styles.closeBtn}>
            <X size={20} />
          </button>
        </div>

        {/* Corpo do Wizard com Renderização Condicional */}
        <div className={styles.wizardBody}>
            
            {/* PASSO 0: Identificação */}
            {currentStep === 0 && (
              <div className={styles.stepContainer}>
                <h3 style={{marginBottom: '1rem'}}>1. Quem é o cliente?</h3>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Cliente</label>
                  <select 
                    className={styles.select}
                    value={formData.cliente}
                    onChange={e => setFormData({...formData, cliente: e.target.value})}
                    autoFocus // Foca automaticamente ao abrir
                  >
                    <option value="">Selecione um cliente...</option>
                    <option value="acme">ACME Corp</option>
                    <option value="globex">Globex Inc</option>
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Ativo (Impressora)</label>
                  <select 
                    className={styles.select}
                    value={formData.ativo}
                    onChange={e => setFormData({...formData, ativo: e.target.value})}
                  >
                    <option value="">Selecione o equipamento...</option>
                    <option value="hp1">HP LaserJet M1132 - RH</option>
                    <option value="kyocera">Kyocera Ecosys - Financeiro</option>
                  </select>
                </div>
              </div>
            )}

            {/* PASSO 1: Detalhes */}
            {currentStep === 1 && (
              <div className={styles.stepContainer}>
                <h3 style={{marginBottom: '1rem'}}>2. Qual o problema?</h3>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Título do Problema</label>
                  <input 
                    type="text" 
                    className={styles.input} 
                    placeholder="Ex: Impressora manchando folha"
                    value={formData.titulo}
                    onChange={e => setFormData({...formData, titulo: e.target.value})}
                    autoFocus
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Descrição Detalhada</label>
                  <textarea 
                    className={styles.textarea}
                    placeholder="Descreva o que aconteceu..."
                    value={formData.descricao}
                    onChange={e => setFormData({...formData, descricao: e.target.value})}
                  />
                </div>
              </div>
            )}

            {/* PASSO 2: Revisão */}
            {currentStep === 2 && (
              <div className={styles.stepContainer}>
                <div style={{textAlign: 'center', padding: '1rem'}}>
                   <div style={{
                       width: 60, height: 60, background: '#dcfce7', color: '#166534', 
                       borderRadius: '50%', display: 'flex', alignItems: 'center', 
                       justifyContent: 'center', margin: '0 auto 1rem auto'
                   }}>
                      <CheckCircle size={32} />
                   </div>
                   <h3>Tudo pronto!</h3>
                   <p style={{color: '#666', marginBottom: '2rem'}}>Revise os dados antes de abrir o chamado.</p>
                   
                   <div style={{background: '#f8fafc', padding: '1rem', borderRadius: 8, textAlign: 'left'}}>
                      <p><strong>Cliente:</strong> {formData.cliente || '-'}</p>
                      <p><strong>Ativo:</strong> {formData.ativo || '-'}</p>
                      <p><strong>Problema:</strong> {formData.titulo || '-'}</p>
                   </div>
                </div>
              </div>
            )}

        </div>

        {/* Footer com Navegação */}
        <div className={styles.footer}>
          {/* Bolinhas indicadoras */}
          <div className={styles.stepIndicator}>
            {[0, 1, 2].map(step => (
                <div key={step} className={`${styles.dot} ${currentStep === step ? styles.dotActive : ''}`} />
            ))}
          </div>

          <div style={{display: 'flex', gap: '1rem'}}>
             {currentStep > 0 && (
                 <button onClick={handleBack} className={styles.btnSecondary}>
                     <ArrowLeft size={16} style={{marginRight: 8, display:'inline'}} /> Voltar
                 </button>
             )}
             
             {currentStep < 2 ? (
                 <button onClick={handleNext} className={styles.btnPrimary}>
                     Próximo <ArrowRight size={18} />
                 </button>
             ) : (
                 <button onClick={handleSubmit} className={styles.btnPrimary} style={{backgroundColor: '#16a34a'}}>
                     Confirmar Abertura
                 </button>
             )}
          </div>
        </div>

      </div>
    </div>
  );
}