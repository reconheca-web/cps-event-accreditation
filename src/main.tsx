import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './registerSW'
import { redirectToPWAStartUrl } from './lib/pwaUtils'

// Verificar se precisamos redirecionar para a URL inicial do PWA
redirectToPWAStartUrl();

createRoot(document.getElementById("root")!).render(<App />);
