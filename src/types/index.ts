export type UserArea = 'Administrativo' | 'RH' | 'Comercial';
export type UserPerfil = 'Coordenador RH' | 'Recrutador' | 'Comercial' | 'Administrador';

export interface User {
  id: string;
  nome: string;
  area: UserArea;
  perfil: UserPerfil;
  email: string;
  telefone: string;
  ativo: boolean;
}

export type VagaStatus =
  | 'EM_VALIDACAO_RH'
  | 'SEM_CVS_DENTRO_SLA'
  | 'SEM_CVS_FORA_SLA'
  | 'COM_CVS_ENVIADOS'
  | 'COM_CVS_MAIS_15_DIAS_SEM_RETORNO'
  | 'EM_FECHAMENTO'
  | 'VAGA_APROVADA'
  | 'VAGA_REPROVADA';

export type CandidatoStatusVaga = 'EM_ENTREVISTA' | 'APROVADO' | 'REPROVADO';

export interface HistoricoStatus {
  status: VagaStatus;
  status_anterior?: VagaStatus;
  alterado_por: string;
  data: string;
  observacao?: string;
}

export interface Vaga {
  id: string;
  status: VagaStatus;
  proprietario_user_id: string;
  recrutador_user_id: string | null;
  data_criacao: string;
  data_validacao_rh: string | null;
  data_ultima_alteracao: string;
  historico_status: HistoricoStatus[];
  reprovada_rh_motivo?: string;

  data_solicitacao: string;
  nome_solicitante: string;
  area_solicitante: string;
  nome_cliente: string;
  motivo_abertura_vaga: string;
  quantidade_de_vagas: number | null;
  funcao: string;
  faixa_salarial: string;
  tipo_contratacao: { pj: boolean; clt: boolean; alocacao: boolean };
  tempo_de_contrato: string;
  horario_trabalho: string;
  quantidade_horas_mes: number | null;
  modalidade_contratacao: { presencial: boolean; hibrido: boolean; remoto: boolean };
  endereco_local_trabalho: string;
  hibrido_dias_presencial: number | null;
  data_prevista_inicio: string;
  principais_responsabilidades: string;
  requisitos_tecnicos: string;
  nivel_senioridade: string;
  formacao: string;
  certificacoes: string;
  linguagens_e_frameworks_necessarios: string;
  soft_skills: string;
  necessario_equipamento: boolean;
  idioma_ingles: string;
  idioma_espanhol: string;
  observacoes: string;

  unidade_negocio: string;
  categoria: string;
  tags: string[];
}

export interface Candidato {
  id: string;
  nome: string;
  cidade: string;
  estado: string;
  telefone_celular: string;
  telefone_outro: string;
  email: string;
  linkedin: string;
  ultimo_cv: { nome: string; tipo: 'PDF' | 'DOCX' } | null;
}

export interface EnvioCandidato {
  id: string;
  vaga_id: string;
  candidato_id: string;
  data_envio: string;
  status: CandidatoStatusVaga;
  observacoes: string;
}

export const STATUS_LABELS: Record<VagaStatus, string> = {
  EM_VALIDACAO_RH: 'Em Validação RH',
  SEM_CVS_DENTRO_SLA: 'Sem CVs – Dentro SLA',
  SEM_CVS_FORA_SLA: 'Sem CVs – Fora SLA',
  COM_CVS_ENVIADOS: 'Com CVs Enviados',
  COM_CVS_MAIS_15_DIAS_SEM_RETORNO: 'CVs +15 dias s/ Retorno',
  EM_FECHAMENTO: 'Em Fechamento',
  VAGA_APROVADA: 'Vaga Aprovada',
  VAGA_REPROVADA: 'Vaga Reprovada',
};

export const CANDIDATO_STATUS_LABELS: Record<CandidatoStatusVaga, string> = {
  EM_ENTREVISTA: 'Em Entrevista',
  APROVADO: 'Aprovado',
  REPROVADO: 'Reprovado',
};

export const PIPELINE_ORDER: VagaStatus[] = [
  'EM_VALIDACAO_RH',
  'SEM_CVS_DENTRO_SLA',
  'SEM_CVS_FORA_SLA',
  'COM_CVS_ENVIADOS',
  'COM_CVS_MAIS_15_DIAS_SEM_RETORNO',
  'EM_FECHAMENTO',
  'VAGA_APROVADA',
  'VAGA_REPROVADA',
];
