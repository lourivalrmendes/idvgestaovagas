
# Plano: CRUD de Motivo de Abertura + Dropdown na Nova Vaga

## Resumo
Criar a tabela `motivos_abertura` no banco de dados com os registros iniciais (Vaga Nova, Substituicao, Reposicao), adicionar o CRUD na area de Administracao, e substituir o campo texto "Motivo Abertura" por um dropdown no formulario de Nova Vaga.

## Alteracoes

### 1. Criar tabela `motivos_abertura` no banco de dados
- Colunas: `id` (uuid), `nome` (text), `ativo` (boolean, default true), `created_at`, `updated_at`
- Inserir 3 registros iniciais: "Vaga Nova", "Substituicao", "Reposicao"
- Habilitar RLS com as mesmas politicas das demais tabelas de dimensao:
  - Admin pode gerenciar (ALL)
  - Authenticated pode ler (SELECT)

### 2. Administration.tsx - Nova aba "Motivos Abertura"
- Adicionar estado `motList`, `motDialog`, `motForm` (mesmo padrao de Categorias/Clientes)
- Implementar `fetchMotivos`, `saveMot` (insert/update), `toggleMot` (ativar/desativar)
- Adicionar tab "Motivos" no `TabsList` e `TabsContent` com tabela mostrando Nome, Status e Acoes

### 3. CreateJob.tsx - Dropdown de Motivo Abertura
- Adicionar estado `motivos` e fetch no `useEffect` existente, buscando da tabela `motivos_abertura` onde `ativo = true`
- Substituir o `<Input>` do campo `motivo_abertura_vaga` por um `<Select>` com os motivos do banco

### Arquivos impactados
- **Migracao SQL** - Nova tabela `motivos_abertura` + seed dos 3 registros + RLS
- `src/pages/Administration.tsx` - Nova aba Motivos com CRUD
- `src/pages/CreateJob.tsx` - Dropdown de motivo lendo do banco

### Detalhes tecnicos
- Padrao identico ao ja implementado para Categorias, Clientes e Unidades (DimensionItem com id, nome, ativo)
- O campo `motivo_abertura_vaga` na tabela `vagas` continuara armazenando o texto do motivo selecionado (sem FK), mantendo consistencia com os demais campos
