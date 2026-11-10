import { useEffect, useRef, type ReactNode } from 'react';
import { Card } from './Card';
/** Native dialog supplies focus containment and makes the page behind it inert. */
export function Modal({ children, label, onClose }: { children: ReactNode; label: string; onClose?: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => { const dialog = ref.current; const previous = document.activeElement; dialog?.showModal(); return () => { dialog?.close(); if (previous instanceof HTMLElement) previous.focus(); }; }, []);
  return <dialog ref={ref} className="ui-modal" aria-label={label} onCancel={event => { event.preventDefault(); onClose?.(); }}><Card variant="elevated" className="ui-modal-content">{children}</Card></dialog>;
}
