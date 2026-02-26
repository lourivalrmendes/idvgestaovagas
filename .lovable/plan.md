
# Plano: Corrigir exibicao da Area na aba Usuarios

## Problema
A coluna "Area" ja existe na tabela de usuarios, porem a maioria dos usuarios tem o campo `area` vazio no banco de dados. Alem disso, o dropdown de area no formulario de edicao de usuario usa valores fixos ("Administrativo", "RH", "Comercial") em vez de ler da tabela `areas` do banco.

## Alteracoes no arquivo `src/pages/Administration.tsx`

### 1. Substituir dropdown fixo por dinamico no formulario de usuario
- Remover o tipo fixo `UserArea` e o hardcoded no `SelectContent`
- Usar o estado `areas` (ja carregado pelo `fetchAreas`) para popular o dropdown de Area no dialogo de usuario
- Filtrar apenas areas ativas (`ativo === true`)
- Gravar o `nome` da area selecionada no campo `area` do perfil

### 2. Ajustar o tipo do campo `area` no `userForm`
- Trocar `area: 'RH' as UserArea` por `area: ''` (string livre)
- Remover o tipo `UserArea` que nao sera mais necessario

### Arquivo impactado
- `src/pages/Administration.tsx` - linhas 20, 33, 529-532
