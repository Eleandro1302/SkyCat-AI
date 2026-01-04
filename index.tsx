import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

try {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} catch (error) {
  // Fallback de segurança: Se o React falhar totalmente, mostra o erro na tela
  // em vez de deixar o usuário com uma tela vazia.
  console.error("Critical App Crash:", error);
  document.body.innerHTML = `
    <div style="color: #ff5555; padding: 20px; font-family: sans-serif; text-align: center; margin-top: 50px;">
      <h1>Something went wrong</h1>
      <p>The application crashed before it could start.</p>
      <pre style="background: #2d2d2d; padding: 15px; border-radius: 8px; text-align: left; overflow: auto; display: inline-block;">
        ${error instanceof Error ? error.message : JSON.stringify(error)}
      </pre>
      <p style="margin-top: 20px; color: #888;">Check the browser console for more details.</p>
    </div>
  `;
}