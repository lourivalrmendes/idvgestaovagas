import { useState, useEffect } from 'react';
import { useAppStore, DimensionItem } from '@/data/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Plus, Pencil, Settings } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import type { AppRole } from '@/hooks/useAuth';

interface AreaItem { id: string; codigo: string; nome: string; ativo: boolean; }
interface FuncaoItem { id: string; codigo: string; nome: string; ativo: boolean; }

type UserArea = 'Administrativo' | 'RH' | 'Comercial';

const ROLE_LABELS: Record<AppRole, string> = {
  ADMIN: 'Administrador',
  COORDENADOR_RH: 'Coordenador RH',
  RECRUTADOR: 'Recrutador',
  COMERCIAL: 'Comercial',
};

export default function Administration() {
  const store = useAppStore();
  const [sla, setSla] = useState(store.slaAceite);
  const [userDialog, setUserDialog] = useState<any | null>(null);
  const [userForm, setUserForm] = useState({ nome: '', area: 'RH' as UserArea, role: 'RECRUTADOR' as AppRole, email: '', telefone: '', password: '' });

  // Áreas
  const [areas, setAreas] = useState<AreaItem[]>([]);
  const [areaDialog, setAreaDialog] = useState<AreaItem | 'new' | null>(null);
  const [areaForm, setAreaForm] = useState({ codigo: '', nome: '' });

  // Funções
  const [funcoes, setFuncoes] = useState<FuncaoItem[]>([]);
  const [funcaoDialog, setFuncaoDialog] = useState<FuncaoItem | 'new' | null>(null);
  const [funcaoForm, setFuncaoForm] = useState({ codigo: '', nome: '' });

  // Categorias
  const [catList, setCatList] = useState<DimensionItem[]>([]);
  const [catDialog, setCatDialog] = useState<DimensionItem | 'new' | null>(null);
  const [catForm, setCatForm] = useState({ nome: '' });

  // Unidades
  const [uniList, setUniList] = useState<DimensionItem[]>([]);
  const [uniDialog, setUniDialog] = useState<DimensionItem | 'new' | null>(null);
  const [uniForm, setUniForm] = useState({ nome: '' });

  const fetchAreas = async () => {
    const { data } = await supabase.from('areas').select('*').order('codigo');
    if (data) setAreas(data as unknown as AreaItem[]);
  };
  const fetchFuncoes = async () => {
    const { data } = await supabase.from('funcoes').select('*').order('codigo');
    if (data) setFuncoes(data as unknown as FuncaoItem[]);
  };
  const fetchCategorias = async () => {
    const { data } = await supabase.from('categorias').select('*').order('nome');
    if (data) setCatList(data as unknown as DimensionItem[]);
  };
  const fetchUnidades = async () => {
    const { data } = await supabase.from('unidades_negocio').select('*').order('nome');
    if (data) setUniList(data as unknown as DimensionItem[]);
  };

  useEffect(() => { fetchAreas(); fetchFuncoes(); fetchCategorias(); fetchUnidades(); }, []);

  // Area CRUD
  const openNewArea = () => { setAreaForm({ codigo: '', nome: '' }); setAreaDialog('new'); };
  const openEditArea = (a: AreaItem) => { setAreaForm({ codigo: a.codigo, nome: a.nome }); setAreaDialog(a); };
  const saveArea = async () => {
    if (!areaForm.codigo.trim() || !areaForm.nome.trim()) { toast.error('Código e Nome são obrigatórios'); return; }
    if (areaDialog === 'new') {
      const { error } = await supabase.from('areas').insert({ codigo: areaForm.codigo.trim(), nome: areaForm.nome.trim() } as any);
      if (error) { toast.error('Erro: ' + error.message); return; }
      toast.success('Área criada');
    } else if (areaDialog) {
      const { error } = await supabase.from('areas').update({ codigo: areaForm.codigo.trim(), nome: areaForm.nome.trim() } as any).eq('id', areaDialog.id);
      if (error) { toast.error('Erro: ' + error.message); return; }
      toast.success('Área atualizada');
    }
    await fetchAreas(); setAreaDialog(null);
  };
  const toggleArea = async (a: AreaItem) => {
    await supabase.from('areas').update({ ativo: !a.ativo } as any).eq('id', a.id);
    await fetchAreas();
  };

  // Funcao CRUD
  const openNewFuncao = () => { setFuncaoForm({ codigo: '', nome: '' }); setFuncaoDialog('new'); };
  const openEditFuncao = (f: FuncaoItem) => { setFuncaoForm({ codigo: f.codigo, nome: f.nome }); setFuncaoDialog(f); };
  const saveFuncao = async () => {
    if (!funcaoForm.codigo.trim() || !funcaoForm.nome.trim()) { toast.error('Código e Nome são obrigatórios'); return; }
    if (funcaoDialog === 'new') {
      const { error } = await supabase.from('funcoes').insert({ codigo: funcaoForm.codigo.trim(), nome: funcaoForm.nome.trim() } as any);
      if (error) { toast.error('Erro: ' + error.message); return; }
      toast.success('Função criada');
    } else if (funcaoDialog) {
      const { error } = await supabase.from('funcoes').update({ codigo: funcaoForm.codigo.trim(), nome: funcaoForm.nome.trim() } as any).eq('id', funcaoDialog.id);
      if (error) { toast.error('Erro: ' + error.message); return; }
      toast.success('Função atualizada');
    }
    await fetchFuncoes(); setFuncaoDialog(null);
  };
  const toggleFuncao = async (f: FuncaoItem) => {
    await supabase.from('funcoes').update({ ativo: !f.ativo } as any).eq('id', f.id);
    await fetchFuncoes();
  };

  // Categoria CRUD
  const openNewCat = () => { setCatForm({ nome: '' }); setCatDialog('new'); };
  const openEditCat = (c: DimensionItem) => { setCatForm({ nome: c.nome }); setCatDialog(c); };
  const saveCat = async () => {
    if (!catForm.nome.trim()) { toast.error('Nome é obrigatório'); return; }
    if (catDialog === 'new') {
      const { error } = await supabase.from('categorias').insert({ nome: catForm.nome.trim() } as any);
      if (error) { toast.error('Erro: ' + error.message); return; }
      toast.success('Categoria criada');
    } else if (catDialog) {
      const { error } = await supabase.from('categorias').update({ nome: catForm.nome.trim() } as any).eq('id', catDialog.id);
      if (error) { toast.error('Erro: ' + error.message); return; }
      toast.success('Categoria atualizada');
    }
    await fetchCategorias(); setCatDialog(null);
  };
  const toggleCat = async (c: DimensionItem) => {
    await supabase.from('categorias').update({ ativo: !c.ativo } as any).eq('id', c.id);
    await fetchCategorias();
  };

  // Unidade CRUD
  const openNewUni = () => { setUniForm({ nome: '' }); setUniDialog('new'); };
  const openEditUni = (u: DimensionItem) => { setUniForm({ nome: u.nome }); setUniDialog(u); };
  const saveUni = async () => {
    if (!uniForm.nome.trim()) { toast.error('Nome é obrigatório'); return; }
    if (uniDialog === 'new') {
      const { error } = await supabase.from('unidades_negocio').insert({ nome: uniForm.nome.trim() } as any);
      if (error) { toast.error('Erro: ' + error.message); return; }
      toast.success('Unidade criada');
    } else if (uniDialog) {
      const { error } = await supabase.from('unidades_negocio').update({ nome: uniForm.nome.trim() } as any).eq('id', uniDialog.id);
      if (error) { toast.error('Erro: ' + error.message); return; }
      toast.success('Unidade atualizada');
    }
    await fetchUnidades(); setUniDialog(null);
  };
  const toggleUni = async (u: DimensionItem) => {
    await supabase.from('unidades_negocio').update({ ativo: !u.ativo } as any).eq('id', u.id);
    await fetchUnidades();
  };


  const saveSla = async () => {
    await store.setSlaAceite(sla);
    toast.success(`SLA atualizado para ${sla} dias úteis`);
  };

  const openNewUser = () => {
    setUserForm({ nome: '', area: 'RH', role: 'RECRUTADOR', email: '', telefone: '', password: '' });
    setUserDialog('new');
  };

  const openEditUser = (u: any) => {
    setUserForm({ nome: u.nome, area: u.area as UserArea, role: (u.role || 'RECRUTADOR') as AppRole, email: u.email, telefone: u.telefone, password: '' });
    setUserDialog(u);
  };

  const saveUser = async () => {
    if (!userForm.nome.trim()) { toast.error('Nome é obrigatório'); return; }
    if (userDialog === 'new') {
      if (!userForm.email.trim() || !userForm.password.trim()) { toast.error('E-mail e senha são obrigatórios'); return; }
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: userForm.email,
        password: userForm.password,
        options: { data: { nome: userForm.nome } },
      });
      if (signUpError) { toast.error('Erro ao criar usuário: ' + signUpError.message); return; }
      if (signUpData.user) {
        await supabase.from('profiles').update({
          nome: userForm.nome, area: userForm.area, telefone: userForm.telefone,
        }).eq('id', signUpData.user.id);
        await supabase.from('user_roles').insert({
          user_id: signUpData.user.id, role: userForm.role,
        });
      }
      toast.success('Usuário criado. Um e-mail de confirmação foi enviado.');
    } else if (userDialog) {
      await supabase.from('profiles').update({
        nome: userForm.nome, area: userForm.area, telefone: userForm.telefone,
      }).eq('id', userDialog.id);
      await supabase.from('user_roles').upsert({
        user_id: userDialog.id, role: userForm.role,
      }, { onConflict: 'user_id,role' });
      toast.success('Usuário atualizado');
    }
    await store.refreshUsers();
    setUserDialog(null);
  };

  return (
    <div className="page-container animate-fade-in">
      <Tabs defaultValue="sla">
        <TabsList className="flex-wrap">
          <TabsTrigger value="sla"><Settings className="h-4 w-4 mr-1" />SLA</TabsTrigger>
          <TabsTrigger value="usuarios">Usuários</TabsTrigger>
          <TabsTrigger value="areas">Áreas</TabsTrigger>
          <TabsTrigger value="funcoes">Funções</TabsTrigger>
          <TabsTrigger value="categorias">Categorias</TabsTrigger>
          <TabsTrigger value="unidades">Unidades</TabsTrigger>
        </TabsList>

        {/* SLA */}
        <TabsContent value="sla" className="mt-4">
          <Card className="max-w-md">
            <CardHeader><CardTitle className="text-base">SLA de Aceite</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Dias úteis para aceite de CV</Label>
                <Input type="number" min={1} max={30} value={sla} onChange={e => setSla(parseInt(e.target.value) || 5)} className="mt-1 w-32" />
              </div>
              <p className="text-xs text-muted-foreground">Vagas sem CVs enviados após este período serão sinalizadas como "Fora do SLA".</p>
              <Button onClick={saveSla}>Salvar SLA</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Usuários */}
        <TabsContent value="usuarios" className="mt-4 space-y-4">
          <Button onClick={openNewUser}><Plus className="h-4 w-4 mr-2" />Novo Usuário</Button>
          <div className="border rounded-xl overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>Nome</TableHead><TableHead>Área</TableHead><TableHead>Perfil</TableHead><TableHead>E-mail</TableHead><TableHead>Telefone</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {store.users.map(u => (
                  <TableRow key={u.id}>
                    <TableCell className="font-medium">{u.nome}</TableCell>
                    <TableCell>{u.area}</TableCell>
                    <TableCell><Badge variant="secondary" className="text-xs">{u.role ? ROLE_LABELS[u.role] : 'Sem perfil'}</Badge></TableCell>
                    <TableCell className="text-sm">{u.email}</TableCell>
                    <TableCell className="text-sm">{u.telefone}</TableCell>
                    <TableCell><Badge variant={u.ativo ? 'default' : 'outline'} className="text-xs">{u.ativo ? 'Ativo' : 'Inativo'}</Badge></TableCell>
                    <TableCell className="text-right"><Button variant="ghost" size="icon" onClick={() => openEditUser(u)}><Pencil className="h-4 w-4" /></Button></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        {/* Áreas */}
        <TabsContent value="areas" className="mt-4 space-y-4">
          <Button onClick={openNewArea}><Plus className="h-4 w-4 mr-2" />Nova Área</Button>
          <div className="border rounded-xl overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>Código</TableHead><TableHead>Nome</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {areas.map(a => (
                  <TableRow key={a.id}>
                    <TableCell className="font-medium font-mono">{a.codigo}</TableCell>
                    <TableCell>{a.nome}</TableCell>
                    <TableCell>
                      <Badge variant={a.ativo ? 'default' : 'outline'} className="text-xs cursor-pointer" onClick={() => toggleArea(a)}>
                        {a.ativo ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => openEditArea(a)}><Pencil className="h-4 w-4" /></Button>
                    </TableCell>
                  </TableRow>
                ))}
                {areas.length === 0 && (
                  <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground py-8">Nenhuma área cadastrada</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        {/* Funções */}
        <TabsContent value="funcoes" className="mt-4 space-y-4">
          <Button onClick={openNewFuncao}><Plus className="h-4 w-4 mr-2" />Nova Função</Button>
          <div className="border rounded-xl overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>Código</TableHead><TableHead>Nome</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {funcoes.map(f => (
                  <TableRow key={f.id}>
                    <TableCell className="font-medium font-mono">{f.codigo}</TableCell>
                    <TableCell>{f.nome}</TableCell>
                    <TableCell>
                      <Badge variant={f.ativo ? 'default' : 'outline'} className="text-xs cursor-pointer" onClick={() => toggleFuncao(f)}>
                        {f.ativo ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => openEditFuncao(f)}><Pencil className="h-4 w-4" /></Button>
                    </TableCell>
                  </TableRow>
                ))}
                {funcoes.length === 0 && (
                  <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground py-8">Nenhuma função cadastrada</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        {/* Categorias */}
        <TabsContent value="categorias" className="mt-4 space-y-4">
          <Button onClick={openNewCat}><Plus className="h-4 w-4 mr-2" />Nova Categoria</Button>
          <div className="border rounded-xl overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>Nome</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {catList.map(c => (
                  <TableRow key={c.id}>
                    <TableCell className="font-medium">{c.nome}</TableCell>
                    <TableCell>
                      <Badge variant={c.ativo ? 'default' : 'outline'} className="text-xs cursor-pointer" onClick={() => toggleCat(c)}>
                        {c.ativo ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => openEditCat(c)}><Pencil className="h-4 w-4" /></Button>
                    </TableCell>
                  </TableRow>
                ))}
                {catList.length === 0 && (
                  <TableRow><TableCell colSpan={3} className="text-center text-muted-foreground py-8">Nenhuma categoria cadastrada</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        {/* Unidades */}
        <TabsContent value="unidades" className="mt-4 space-y-4">
          <Button onClick={openNewUni}><Plus className="h-4 w-4 mr-2" />Nova Unidade</Button>
          <div className="border rounded-xl overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>Nome</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {uniList.map(u => (
                  <TableRow key={u.id}>
                    <TableCell className="font-medium">{u.nome}</TableCell>
                    <TableCell>
                      <Badge variant={u.ativo ? 'default' : 'outline'} className="text-xs cursor-pointer" onClick={() => toggleUni(u)}>
                        {u.ativo ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => openEditUni(u)}><Pencil className="h-4 w-4" /></Button>
                    </TableCell>
                  </TableRow>
                ))}
                {uniList.length === 0 && (
                  <TableRow><TableCell colSpan={3} className="text-center text-muted-foreground py-8">Nenhuma unidade cadastrada</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>

      {/* User Dialog */}
      <Dialog open={!!userDialog} onOpenChange={() => setUserDialog(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>{userDialog === 'new' ? 'Novo Usuário' : 'Editar Usuário'}</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div><Label>Nome *</Label><Input value={userForm.nome} onChange={e => setUserForm(p => ({ ...p, nome: e.target.value }))} /></div>
            {userDialog === 'new' && (
              <>
                <div><Label>E-mail *</Label><Input type="email" value={userForm.email} onChange={e => setUserForm(p => ({ ...p, email: e.target.value }))} /></div>
                <div><Label>Senha *</Label><Input type="password" value={userForm.password} onChange={e => setUserForm(p => ({ ...p, password: e.target.value }))} /></div>
              </>
            )}
            <div>
              <Label>Área</Label>
              <Select value={userForm.area} onValueChange={v => setUserForm(p => ({ ...p, area: v as UserArea }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="Administrativo">Administrativo</SelectItem><SelectItem value="RH">RH</SelectItem><SelectItem value="Comercial">Comercial</SelectItem></SelectContent>
              </Select>
            </div>
            <div>
              <Label>Perfil</Label>
              <Select value={userForm.role} onValueChange={v => setUserForm(p => ({ ...p, role: v as AppRole }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="ADMIN">Administrador</SelectItem>
                  <SelectItem value="COORDENADOR_RH">Coordenador RH</SelectItem>
                  <SelectItem value="RECRUTADOR">Recrutador</SelectItem>
                  <SelectItem value="COMERCIAL">Comercial</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div><Label>Telefone</Label><Input value={userForm.telefone} onChange={e => setUserForm(p => ({ ...p, telefone: e.target.value }))} /></div>
          </div>
          <DialogFooter><Button variant="outline" onClick={() => setUserDialog(null)}>Cancelar</Button><Button onClick={saveUser}>Salvar</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Area Dialog */}
      <Dialog open={!!areaDialog} onOpenChange={() => setAreaDialog(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>{areaDialog === 'new' ? 'Nova Área' : 'Editar Área'}</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div><Label>Código *</Label><Input placeholder="Ex: RH" value={areaForm.codigo} onChange={e => setAreaForm(p => ({ ...p, codigo: e.target.value }))} /></div>
            <div><Label>Nome *</Label><Input placeholder="Ex: Recursos Humanos" value={areaForm.nome} onChange={e => setAreaForm(p => ({ ...p, nome: e.target.value }))} /></div>
          </div>
          <DialogFooter><Button variant="outline" onClick={() => setAreaDialog(null)}>Cancelar</Button><Button onClick={saveArea}>Salvar</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Funcao Dialog */}
      <Dialog open={!!funcaoDialog} onOpenChange={() => setFuncaoDialog(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>{funcaoDialog === 'new' ? 'Nova Função' : 'Editar Função'}</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div><Label>Código *</Label><Input placeholder="Ex: DevJavaSr" value={funcaoForm.codigo} onChange={e => setFuncaoForm(p => ({ ...p, codigo: e.target.value }))} /></div>
            <div><Label>Nome *</Label><Input placeholder="Ex: Desenvolvedor Java SR" value={funcaoForm.nome} onChange={e => setFuncaoForm(p => ({ ...p, nome: e.target.value }))} /></div>
          </div>
          <DialogFooter><Button variant="outline" onClick={() => setFuncaoDialog(null)}>Cancelar</Button><Button onClick={saveFuncao}>Salvar</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Categoria Dialog */}
      <Dialog open={!!catDialog} onOpenChange={() => setCatDialog(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>{catDialog === 'new' ? 'Nova Categoria' : 'Editar Categoria'}</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div><Label>Nome *</Label><Input placeholder="Ex: Tecnologia" value={catForm.nome} onChange={e => setCatForm(p => ({ ...p, nome: e.target.value }))} /></div>
          </div>
          <DialogFooter><Button variant="outline" onClick={() => setCatDialog(null)}>Cancelar</Button><Button onClick={saveCat}>Salvar</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Unidade Dialog */}
      <Dialog open={!!uniDialog} onOpenChange={() => setUniDialog(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>{uniDialog === 'new' ? 'Nova Unidade' : 'Editar Unidade'}</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div><Label>Nome *</Label><Input placeholder="Ex: São Paulo" value={uniForm.nome} onChange={e => setUniForm(p => ({ ...p, nome: e.target.value }))} /></div>
          </div>
          <DialogFooter><Button variant="outline" onClick={() => setUniDialog(null)}>Cancelar</Button><Button onClick={saveUni}>Salvar</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
