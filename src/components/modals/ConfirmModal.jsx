import { AlertTriangle } from 'lucide-react';
import Button from '@/components/ui/Button';
import '@/styles/components/modals.css';

export default function ConfirmModal({ isOpen, title, message, confirmLabel = 'Confirmer', cancelLabel = 'Annuler', variant = 'danger', onConfirm, onCancel }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-panel modal-panel-sm" onClick={(e) => e.stopPropagation()} role="alertdialog" aria-modal="true" aria-labelledby="confirm-title">
        <div className="modal-header">
          <AlertTriangle size="var(--icon-size-lg)" strokeWidth="var(--icon-stroke-default)" color="var(--color-warning)" />
          <h2 id="confirm-title" className="modal-title">{title}</h2>
        </div>
        <div className="modal-body">
          <p className="confirm-modal-message">{message}</p>
        </div>
        <div className="modal-footer">
          <Button variant="secondary" onClick={onCancel}>{cancelLabel}</Button>
          <Button variant={variant} onClick={onConfirm}>{confirmLabel}</Button>
        </div>
      </div>
    </div>
  );
}
