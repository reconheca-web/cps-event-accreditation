-- Adiciona extensão HTTP para permitir requisições HTTP a partir do PostgreSQL
CREATE EXTENSION IF NOT EXISTS http;

-- Função para envio automático da mensagem de confirmação
CREATE OR REPLACE FUNCTION public.notificar_inscricao_aprovada()
RETURNS trigger AS $$
DECLARE
  content_text TEXT;
  response http_response;
BEGIN
  -- Verifica se o status mudou para 'aprovado' e se a mensagem ainda não foi enviada
  IF NEW.status_inscricao = 'aprovado' 
     AND (OLD.status_inscricao IS DISTINCT FROM NEW.status_inscricao)
     AND NEW.envio_mensagem_confirmacao IS NOT TRUE
  THEN
    -- Preparar o conteúdo da requisição como texto
    content_text := '{"id":"' || NEW.id || '"}'; 
    
    -- Fazer a requisição HTTP POST
    SELECT * FROM http_post(
      'https://emwlcpuwiuwrgfcvqcso.supabase.co/functions/v1/envia_msg_confirmada',
      content_text,
      'application/json'
    ) INTO response;
    
    -- Não atualizamos o campo envio_mensagem_confirmacao aqui
    -- A edge function é responsável por atualizar esse campo quando a mensagem for enviada com sucesso
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para envio automático da mensagem de rejeição
CREATE OR REPLACE FUNCTION public.notificar_inscricao_rejeitada()
RETURNS trigger AS $$
DECLARE
  content_text TEXT;
  response http_response;
BEGIN
  -- Verifica se o status mudou para 'rejeitado' e se a mensagem ainda não foi enviada
  IF NEW.status_inscricao = 'rejeitado' 
     AND (OLD.status_inscricao IS DISTINCT FROM NEW.status_inscricao)
     AND NEW.envio_mensagem_rejeicao IS NOT TRUE
  THEN
    -- Preparar o conteúdo da requisição como texto
    content_text := '{"id":"' || NEW.id || '"}'; 
    
    -- Fazer a requisição HTTP POST
    SELECT * FROM http_post(
      'https://emwlcpuwiuwrgfcvqcso.supabase.co/functions/v1/envia_msg_rejeitada',
      content_text,
      'application/json'
    ) INTO response;
    
    -- Não atualizamos o campo envio_mensagem_rejeicao aqui
    -- A edge function é responsável por atualizar esse campo quando a mensagem for enviada com sucesso
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Remove triggers existentes, se houver
DROP TRIGGER IF EXISTS trigger_notifica_inscricao_aprovada ON public.inscricoes_evento_cps;
DROP TRIGGER IF EXISTS trigger_notifica_inscricao_rejeitada ON public.inscricoes_evento_cps;

-- Cria trigger para notificação de inscrição aprovada
CREATE TRIGGER trigger_notifica_inscricao_aprovada
AFTER UPDATE ON public.inscricoes_evento_cps
FOR EACH ROW
EXECUTE FUNCTION public.notificar_inscricao_aprovada();

-- Cria trigger para notificação de inscrição rejeitada
CREATE TRIGGER trigger_notifica_inscricao_rejeitada
AFTER UPDATE ON public.inscricoes_evento_cps
FOR EACH ROW
EXECUTE FUNCTION public.notificar_inscricao_rejeitada();

-- Comentário: Esta migração implementa a automação do envio de mensagens de WhatsApp
-- quando uma inscrição é aprovada ou rejeitada, utilizando chamadas HTTP diretas para as Edge Functions.
-- As funções de trigger verificam se o status da inscrição foi alterado e fazem uma requisição HTTP
-- para as edge functions correspondentes, que por sua vez enviam as mensagens de WhatsApp.
