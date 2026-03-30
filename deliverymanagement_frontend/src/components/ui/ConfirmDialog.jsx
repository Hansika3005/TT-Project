import Modal from "./Modal";
import { Button } from "./Button";
import { AlertTriangle } from "lucide-react";

export default function ConfirmDialog({ isOpen, onClose, onConfirm, title, message, isLoading }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} className="max-w-md">
      <div className="flex flex-col items-center text-center gap-4 py-4 px-2">
        <div className="h-14 w-14 rounded-2xl bg-destructive/10 border border-destructive/20 flex items-center justify-center text-destructive shadow-[0_0_20px_rgba(239,68,68,0.15)]">
          <AlertTriangle className="h-7 w-7" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-foreground mb-1">Confirm Action</h3>
          <p className="text-sm text-muted-foreground leading-relaxed px-4">{message}</p>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row justify-end gap-2.5 pt-6 mt-2 border-t border-border/40">
        <Button variant="ghost" onClick={onClose} disabled={isLoading} className="sm:flex-1">Cancel</Button>
        <Button variant="destructive" onClick={onConfirm} isLoading={isLoading} className="sm:flex-1">Delete Permanently</Button>
      </div>
    </Modal>
  );
}
