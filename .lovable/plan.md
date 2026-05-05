## Problema

Na aba **Histórico** do Detalhe da Vaga, quando o usuário muda o status e digita uma observação, o texto não aparece depois na lista. A renderização já contempla `h.observacao`, mas o valor não está sendo persistido corretamente no banco.

## Causa

Em `src/data/store.tsx` (`changeVagaStatus`), a observação é gravada com:

```ts
supabase.from('vaga_status_historico')
  .update({ observacao })
  .eq('vaga_id', dbId)
  .eq('status_novo', newStatus)
  .order(...).limit(1)
```

O PostgREST ignora `order/limit` em `update`, então: (a) se já houver registros antigos com o mesmo `status_novo`, todos seriam afetados; (b) em alguns casos a linha-alvo (recém-criada pelo trigger) não é localizada de forma confiável. Resultado: a observação se perde.

## Correção

Trocar a abordagem por uma busca explícita da última linha do histórico daquela vaga e atualizar pelo `id`:

1. Após o `update` da `vagas`, fazer `select id` em `vaga_status_historico` filtrando por `vaga_id` e `status_novo`, ordenando por `criado_em desc` e pegando 1.
2. Atualizar `observacao` apenas naquele `id`.

Arquivo: `src/data/store.tsx`, função `changeVagaStatus`.

A tela `JobDetail.tsx` (aba Histórico) já exibe `h.observacao` em itálico abaixo do usuário/data — nenhuma mudança visual necessária.

## Resultado esperado

- Ao trocar o status da vaga e preencher a Observação, o texto passa a aparecer na linha correspondente do Histórico, logo abaixo do nome do usuário e da data.
- Sem alterações de schema, RLS ou de outras telas.