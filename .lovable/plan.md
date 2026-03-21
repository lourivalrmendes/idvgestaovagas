
Objetivo: criar um novo item no menu lateral chamado “Assistente de Recrutamento” que abra, no canvas central do sistema, uma página dedicada com o site `https://recrutamento-hml.idvlabs.com.br/` incorporado.

O que vou implementar
1. Novo item no menu lateral
- Adicionar “Assistente de Recrutamento” na navegação principal do `AppSidebar`.
- Usar um ícone compatível com o restante do menu.
- Garantir destaque visual quando a rota estiver ativa.

2. Nova rota da aplicação
- Criar uma rota própria, por exemplo `/assistente-recrutamento`.
- Registrar essa rota em `src/App.tsx`.
- Incluir o título/breadcrumb correspondente no `Layout`.

3. Nova página para o assistente
- Criar uma página dedicada para renderizar o conteúdo externo dentro da área central do sistema.
- Usar um `iframe` ocupando toda a área útil da página, com altura responsiva e visual integrado ao layout atual.
- Incluir um estado inicial simples de carregamento para evitar tela “vazia” enquanto o conteúdo abre.

4. Comportamento esperado
- Ao clicar no item do menu, o usuário permanece dentro do sistema.
- O chatbot será exibido dentro do canvas central, sem abrir nova aba.
- A sidebar e o cabeçalho continuam visíveis, como nas demais telas.

Pontos técnicos importantes
- Arquivos que devem ser ajustados:
  - `src/components/AppSidebar.tsx`
  - `src/App.tsx`
  - `src/components/Layout.tsx`
  - novo arquivo de página, por exemplo `src/pages/RecruitmentAssistant.tsx`
- A implementação será apenas de embed, conforme sua decisão.
- Existe um risco externo: se esse site enviar políticas de segurança do navegador que bloqueiem incorporação (`iframe`), a página não poderá ser exibida dentro do sistema. Mesmo assim, a estrutura da tela e do menu ficará pronta corretamente do nosso lado.

Resultado esperado
- Novo menu “Assistente de Recrutamento” disponível na lateral.
- Ao acessar, o sistema mostra a página do chatbot incorporada no centro da aplicação.
- Navegação consistente com o restante do produto.
