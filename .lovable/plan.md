## Manutenção de Status de Vaga — Botão "Atualizar Status"

### Contexto
O botão **Atualizar Status** na tela de Detalhes da Vaga lista os status disponíveis para a vaga. Hoje existem 12 status, sendo que 4 deles devem ser removidos e 1 novo deve ser adicionado.

### Alterações no tipo `VagaStatus` (`src/types/index.ts`)
- **Remover** os seguintes status:
  - `ENTREVISTA_RS`
  - `ENVIADO_COMERCIAL_CLIENTE`
  - `ENTREVISTA_TECNICA`
  - `ENTREVISTA_CLIENTE`
- **Adicionar** o novo status:
  - `CANCELADA_CONGELADA` com label "Cancelada / Congelada"
- **Atualizar** `STATUS_LABELS` — remover entradas dos 4 status excluídos, adicionar entrada para `CANCELADA_CONGELADA`.
- **Atualizar** `PIPELINE_ORDER` — remover os 4 status excluídos, posicionar `CANCELADA_CONGELADA` ao final do pipeline (após `VAGA_REPROVADA`).

### Status finais da vaga (9 status)
1. Em Validação RH
2. Sem CVs – Dentro SLA
3. Sem CVs – Fora SLA
4. Com CVs Enviados
5. CVs +15 dias s/ Retorno
6. Em Fechamento
7. Vaga Aprovada
8. Vaga Reprovada
9. Cancelada / Congelada *(novo)*

### Alterações em `src/components/StatusBadge.tsx`
- Remover as 4 entradas de `statusStyles` dos status excluídos.
- Adicionar entrada `CANCELADA_CONGELADA` com estilo visual apropriado (sugestão: cinza/neutro).

### Impacto em outras telas
- **Fluxo de Vagas (Kanban)** — as colunas são geradas a partir de `PIPELINE_ORDER`, então refletem automaticamente os 9 status.
- **Detalhes da Vaga → Atualizar Status** — o `<Select>` itera sobre `PIPELINE_ORDER`, então o dropdown reflete automaticamente os 9 status.
- **Dashboard** — a lista `openStatuses` define quais status são considerados "abertos". O novo status `CANCELADA_CONGELADA` será tratado como "encerrado" (não aberto), assim como `VAGA_APROVADA` e `VAGA_REPROVADA`.

### Segurança de dados
- Verificação no banco: **nenhuma vaga** atualmente utiliza os 4 status que serão removidos. Não há necessidade de migração de dados.
- O campo `status` da tabela `vagas` é do tipo `text` (sem enum ou check constraint), portanto não requer alteração de schema.

### Arquivos alterados
- `src/types/index.ts`
- `src/components/StatusBadge.tsx`
- `src/pages/Dashboard.tsx` (ajuste em `openStatuses` se necessário)
