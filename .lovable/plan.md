
Objetivo: adicionar, na página de Candidatos, um filtro de Cargo ao lado da pesquisa por nome para listar apenas candidatos relacionados ao cargo selecionado.

Diagnóstico do que existe hoje
- A tela `src/pages/Candidates.tsx` hoje só filtra por texto (`nome`, `email`, `cidade`).
- O dropdown de cargos pode vir da tabela `funcoes`, que já existe e já é usada em `CreateJob.tsx`.
- Porém a tabela `candidatos` não possui campo de cargo/função próprio.
- No modelo atual, o vínculo entre candidato e cargo existe indiretamente por `envios -> vagas -> vagas.funcao`.

Plano recomendado
1. Carregar os cargos ativos
- Reaproveitar o mesmo padrão já usado em `CreateJob.tsx` para buscar `funcoes` ativas.
- Exibir o dropdown ao lado do campo de pesquisa.
- Incluir opção padrão como “Todos os cargos”.

2. Adicionar estado de filtro na tela
- Criar um estado local para o cargo selecionado.
- Manter o filtro de nome atual funcionando junto com o novo filtro de cargo.

3. Filtrar candidatos pelo cargo das vagas relacionadas
- Usar `store.envios` + `store.vagas` para descobrir quais candidatos já tiveram envio para vagas com `vaga.funcao === cargoSelecionado`.
- Aplicar esse conjunto junto com a busca textual.
- Garantir que o mesmo candidato não apareça duplicado.

4. Ajustar a experiência da listagem
- Se nenhum cargo estiver selecionado, a listagem continua como hoje.
- Se houver cargo selecionado, mostrar apenas os candidatos compatíveis.
- Manter a mensagem de “Nenhum candidato encontrado” funcionando também com o novo filtro.

5. Refinar usabilidade
- Posicionar o dropdown ao lado da busca.
- Exibir o nome do cargo exatamente como vem da tabela de funções.
- Deixar o layout responsivo para caber bem na largura atual da página.

Detalhe importante de negócio
- Pelo modelo atual, esse filtro vai trazer candidatos que já foram associados a vagas daquele cargo.
- Se a intenção for filtrar por um “cargo do próprio candidato” salvo no cadastro dele, aí será necessária uma segunda etapa com mudança no banco:
  - adicionar campo de cargo em `candidatos`
  - incluir esse campo no criar/editar candidato
  - trocar o filtro para usar esse valor diretamente

Arquivos envolvidos
- `src/pages/Candidates.tsx`
- possivelmente `src/data/store.tsx` apenas se eu centralizar o carregamento de `funcoes`

Recomendação
- Implementar primeiro sem alterar o banco, usando a relação já existente entre candidatos, envios e vagas.
- Isso entrega o filtro pedido mais rápido e com menor risco.
