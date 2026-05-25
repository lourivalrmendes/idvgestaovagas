## Objetivo
Adicionar botão **"Associar a Vaga"** ao lado do campo LinkedIn no diálogo **Editar Candidato**, permitindo vincular o candidato a uma vaga ativa de um cliente específico.

## Comportamento

- **Novo Candidato**: botão fica desabilitado (com tooltip "Salve o candidato primeiro"). Só fica ativo no diálogo **Editar Candidato**.
- **Editar Candidato**: ao clicar abre um modal "Associar Candidato a Vaga".

## Fluxo do modal de associação

1. **Passo 1 — Selecionar Cliente**: dropdown listando todos os clientes ativos (`clientes` ordenados por nome).
2. **Passo 2 — Selecionar Vaga**: após escolher o cliente, listar as vagas daquele cliente cujo status **NÃO** esteja em:
   - `VAGA_APROVADA`
   - `VAGA_REPROVADA`
   - `CANCELADA_CONGELADA`
   - `VAGA_PERDIDA`
   - Mostrar `código - função` (ex: `VAG-0012 - Desenvolvedor React`) com badge de status.
3. **Confirmar**: cria um registro em `envios` com:
   - `vaga_id` = vaga selecionada
   - `candidato_id` = candidato editado
   - `data_envio` = hoje
   - `status_candidato_na_vaga` = `EM_ENTREVISTA` (Entrevista com R&S)
   - `created_by_user_id` = usuário logado
4. **Validação**: se já existir envio do mesmo candidato para a mesma vaga, mostrar erro "Candidato já associado a esta vaga".

## Resultado

- O envio aparece automaticamente em:
  - **Histórico de Vagas** na página do Candidato (`CandidateDetail.tsx` — já lê `getEnviosByCandidato`).
  - **Aba Candidatos** na página da Vaga (`JobDetail.tsx` — já lê `getEnviosByVaga`).
- Toast de sucesso e fecha o modal de associação (mantém o diálogo de edição aberto).

## Detalhes técnicos

- **Arquivos a modificar**:
  - `src/pages/Candidates.tsx` — adicionar botão ao lado do input LinkedIn (mesma linha, layout flex) e novo `Dialog` "Associar a Vaga" controlado por estado local.
  - Nenhuma alteração de schema/DB necessária: já existem `clientes`, `vagas`, `envios` e RLS para INSERT em `envios` por Admin/Coord/Recrutador.
- **Filtros das vagas**: usar `store.vagas` filtrando por `cliente_id` (ou `nome_cliente`) e excluindo os 4 status finais.
- **Permissões**: RLS de `envios` exige que recrutador esteja atribuído à vaga. Admin/Coord podem associar a qualquer vaga. Mostrar erro amigável se o INSERT for negado.
- **UI**: layout do campo LinkedIn passa a ser `flex gap-2` com Input + Button "Associar a Vaga" (ícone `Link2`).
