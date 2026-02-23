import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAppStore, DbHistorico } from '@/data/store';
import { VagaStatusBadge, CandidatoStatusBadge } from '@/components/StatusBadge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { STATUS_LABELS, PIPELINE_ORDER, VagaStatus, CandidatoStatusVaga } from '@/types';
import { toast } from 'sonner';
import { ArrowLeft, Clock, User, Building2, Loader2 } from 'lucide-react';

export default function JobDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const store = useAppStore();
  const vaga = store.vagas.find(v => v.dbId === id);
  const [statusDialog, setStatusDialog] = useState(false);
  const [newStatus, setNewStatus] = useState<VagaStatus | ''>('');
  const [statusObs, setStatusObs] = useState('');
  const [statusDate, setStatusDate] = useState('');
  const [assocDialog, setAssocDialog] = useState(false);
  const [assocCandidato, setAssocCandidato] = useState('');
  const [assocObs, setAssocObs] = useState('');
  const [reprovarDialog, setReprovarDialog] = useState(false);
  const [reprovarMotivo, setReprovarMotivo] = useState('');
  const [validarDialog, setValidarDialog] = useState(false);
  const [validarRecrutador, setValidarRecrutador] = useState('');
  const [historico, setHistorico] = useState<DbHistorico[]>([]);
  const [loadingHistorico, setLoadingHistorico] = useState(false);

  useEffect(() => {
    if (vaga) {
      setLoadingHistorico(true);
      store.getHistoricoByVaga(vaga.dbId).then(h => { setHistorico(h); setLoadingHistorico(false); });
    }
  }, [vaga?.dbId, store.vagas]);

  if (!vaga) return <div className="page-container"><p>Vaga não encontrada.</p><Button variant="outline" onClick={() => navigate('/vagas')}>Voltar</Button></div>;

  const proprietario = store.getUserById(vaga.proprietario_user_id);
  const recrutador = vaga.recrutador_user_id ? store.getUserById(vaga.recrutador_user_id) : null;
  const envios = store.getEnviosByVaga(vaga.dbId);
  const diasSLA = vaga.data_validacao_rh ? Math.floor((Date.now() - new Date(vaga.data_validacao_rh).getTime()) / 86400000) : null;
  const recrutadores = store.users.filter(u => u.role === 'RECRUTADOR');
  const canValidate = store.currentUser?.role === 'COORDENADOR_RH' || store.currentUser?.role === 'ADMIN';

  const handleStatusChange = async () => {
    if (!newStatus) return;
    if (newStatus === 'VAGA_REPROVADA' && !statusObs.trim()) { toast.error('Informe o motivo'); return; }
    if (newStatus === 'VAGA_APROVADA' && !statusDate) { toast.error('Informe data de início'); return; }
    if (newStatus === 'VAGA_APROVADA' && statusDate) await store.updateVaga(vaga.dbId, { data_prevista_inicio: statusDate });
    await store.changeVagaStatus(vaga.dbId, newStatus as VagaStatus, statusObs || undefined);
    toast.success(`Status atualizado para ${STATUS_LABELS[newStatus as VagaStatus]}`);
    setStatusDialog(false);
    setNewStatus('');
    setStatusObs('');
  };

  const handleValidar = async () => {
    if (!validarRecrutador) { toast.error('Selecione um recrutador'); return; }
    await store.updateVaga(vaga.dbId, { recrutador_user_id: validarRecrutador, data_validacao_rh: new Date().toISOString().split('T')[0] });
    await store.changeVagaStatus(vaga.dbId, 'SEM_CVS_DENTRO_SLA', 'Vaga validada pelo RH');
    toast.success('Vaga validada e recrutador atribuído');
    setValidarDialog(false);
  };

  const handleReprovar = async () => {
    if (!reprovarMotivo.trim()) { toast.error('Informe o motivo'); return; }
    await store.updateVaga(vaga.dbId, { motivo_reprovacao_rh: reprovarMotivo });
    toast.success('Vaga recusada pelo RH');
    toast.info('📧 E-mail de notificação enviado ao proprietário (simulado)', { duration: 5000 });
    setReprovarDialog(false);
  };

  const handleAssociar = async () => {
    if (!assocCandidato) { toast.error('Selecione um candidato'); return; }
    await store.addEnvio({
      vaga_id: vaga.dbId, candidato_id: assocCandidato,
      data_envio: new Date().toISOString().split('T')[0], status_candidato_na_vaga: 'EM_ENTREVISTA',
      observacoes: assocObs, created_by_user_id: store.currentUser!.id,
    });
    if (vaga.status === 'SEM_CVS_DENTRO_SLA' || vaga.status === 'SEM_CVS_FORA_SLA') {
      await store.changeVagaStatus(vaga.dbId, 'COM_CVS_ENVIADOS', 'Candidato associado à vaga');
    }
    toast.success('Candidato associado com sucesso');
    setAssocDialog(false);
    setAssocCandidato('');
    setAssocObs('');
  };

  const field = (label: string, value: string | number | null | undefined) => (
    <div>
      <p className="text-xs text-muted-foreground mb-0.5">{label}</p>
      <p className="text-sm font-medium">{value || '—'}</p>
    </div>
  );

  return (
    <div className="page-container animate-fade-in">
      <Button variant="ghost" onClick={() => navigate('/vagas')} className="mb-2"><ArrowLeft className="h-4 w-4 mr-2" />Voltar ao Painel</Button>

      <div className="flex flex-wrap items-center gap-4 mb-6">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-xl font-bold">{vaga.funcao}</h1>
            <VagaStatusBadge status={vaga.status} />
          </div>
          <p className="text-muted-foreground">{vaga.nome_cliente} · {vaga.unidade_negocio} · {vaga.categoria}</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          {canValidate && vaga.status === 'EM_VALIDACAO_RH' && !vaga.reprovada_rh_motivo && (
            <>
              <Button onClick={() => setValidarDialog(true)}>Validar e Atribuir Recrutador</Button>
              <Button variant="destructive" onClick={() => setReprovarDialog(true)}>Reprovar Vaga</Button>
            </>
          )}
          <Button variant="outline" onClick={() => setStatusDialog(true)}>Atualizar Status</Button>
        </div>
      </div>

      <Tabs defaultValue="resumo">
        <TabsList>
          <TabsTrigger value="resumo">Resumo</TabsTrigger>
          <TabsTrigger value="dados">Dados da Vaga</TabsTrigger>
          <TabsTrigger value="candidatos">Candidatos ({envios.length})</TabsTrigger>
          <TabsTrigger value="historico">Histórico</TabsTrigger>
        </TabsList>

        <TabsContent value="resumo" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><Building2 className="h-4 w-4" />Informações</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                {field('Cliente', vaga.nome_cliente)}
                {field('Função', vaga.funcao)}
                {field('Qtde Vagas', vaga.quantidade_de_vagas)}
                {field('Senioridade', vaga.nivel_senioridade)}
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><User className="h-4 w-4" />Responsáveis</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                {field('Proprietário', proprietario?.nome)}
                {field('Recrutador', recrutador?.nome || 'Não atribuído')}
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><Clock className="h-4 w-4" />SLA e Datas</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                {field('Criação', vaga.data_criacao)}
                {field('Validação RH', vaga.data_validacao_rh || 'Pendente')}
                <div>
                  <p className="text-xs text-muted-foreground mb-0.5">Dias desde validação</p>
                  {diasSLA !== null ? (
                    <Badge variant={diasSLA > 15 ? 'destructive' : diasSLA > 5 ? 'default' : 'secondary'}>{diasSLA} dias</Badge>
                  ) : <p className="text-sm">—</p>}
                </div>
                {vaga.reprovada_rh_motivo && (
                  <div className="p-2 bg-destructive/10 rounded text-sm text-destructive">
                    <strong>Recusada RH:</strong> {vaga.reprovada_rh_motivo}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="dados" className="mt-4">
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold text-sm border-b pb-1">Solicitante</h4>
                  {field('Data Solicitação', vaga.data_solicitacao)}
                  {field('Solicitante', vaga.nome_solicitante)}
                  {field('Área', vaga.area_solicitante)}
                </div>
                <div className="space-y-4">
                  <h4 className="font-semibold text-sm border-b pb-1">Contratação</h4>
                  {field('Faixa Salarial', vaga.faixa_salarial)}
                  {field('Tipo', [vaga.tipo_contratacao.clt && 'CLT', vaga.tipo_contratacao.pj && 'PJ', vaga.tipo_contratacao.alocacao && 'Alocação'].filter(Boolean).join(', '))}
                  {field('Modalidade', [vaga.modalidade_contratacao.presencial && 'Presencial', vaga.modalidade_contratacao.hibrido && 'Híbrido', vaga.modalidade_contratacao.remoto && 'Remoto'].filter(Boolean).join(', '))}
                  {field('Horário', vaga.horario_trabalho)}
                  {field('Endereço', vaga.endereco_local_trabalho)}
                  {field('Data Início Prevista', vaga.data_prevista_inicio)}
                </div>
                <div className="space-y-4">
                  <h4 className="font-semibold text-sm border-b pb-1">Requisitos</h4>
                  {field('Responsabilidades', vaga.principais_responsabilidades)}
                  {field('Requisitos Técnicos', vaga.requisitos_tecnicos)}
                  {field('Linguagens/Frameworks', vaga.linguagens_e_frameworks_necessarios)}
                  {field('Formação', vaga.formacao)}
                  {field('Soft Skills', vaga.soft_skills)}
                  {field('Inglês', vaga.idioma_ingles)}
                  {field('Espanhol', vaga.idioma_espanhol)}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="candidatos" className="mt-4 space-y-4">
          <Button onClick={() => setAssocDialog(true)}>Associar Candidato</Button>
          {envios.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Candidato</TableHead>
                  <TableHead>Data Envio</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Observações</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {envios.map(e => {
                  const cand = store.candidatos.find(c => c.id === e.candidato_id);
                  return (
                    <TableRow key={e.id}>
                      <TableCell className="font-medium">{cand?.nome || e.candidato_id}</TableCell>
                      <TableCell>{e.data_envio}</TableCell>
                      <TableCell><CandidatoStatusBadge status={e.status_candidato_na_vaga as CandidatoStatusVaga} /></TableCell>
                      <TableCell className="text-sm text-muted-foreground max-w-[200px] truncate">{e.observacoes || '—'}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          {cand && <Button variant="ghost" size="sm" onClick={() => navigate(`/candidatos/${cand.id}`)}>Ver</Button>}
                          <Select onValueChange={val => { store.updateEnvioStatus(e.id, val); toast.success('Status atualizado'); }}>
                            <SelectTrigger className="h-8 w-auto text-xs"><SelectValue placeholder="Status" /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="EM_ENTREVISTA">Em Entrevista</SelectItem>
                              <SelectItem value="APROVADO">Aprovado</SelectItem>
                              <SelectItem value="REPROVADO">Reprovado</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-12 text-muted-foreground border border-dashed rounded-lg">Nenhum candidato enviado para esta vaga.</div>
          )}
        </TabsContent>

        <TabsContent value="historico" className="mt-4">
          <Card>
            <CardContent className="pt-6">
              {loadingHistorico ? (
                <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
              ) : (
                <div className="space-y-4">
                  {historico.map((h, i) => {
                    const user = h.alterado_por ? store.getUserById(h.alterado_por) : null;
                    return (
                      <div key={h.id} className="flex gap-4 items-start">
                        <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-medium">
                            {h.status_anterior ? `${STATUS_LABELS[h.status_anterior as VagaStatus] || h.status_anterior} → ` : ''}{STATUS_LABELS[h.status_novo as VagaStatus] || h.status_novo}
                          </p>
                          <p className="text-xs text-muted-foreground">{user?.nome || 'Sistema'} · {new Date(h.criado_em).toLocaleDateString('pt-BR')}</p>
                          {h.observacao && <p className="text-xs text-muted-foreground mt-1 italic">{h.observacao}</p>}
                        </div>
                      </div>
                    );
                  })}
                  {historico.length === 0 && <p className="text-muted-foreground text-center py-4">Sem histórico registrado.</p>}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Status Dialog */}
      <Dialog open={statusDialog} onOpenChange={setStatusDialog}>
        <DialogContent>
          <DialogHeader><DialogTitle>Atualizar Status — {vaga.id}</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <Select value={newStatus} onValueChange={v => setNewStatus(v as VagaStatus)}>
              <SelectTrigger><SelectValue placeholder="Selecione o novo status" /></SelectTrigger>
              <SelectContent>
                {PIPELINE_ORDER.filter(s => s !== vaga.status).map(s => <SelectItem key={s} value={s}>{STATUS_LABELS[s]}</SelectItem>)}
              </SelectContent>
            </Select>
            {newStatus === 'VAGA_APROVADA' && <Input type="date" value={statusDate} onChange={e => setStatusDate(e.target.value)} placeholder="Data início" />}
            <Textarea value={statusObs} onChange={e => setStatusObs(e.target.value)} placeholder="Observação (opcional)" rows={2} />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setStatusDialog(false)}>Cancelar</Button>
            <Button onClick={handleStatusChange}>Confirmar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Validar Dialog */}
      <Dialog open={validarDialog} onOpenChange={setValidarDialog}>
        <DialogContent>
          <DialogHeader><DialogTitle>Validar e Atribuir Recrutador</DialogTitle></DialogHeader>
          <Select value={validarRecrutador} onValueChange={setValidarRecrutador}>
            <SelectTrigger><SelectValue placeholder="Selecione o recrutador" /></SelectTrigger>
            <SelectContent>
              {recrutadores.map(r => <SelectItem key={r.id} value={r.id}>{r.nome}</SelectItem>)}
            </SelectContent>
          </Select>
          <DialogFooter>
            <Button variant="outline" onClick={() => setValidarDialog(false)}>Cancelar</Button>
            <Button onClick={handleValidar}>Validar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reprovar Dialog */}
      <Dialog open={reprovarDialog} onOpenChange={setReprovarDialog}>
        <DialogContent>
          <DialogHeader><DialogTitle>Reprovar Vaga</DialogTitle></DialogHeader>
          <Textarea value={reprovarMotivo} onChange={e => setReprovarMotivo(e.target.value)} placeholder="Motivo da reprovação *" rows={3} />
          <DialogFooter>
            <Button variant="outline" onClick={() => setReprovarDialog(false)}>Cancelar</Button>
            <Button variant="destructive" onClick={handleReprovar}>Reprovar e Notificar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Associar Candidato Dialog */}
      <Dialog open={assocDialog} onOpenChange={setAssocDialog}>
        <DialogContent>
          <DialogHeader><DialogTitle>Associar Candidato à Vaga</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <Select value={assocCandidato} onValueChange={setAssocCandidato}>
              <SelectTrigger><SelectValue placeholder="Selecione um candidato" /></SelectTrigger>
              <SelectContent>
                {store.candidatos.map(c => <SelectItem key={c.id} value={c.id}>{c.nome} — {c.cidade}/{c.estado}</SelectItem>)}
              </SelectContent>
            </Select>
            <Textarea value={assocObs} onChange={e => setAssocObs(e.target.value)} placeholder="Observações" rows={2} />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAssocDialog(false)}>Cancelar</Button>
            <Button onClick={handleAssociar}>Associar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
