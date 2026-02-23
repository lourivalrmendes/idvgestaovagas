import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth, AppRole, Profile } from '@/hooks/useAuth';
import { toast } from 'sonner';

// ---- Types matching the DB ----
export interface UserProfile extends Profile {
  role: AppRole | null;
}

export interface DbVaga {
  id: string;
  codigo: string;
  status: string;
  proprietario_user_id: string;
  recrutador_user_id: string | null;
  data_criacao: string;
  data_validacao_rh: string | null;
  data_ultima_alteracao: string;
  motivo_reprovacao_rh: string | null;
  data_solicitacao: string | null;
  nome_solicitante: string;
  area_solicitante: string;
  nome_cliente: string;
  motivo_abertura_vaga: string;
  quantidade_de_vagas: number | null;
  funcao: string;
  faixa_salarial: string;
  tipo_contratacao: string;
  tempo_de_contrato: string;
  horario_trabalho: string;
  quantidade_horas_mes: number | null;
  modalidade: string;
  endereco_local_trabalho: string;
  hibrido_dias_presencial: number | null;
  data_prevista_inicio: string | null;
  principais_responsabilidades: string;
  requisitos_tecnicos: string;
  nivel_senioridade: string;
  formacao: string;
  certificacoes: string;
  linguagens_e_frameworks_necessarios: string;
  soft_skills: string;
  necessario_equipamento: boolean;
  ingles_nivel: string | null;
  espanhol_nivel: string | null;
  observacoes: string;
  cliente_id: string | null;
  unidade_id: string | null;
  categoria_id: string | null;
}

export interface DbCandidato {
  id: string;
  nome: string;
  cidade: string;
  estado: string;
  telefone_celular: string;
  telefone_outro: string;
  email: string;
  linkedin: string;
  ultimo_cv_nome: string | null;
  ultimo_cv_tipo: string | null;
  created_by_user_id: string;
}

export interface DbEnvio {
  id: string;
  vaga_id: string;
  candidato_id: string;
  data_envio: string;
  status_candidato_na_vaga: string;
  observacoes: string;
  created_by_user_id: string;
}

export interface DbHistorico {
  id: string;
  vaga_id: string;
  status_anterior: string | null;
  status_novo: string;
  alterado_por: string | null;
  observacao: string | null;
  criado_em: string;
}

export interface DimensionItem {
  id: string;
  nome: string;
  ativo: boolean;
}

// ---- Mapping helpers for UI compatibility ----
export function dbVagaToUiVaga(v: DbVaga) {
  // Map tipo_contratacao string to object
  const tc = v.tipo_contratacao || '';
  const tipo_contratacao = { pj: tc === 'PJ', clt: tc === 'CLT', alocacao: tc === 'ALOCACAO' };
  const mod = v.modalidade || '';
  const modalidade_contratacao = { presencial: mod === 'PRESENCIAL', hibrido: mod === 'HIBRIDO', remoto: mod === 'REMOTO' };

  return {
    id: v.codigo || v.id,
    dbId: v.id,
    status: v.status as any,
    proprietario_user_id: v.proprietario_user_id,
    recrutador_user_id: v.recrutador_user_id,
    data_criacao: v.data_criacao,
    data_validacao_rh: v.data_validacao_rh,
    data_ultima_alteracao: v.data_ultima_alteracao,
    reprovada_rh_motivo: v.motivo_reprovacao_rh || undefined,
    data_solicitacao: v.data_solicitacao || '',
    nome_solicitante: v.nome_solicitante,
    area_solicitante: v.area_solicitante,
    nome_cliente: v.nome_cliente,
    motivo_abertura_vaga: v.motivo_abertura_vaga,
    quantidade_de_vagas: v.quantidade_de_vagas,
    funcao: v.funcao,
    faixa_salarial: v.faixa_salarial,
    tipo_contratacao,
    tempo_de_contrato: v.tempo_de_contrato,
    horario_trabalho: v.horario_trabalho,
    quantidade_horas_mes: v.quantidade_horas_mes,
    modalidade_contratacao,
    endereco_local_trabalho: v.endereco_local_trabalho,
    hibrido_dias_presencial: v.hibrido_dias_presencial,
    data_prevista_inicio: v.data_prevista_inicio || '',
    principais_responsabilidades: v.principais_responsabilidades,
    requisitos_tecnicos: v.requisitos_tecnicos,
    nivel_senioridade: v.nivel_senioridade,
    formacao: v.formacao,
    certificacoes: v.certificacoes,
    linguagens_e_frameworks_necessarios: v.linguagens_e_frameworks_necessarios,
    soft_skills: v.soft_skills,
    necessario_equipamento: v.necessario_equipamento,
    idioma_ingles: v.ingles_nivel || '',
    idioma_espanhol: v.espanhol_nivel || '',
    observacoes: v.observacoes,
    unidade_negocio: '', // Will be resolved by join
    categoria: '', // Will be resolved by join
    tags: [] as string[],
    historico_status: [] as any[], // Loaded separately
  };
}

