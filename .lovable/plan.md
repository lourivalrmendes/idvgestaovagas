

## Plano: Remover opção "Alocação" do tipo de contratação

Remover a opção "Alocação" de todos os locais onde aparece, mantendo apenas CLT e PJ.

### Arquivos a alterar

1. **`src/types/index.ts`** — Remover `alocacao` do tipo `tipo_contratacao`
2. **`src/pages/CreateJob.tsx`** — Remover `tipo_alocacao` do formulário, estado inicial e validação
3. **`src/pages/JobDetail.tsx`** — Remover referência a `alocacao` na exibição
4. **`src/data/store.tsx`** — Remover mapeamento de `ALOCACAO`
5. **`src/data/mockData.ts`** — Remover `alocacao` dos dados mock

### Detalhes técnicos

- O tipo `tipo_contratacao` passa de `{ pj: boolean; clt: boolean; alocacao: boolean }` para `{ pj: boolean; clt: boolean }`
- No formulário de criação, o array de checkboxes passa de `["tipo_clt", "tipo_pj", "tipo_alocacao"]` para `["tipo_clt", "tipo_pj"]`
- A validação e o mapeamento de tipo são ajustados para considerar apenas CLT e PJ

