
Objetivo: corrigir o fluxo de troca imediata do CV na edição do candidato, para que após excluir o arquivo o usuário possa selecionar outro sem precisar clicar em “Salvar”, e evitar o erro `Invalid key`.

Diagnóstico
- A exclusão do CV já está sendo persistida imediatamente no backend por `removeCandidatoCV`.
- O botão “Salvar” não é o responsável por “limpar variáveis” do CV removido.
- O erro mostrado (`Invalid key`) aponta para o nome/caminho do arquivo enviado ao storage, especialmente porque o path atual usa `file.name` bruto:
```text
${candidatoId}/${Date.now()}_${file.name}
```
- Nomes com acentos, caracteres especiais ou certos símbolos podem gerar chave inválida no storage. Isso explica por que a remoção funciona, mas o novo upload falha.

O que vou ajustar
1. Sanitizar o nome do arquivo antes do upload
- Em `src/data/store.tsx`, criar uma função para normalizar o nome do CV:
  - remover acentos
  - trocar espaços por `_` ou `-`
  - remover caracteres especiais inválidos
  - manter a extensão original
- O upload passará a usar um nome seguro no storage, sem depender do nome bruto do arquivo.

2. Manter o nome original apenas para exibição
- Salvar no banco:
  - `cv_url` com o path seguro/publicado
  - `cv_filename` com o nome original do arquivo para o usuário continuar vendo o nome real no sistema
- Assim resolvemos o erro técnico sem piorar a experiência visual.

3. Garantir troca imediata no modal
- Revisar `src/pages/Candidates.tsx` e `src/components/FileUpload.tsx` para confirmar que, após `handleRemoveCV`, o componente entra imediatamente em estado “sem arquivo”.
- O usuário poderá selecionar outro CV no mesmo modal, sem precisar salvar antes.

4. Fortalecer o fluxo de substituição
- Em `uploadCandidatoCV`, manter a limpeza prévia dos arquivos antigos.
- Se o upload do novo arquivo falhar, exibir mensagem clara de erro sem deixar o modal em estado inconsistente.

5. Validar mensagens e comportamento esperado
- Exclusão continua com sucesso imediato.
- Seleção de novo arquivo após exclusão passa a funcionar no mesmo modal.
- O novo upload só será efetivado ao salvar a edição, mas sem erro de chave inválida.

Arquivos envolvidos
- `src/data/store.tsx`
- `src/pages/Candidates.tsx`
- `src/components/FileUpload.tsx`

Resultado esperado
- Excluir o CV atual continua funcionando na hora.
- Logo após excluir, o usuário consegue escolher outro arquivo sem clicar em “Salvar”.
- O erro `Invalid key` deixa de acontecer, mesmo com nomes de arquivo contendo acentos e caracteres especiais.
