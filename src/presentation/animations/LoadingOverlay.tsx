import { Modal } from '../ui/Modal';
import { LottieAsset } from './LottieAsset';
export function LoadingOverlay() {
  return <Modal label="Signing in"><div role="status" aria-live="polite"><LottieAsset src="/assets/animations/auth-loading.json" fallback={<span className="ui-spinner" />} /><p>Loading…</p></div></Modal>;
}
