Objetivo: adicionar no Painel de Vagas um botão "Exportar Excel" que gera uma planilha .xlsx formatada com os dados atualmente exibidos na tabela, respeitando a busca e os filtros aplicados.

O que vou implementar
1. Botão "Exportar Excel"
- Adicionar ao lado do botão "Nova Vaga", no topo do Painel de Vagas.
- Ícone de download e estilo visual coerente com os demais botões.
- Desabilitado quando não houver linhas a exportar.

2. Exportação respeitando filtros
- A planilha conterá exatamente as linhas em `filtered` (ou seja, com a busca por ID/cliente/função e os filtros globais já aplicados).
- Colunas exportadas (mesmas da tabela):
  - ID, Cliente, Função, Unidade, Categoria, Recrutador, Status, Data de Criação, SLA (dias), Quantidade de CVs.

3. Formatação do arquivo
- Cabeçalho em negrito, fundo destacado e texto centralizado.
- Largura de colunas ajustada ao conteúdo.
- Linhas com bordas finas e zebrado leve para leitura.
- Nome do arquivo no padrão `painel-vagas-AAAA-MM-DD.xlsx`.

4. Biblioteca
- Usar `xlsx` (SheetJS) para gerar o arquivo no navegador, sem necessidade de backend.
- Será adicionada como dependência se ainda não estiver instalada.

Pontos técnicos
- Arquivo afetado: `src/pages/JobsPanel.tsx`.
- A função de exportação será uma função local, recebendo `filtered`, `getUserById` e `getEnviosByVaga` para montar as linhas exatamente como aparecem na tela.
- Sem mudanças em banco, regras de negócio ou outras telas.

Resultado esperado
- No Painel de Vagas, o usuário aplica filtros/busca, clica em "Exportar Excel" e baixa uma planilha formatada contendo apenas as vagas visíveis na tela.