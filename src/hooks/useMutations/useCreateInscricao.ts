import { useMutation } from '@tanstack/react-query';
import { criarInscricao } from '@/lib/supabase';
import { InscricaoInput } from '@/types/supabase';

/**
 * Hook para criação de uma nova inscrição no sistema
 * @returns Mutation para criar inscrição
 */
export function useCreateInscricao() {
  return useMutation({
    mutationFn: async (inscricao: InscricaoInput) => {
      try {
        // Inicia o processo de inscrição usando a função otimizada
        // que já contém a lógica de normalização e tratamento de erros
        const resultado = await criarInscricao({
          nome_completo: inscricao.nome_completo,
          email: inscricao.email,
          telefone: inscricao.telefone,
          tipo_unidade: inscricao.tipo_unidade,
          nome_unidade: inscricao.nome_unidade,
          cargo: inscricao.cargo
        });
        
        return resultado;
      } catch (error) {
        // Erro já tratado pela função criarInscricao
        console.error('Erro capturado pelo hook:', error);
        throw error;
      }
    }
  });
}
