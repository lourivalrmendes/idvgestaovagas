
# Plano: Inserir categoria SAP no banco de dados

## Problema
A categoria "SAP" nao foi inserida no banco de dados. A tentativa anterior provavelmente falhou por causa das politicas RLS que bloqueiam insercoes fora do contexto de admin autenticado.

## Solucao
Criar uma migracao SQL para inserir o registro "SAP" na tabela `categorias`. Migracoes rodam com privilegios elevados (bypass RLS), garantindo que o registro sera criado.

## Alteracao
- **Nova migracao SQL**: `INSERT INTO public.categorias (nome) VALUES ('SAP');`

## Resultado esperado
- A categoria "SAP" aparecera automaticamente:
  - No dropdown de Categoria nos filtros do Dashboard
  - No dropdown de Categoria no formulario de Nova Vaga
  - Na aba Categorias da Administracao
