## Objetivo

Expandir os status de **Candidato na Vaga** (Detalhes da Vaga) e os status de **Vaga** (Fluxo/Kanban) com novas etapas, mantendo as existentes.

## 1. Status do Candidato na Vaga (aba Candidatos do Detalhe da Vaga)

Lista final, na ordem do dropdown:

1. Entrevista com R&S  *(renomeação do atual “Em Entrevista RH”)*
2. Enviado ao Comercial/Cliente  *(novo)*
3. Entrevista Técnica  *(já existe — ajuste de rótulo)*
4. Entrevista com Cliente  *(já existe — ajuste de rótulo)*
5. Reprovado  *(mantém)*
6. Aprovado  *(mantém)*

## 2. Status da Vaga (Fluxo de Vagas / Kanban)

Pipeline final, na ordem das colunas:

1. Em Validação RH  *(mantém)*
2. Sem CVs – Dentro SLA  *(mantém)*
3. Sem CVs – Fora SLA  *(mantém)*
4. Com CVs Enviados  *(mantém)*
5. CVs +15 dias s/ Retorno  *(mantém)*
6. Entrevista com R&S  *(novo)*
7. Enviado ao Comercial/Cliente  *(novo)*
8. Entrevista Técnica  *(novo)*
9. Entrevista com Cliente  *(novo)*
10. Em Fechamento  *(mantém)*
11. Vaga Aprovada  *(mantém)*
12. Vaga Reprovada  *(mantém)*

A movimentação entre colunas continua livre (via dropdown “Mover para…”), exceto para Aprovada/Reprovada que seguem exigindo o diálogo de confirmação atual.

## Detalhes técnicos

**Sem alterações de banco.** As colunas `vagas.status` e `envios.status_candidato_na_vaga` já são `text` livres com default — basta usar novos valores string. RLS, triggers e histórico continuam funcionando.

Arquivos a editar:

- `src/types/index.ts`
  - `CandidatoStatusVaga`: adicionar `'ENVIADO_COMERCIAL_CLIENTE'`.
  - `CANDIDATO_STATUS_LABELS`: renomear `EM_ENTREVISTA` → "Entrevista com R&S"; adicionar `ENVIADO_COMERCIAL_CLIENTE`; ajustar rótulos de técnica/cliente; manter Aprovado/Reprovado. Reordenar para refletir a sequência pedida.
  - `VagaStatus`: adicionar `'ENTREVISTA_RS'`, `'ENVIADO_COMERCIAL_CLIENTE'`, `'ENTREVISTA_TECNICA'`, `'ENTREVISTA_CLIENTE'`.
  - `STATUS_LABELS`: rótulos das novas fases.
  - `PIPELINE_ORDER`: inserir as 4 novas fases entre `COM_CVS_MAIS_15_DIAS_SEM_RETORNO` e `EM_FECHAMENTO`.

- `src/components/StatusBadge.tsx`
  - Acrescentar entradas de cor para os 4 novos `VagaStatus` e o novo `CandidatoStatusVaga`, reaproveitando os tokens existentes em `index.css` (`--status-validacao`, `--status-com-cvs`, `--status-sem-retorno`, `--status-fechamento`) — sem novas variáveis de tema.

- `src/pages/JobsKanban.tsx` e `src/pages/JobDetail.tsx`
  - Sem mudança estrutural: ambos já leem `PIPELINE_ORDER` / `CANDIDATO_STATUS_LABELS` e renderizam dinamicamente. As novas fases aparecem automaticamente nas colunas e nos dropdowns de troca de status.

## Resultado esperado

- Detalhe da Vaga → aba Candidatos: dropdown de status passa a ter as 6 opções na ordem pedida; badges renderizam corretamente.
- Fluxo de Vagas (Kanban): 12 colunas na ordem definida; é possível mover qualquer vaga para as novas fases, com registro automático no Histórico (trigger existente).
- Nenhuma migração necessária; dados antigos permanecem válidos.
