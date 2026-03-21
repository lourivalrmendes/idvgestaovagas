import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '@/data/store';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Search, Eye, Pencil, Trash2, Loader2, Download } from 'lucide-react';
import { toast } from 'sonner';
import { DbCandidato } from '@/data/store';
import { FileUpload } from '@/components/FileUpload';

interface FuncaoOption {
  id: string;
  codigo: string;
  nome: string;
}

export default function Candidates() {
  const store = useAppStore();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [selectedCargo, setSelectedCargo] = useState('all');
  const [funcoes, setFuncoes] = useState<FuncaoOption[]>([]);
  const [createDialog, setCreateDialog] = useState(false);
  const [editDialog, setEditDialog] = useState<DbCandidato | null>(null);
  const [form, setForm] = useState({ nome: '', cidade: '', estado: '', telefone_celular: '', telefone_outro: '', email: '', linkedin: '' });
  const [cvFile, setCvFile] = useState<File | null>(null);

  useEffect(() => {
    supabase
      .from('funcoes')
      .select('id, codigo, nome')
      .eq('ativo', true)
      .order('codigo')
      .then(({ data, error }) => {
        if (error) {
          toast.error('Erro ao carregar cargos');
          return;
        }

        setFuncoes(data || []);
      });
  }, []);

  const candidatosPorCargo = useMemo(() => {
    if (selectedCargo === 'all') return null;

    const vagaIds = new Set(
      store.vagas
        .filter((vaga) => vaga.funcao === selectedCargo)
        .map((vaga) => vaga.dbId ?? vaga.id)
    );

    return new Set(
      store.envios
        .filter((envio) => vagaIds.has(envio.vaga_id))
        .map((envio) => envio.candidato_id)
    );
  }, [selectedCargo, store.envios, store.vagas]);

  const filtered = useMemo(() => {
    const s = search.trim().toLowerCase();

    return store.candidatos.filter((candidato) => {
      const matchesSearch = !s || [candidato.nome, candidato.email, candidato.cidade]
        .some((value) => value.toLowerCase().includes(s));

      const matchesCargo = !candidatosPorCargo || candidatosPorCargo.has(candidato.id);

      return matchesSearch && matchesCargo;
    });
  }, [candidatosPorCargo, search, store.candidatos]);

  const resetForm = () => {
    setForm({ nome: '', cidade: '', estado: '', telefone_celular: '', telefone_outro: '', email: '', linkedin: '' });
    setCvFile(null);
  };

  const handleCreate = async () => {
    if (!form.nome.trim()) { toast.error('Nome é obrigatório'); return; }
    const candidatoId = await store.addCandidato({
      nome: form.nome, cidade: form.cidade, estado: form.estado,
      telefone_celular: form.telefone_celular, telefone_outro: form.telefone_outro,
      email: form.email, linkedin: form.linkedin,
      cv_url: null, cv_filename: null,
      created_by_user_id: store.currentUser!.id,
    });
    
    if (!candidatoId) return;

    if (cvFile) {
      await store.uploadCandidatoCV(candidatoId, cvFile);
    }
    
    toast.success('Candidato criado com sucesso');
    setCreateDialog(false);
    resetForm();
  };

  const handleEdit = async () => {
    if (!editDialog) return;
    const success = await store.updateCandidato(editDialog.id, {
      nome: form.nome, cidade: form.cidade, estado: form.estado,
      telefone_celular: form.telefone_celular, telefone_outro: form.telefone_outro,
      email: form.email, linkedin: form.linkedin,
    });
    if (!success) return;
    
    if (cvFile) {
      await store.uploadCandidatoCV(editDialog.id, cvFile);
    }
    
    toast.success('Candidato atualizado');
    setEditDialog(null);
    resetForm();
  };

  const openEdit = (c: DbCandidato) => {
    setForm({
      nome: c.nome, cidade: c.cidade, estado: c.estado,
      telefone_celular: c.telefone_celular, telefone_outro: c.telefone_outro,
      email: c.email, linkedin: c.linkedin,
    });
    setCvFile(null);
    setEditDialog(c);
  };

  const handleRemoveCV = async () => {
    if (!editDialog) return;

    await store.removeCandidatoCV(editDialog.id);
    setCvFile(null);
    setEditDialog((current) => current ? { ...current, cv_filename: null, cv_url: null } : null);
  };

  const formFields = (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-2">
      <div><Label>Nome *</Label><Input value={form.nome} onChange={e => setForm(p => ({ ...p, nome: e.target.value }))} /></div>
      <div><Label>E-mail</Label><Input type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} /></div>
      <div><Label>Cidade</Label><Input value={form.cidade} onChange={e => setForm(p => ({ ...p, cidade: e.target.value }))} /></div>
      <div><Label>Estado</Label><Input value={form.estado} onChange={e => setForm(p => ({ ...p, estado: e.target.value }))} maxLength={2} /></div>
      <div><Label>Telefone Celular</Label><Input value={form.telefone_celular} onChange={e => setForm(p => ({ ...p, telefone_celular: e.target.value }))} /></div>
      <div><Label>Telefone Outro</Label><Input value={form.telefone_outro} onChange={e => setForm(p => ({ ...p, telefone_outro: e.target.value }))} /></div>
      <div><Label>LinkedIn</Label><Input value={form.linkedin} onChange={e => setForm(p => ({ ...p, linkedin: e.target.value }))} /></div>
      <div className="md:col-span-2">
        <Label>CV do Candidato</Label>
        <FileUpload 
          onFileSelect={(file) => setCvFile(file)}
          currentFile={editDialog?.cv_filename || null}
          onRemove={editDialog ? handleRemoveCV : undefined}
        />
      </div>
    </div>
  );

  if (store.loadingCandidatos) {
    return <div className="page-container flex items-center justify-center min-h-[400px]"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  return (
    <div className="page-container animate-fade-in">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-1 flex-wrap items-center gap-3">
          <div className="relative min-w-[280px] flex-1 max-w-[320px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Buscar candidato..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 bg-card" />
          </div>
          <Select value={selectedCargo} onValueChange={setSelectedCargo}>
            <SelectTrigger className="w-full bg-card sm:w-[280px]">
              <SelectValue placeholder="Filtrar por cargo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os cargos</SelectItem>
              {funcoes.map((funcao) => (
                <SelectItem key={funcao.id} value={funcao.nome}>
                  {funcao.codigo} - {funcao.nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button onClick={() => { resetForm(); setCreateDialog(true); }}><Plus className="h-4 w-4 mr-2" />Novo Candidato</Button>
      </div>

      <div className="border rounded-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>Nome</TableHead>
              <TableHead>Cidade/UF</TableHead>
              <TableHead>Celular</TableHead>
              <TableHead>E-mail</TableHead>
              <TableHead>LinkedIn</TableHead>
              <TableHead>CV</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map(c => (
              <TableRow key={c.id} className="hover:bg-muted/30 cursor-pointer" onClick={() => navigate(`/candidatos/${c.id}`)}>
                <TableCell className="font-medium">{c.nome}</TableCell>
                <TableCell>{c.cidade}/{c.estado}</TableCell>
                <TableCell className="text-sm">{c.telefone_celular}</TableCell>
                <TableCell className="text-sm">{c.email}</TableCell>
                <TableCell className="text-sm text-primary truncate max-w-[150px]">{c.linkedin || '—'}</TableCell>
                <TableCell>
                  {c.cv_filename ? (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={(e) => {
                        e.stopPropagation();
                        if (c.cv_url) window.open(c.cv_url, '_blank');
                      }}
                    >
                      <Download className="h-4 w-4 mr-1" />
                      <span className="truncate max-w-[100px]">{c.cv_filename}</span>
                    </Button>
                  ) : (
                    <span className="text-muted-foreground text-sm">—</span>
                  )}
                </TableCell>
                <TableCell className="text-right" onClick={e => e.stopPropagation()}>
                  <div className="flex items-center justify-end gap-1">
                    <Button variant="ghost" size="icon" onClick={() => navigate(`/candidatos/${c.id}`)}><Eye className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => openEdit(c)}><Pencil className="h-4 w-4" /></Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild><Button variant="ghost" size="icon"><Trash2 className="h-4 w-4 text-destructive" /></Button></AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader><AlertDialogTitle>Deletar {c.nome}?</AlertDialogTitle><AlertDialogDescription>Esta ação não pode ser desfeita.</AlertDialogDescription></AlertDialogHeader>
                        <AlertDialogFooter><AlertDialogCancel>Cancelar</AlertDialogCancel><AlertDialogAction onClick={async () => { await store.deleteCandidato(c.id); toast.success('Candidato deletado'); }}>Deletar</AlertDialogAction></AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          {store.candidatos.length === 0 ? (
            <div><p className="mb-4">Nenhum candidato cadastrado.</p><Button onClick={() => { resetForm(); setCreateDialog(true); }}><Plus className="h-4 w-4 mr-2" />Criar primeiro candidato</Button></div>
          ) : 'Nenhum candidato encontrado.'}
        </div>
      )}

      <Dialog open={createDialog} onOpenChange={setCreateDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader><DialogTitle>Novo Candidato</DialogTitle></DialogHeader>
          {formFields}
          <DialogFooter><Button variant="outline" onClick={() => setCreateDialog(false)}>Cancelar</Button><Button onClick={handleCreate}>Criar</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!editDialog} onOpenChange={() => setEditDialog(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader><DialogTitle>Editar Candidato</DialogTitle></DialogHeader>
          {formFields}
          <DialogFooter><Button variant="outline" onClick={() => setEditDialog(null)}>Cancelar</Button><Button onClick={handleEdit}>Salvar</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
