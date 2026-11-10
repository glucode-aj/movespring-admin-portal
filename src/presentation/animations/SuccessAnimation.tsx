import { CheckCircle2 } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { LottieAsset } from './LottieAsset';
export function SuccessAnimation({ onContinue }: { onContinue: () => void }) {
  return <Modal label="Challenge created" onClose={onContinue}><div role="status"><LottieAsset src="/assets/animations/challenge-created.json" loop={false} fallback={<CheckCircle2 className="ui-success-icon" />} /><p>Challenge created</p></div><Button className="ui-animation-actions" onClick={onContinue}>Continue</Button></Modal>;
}
