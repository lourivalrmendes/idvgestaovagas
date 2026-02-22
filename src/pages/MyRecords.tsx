import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '@/data/store';
import { VagaStatusBadge, CandidatoStatusBadge } from '@/components/StatusBadge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function MyRecords() {
  const { currentUser, vagas, candidatos, envios, getUserById } = useAppStore();
  const navigate = useNavigate();

  const minhasVagas = useMemo(() => vagas.filter(v => v.proprietario_user_id === currentUser.id || v.recrutador_user_id === currentUser.id), [vagas, currentUser]);

  const minhasAlteracoes = useMemo(() => {
    const all: { vagaId: string; status: string; data: string }[] = [];
    vagas.forEach(v => v.historico_status.forEach(h => {
      if (h.alterado_por === currentUser.id) all.push({ vagaId: v.id, status: h.status, data: h.data });
    }));
    return all.sort((a, b) => b.data.localeCompare(a.data)).slice(0, 50);
  }, [vagas, currentUser]);

  return (
    <div className="page-container animate-fade-in">
      <Tabs defaultValue="vagas">
        <TabsList>
          <TabsTrigger value="vagas">Minhas Vagas ({minhasVagas.length})</TabsTrigger>
          <TabsTrigger value="alteracoes">Minhas Alterações ({minhasAlteracoes.length})</TabsTrigger>
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
                    <TableRow key={v.id} className="cursor-pointer hover:bg-muted/30" onClick={() => navigate(`/vagas/${v.id}`)}>
                      <TableCell className="font-mono text-xs">{v.id}</TableCell>
                      <TableCell className="font-medium">{v.nome_cliente}</TableCell>
                      <TableCell>{v.funcao}</TableCell>
                      <TableCell><VagaStatusBadge status={v.status} /></TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">
                          {v.proprietario_user_id === currentUser.id ? 'Proprietário' : 'Recrutador'}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : <p className="text-muted-foreground text-center py-12">Nenhuma vaga associada ao seu perfil.</p>}
        </TabsContent>

        <TabsContent value="alteracoes" className="mt-4">
          <Card>
            <CardContent className="pt-6">
              {minhasAlteracoes.length > 0 ? (
                <div className="space-y-3">
                  {minhasAlteracoes.map((a, i) => (
                    <div key={i} className="flex items-center gap-4 text-sm cursor-pointer hover:bg-muted/30 p-2 rounded" onClick={() => navigate(`/vagas/${a.vagaId}`)}>
                      <span className="font-mono text-xs text-muted-foreground w-20">{a.vagaId}</span>
                      <VagaStatusBadge status={a.status as any} />
                      <span className="text-muted-foreground ml-auto">{a.data}</span>
                    </div>
                  ))}
                </div>
              ) : <p className="text-muted-foreground text-center py-8">Nenhuma alteração registrada.</p>}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
