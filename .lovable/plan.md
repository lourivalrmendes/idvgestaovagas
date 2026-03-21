
Objetivo: fazer o botão “X” do CV, na edição de candidato, realmente excluir o arquivo salvo no backend e liberar a troca por um novo arquivo.

1. Identificar a causa do problema atual
- Hoje o componente `FileUpload` apenas limpa o nome exibido localmente.
- Ele não chama nenhuma ação para apagar o arquivo do bucket `candidate-cvs`.
- Ele também não limpa os campos `cv_url` e `cv_filename` do candidato na tabela `candidatos`.

2. Ajustar o `FileUpload` para suportar remoção real
- Evoluir `src/components/FileUpload.tsx` para aceitar um callback de remoção do arquivo atual.
- Diferenciar dois cenários:
  - arquivo já salvo no candidato: clicar no “X” deve executar a remoção real
  - arquivo recém-selecionado, mas ainda não salvo: clicar no “X” deve apenas limpar a seleção local
- Adicionar estado de carregamento/desabilitado durante a exclusão para evitar cliques duplicados.

3. Criar ação de remoção de CV no store
- Em `src/data/store.tsx`, adicionar uma função como `removeCandidatoCV(candidatoId)`.
- Essa função deve:
  - localizar os arquivos na pasta do candidato no bucket (`${candidatoId}/`)
  - remover o(s) arquivo(s) existente(s) do storage
  - atualizar a tabela `candidatos`, definindo `cv_url = null` e `cv_filename = null`
  - recarregar a lista de candidatos
  - exibir mensagem de sucesso/erro adequada

4. Conectar a remoção na tela de candidatos
- Em `src/pages/Candidates.tsx`, passar o callback de remoção para o `FileUpload` dentro do modal de edição.
- Após remover o CV:
  - atualizar o `editDialog` local para refletir que o candidato ficou sem CV
  - manter o modal aberto
  - permitir selecionar imediatamente um novo arquivo para substituição

5. Melhorar o fluxo de substituição do CV
- Ajustar `uploadCandidatoCV` para limpar arquivos antigos da pasta do candidato antes de enviar o novo.
- Isso evita arquivos órfãos e garante que cada candidato tenha apenas um CV ativo.

Arquivos envolvidos
- `src/components/FileUpload.tsx`
- `src/data/store.tsx`
- `src/pages/Candidates.tsx`

Detalhes técnicos
- Não deve ser necessária migração no banco.
- A exclusão pode ser feita de forma robusta listando os arquivos em `candidate-cvs/${candidatoId}` e removendo todos dessa pasta, porque o upload atual já usa esse padrão:
```text
${candidatoId}/${Date.now()}_${file.name}
```
- Depois da remoção, os campos do candidato devem ficar:
```text
cv_url = null
cv_filename = null
```

Resultado esperado
- Ao clicar no “X” do CV existente, o arquivo some de verdade do storage e do cadastro do candidato.
- O usuário consegue escolher outro CV no mesmo modal e salvar normalmente.
- A interface deixa claro quando o CV foi removido com sucesso e não mostra mais o arquivo antigo.
