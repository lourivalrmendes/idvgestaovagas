

# Plano: Substituir campo texto por dropdown de Motivos de Abertura

## Resumo
O campo "Motivo Abertura" no formulario de Nova Vaga ainda esta como `<Input>` texto livre. Sera substituido por um `<Select>` que le os motivos ativos da tabela `motivos_abertura`.

## Alteracoes no arquivo `src/pages/CreateJob.tsx`

### 1. Adicionar estado e fetch para motivos
- Adicionar `const [motivos, setMotivos] = useState<{ id: string; nome: string }[]>([]);`
- No `useEffect` existente, adicionar fetch: `supabase.from('motivos_abertura').select('id, nome').eq('ativo', true).order('nome')`

### 2. Substituir Input por Select no campo Motivo Abertura (linha 280-281)
- Trocar o `<Input>` por um `<Select>` com `<SelectContent className="bg-popover z-50">` para garantir visibilidade do dropdown
- Mapear os motivos ativos como `<SelectItem>`

### Arquivo impactado
- `src/pages/CreateJob.tsx`

