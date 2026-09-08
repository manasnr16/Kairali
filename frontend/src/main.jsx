import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import AuthProvider from './Contex/AuthProvider';
import { RouterProvider } from 'react-router';
import { router } from './Routers/Router';

// ✅ TanStack Query Client
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Stripe is intentionally not wired up right now (payment is skipped during
// dev — see CheckoutPage.jsx). Re-add the Elements/loadStripe wrapper here
// once a real VITE_PYMENT_PUB_KEY is available.

const queryClient = new QueryClient();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>
);
