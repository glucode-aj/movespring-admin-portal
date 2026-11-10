import { useEffect, useState, lazy, Suspense, type ReactNode } from 'react';
import { useReducedMotion } from './useReducedMotion';
const Lottie = lazy(() => import('lottie-react').then(module => ({ default: module.Lottie })));
/** Missing/private exports retain an accessible local fallback. */
export function LottieAsset({ src, fallback, loop = true }: { src: string; fallback: ReactNode; loop?: boolean }) {
  const [data, setData] = useState<object | null>(null);
  const reduced = useReducedMotion();
  useEffect(() => {
    if (reduced) return;
    const controller = new AbortController();
    fetch(src, { signal: controller.signal }).then(r => { if (!r.ok) throw new Error('Animation unavailable'); return r.json(); }).then(value => { if (value && Array.isArray(value.layers) && value.v) setData(value); }).catch(() => { /* Render fallback. */ });
    return () => controller.abort();
  }, [src, reduced]);
  return <div className="ui-animation" aria-hidden="true">{!reduced && data ? <Suspense fallback={fallback}><Lottie src={data} autoplay className="ui-lottie-player" loop={loop} /></Suspense> : fallback}</div>;
}
