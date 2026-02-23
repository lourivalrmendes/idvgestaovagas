
-- Tabela de Áreas
CREATE TABLE public.areas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  codigo text NOT NULL UNIQUE,
  nome text NOT NULL,
  ativo boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.areas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated can read areas" ON public.areas FOR SELECT USING (true);
CREATE POLICY "Admin can manage areas" ON public.areas FOR ALL USING (is_admin(auth.uid())) WITH CHECK (is_admin(auth.uid()));

CREATE TRIGGER update_areas_updated_at BEFORE UPDATE ON public.areas
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Tabela de Funções
CREATE TABLE public.funcoes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  codigo text NOT NULL UNIQUE,
  nome text NOT NULL,
  ativo boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.funcoes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated can read funcoes" ON public.funcoes FOR SELECT USING (true);
CREATE POLICY "Admin can manage funcoes" ON public.funcoes FOR ALL USING (is_admin(auth.uid())) WITH CHECK (is_admin(auth.uid()));

CREATE TRIGGER update_funcoes_updated_at BEFORE UPDATE ON public.funcoes
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