// ---- Context ----
interface AppState {
  // Current user from auth
  currentUser: UserProfile | null;
  // Users (profiles + roles)
  users: UserProfile[];
  loadingUsers: boolean;
  refreshUsers: () => Promise<void>;
  // Vagas
  vagas: any[];
  loadingVagas: boolean;
  refreshVagas: () => Promise<void>;
  addVaga: (data: Record<string, any>) => Promise<string | null>;
  updateVaga: (dbId: string, updates: Record<string, any>) => Promise<void>;
  deleteVaga: (dbId: string) => Promise<void>;
  changeVagaStatus: (dbId: string, newStatus: string, observacao?: string) => Promise<void>;
  // Candidatos
  candidatos: DbCandidato[];
  loadingCandidatos: boolean;
  refreshCandidatos: () => Promise<void>;
  addCandidato: (data: Omit<DbCandidato, 'id'>) => Promise<string | null>;
  updateCandidato: (id: string, updates: Partial<DbCandidato>) => Promise<void>;
  deleteCandidato: (id: string) => Promise<void>;
  // Envios
  envios: DbEnvio[];
  loadingEnvios: boolean;
  refreshEnvios: () => Promise<void>;
  addEnvio: (data: Omit<DbEnvio, 'id'>) => Promise<void>;
  updateEnvioStatus: (id: string, status: string, observacoes?: string) => Promise<void>;
  // Historico
  getHistoricoByVaga: (vagaDbId: string) => Promise<DbHistorico[]>;
  // Dimensions
  clientes: DimensionItem[];
  unidadesNegocio: DimensionItem[];
  categorias: DimensionItem[];
  // Settings
  slaAceite: number;
  setSlaAceite: (v: number) => Promise<void>;
  // Helpers
  getEnviosByVaga: (vagaDbId: string) => DbEnvio[];
  getEnviosByCandidato: (candidatoId: string) => DbEnvio[];
  getUserById: (id: string) => UserProfile | undefined;
}

const AppContext = createContext<AppState | null>(null);

export const useAppStore = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppStore must be within AppProvider');
  return ctx;
};

