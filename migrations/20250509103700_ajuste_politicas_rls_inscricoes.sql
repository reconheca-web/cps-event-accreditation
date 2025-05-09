-- Migração: Ajuste nas políticas RLS da tabela inscricoes_evento_cps
-- Propósito: Permitir que usuários não autenticados possam inserir inscrições

-- Configurar o schema explicitamente (conforme boas práticas)
SET search_path = public;

-- Comentário explicativo
COMMENT ON TABLE public.inscricoes_evento_cps IS 'Tabela de inscrições para eventos da CPS';

-- 1. Remover todas as políticas existentes para evitar conflitos
DROP POLICY IF EXISTS "Cadastro aberto (sem auth)" ON public.inscricoes_evento_cps;
DROP POLICY IF EXISTS "Leitura apenas autenticado" ON public.inscricoes_evento_cps;
DROP POLICY IF EXISTS "Atualização apenas autenticado" ON public.inscricoes_evento_cps;
DROP POLICY IF EXISTS "Exclusão apenas autenticado" ON public.inscricoes_evento_cps;
DROP POLICY IF EXISTS "Inserção universal" ON public.inscricoes_evento_cps;

-- 2. Desativar temporariamente o RLS para garantir que não há interferência durante a migração
ALTER TABLE public.inscricoes_evento_cps DISABLE ROW LEVEL SECURITY;

-- 3. Ativar novamente o RLS e garantir que ele seja aplicado também ao proprietário da tabela
ALTER TABLE public.inscricoes_evento_cps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inscricoes_evento_cps FORCE ROW LEVEL SECURITY;

-- 4. Criar novas políticas mais específicas e abrangentes
-- Política para inserções - permitir a qualquer usuário (incluindo anônimos)
CREATE POLICY "Inserção universal" 
ON public.inscricoes_evento_cps 
FOR INSERT 
TO public
WITH CHECK (true);

-- Política para leitura - apenas usuários autenticados
CREATE POLICY "Leitura apenas autenticado" 
ON public.inscricoes_evento_cps 
FOR SELECT 
TO authenticated
USING (auth.role() = 'authenticated');

-- Política para atualização - apenas usuários autenticados
CREATE POLICY "Atualização apenas autenticado" 
ON public.inscricoes_evento_cps 
FOR UPDATE 
TO authenticated
USING (auth.role() = 'authenticated');

-- Política para exclusão - apenas usuários autenticados
CREATE POLICY "Exclusão apenas autenticado" 
ON public.inscricoes_evento_cps 
FOR DELETE 
TO authenticated
USING (auth.role() = 'authenticated');

-- 5. Garantir permissões explícitas para os papéis
GRANT SELECT, INSERT, UPDATE, DELETE ON public.inscricoes_evento_cps TO authenticated;
GRANT INSERT ON public.inscricoes_evento_cps TO anon;

-- 6. Adicionar índices para colunas usadas em restrições de unicidade
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE tablename = 'inscricoes_evento_cps' AND indexname = 'idx_inscricoes_email'
  ) THEN
    CREATE UNIQUE INDEX idx_inscricoes_email ON public.inscricoes_evento_cps (email);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE tablename = 'inscricoes_evento_cps' AND indexname = 'idx_inscricoes_telefone'
  ) THEN
    CREATE UNIQUE INDEX idx_inscricoes_telefone ON public.inscricoes_evento_cps (telefone);
  END IF;
END
$$;

-- 7. Adicionar comentários explicativos às políticas para melhor documentação
COMMENT ON POLICY "Inserção universal" ON public.inscricoes_evento_cps IS 
'Permite que qualquer usuário (incluindo anônimos) insira uma nova inscrição, necessário para o formulário público de cadastro.';

COMMENT ON POLICY "Leitura apenas autenticado" ON public.inscricoes_evento_cps IS 
'Restringe a leitura de inscrições apenas a usuários autenticados para proteger dados pessoais.';

COMMENT ON POLICY "Atualização apenas autenticado" ON public.inscricoes_evento_cps IS 
'Restringe a atualização de inscrições apenas a usuários autenticados para proteger a integridade dos dados.';

COMMENT ON POLICY "Exclusão apenas autenticado" ON public.inscricoes_evento_cps IS 
'Restringe a exclusão de inscrições apenas a usuários autenticados para proteger a integridade dos dados.';
