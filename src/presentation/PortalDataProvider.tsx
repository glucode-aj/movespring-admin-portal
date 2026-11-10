import { createContext, useContext, type ReactNode } from 'react';
import type { PortalRepository } from '../domain/ports/PortalRepository';
const PortalContext = createContext<PortalRepository | null>(null);
export function PortalDataProvider({ repository, children }: { repository: PortalRepository; children: ReactNode }) { return <PortalContext.Provider value={repository}>{children}</PortalContext.Provider>; }
export function usePortalRepository(): PortalRepository {
  const repository = useContext(PortalContext);
  if (!repository) throw new Error('PortalDataProvider is required to display portal data.');
  return repository;
}
