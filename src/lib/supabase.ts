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
    console.log('Detalhes do erro recebido:', error);
    
    // Verificar erro de duplicidade (23505 é o código de violação de unicidade no PostgreSQL)
    if (error.code === '23505' || 
        (error.details && error.details.includes('already exists')) ||
        (error.message && error.message.includes('duplicate key'))) {
      
      const msg = error.message || error.details || '';
      console.log('Mensagem de erro completa:', msg);
      
      // Verificar se a mensagem contém referências a email ou telefone
      if (msg.toLowerCase().includes('email')) {
        return 'Este e-mail já está cadastrado no evento. Por favor, utilize outro e-mail ou entre em contato com a equipe CPS.';
      }
      
      if (msg.toLowerCase().includes('telefone')) {
        return 'Este telefone já está cadastrado no evento. Por favor, utilize outro número ou entre em contato com a equipe CPS.';
      }
      
      // Se não conseguir identificar o campo específico, mas for erro de duplicidade
      return 'Este cadastro já existe no sistema. Você já está inscrito neste evento.';
    }
    
    // Verificar outros tipos de erros conhecidos
    if (error.code || error.message) {
      console.log(`Erro identificado: Código ${error.code}, Mensagem: ${error.message}`);
      // Tentar extrair informações úteis do erro
      if (error.message && error.message.toLowerCase().includes('unique')) {
        return 'Já existe um cadastro com estas informações no evento. Por favor, verifique seus dados ou entre em contato com a organização.';
      }
    }
  }
  
  // Mensagem genérica para outros erros
  return 'Erro ao processar sua inscrição. Por favor, tente novamente mais tarde ou entre em contato com a organização do evento.';
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
  cargo?: string;
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
      nome_unidade: dados.nome_unidade.trim(),
      cargo: dados.cargo ? dados.cargo.trim() : null
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
        const responseText = await response.text();
        errorData = { message: responseText };
        
        // Tentar identificar erros de duplicidade no texto da resposta
        if (responseText.includes('duplicate') || responseText.includes('already exists')) {
          if (responseText.toLowerCase().includes('email')) {
            errorData = { 
              code: '23505', 
              message: `Violação de chave única: email=${dadosEnvio.email} já está cadastrado no evento.` 
            };
          } else if (responseText.toLowerCase().includes('telefone')) {
            errorData = { 
              code: '23505', 
              message: `Violação de chave única: telefone=${dadosEnvio.telefone} já está cadastrado no evento.` 
            };
          } else {
            errorData = { 
              code: '23505', 
              message: 'Violação de chave única: este registro já existe no sistema.' 
            };
          }
        }
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
