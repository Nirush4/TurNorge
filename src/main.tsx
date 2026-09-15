// import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import './index.css';

const root = document.getElementById('root');
if (!root) {
  throw new Error('Root element #root was not found');
}

createRoot(root).render(
  // <StrictMode>
  <App />,
  // </StrictMode>,
);
