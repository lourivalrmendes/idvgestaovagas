import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAppStore } from '@/data/store';

export interface Filters {
  periodo: string;
  recrutador: string;
  cliente: string;
  unidade: string;
  categoria: string;
}

export const defaultFilters: Filters = { periodo: 'total', recrutador: 'todos', cliente: 'todos', unidade: 'todos', categoria: 'todos' };

interface Props {
  filters: Filters;
  onChange: (f: Filters) => void;
}

export function GlobalFilters({ filters, onChange }: Props) {
  const { users, clientes, unidadesNegocio, categorias } = useAppStore();
  const recrutadores = users.filter(u => u.role === 'RECRUTADOR');

  const set = (key: keyof Filters, val: string) => onChange({ ...filters, [key]: val });

  return (
    <div className="flex flex-wrap gap-3 items-center">
      <Select value={filters.periodo} onValueChange={v => set('periodo', v)}>
        <SelectTrigger className="w-[140px] bg-card"><SelectValue placeholder="Período" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="7">Últimos 7 dias</SelectItem>
          <SelectItem value="30">Últimos 30 dias</SelectItem>
          <SelectItem value="total">Total</SelectItem>
        </SelectContent>
      </Select>

      <Select value={filters.recrutador} onValueChange={v => set('recrutador', v)}>
        <SelectTrigger className="w-[180px] bg-card"><SelectValue placeholder="Recrutador" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="todos">Todos Recrutadores</SelectItem>
          {recrutadores.map(r => <SelectItem key={r.id} value={r.id}>{r.nome}</SelectItem>)}
        </SelectContent>
      </Select>

      <Select value={filters.cliente} onValueChange={v => set('cliente', v)}>
        <SelectTrigger className="w-[180px] bg-card"><SelectValue placeholder="Cliente" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="todos">Todos Clientes</SelectItem>
          {clientes.map(c => <SelectItem key={c.id} value={c.nome}>{c.nome}</SelectItem>)}
        </SelectContent>
      </Select>

      <Select value={filters.unidade} onValueChange={v => set('unidade', v)}>
        <SelectTrigger className="w-[160px] bg-card"><SelectValue placeholder="Unidade" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="todos">Todas Unidades</SelectItem>
          {unidadesNegocio.map(u => <SelectItem key={u.id} value={u.nome}>{u.nome}</SelectItem>)}
        </SelectContent>
      </Select>

      <Select value={filters.categoria} onValueChange={v => set('categoria', v)}>
        <SelectTrigger className="w-[160px] bg-card"><SelectValue placeholder="Categoria" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="todos">Todas Categorias</SelectItem>
          {categorias.map(c => <SelectItem key={c.id} value={c.nome}>{c.nome}</SelectItem>)}
        </SelectContent>
      </Select>
    </div>
  );
}
