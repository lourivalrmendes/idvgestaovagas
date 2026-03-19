

## Plano: Validação de duplicidade de candidato (telefone + email)

Impedir inserção de candidatos duplicados usando a combinação de **telefone celular + email** como chave única.

### Abordagem

Duas camadas de proteção:

1. **Banco de dados** — Criar um índice único na tabela `candidatos` sobre `(telefone_celular, email)` para garantir integridade mesmo fora da aplicação.

2. **Aplicação (store.tsx)** — Antes do `insert`, fazer um `select` verificando se já existe candidato com mesmo telefone + email. Se existir, exibir toast de erro com mensagem amigável e **não** inserir.

### Arquivos a alterar

1. **Migration SQL** — Criar índice único: `CREATE UNIQUE INDEX idx_candidatos_tel_email ON candidatos (telefone_celular, email)`
2. **`src/data/store.tsx`** — Na função `addCandidato`, adicionar query de verificação antes do insert

### Detalhes técnicos

```typescript
// store.tsx — addCandidato
const { data: existing } = await supabase
  .from('candidatos')
  .select('id')
  .eq('telefone_celular', data.telefone_celular)
  .eq('email', data.email)
  .maybeSingle();

if (existing) {
  toast.error('Candidato já cadastrado com este telefone e e-mail.');
  return null;
}
```

A constraint no banco serve como fallback de segurança caso a validação no front seja bypassada.

