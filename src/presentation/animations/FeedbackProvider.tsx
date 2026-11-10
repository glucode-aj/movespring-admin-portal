import { createContext, useContext, useState, type ReactNode } from 'react';
import { SuccessAnimation } from './SuccessAnimation';
const FeedbackContext = createContext<() => void>(() => {});
export function FeedbackProvider({ children }: { children: ReactNode }) {
  const [success, setSuccess] = useState(false);
  return <FeedbackContext.Provider value={() => setSuccess(true)}>{children}{success && <SuccessAnimation onContinue={() => setSuccess(false)} />}</FeedbackContext.Provider>;
}
export const useChallengeFeedback = () => useContext(FeedbackContext);
