import { useAppStore } from '@/data/store';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { User, Mail, Phone, LogOut } from 'lucide-react';

const ROLE_LABELS: Record<string, string> = {
  ADMIN: 'Administrador',
  COORDENADOR_RH: 'Coordenador RH',
  RECRUTADOR: 'Recrutador',
  COMERCIAL: 'Comercial',
};

export default function MyProfile() {
  const { currentUser } = useAppStore();
  const { signOut } = useAuth();

  if (!currentUser) return null;

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
              <Badge variant="secondary">{currentUser.area || '—'}</Badge>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-0.5">Perfil</p>
              <Badge>{currentUser.role ? ROLE_LABELS[currentUser.role] : 'Sem perfil'}</Badge>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-0.5 flex items-center gap-1"><Mail className="h-3 w-3" />E-mail</p>
              <p className="text-sm">{currentUser.email}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-0.5 flex items-center gap-1"><Phone className="h-3 w-3" />Telefone</p>
              <p className="text-sm">{currentUser.telefone || '—'}</p>
            </div>
          </div>

          <Button variant="outline" onClick={signOut} className="w-full">
            <LogOut className="h-4 w-4 mr-2" />Sair
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
