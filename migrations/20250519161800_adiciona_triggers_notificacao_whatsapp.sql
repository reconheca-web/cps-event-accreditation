-- Adiciona extensão HTTP para permitir requisições HTTP a partir do PostgreSQL
CREATE EXTENSION IF NOT EXISTS http;

-- Função para envio automático da mensagem de confirmação
CREATE OR REPLACE FUNCTION public.notificar_whatsapp_confirmacao()
RETURNS trigger AS $$
DECLARE
  content_text TEXT;
BEGIN
  IF NEW.status_inscricao = 'aprovado'
     AND (OLD.status_inscricao IS DISTINCT FROM NEW.status_inscricao)
     AND NEW.envio_mensagem_confirmacao IS NOT TRUE
  THEN
    -- Preparar o conteúdo da requisição como texto
    content_text := '{"id":"' || NEW.id || '"}'; 
    
    -- Fazer a requisição HTTP POST
    PERFORM http_post(
      'https://emwlcpuwiuwrgfcvqcso.supabase.co/functions/v1/envia_msg_confirmada',
      content_text,
      'application/json'
    );
    
    -- Atualizar o registro para indicar que a notificação foi enviada
    UPDATE public.inscricoes_evento_cps
    SET envio_mensagem_confirmacao = TRUE
    WHERE id = NEW.id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Função para envio automático da mensagem de rejeição
CREATE OR REPLACE FUNCTION public.notificar_whatsapp_rejeicao()
RETURNS trigger AS $$
DECLARE
  content_text TEXT;
BEGIN
  IF NEW.status_inscricao = 'rejeitado'
     AND (OLD.status_inscricao IS DISTINCT FROM NEW.status_inscricao)
     AND NEW.envio_mensagem_rejeicao IS NOT TRUE
  THEN
    -- Preparar o conteúdo da requisição como texto
    content_text := '{"id":"' || NEW.id || '"}'; 
    
    -- Fazer a requisição HTTP POST
    PERFORM http_post(
      'https://emwlcpuwiuwrgfcvqcso.supabase.co/functions/v1/envia_msg_rejeitada',
      content_text,
      'application/json'
    );
    
    -- Atualizar o registro para indicar que a notificação foi enviada
    UPDATE public.inscricoes_evento_cps
    SET envio_mensagem_rejeicao = TRUE
    WHERE id = NEW.id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Remover triggers existentes, se houver
DROP TRIGGER IF EXISTS trigger_envia_mensagem_confirmacao ON public.inscricoes_evento_cps;
DROP TRIGGER IF EXISTS trigger_envia_mensagem_rejeicao ON public.inscricoes_evento_cps;

-- Criar trigger para envio de mensagem de confirmação
CREATE TRIGGER trigger_envia_mensagem_confirmacao
AFTER UPDATE ON public.inscricoes_evento_cps
FOR EACH ROW
EXECUTE FUNCTION public.notificar_whatsapp_confirmacao();

-- Criar trigger para envio de mensagem de rejeição
CREATE TRIGGER trigger_envia_mensagem_rejeicao
AFTER UPDATE ON public.inscricoes_evento_cps
FOR EACH ROW
EXECUTE FUNCTION public.notificar_whatsapp_rejeicao();

-- Comentário: Esta migração implementa a automação do envio de mensagens de WhatsApp
-- quando uma inscrição é aprovada ou rejeitada. As funções de trigger verificam se o status
-- da inscrição foi alterado para 'aprovado' ou 'rejeitado' e, em caso positivo, fazem uma
-- requisição HTTP para as Edge Functions do Supabase que enviam as mensagens.
