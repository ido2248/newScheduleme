"use client";

import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";

export type EditScope = "permanent" | "week" | "month";

interface ScopeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (scope: EditScope) => void;
  loading: boolean;
}

export default function ScopeDialog({
  isOpen,
  onClose,
  onSelect,
  loading,
}: ScopeDialogProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="טווח השינויים">
      <p className="mb-4 text-sm text-muted">
        לאיזה טווח תרצה להחיל את השינויים?
      </p>
      <div className="space-y-2">
        <button
          onClick={() => onSelect("week")}
          disabled={loading}
          className="w-full rounded-lg border border-border p-3 text-start hover:bg-card-hover disabled:opacity-50"
        >
          <div className="font-medium">השבוע הנוכחי בלבד</div>
          <div className="text-sm text-muted">
            השינויים יחולו רק על השבוע הנוכחי
          </div>
        </button>
        <button
          onClick={() => onSelect("month")}
          disabled={loading}
          className="w-full rounded-lg border border-border p-3 text-start hover:bg-card-hover disabled:opacity-50"
        >
          <div className="font-medium">החודש הנוכחי בלבד</div>
          <div className="text-sm text-muted">
            השינויים יחולו רק על החודש הנוכחי
          </div>
        </button>
        <button
          onClick={() => onSelect("permanent")}
          disabled={loading}
          className="w-full rounded-lg border border-primary bg-primary/5 p-3 text-start hover:bg-primary/10 disabled:opacity-50"
        >
          <div className="font-medium text-primary">קבוע</div>
          <div className="text-sm text-muted">
            השינויים יחולו לכל השבועות מעכשיו והלאה
          </div>
        </button>
      </div>
      {loading && (
        <div className="mt-3 text-center text-sm text-muted">שומר שינויים...</div>
      )}
    </Modal>
  );
}
