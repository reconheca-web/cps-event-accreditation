import { createClient } from '@supabase/supabase-js';

/**
 * Configuração do cliente Supabase usando variáveis de ambiente
 * As variáveis são fornecidas pelo Vite em tempo de execução
 */
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://emwlcpuwiuwrgfcvqcso.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Em ambiente de desenvolvimento, exibir alerta se as variáveis não estiverem definidas
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    'Variáveis de ambiente do Supabase não encontradas. Verifique se você criou um arquivo .env.local baseado no .env.example'
  );
}

/**
 * Cliente Supabase padrão - usado apenas para leitura de dados quando autenticado
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Função auxiliar para capturar erros de duplicidade
function handleErrorMessage(error: any): string {
  if (typeof error === 'object' && error !== null) {
    // Verificar erro de duplicidade (23505 é o código de violação de unicidade no PostgreSQL)
    if (error.code === '23505' || (error.details && error.details.includes('already exists'))) {
      const msg = error.message || error.details || '';
      if (msg.toLowerCase().includes('email')) {
        return 'Este e-mail já está cadastrado no sistema.';
      }
      if (msg.toLowerCase().includes('telefone')) {
        return 'Este telefone já está cadastrado no sistema.';
      }
      return 'Este registro já existe no sistema.';
    }
  }
  
  // Mensagem genérica para outros erros
  return 'Erro ao processar sua inscrição. Por favor, tente novamente mais tarde.';
}

/**
 * Utilitário para criar inscrições no evento da CPS
 * 
 * Implementação usando fetch direto para a API REST do Supabase
 * Esta versão evita problemas com as políticas RLS
 */
export async function criarInscricao(dados: {
  nome_completo: string;
  email: string;
  telefone: string;
  tipo_unidade: string;
  nome_unidade: string;
}) {
  try {
    // Validar dados localmente antes de enviar
    if (!dados.nome_completo || !dados.email || !dados.telefone || !dados.tipo_unidade || !dados.nome_unidade) {
      throw new Error('Todos os campos são obrigatórios');
    }
    
    // Preparar dados normalizados - apenas os campos necessários
    const dadosEnvio = {
      nome_completo: dados.nome_completo.trim(),
      email: dados.email.trim().toLowerCase(),
      telefone: dados.telefone.trim(),
      tipo_unidade: dados.tipo_unidade.trim(),
      nome_unidade: dados.nome_unidade.trim()
      // Os campos enviado_qrcode, bloqueado_ia e status_inscricao terão seus valores padrão aplicados pelo banco
    };
    
    // Preparar cabeçalhos da requisição
    const headers = new Headers();
    headers.append('apikey', supabaseAnonKey);
    headers.append('Authorization', `Bearer ${supabaseAnonKey}`);
    headers.append('Content-Type', 'application/json');
    headers.append('Prefer', 'return=minimal');  // Alterado para minimal para evitar problemas com RLS na resposta

    console.log('Enviando dados:', dadosEnvio);
    
    // Requisição para o endpoint REST
    const response = await fetch(
      `${supabaseUrl}/rest/v1/inscricoes_evento_cps`,
      {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(dadosEnvio),
        credentials: 'omit' // Evitar envio de cookies
      }
    );

    // Verificação da resposta
    if (!response.ok) {
      let errorData = {};
      try {
        errorData = await response.json();
      } catch (e) {
        // Se não conseguir obter JSON, usar texto da resposta
        errorData = { message: await response.text() };
      }
      
      console.error('Erro na resposta:', response.status, errorData);
      throw errorData;
    }

    // Sucesso - retornar confirmação
    return { success: true, message: 'Inscrição realizada com sucesso!' };
  } catch (error) {
    console.error('Erro ao processar inscrição:', error);
    const mensagem = handleErrorMessage(error);
    throw new Error(mensagem);
  }
}
