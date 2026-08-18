import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import {BrowserRouter} from 'react-router-dom';
import App from './App.tsx';
import './index.css';
import { registerPwa } from './pwa.ts';

// Global fetch interceptor to handle token expiration/invalid errors
const originalFetch = window.fetch;
window.fetch = async (input, init) => {
  const response = await originalFetch(input, init);
  if (response.status === 401) {
    const urlStr = typeof input === "string" ? input : input instanceof URL ? input.href : input.url;
    const isAuthRoute = urlStr.includes("/api/auth/login") || urlStr.includes("/api/auth/register");
    if (!isAuthRoute) {
      localStorage.removeItem("saas_token");
      localStorage.removeItem("saas_user");
      localStorage.removeItem("saas_super_token");
      if (window.location.pathname !== "/") {
        window.location.href = "/";
      }
    }
  }
  return response;
};

registerPwa();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);

