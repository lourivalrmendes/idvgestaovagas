import { useAppStore } from '@/data/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { User, Mail, Phone, Building2, LogOut } from 'lucide-react';
import { toast } from 'sonner';

export default function MyProfile() {
  const store = useAppStore();
  const { currentUser, users, setCurrentUser } = store;

  const handleLogout = () => toast.info('Logout simulado — sessão encerrada');

  return (
    <div className="page-container animate-fade-in max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><User className="h-5 w-5" />Meu Perfil</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-muted-foreground mb-0.5">Nome</p>
              <p className="font-medium">{currentUser.nome}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-0.5">Área</p>
              <Badge variant="secondary">{currentUser.area}</Badge>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-0.5">Perfil</p>
              <Badge>{currentUser.perfil}</Badge>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-0.5 flex items-center gap-1"><Mail className="h-3 w-3" />E-mail</p>
              <p className="text-sm">{currentUser.email}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-0.5 flex items-center gap-1"><Phone className="h-3 w-3" />Telefone</p>
              <p className="text-sm">{currentUser.telefone}</p>
            </div>
          </div>

          <div className="border-t pt-4 space-y-3">
            <p className="text-sm font-medium text-muted-foreground">Simular outro perfil:</p>
            <Select value={currentUser.id} onValueChange={id => {
              const u = users.find(u => u.id === id);
              if (u) { setCurrentUser(u); toast.success(`Perfil alterado para ${u.nome} (${u.perfil})`); }
            }}>
              <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
              <SelectContent>
                {users.map(u => <SelectItem key={u.id} value={u.id}>{u.nome} — {u.perfil}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <Button variant="outline" onClick={handleLogout} className="w-full">
            <LogOut className="h-4 w-4 mr-2" />Logout (simulado)
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
