import { useRef, useState } from 'react';
/** Guard synchronously, including two submits before React has rendered disabled. */
export function usePendingAction() {
  const busy = useRef(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');
  const run = async (action: () => void | Promise<void>) => {
    if (busy.current) return;
    busy.current = true; setPending(true); setError('');
    try { await action(); } catch (error) { setError(error instanceof Error ? error.message : 'Unable to complete the request. Please try again.'); }
    finally { busy.current = false; setPending(false); }
  };
  return { pending, error, run };
}
