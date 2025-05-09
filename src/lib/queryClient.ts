import { QueryClient } from '@tanstack/react-query';

/**
 * Cliente de query centralizado para a aplicação
 * Configurado com valores padrão recomendados para melhor experiência do usuário
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutos
    },
  },
});
