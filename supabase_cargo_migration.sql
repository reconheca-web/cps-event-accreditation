-- Execute este SQL no console do Supabase para adicionar a coluna cargo à tabela
ALTER TABLE public.inscricoes_evento_cps ADD COLUMN cargo TEXT;

-- Adiciona comentário explicativo à coluna
COMMENT ON COLUMN public.inscricoes_evento_cps.cargo IS 'Cargo ou função do inscrito na instituição';
