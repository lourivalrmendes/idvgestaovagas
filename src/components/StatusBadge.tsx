import { VagaStatus, CandidatoStatusVaga, STATUS_LABELS, CANDIDATO_STATUS_LABELS } from '@/types';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const statusStyles: Record<VagaStatus, string> = {
  EM_VALIDACAO_RH: 'bg-status-validacao/15 text-status-validacao border-status-validacao/30',
  SEM_CVS_DENTRO_SLA: 'bg-status-dentro-sla/15 text-status-dentro-sla border-status-dentro-sla/30',
  SEM_CVS_FORA_SLA: 'bg-status-fora-sla/15 text-status-fora-sla border-status-fora-sla/30',
  COM_CVS_ENVIADOS: 'bg-status-com-cvs/15 text-status-com-cvs border-status-com-cvs/30',
  COM_CVS_MAIS_15_DIAS_SEM_RETORNO: 'bg-status-sem-retorno/15 text-status-sem-retorno border-status-sem-retorno/30',
  EM_FECHAMENTO: 'bg-status-fechamento/15 text-status-fechamento border-status-fechamento/30',
  VAGA_APROVADA: 'bg-status-aprovada/15 text-status-aprovada border-status-aprovada/30',
  VAGA_REPROVADA: 'bg-status-reprovada/15 text-status-reprovada border-status-reprovada/30',
};

const candidatoStatusStyles: Record<CandidatoStatusVaga, string> = {
  EM_ENTREVISTA: 'bg-status-validacao/15 text-status-validacao border-status-validacao/30',
  APROVADO: 'bg-status-aprovada/15 text-status-aprovada border-status-aprovada/30',
  REPROVADO: 'bg-status-reprovada/15 text-status-reprovada border-status-reprovada/30',
};

export function VagaStatusBadge({ status, className }: { status: VagaStatus; className?: string }) {
  return (
    <Badge variant="outline" className={cn('status-badge font-medium', statusStyles[status], className)}>
      {STATUS_LABELS[status]}
    </Badge>
  );
}

export function CandidatoStatusBadge({ status, className }: { status: CandidatoStatusVaga; className?: string }) {
  return (
    <Badge variant="outline" className={cn('status-badge font-medium', candidatoStatusStyles[status], className)}>
      {CANDIDATO_STATUS_LABELS[status]}
    </Badge>
  );
}
