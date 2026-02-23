import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '@/data/store';
import { VagaStatusBadge } from '@/components/StatusBadge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2 } from 'lucide-react';
import { VagaStatus } from '@/types';

export default function MyRecords() {
  const { currentUser, vagas, loadingVagas } = useAppStore();
  const navigate = useNavigate();

  const minhasVagas = useMemo(() => {
    if (!currentUser) return [];
    return vagas.filter(v => v.proprietario_user_id === currentUser.id || v.recrutador_user_id === currentUser.id);
  }, [vagas, currentUser]);

  if (loadingVagas) {
    return <div className="page-container flex items-center justify-center min-h-[400px]"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  return (
    <div className="page-container animate-fade-in">
      <Tabs defaultValue="vagas">
        <TabsList>
          <TabsTrigger value="vagas">Minhas Vagas ({minhasVagas.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="vagas" className="mt-4">
          {minhasVagas.length > 0 ? (
            <div className="border rounded-xl overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead>ID</TableHead><TableHead>Cliente</TableHead><TableHead>Função</TableHead><TableHead>Status</TableHead><TableHead>Papel</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {minhasVagas.map(v => (
                    <TableRow key={v.dbId} className="cursor-pointer hover:bg-muted/30" onClick={() => navigate(`/vagas/${v.dbId}`)}>
                      <TableCell className="font-mono text-xs">{v.id}</TableCell>
                      <TableCell className="font-medium">{v.nome_cliente}</TableCell>
                      <TableCell>{v.funcao}</TableCell>
                      <TableCell><VagaStatusBadge status={v.status as VagaStatus} /></TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">
                          {v.proprietario_user_id === currentUser?.id ? 'Proprietário' : 'Recrutador'}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : <p className="text-muted-foreground text-center py-12">Nenhuma vaga associada ao seu perfil.</p>}
        </TabsContent>
      </Tabs>
    </div>
  );
}
