import { useState } from 'react';
import { useAppStore } from '@/data/store';
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
import { User, UserArea, UserPerfil } from '@/types';
import { Plus, Pencil, Settings } from 'lucide-react';

export default function Administration() {
  const store = useAppStore();
  const [sla, setSla] = useState(store.slaAceite);
  const [userDialog, setUserDialog] = useState<User | null | 'new'>(null);
  const [userForm, setUserForm] = useState({ nome: '', area: 'RH' as UserArea, perfil: 'Recrutador' as UserPerfil, email: '', telefone: '' });

  const saveSla = () => {
    store.setSlaAceite(sla);
    toast.success(`SLA atualizado para ${sla} dias úteis`);
  };

  const openNewUser = () => {
    setUserForm({ nome: '', area: 'RH', perfil: 'Recrutador', email: '', telefone: '' });
    setUserDialog('new');
  };

  const openEditUser = (u: User) => {
    setUserForm({ nome: u.nome, area: u.area, perfil: u.perfil, email: u.email, telefone: u.telefone });
    setUserDialog(u);
  };

  const saveUser = () => {
    if (!userForm.nome.trim()) { toast.error('Nome é obrigatório'); return; }
    if (userDialog === 'new') {
      const id = `USR-${String(store.users.length + 1).padStart(3, '0')}`;
      store.setUsers(prev => [...prev, { id, ...userForm, ativo: true }]);
      toast.success('Usuário criado');
    } else if (userDialog) {
      store.setUsers(prev => prev.map(u => u.id === (userDialog as User).id ? { ...u, ...userForm } : u));
      toast.success('Usuário atualizado');
    }
    setUserDialog(null);
  };

  return (
    <div className="page-container animate-fade-in">
      <Tabs defaultValue="sla">
        <TabsList>
          <TabsTrigger value="sla"><Settings className="h-4 w-4 mr-1" />SLA</TabsTrigger>
          <TabsTrigger value="usuarios">Usuários</TabsTrigger>
          <TabsTrigger value="categorias">Categorias</TabsTrigger>
          <TabsTrigger value="unidades">Unidades</TabsTrigger>
        </TabsList>

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
                    <TableCell><Badge variant="secondary" className="text-xs">{u.perfil}</Badge></TableCell>
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

        <TabsContent value="categorias" className="mt-4">
          <Card className="max-w-md">
            <CardHeader><CardTitle className="text-base">Categorias</CardTitle></CardHeader>
            <CardContent>
              <ul className="space-y-2">{store.categorias.map(c => <li key={c} className="flex items-center gap-2"><Badge variant="outline">{c}</Badge></li>)}</ul>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="unidades" className="mt-4">
          <Card className="max-w-md">
            <CardHeader><CardTitle className="text-base">Unidades de Negócio</CardTitle></CardHeader>
            <CardContent>
              <ul className="space-y-2">{store.unidadesNegocio.map(u => <li key={u} className="flex items-center gap-2"><Badge variant="outline">{u}</Badge></li>)}</ul>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* User Dialog */}
      <Dialog open={!!userDialog} onOpenChange={() => setUserDialog(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>{userDialog === 'new' ? 'Novo Usuário' : 'Editar Usuário'}</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div><Label>Nome *</Label><Input value={userForm.nome} onChange={e => setUserForm(p => ({ ...p, nome: e.target.value }))} /></div>
            <div>
              <Label>Área</Label>
              <Select value={userForm.area} onValueChange={v => setUserForm(p => ({ ...p, area: v as UserArea }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="Administrativo">Administrativo</SelectItem><SelectItem value="RH">RH</SelectItem><SelectItem value="Comercial">Comercial</SelectItem></SelectContent>
              </Select>
            </div>
            <div>
              <Label>Perfil</Label>
              <Select value={userForm.perfil} onValueChange={v => setUserForm(p => ({ ...p, perfil: v as UserPerfil }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="Coordenador RH">Coordenador RH</SelectItem><SelectItem value="Recrutador">Recrutador</SelectItem><SelectItem value="Comercial">Comercial</SelectItem><SelectItem value="Administrador">Administrador</SelectItem></SelectContent>
              </Select>
            </div>
            <div><Label>E-mail</Label><Input value={userForm.email} onChange={e => setUserForm(p => ({ ...p, email: e.target.value }))} /></div>
            <div><Label>Telefone</Label><Input value={userForm.telefone} onChange={e => setUserForm(p => ({ ...p, telefone: e.target.value }))} /></div>
          </div>
          <DialogFooter><Button variant="outline" onClick={() => setUserDialog(null)}>Cancelar</Button><Button onClick={saveUser}>Salvar</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
