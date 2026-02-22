import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '@/data/store';
import { VagaStatusBadge } from '@/components/StatusBadge';
import { GlobalFilters, Filters, defaultFilters } from '@/components/GlobalFilters';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { PIPELINE_ORDER, STATUS_LABELS, Vaga, VagaStatus } from '@/types';
import { toast } from 'sonner';

export default function JobsKanban() {
  const { vagas, changeVagaStatus, getEnviosByVaga, getUserById } = useAppStore();
  const navigate = useNavigate();
  const [filters, setFilters] = useState<Filters>(defaultFilters);
  const [moveDialog, setMoveDialog] = useState<{ vaga: Vaga; newStatus: VagaStatus } | null>(null);
  const [moveReason, setMoveReason] = useState('');
  const [moveDate, setMoveDate] = useState('');

  const filtered = useMemo(() => {
    return vagas.filter(v => {
      if (filters.recrutador !== 'todos' && v.recrutador_user_id !== filters.recrutador) return false;
      if (filters.cliente !== 'todos' && v.nome_cliente !== filters.cliente) return false;
      if (filters.unidade !== 'todos' && v.unidade_negocio !== filters.unidade) return false;
      if (filters.categoria !== 'todos' && v.categoria !== filters.categoria) return false;
      return true;
    });
  }, [vagas, filters]);

  const columns = PIPELINE_ORDER.map(status => ({
    status,
    label: STATUS_LABELS[status],
    vagas: filtered.filter(v => v.status === status),
  }));

  const handleMoveRequest = (vaga: Vaga, newStatus: VagaStatus) => {
    if (newStatus === 'VAGA_APROVADA' || newStatus === 'VAGA_REPROVADA') {
      setMoveDialog({ vaga, newStatus });
      setMoveReason('');
      setMoveDate('');
    } else {
      changeVagaStatus(vaga.id, newStatus);
      toast.success(`Vaga ${vaga.id} movida para ${STATUS_LABELS[newStatus]}`);
    }
  };

  const confirmMove = () => {
    if (!moveDialog) return;
    const { vaga, newStatus } = moveDialog;
    if (newStatus === 'VAGA_REPROVADA' && !moveReason.trim()) {
      toast.error('Informe o motivo da reprovação');
      return;
    }
    if (newStatus === 'VAGA_APROVADA' && !moveDate) {
      toast.error('Informe a data prevista de início');
      return;
    }
    changeVagaStatus(vaga.id, newStatus, moveReason || undefined);
    toast.success(`Vaga ${vaga.id} movida para ${STATUS_LABELS[newStatus]}`);
    setMoveDialog(null);
  };

  return (
    <div className="page-container animate-fade-in">
      <GlobalFilters filters={filters} onChange={setFilters} />

      <div className="overflow-x-auto pb-4">
        <div className="flex gap-4 min-w-max">
          {columns.map(col => (
            <div key={col.status} className="kanban-column">
              <div className="flex items-center gap-2 mb-3 px-1">
                <VagaStatusBadge status={col.status} />
                <span className="text-xs text-muted-foreground font-medium">{col.vagas.length}</span>
              </div>

              <div className="space-y-3">
                {col.vagas.map(vaga => {
                  const envios = getEnviosByVaga(vaga.id);
                  const recrutador = vaga.recrutador_user_id ? getUserById(vaga.recrutador_user_id) : null;
                  return (
                    <div key={vaga.id} className="kanban-card">
                      <div className="flex justify-between items-start mb-2">
                        <button onClick={() => navigate(`/vagas/${vaga.id}`)} className="text-sm font-semibold text-foreground hover:text-primary text-left">
                          {vaga.nome_cliente}
                        </button>
                        <span className="text-[10px] font-mono text-muted-foreground">{vaga.id}</span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{vaga.funcao}</p>
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        <Badge variant="secondary" className="text-[10px]">{vaga.unidade_negocio}</Badge>
                        <Badge variant="outline" className="text-[10px]">{vaga.categoria}</Badge>
                        {envios.length > 0 && <Badge className="text-[10px] bg-primary/10 text-primary border-0">{envios.length} CV(s)</Badge>}
                      </div>
                      {recrutador && <p className="text-[11px] text-muted-foreground mb-2">🧑 {recrutador.nome}</p>}
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm" className="text-xs h-7" onClick={() => navigate(`/vagas/${vaga.id}`)}>Abrir</Button>
                        <Select onValueChange={(val) => handleMoveRequest(vaga, val as VagaStatus)}>
                          <SelectTrigger className="h-7 text-xs w-auto min-w-[100px]">
                            <SelectValue placeholder="Mover para…" />
                          </SelectTrigger>
                          <SelectContent>
                            {PIPELINE_ORDER.filter(s => s !== vaga.status).map(s => (
                              <SelectItem key={s} value={s} className="text-xs">{STATUS_LABELS[s]}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  );
                })}
                {col.vagas.length === 0 && (
                  <div className="text-xs text-muted-foreground text-center py-8 border border-dashed rounded-lg">
                    Nenhuma vaga
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <Dialog open={!!moveDialog} onOpenChange={() => setMoveDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {moveDialog?.newStatus === 'VAGA_APROVADA' ? 'Aprovar Vaga' : 'Reprovar Vaga'} — {moveDialog?.vaga.id}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            {moveDialog?.newStatus === 'VAGA_APROVADA' && (
              <div>
                <label className="text-sm font-medium">Data prevista de início *</label>
                <Input type="date" value={moveDate} onChange={e => setMoveDate(e.target.value)} className="mt-1" />
              </div>
            )}
            {moveDialog?.newStatus === 'VAGA_REPROVADA' && (
              <div>
                <label className="text-sm font-medium">Motivo da reprovação *</label>
                <Input value={moveReason} onChange={e => setMoveReason(e.target.value)} placeholder="Descreva o motivo..." className="mt-1" />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setMoveDialog(null)}>Cancelar</Button>
            <Button onClick={confirmMove}>Confirmar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
