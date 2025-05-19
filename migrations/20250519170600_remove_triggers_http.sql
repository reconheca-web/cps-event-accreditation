-- Remove as triggers e funções que usam HTTP diretamente
DROP TRIGGER IF EXISTS trigger_envia_mensagem_confirmacao ON public.inscricoes_evento_cps;
DROP TRIGGER IF EXISTS trigger_envia_mensagem_rejeicao ON public.inscricoes_evento_cps;

DROP FUNCTION IF EXISTS public.notificar_whatsapp_confirmacao();
DROP FUNCTION IF EXISTS public.notificar_whatsapp_rejeicao();

-- Comentário: Esta migração remove as triggers e funções que tentavam usar HTTP diretamente
-- para chamar Edge Functions. Serão substituídas por Webhooks do Supabase.
