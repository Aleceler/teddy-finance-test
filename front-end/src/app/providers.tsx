import { QueryClientProvider } from '@tanstack/react-query';
import { type ReactNode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { queryClient } from '../lib/query-client';
import 'react-toastify/dist/ReactToastify.css';

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        {children}
        <ToastContainer position="top-right" autoClose={3000} />
      </BrowserRouter>
    </QueryClientProvider>
  );
}
