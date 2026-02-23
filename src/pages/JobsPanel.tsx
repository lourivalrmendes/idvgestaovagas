import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '@/data/store';
import { VagaStatusBadge } from '@/components/StatusBadge';
import { GlobalFilters, Filters, defaultFilters } from '@/components/GlobalFilters';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Plus, Eye, Pencil, Trash2, Search, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { VagaStatus } from '@/types';

export default function JobsPanel() {
  const { vagas, deleteVaga, getUserById, getEnviosByVaga, loadingVagas } = useAppStore();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<Filters>(defaultFilters);

  const filtered = useMemo(() => {
    return vagas.filter(v => {
      if (search) {
        const s = search.toLowerCase();
        if (!v.id.toLowerCase().includes(s) && !v.nome_cliente.toLowerCase().includes(s) && !v.funcao.toLowerCase().includes(s)) return false;
      }
      if (filters.recrutador !== 'todos' && v.recrutador_user_id !== filters.recrutador) return false;
      if (filters.cliente !== 'todos' && v.nome_cliente !== filters.cliente) return false;
      if (filters.unidade !== 'todos' && v.unidade_negocio !== filters.unidade) return false;
      if (filters.categoria !== 'todos' && v.categoria !== filters.categoria) return false;
      return true;
    });
  }, [vagas, search, filters]);

  const diasDesdeValidacao = (v: any) => {
    if (!v.data_validacao_rh) return null;
    return Math.floor((Date.now() - new Date(v.data_validacao_rh).getTime()) / 86400000);
  };

  const handleDelete = async (v: any) => {
    await deleteVaga(v.dbId);
    toast.success('Vaga deletada com sucesso');
  };

  if (loadingVagas) {
    return <div className="page-container flex items-center justify-center min-h-[400px]"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  if (filtered.length === 0 && vagas.length === 0) {
    return (
      <div className="page-container animate-fade-in flex flex-col items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground mb-4">Nenhuma vaga cadastrada ainda.</p>
        <Button onClick={() => navigate('/vagas/nova')}><Plus className="h-4 w-4 mr-2" />Criar primeira vaga</Button>
      </div>
    );
  }

  return (
    <div className="page-container animate-fade-in">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Buscar por ID, cliente ou função..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 w-[300px] bg-card" />
        </div>
        <Button onClick={() => navigate('/vagas/nova')}><Plus className="h-4 w-4 mr-2" />Nova Vaga</Button>
      </div>

      <GlobalFilters filters={filters} onChange={setFilters} />

      <CardWrapper className="border rounded-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-[100px]">ID</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Função</TableHead>
              <TableHead>Unidade</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead>Recrutador</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Criação</TableHead>
              <TableHead>SLA (dias)</TableHead>
              <TableHead className="text-center">CVs</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map(v => {
              const dias = diasDesdeValidacao(v);
              const recrutador = v.recrutador_user_id ? getUserById(v.recrutador_user_id) : null;
              const envios = getEnviosByVaga(v.dbId);
              return (
                <TableRow key={v.dbId} className="hover:bg-muted/30 cursor-pointer" onClick={() => navigate(`/vagas/${v.dbId}`)}>
                  <TableCell className="font-mono text-xs text-muted-foreground">{v.id}</TableCell>
                  <TableCell className="font-medium">{v.nome_cliente}</TableCell>
                  <TableCell>{v.funcao}</TableCell>
                  <TableCell><Badge variant="secondary" className="text-xs">{v.unidade_negocio}</Badge></TableCell>
                  <TableCell><Badge variant="outline" className="text-xs">{v.categoria}</Badge></TableCell>
                  <TableCell className="text-sm">{recrutador?.nome || '—'}</TableCell>
                  <TableCell><VagaStatusBadge status={v.status} /></TableCell>
                  <TableCell className="text-sm text-muted-foreground">{v.data_criacao}</TableCell>
                  <TableCell>
                    {dias !== null ? (
                      <Badge variant={dias > 15 ? 'destructive' : dias > 5 ? 'default' : 'secondary'} className="text-xs">
                        {dias}d
                      </Badge>
                    ) : '—'}
                  </TableCell>
                  <TableCell className="text-center">{envios.length}</TableCell>
                  <TableCell className="text-right" onClick={e => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon" onClick={() => navigate(`/vagas/${v.dbId}`)}><Eye className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => navigate(`/vagas/${v.dbId}`)}><Pencil className="h-4 w-4" /></Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon"><Trash2 className="h-4 w-4 text-destructive" /></Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Deletar vaga {v.id}?</AlertDialogTitle>
                            <AlertDialogDescription>Esta ação não pode ser desfeita.</AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(v)}>Deletar</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardWrapper>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          Nenhuma vaga encontrada com os filtros aplicados.
        </div>
      )}
    </div>
  );
}

function CardWrapper({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={className}>{children}</div>;
}
