## Objetivo
Incluir o status **"Vaga Perdida"** ao final do pipeline de vagas, após "Cancelada / Congelada", refletindo na página de Fluxo de Vagas (Kanban) e em todas as telas que consomem os status.

## Alterações

### 1. Tipos e constantes (`src/types/index.ts`)
- Adicionar `VAGA_PERDIDA` ao union type `VagaStatus`
- Adicionar label `VAGA_PERDIDA: 'Vaga Perdida'` em `STATUS_LABELS`
- Incluir `'VAGA_PERDIDA'` ao final de `PIPELINE_ORDER`

### 2. Badge de status (`src/components/StatusBadge.tsx`)
- Adicionar estilo visual para `VAGA_PERDIDA` (tom que indique perda/encerramento negativo, similar a `VAGA_REPROVADA`)

### 3. Dashboard (`src/pages/Dashboard.tsx`)
- Atualizar KPI "Vagas Perdidas" para contar tanto `VAGA_REPROVADA` quanto `VAGA_PERDIDA`
- Atualizar KPI "Encerradas" para incluir `VAGA_PERDIDA`
- Atualizar gráfico de barras (perdidas por categoria) para incluir `VAGA_PERDIDA`
- Atualizar insights de perdas para incluir `VAGA_PERDIDA`

### 4. Fluxo de Vagas / Kanban (`src/pages/JobsKanban.tsx`)
- Como a página itera sobre `PIPELINE_ORDER`, a nova coluna aparecerá automaticamente
- Verificar se o diálogo de confirmação ao mover para `VAGA_PERDIDA` precisa de tratamento especial (será tratado como status normal, sem diálogo de aprovação/reprovação)

### 5. Detalhe da Vaga (`src/pages/JobDetail.tsx`)
- O seletor de status já itera sobre `PIPELINE_ORDER`, portanto a nova opção aparece automaticamente
- Nenhuma lógica especial necessária para `VAGA_PERDIDA` (não exige data de início nem motivo)

## Resultado final
A coluna "Vaga Perdida" será exibida no Kanban como a última coluna do pipeline, permitindo mover vagas para esse status e contabilizá-las corretamente nos indicadores do Dashboard.