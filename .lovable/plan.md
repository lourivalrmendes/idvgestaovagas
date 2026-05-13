## Ajustar Status do Candidato na Vaga

### Objetivo
Atualizar a lista de status disponíveis para candidatos associados a uma vaga (aba Candidatos no Detalhe da Vaga), refletindo as novas etapas do processo seletivo.

### Mudanças no tipo `CandidatoStatusVaga`
- **Adicionar:** `DECLINOU`
- **Manter:** `EM_ENTREVISTA`, `ENVIADO_COMERCIAL_CLIENTE`, `EM_ENTREVISTA_TECNICA`, `EM_ENTREVISTA_CLIENTE`, `REPROVADO`, `APROVADO`

### Mudanças nos rótulos (`CANDIDATO_STATUS_LABELS`)
- `EM_ENTREVISTA` → "Entrevista com R&S"
- `EM_ENTREVISTA_TECNICA` → "Entrevista técnica"
- `ENVIADO_COMERCIAL_CLIENTE` → "CV Enviado ao comercial/cliente" *(renomeado)*
- `EM_ENTREVISTA_CLIENTE` → "Entrevista com cliente"
- `REPROVADO` → "Reprovado"
- `APROVADO` → "Aprovado"
- `DECLINOU` → "Declinou" *(novo)*

### Mudanças nos componentes
1. **`src/types/index.ts`**
   - Adicionar `DECLINOU` ao tipo `CandidatoStatusVaga`.
   - Atualizar `CANDIDATO_STATUS_LABELS` com os rótulos acima.

2. **`src/components/StatusBadge.tsx`**
   - Adicionar estilo para `DECLINOU` no `candidatoStatusStyles`.

3. **`src/pages/JobDetail.tsx`**
   - Atualizar o `<Select>` de status do candidato (linhas ~330-336) para listar todas as opções, usando os valores e rótulos atualizados.

### Nota técnica
Não são necessárias mudanças no banco de dados. A coluna `envios.status_candidato_na_vaga` é do tipo `text`, então novos valores são aceitos automaticamente.