
-- Create motivos_abertura table
CREATE TABLE public.motivos_abertura (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  ativo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.motivos_abertura ENABLE ROW LEVEL SECURITY;

-- Admin can manage
CREATE POLICY "Admin can manage motivos_abertura"
ON public.motivos_abertura
FOR ALL
USING (is_admin(auth.uid()))
WITH CHECK (is_admin(auth.uid()));

-- Authenticated can read
CREATE POLICY "Authenticated can read motivos_abertura"
ON public.motivos_abertura
FOR SELECT
USING (true);

-- Seed initial data
INSERT INTO public.motivos_abertura (nome) VALUES
  ('Vaga Nova'),
  ('Substituição'),
  ('Reposição');

-- Trigger for updated_at
CREATE TRIGGER update_motivos_abertura_updated_at
BEFORE UPDATE ON public.motivos_abertura
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
