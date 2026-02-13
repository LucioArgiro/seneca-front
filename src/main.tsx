import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import AppRouter from './router/AppRouter';
import { BrowserRouter } from 'react-router-dom';
import { useAuthStore } from './store/auth';
import './index.css';
import AOS from 'aos';
import 'aos/dist/aos.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

// Componente para inicializar animaciones
const AOSInitializer = () => {
  useEffect(() => {
    AOS.init({
      duration: 1200,
      once: true,
      offset: 100,
      easing: 'ease-out-cubic',
    });
  }, []);
  return null;
};

const AuthWrapper = ({ children }: { children: React.ReactNode }) => {
  const checkAuth = useAuthStore((s) => s.checkAuth);
  const isChecking = useAuthStore((s) => s.isChecking);

  useEffect(() => {
    checkAuth();
  }, []); // El array vacío asegura que solo corra 1 vez al montar

  if (isChecking) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-[#0a0a0a]">
        {/* Un loader simple para que sepa que algo pasa */}
        <div className="text-[#C9A227] animate-pulse font-bold tracking-widest">
          VERIFICANDO SESIÓN...
        </div>
      </div>
    );
  }

  return <>{children}</>;
};


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AOSInitializer />
      <AuthWrapper>
        <BrowserRouter>
          <AppRouter />
        </BrowserRouter>
      </AuthWrapper>

      <Toaster
        position="bottom-right"
        reverseOrder={false}
        toastOptions={{
          style: {
            background: '#1A1A1A',
            color: '#C9A227',
            border: '1px solid rgba(201,162,39,0.2)'
          },
        }}
        gutter={8}
        containerStyle={{ bottom: 20, right: 20 }}
      />
    </QueryClientProvider>
  </React.StrictMode>,
);