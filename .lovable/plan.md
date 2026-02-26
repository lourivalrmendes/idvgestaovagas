

# Plano: CRUD de Clientes na Administracao + Atualizar Filtros

## Resumo
Criar a aba "Clientes" na area de Administracao com CRUD completo (criar, editar, ativar/desativar), e atualizar todos os dropdowns de Cliente para ler da tabela `clientes` do banco de dados (apenas ativos).

## Alteracoes

### 1. Administration.tsx - Nova aba "Clientes"
- Adicionar estado para `cliList`, `cliDialog`, `cliForm` (mesmo padrao de Categorias/Unidades)
- Adicionar `fetchClientes` que le da tabela `clientes`
- Implementar `saveCli` (insert/update) e `toggleCli` (ativar/desativar)
- Adicionar tab "Clientes" no `TabsList` e `TabsContent` com tabela mostrando Nome, Status e Acoes (editar/toggle)

### 2. GlobalFilters.tsx - Ler clientes do banco
- Substituir `store.clientes` por um estado local com `useEffect` que busca clientes ativos (`ativo = true`) diretamente do banco via Supabase
- O mesmo ajuste ja foi feito para Unidades e Categorias no CreateJob; agora sera aplicado nos filtros globais (usado no Dashboard e Kanban)

### 3. CreateJob.tsx - Ler clientes do banco
- Adicionar estado `clientes` e fetch no `useEffect` existente, buscando da tabela `clientes` onde `ativo = true`
- Substituir `store.clientes` no dropdown e na resolucao de `clienteId`

### Arquivos impactados
- `src/pages/Administration.tsx` - Nova aba Clientes com CRUD
- `src/components/GlobalFilters.tsx` - Dropdown de clientes lendo do banco
- `src/pages/CreateJob.tsx` - Dropdown de clientes lendo do banco

### Detalhes tecnicos
- Nenhuma alteracao de banco de dados necessaria (tabela `clientes` ja existe com RLS configurado)
- Padrao identico ao ja implementado para Categorias e Unidades (DimensionItem com id, nome, ativo)
- Os filtros no Dashboard e Fluxo de Vagas (Kanban) usam o componente `GlobalFilters`, entao ambos serao atualizados automaticamente

