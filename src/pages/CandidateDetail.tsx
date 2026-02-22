import { useParams, useNavigate } from 'react-router-dom';
import { useAppStore } from '@/data/store';
import { CandidatoStatusBadge, VagaStatusBadge } from '@/components/StatusBadge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Mail, Phone, MapPin, Linkedin, FileText } from 'lucide-react';

export default function CandidateDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const store = useAppStore();
  const candidato = store.candidatos.find(c => c.id === id);

  if (!candidato) return <div className="page-container"><p>Candidato não encontrado.</p><Button variant="outline" onClick={() => navigate('/candidatos')}>Voltar</Button></div>;

  const envios = store.getEnviosByCandidato(candidato.id);

  return (
    <div className="page-container animate-fade-in">
      <Button variant="ghost" onClick={() => navigate('/candidatos')} className="mb-4"><ArrowLeft className="h-4 w-4 mr-2" />Voltar</Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader><CardTitle>{candidato.nome}</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2 text-sm"><MapPin className="h-4 w-4 text-muted-foreground" />{candidato.cidade}/{candidato.estado}</div>
            <div className="flex items-center gap-2 text-sm"><Phone className="h-4 w-4 text-muted-foreground" />{candidato.telefone_celular}</div>
            {candidato.telefone_outro && <div className="flex items-center gap-2 text-sm"><Phone className="h-4 w-4 text-muted-foreground" />{candidato.telefone_outro}</div>}
            <div className="flex items-center gap-2 text-sm"><Mail className="h-4 w-4 text-muted-foreground" />{candidato.email}</div>
            {candidato.linkedin && <div className="flex items-center gap-2 text-sm"><Linkedin className="h-4 w-4 text-muted-foreground" /><span className="truncate">{candidato.linkedin}</span></div>}
            {candidato.ultimo_cv && (
              <div className="flex items-center gap-2">
                <Badge variant="secondary"><FileText className="h-3 w-3 mr-1" />{candidato.ultimo_cv.nome}</Badge>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader><CardTitle className="text-base">Histórico de Vagas</CardTitle></CardHeader>
          <CardContent>
            {envios.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Vaga</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Data Envio</TableHead>
                    <TableHead>Status Candidato</TableHead>
                    <TableHead>Status Vaga</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {envios.map(e => {
                    const vaga = store.vagas.find(v => v.id === e.vaga_id);
                    return (
                      <TableRow key={e.id} className="cursor-pointer hover:bg-muted/30" onClick={() => vaga && navigate(`/vagas/${vaga.id}`)}>
                        <TableCell className="font-medium">{vaga?.funcao || e.vaga_id}</TableCell>
                        <TableCell>{vaga?.nome_cliente || '—'}</TableCell>
                        <TableCell>{e.data_envio}</TableCell>
                        <TableCell><CandidatoStatusBadge status={e.status} /></TableCell>
                        <TableCell>{vaga && <VagaStatusBadge status={vaga.status} />}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            ) : (
              <p className="text-muted-foreground text-center py-8">Este candidato ainda não foi enviado para nenhuma vaga.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