export function AppProvider({ children }: { children: ReactNode }) {
  const { user, profile, role } = useAuth();

  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [vagas, setVagas] = useState<any[]>([]);
  const [loadingVagas, setLoadingVagas] = useState(true);
  const [candidatos, setCandidatos] = useState<DbCandidato[]>([]);
  const [loadingCandidatos, setLoadingCandidatos] = useState(true);
  const [envios, setEnvios] = useState<DbEnvio[]>([]);
  const [loadingEnvios, setLoadingEnvios] = useState(true);
  const [clientes, setClientes] = useState<DimensionItem[]>([]);
  const [unidadesNegocio, setUnidadesNegocio] = useState<DimensionItem[]>([]);
  const [categorias, setCategorias] = useState<DimensionItem[]>([]);
  const [slaAceite, setSlaAceiteState] = useState(5);

  const currentUser: UserProfile | null = profile ? { ...profile, role } : null;

  // ---- Load all data ----
  const refreshUsers = useCallback(async () => {
    setLoadingUsers(true);
    const [{ data: profiles }, { data: roles }] = await Promise.all([
      supabase.from('profiles').select('*'),
      supabase.from('user_roles').select('*'),
    ]);
    const roleMap = new Map<string, AppRole>();
    (roles || []).forEach((r: any) => roleMap.set(r.user_id, r.role as AppRole));
    setUsers((profiles || []).map((p: any) => ({
      id: p.id, nome: p.nome || '', area: p.area || '', email: p.email || '',
      telefone: p.telefone || '', ativo: p.ativo ?? true,
      role: roleMap.get(p.id) || null,
    })));
    setLoadingUsers(false);
  }, []);

  const refreshVagas = useCallback(async () => {
    setLoadingVagas(true);
    const { data } = await supabase.from('vagas').select(`
      *,
      cliente:clientes(nome),
      unidade:unidades_negocio(nome),
      categoria:categorias(nome)
    `).order('data_criacao', { ascending: false });
    const mapped = (data || []).map((v: any) => {
      const ui = dbVagaToUiVaga(v);
      ui.unidade_negocio = v.cliente?.nome ? '' : '';
      ui.unidade_negocio = v.unidade?.nome || '';
      ui.categoria = v.categoria?.nome || '';
      return ui;
    });
    setVagas(mapped);
    setLoadingVagas(false);
  }, []);

  const refreshCandidatos = useCallback(async () => {
    setLoadingCandidatos(true);
    const { data } = await supabase.from('candidatos').select('*').order('nome');
    setCandidatos((data || []).map((c: any) => ({
      id: c.id, nome: c.nome, cidade: c.cidade || '', estado: c.estado || '',
      telefone_celular: c.telefone_celular || '', telefone_outro: c.telefone_outro || '',
      email: c.email || '', linkedin: c.linkedin || '',
      ultimo_cv_nome: c.ultimo_cv_nome, ultimo_cv_tipo: c.ultimo_cv_tipo,
      created_by_user_id: c.created_by_user_id,
    })));
    setLoadingCandidatos(false);
  }, []);

  const refreshEnvios = useCallback(async () => {
    setLoadingEnvios(true);
    const { data } = await supabase.from('envios').select('*');
    setEnvios((data || []).map((e: any) => ({
      id: e.id, vaga_id: e.vaga_id, candidato_id: e.candidato_id,
      data_envio: e.data_envio, status_candidato_na_vaga: e.status_candidato_na_vaga,
      observacoes: e.observacoes || '', created_by_user_id: e.created_by_user_id,
    })));
    setLoadingEnvios(false);
  }, []);

  const loadDimensions = useCallback(async () => {
    const [{ data: cl }, { data: un }, { data: ca }, { data: st }] = await Promise.all([
      supabase.from('clientes').select('*').order('nome'),
      supabase.from('unidades_negocio').select('*').order('nome'),
      supabase.from('categorias').select('*').order('nome'),
      supabase.from('settings').select('*').limit(1).single(),
    ]);
    setClientes((cl || []).map((c: any) => ({ id: c.id, nome: c.nome, ativo: c.ativo })));
    setUnidadesNegocio((un || []).map((u: any) => ({ id: u.id, nome: u.nome, ativo: u.ativo })));
    setCategorias((ca || []).map((c: any) => ({ id: c.id, nome: c.nome, ativo: c.ativo })));
    if (st) setSlaAceiteState(st.sla_dias_uteis);
  }, []);

  useEffect(() => {
    if (user) {
      refreshUsers();
      refreshVagas();
      refreshCandidatos();
      refreshEnvios();
      loadDimensions();
    }
  }, [user]);

  // ---- Mutations ----
  const addVaga = useCallback(async (data: Record<string, any>): Promise<string | null> => {
    const { data: result, error } = await supabase.from('vagas').insert([data] as any).select().single();
    if (error) { toast.error('Erro ao criar vaga: ' + error.message); return null; }
    await refreshVagas();
    return result?.id || null;
  }, [refreshVagas]);

  const updateVaga = useCallback(async (dbId: string, updates: Record<string, any>) => {
    const { error } = await supabase.from('vagas').update(updates).eq('id', dbId);
    if (error) { toast.error('Erro ao atualizar vaga: ' + error.message); return; }
    await refreshVagas();
  }, [refreshVagas]);

  const deleteVaga = useCallback(async (dbId: string) => {
    const { error } = await supabase.from('vagas').delete().eq('id', dbId);
    if (error) { toast.error('Erro ao deletar vaga: ' + error.message); return; }
    await refreshVagas();
  }, [refreshVagas]);

  const changeVagaStatus = useCallback(async (dbId: string, newStatus: string, observacao?: string) => {
    const updates: Record<string, any> = { status: newStatus };
    if (observacao) {
      // The trigger handles historico insertion automatically
    }
    if (newStatus === 'VAGA_REPROVADA' && observacao) {
      updates.motivo_reprovacao_rh = observacao;
    }
    const { error } = await supabase.from('vagas').update(updates).eq('id', dbId);
    if (error) { toast.error('Erro: ' + error.message); return; }
    // If there's a custom observation, insert it manually into historico since trigger doesn't capture it
    if (observacao) {
      await supabase.from('vaga_status_historico').update({ observacao }).eq('vaga_id', dbId).eq('status_novo', newStatus).order('criado_em', { ascending: false }).limit(1);
    }
    await refreshVagas();
  }, [refreshVagas]);

  const addCandidato = useCallback(async (data: Omit<DbCandidato, 'id'>): Promise<string | null> => {
    const { data: result, error } = await supabase.from('candidatos').insert(data).select().single();
    if (error) { toast.error('Erro ao criar candidato: ' + error.message); return null; }
    await refreshCandidatos();
    return result?.id || null;
  }, [refreshCandidatos]);

  const updateCandidato = useCallback(async (id: string, updates: Partial<DbCandidato>) => {
    const { error } = await supabase.from('candidatos').update(updates).eq('id', id);
    if (error) { toast.error('Erro: ' + error.message); return; }
    await refreshCandidatos();
  }, [refreshCandidatos]);

  const deleteCandidato = useCallback(async (id: string) => {
    const { error } = await supabase.from('candidatos').delete().eq('id', id);
    if (error) { toast.error('Erro: ' + error.message); return; }
    await refreshCandidatos();
  }, [refreshCandidatos]);

  const addEnvio = useCallback(async (data: Omit<DbEnvio, 'id'>) => {
    const { error } = await supabase.from('envios').insert(data);
    if (error) { toast.error('Erro ao associar candidato: ' + error.message); return; }
    await refreshEnvios();
  }, [refreshEnvios]);

  const updateEnvioStatus = useCallback(async (id: string, status: string, observacoes?: string) => {
    const updates: Record<string, any> = { status_candidato_na_vaga: status };
    if (observacoes !== undefined) updates.observacoes = observacoes;
    const { error } = await supabase.from('envios').update(updates).eq('id', id);
    if (error) { toast.error('Erro: ' + error.message); return; }
    await refreshEnvios();
  }, [refreshEnvios]);

  const getHistoricoByVaga = useCallback(async (vagaDbId: string): Promise<DbHistorico[]> => {
    const { data } = await supabase.from('vaga_status_historico').select('*').eq('vaga_id', vagaDbId).order('criado_em', { ascending: false });
    return (data || []).map((h: any) => ({
      id: h.id, vaga_id: h.vaga_id, status_anterior: h.status_anterior,
      status_novo: h.status_novo, alterado_por: h.alterado_por,
      observacao: h.observacao, criado_em: h.criado_em,
    }));
  }, []);

  const setSlaAceite = useCallback(async (v: number) => {
    const { error } = await supabase.from('settings').update({ sla_dias_uteis: v }).neq('id', '00000000-0000-0000-0000-000000000000'); // update all rows
    if (error) { toast.error('Erro: ' + error.message); return; }
    setSlaAceiteState(v);
  }, []);

  const getEnviosByVaga = useCallback((vagaDbId: string) => {
    // vagaDbId might be the DB UUID; envios reference vaga_id (UUID)
    return envios.filter(e => e.vaga_id === vagaDbId);
  }, [envios]);

  const getEnviosByCandidato = useCallback((candidatoId: string) => envios.filter(e => e.candidato_id === candidatoId), [envios]);
  const getUserById = useCallback((id: string) => users.find(u => u.id === id), [users]);

  return (
    <AppContext.Provider value={{
      currentUser, users, loadingUsers, refreshUsers,
      vagas, loadingVagas, refreshVagas, addVaga, updateVaga, deleteVaga, changeVagaStatus,
      candidatos, loadingCandidatos, refreshCandidatos, addCandidato, updateCandidato, deleteCandidato,
      envios, loadingEnvios, refreshEnvios, addEnvio, updateEnvioStatus,
      getHistoricoByVaga,
      clientes, unidadesNegocio, categorias,
      slaAceite, setSlaAceite,
      getEnviosByVaga, getEnviosByCandidato, getUserById,
    }}>
      {children}
    </AppContext.Provider>
  );
}
