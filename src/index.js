import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';  // Seu CSS global, já com Tailwind e estilos customizados
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Para medir performance, você pode descomentar e passar uma função de log, ex:
// reportWebVitals(console.log);

// Ou enviar dados para um endpoint de analytics
reportWebVitals();
