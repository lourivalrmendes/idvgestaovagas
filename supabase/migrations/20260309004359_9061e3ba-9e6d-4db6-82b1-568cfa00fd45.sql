-- Alter the 'necessario_equipamento' column to store equipment provider instead of boolean
-- Change from boolean to text to store: 'PROPRIO', 'IDV', 'CLIENTE'
ALTER TABLE public.vagas 
  ALTER COLUMN necessario_equipamento TYPE TEXT USING 
    CASE 
      WHEN necessario_equipamento = true THEN 'IDV'
      WHEN necessario_equipamento = false THEN 'NAO_NECESSARIO'
      ELSE 'NAO_NECESSARIO'
    END;

-- Rename the column to better reflect its new purpose
ALTER TABLE public.vagas 
  RENAME COLUMN necessario_equipamento TO equipamento;

-- Set default value
ALTER TABLE public.vagas 
  ALTER COLUMN equipamento SET DEFAULT 'NAO_NECESSARIO';

COMMENT ON COLUMN public.vagas.equipamento IS 'Equipment provider: PROPRIO (candidate owns), IDV (company provides), CLIENTE (client provides), NAO_NECESSARIO (not needed)';