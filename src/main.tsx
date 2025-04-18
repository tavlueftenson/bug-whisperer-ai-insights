
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Log when the app starts for debugging purposes
console.log("Application starting up with base URL:", import.meta.env.BASE_URL);

createRoot(document.getElementById("root")!).render(<App />);
