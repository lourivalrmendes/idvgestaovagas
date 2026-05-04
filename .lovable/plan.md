## Objetivo
Expandir os status do candidato dentro de uma vaga, na tela de Detalhes da Vaga, para incluir três tipos de entrevista além de Aprovado/Reprovado.

## Novos status
- Em Entrevista RH (renomeação do atual "Em Entrevista", mantém o código `EM_ENTREVISTA` no banco para preservar os registros existentes)
- Em Entrevista Técnica (novo, código `EM_ENTREVISTA_TECNICA`)
- Em Entrevista Cliente (novo, código `EM_ENTREVISTA_CLIENTE`)
- Aprovado (mantido)
- Reprovado (mantido)

## O que vou alterar

1. `src/types/index.ts`
   - Atualizar o tipo `CandidatoStatusVaga` para incluir os dois novos códigos.
   - Atualizar `CANDIDATO_STATUS_LABELS`: rótulo de `EM_ENTREVISTA` passa a ser "Em Entrevista RH" e adicionar os rótulos dos novos status.

2. `src/components/StatusBadge.tsx`
   - Adicionar estilos para os novos status (mesma família visual do "Em Entrevista" atual, para manter consistência), garantindo que o badge renderize corretamente.

3. `src/pages/JobDetail.tsx`
   - No `Select` de status do candidato (aba Candidatos), incluir os três itens de entrevista além de Aprovado/Reprovado, na ordem:
     1. Em Entrevista RH
     2. Em Entrevista Técnica
     3. Em Entrevista Cliente
     4. Aprovado
     5. Reprovado

## O que NÃO vou alterar
- Banco de dados: a coluna `envios.status_candidato_na_vaga` já é `text` sem constraint, então os novos valores são aceitos sem migração. Registros antigos `EM_ENTREVISTA` continuam válidos e passam a aparecer como "Em Entrevista RH".
- Regras de negócio, RLS, fluxo de Kanban da vaga e demais telas permanecem inalterados.

## Resultado esperado
Na aba Candidatos da tela de Detalhes da Vaga, o seletor de status do candidato passa a oferecer 5 opções: Em Entrevista RH, Em Entrevista Técnica, Em Entrevista Cliente, Aprovado e Reprovado, com badges coloridos correspondentes.