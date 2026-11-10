import { House } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
export function InviteFalconAnimation({ senderName, recipientName, onClose }: { senderName: string; recipientName: string; onClose: () => void }) {
  return <Modal label="Invitation resent" onClose={onClose}>
    <div className="ui-falcon-scene" aria-hidden="true">
      <div className="ui-house ui-house--sender"><House /><span>{senderName}</span></div>
      <svg className="ui-falcon" viewBox="0 0 64 64" fill="currentColor"><path d="M31 29C18 25 9 12 3 10c2 15 12 24 24 27L17 48l15-6 7 3-3-10c7 0 11-4 15-8l10-3-9-3-5 2c-5-1-8 2-10 4C42 16 39 6 35 2c-5 9-7 19-4 27Z"/><g className="ui-falcon-scroll" fill="currentColor"><path d="M30 42h18v12H30z"/><path d="M28 41h4v14h-4zm18 0h4v14h-4z"/></g><path d="m36 37 2 7" fill="none" stroke="currentColor" strokeWidth="2"/></svg>
      <div className="ui-house ui-house--recipient"><House /><span>{recipientName}</span></div>
    </div>
    <p role="status">Invitation resent from {senderName} to {recipientName}</p>
    <Button className="ui-animation-actions" onClick={onClose}>Continue</Button>
  </Modal>;
}
