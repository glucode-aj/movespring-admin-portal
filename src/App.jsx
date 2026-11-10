import { samplePortalRepository } from './data/repositories/samplePortal';
import { PortalDataProvider } from './presentation/PortalDataProvider';
import { FeedbackProvider } from './presentation/animations/FeedbackProvider';
import AppRouter from './presentation/AppRouter';
import { ThemeProvider, ThemeToggle } from './core/theme/ThemeProvider';
export default function App() { return <ThemeProvider><FeedbackProvider><PortalDataProvider repository={samplePortalRepository}><AppRouter /></PortalDataProvider><ThemeToggle /></FeedbackProvider></ThemeProvider>; }
