import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { User, Vaga, Candidato, EnvioCandidato, VagaStatus, HistoricoStatus, CandidatoStatusVaga } from '@/types';
import { USERS, VAGAS, CANDIDATOS, ENVIOS, CLIENTES, UNIDADES_NEGOCIO, CATEGORIAS } from './mockData';

interface AppState {
  currentUser: User;
  setCurrentUser: (user: User) => void;
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  vagas: Vaga[];
  candidatos: Candidato[];
  envios: EnvioCandidato[];
  slaAceite: number;
  setSlaAceite: (v: number) => void;
  clientes: string[];
  unidadesNegocio: string[];
  categorias: string[];

  addVaga: (vaga: Vaga) => void;
  updateVaga: (id: string, updates: Partial<Vaga>) => void;
  deleteVaga: (id: string) => void;
  changeVagaStatus: (id: string, newStatus: VagaStatus, observacao?: string) => void;

  addCandidato: (c: Candidato) => void;
  updateCandidato: (id: string, updates: Partial<Candidato>) => void;
  deleteCandidato: (id: string) => void;

  addEnvio: (e: EnvioCandidato) => void;
  updateEnvioStatus: (id: string, status: CandidatoStatusVaga, observacoes?: string) => void;

  getEnviosByVaga: (vagaId: string) => EnvioCandidato[];
  getEnviosByCandidato: (candidatoId: string) => EnvioCandidato[];
  getUserById: (id: string) => User | undefined;
  nextVagaId: () => string;
  nextCandidatoId: () => string;
  nextEnvioId: () => string;
}

const AppContext = createContext<AppState | null>(null);

export const useAppStore = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppStore must be within AppProvider');
  return ctx;
};

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User>(USERS[0]);
  const [users, setUsers] = useState<User[]>(USERS);
  const [vagas, setVagas] = useState<Vaga[]>(VAGAS);
  const [candidatos, setCandidatos] = useState<Candidato[]>(CANDIDATOS);
  const [envios, setEnvios] = useState<EnvioCandidato[]>(ENVIOS);
  const [slaAceite, setSlaAceite] = useState(5);

  const addVaga = useCallback((vaga: Vaga) => setVagas(p => [...p, vaga]), []);
  const updateVaga = useCallback((id: string, updates: Partial<Vaga>) =>
    setVagas(p => p.map(v => v.id === id ? { ...v, ...updates, data_ultima_alteracao: new Date().toISOString().split('T')[0] } : v)), []);
  const deleteVaga = useCallback((id: string) => setVagas(p => p.filter(v => v.id !== id)), []);

  const changeVagaStatus = useCallback((id: string, newStatus: VagaStatus, observacao?: string) => {
    setVagas(p => p.map(vaga => {
      if (vaga.id !== id) return vaga;
      const entry: HistoricoStatus = {
        status: newStatus, status_anterior: vaga.status,
        alterado_por: currentUser.id, data: new Date().toISOString().split('T')[0], observacao,
      };
      return { ...vaga, status: newStatus, data_ultima_alteracao: entry.data, historico_status: [...vaga.historico_status, entry] };
    }));
  }, [currentUser]);

  const addCandidato = useCallback((c: Candidato) => setCandidatos(p => [...p, c]), []);
  const updateCandidato = useCallback((id: string, updates: Partial<Candidato>) =>
    setCandidatos(p => p.map(c => c.id === id ? { ...c, ...updates } : c)), []);
  const deleteCandidato = useCallback((id: string) => setCandidatos(p => p.filter(c => c.id !== id)), []);

  const addEnvio = useCallback((e: EnvioCandidato) => setEnvios(p => [...p, e]), []);
  const updateEnvioStatus = useCallback((id: string, status: CandidatoStatusVaga, observacoes?: string) =>
    setEnvios(p => p.map(e => e.id === id ? { ...e, status, ...(observacoes !== undefined ? { observacoes } : {}) } : e)), []);

  const getEnviosByVaga = useCallback((vagaId: string) => envios.filter(e => e.vaga_id === vagaId), [envios]);
  const getEnviosByCandidato = useCallback((candidatoId: string) => envios.filter(e => e.candidato_id === candidatoId), [envios]);
  const getUserById = useCallback((id: string) => users.find(u => u.id === id), [users]);

  const nextVagaId = useCallback(() => {
    const max = vagas.reduce((m, v) => Math.max(m, parseInt(v.id.replace('VAG-', ''))), 0);
    return `VAG-${String(max + 1).padStart(4, '0')}`;
  }, [vagas]);
  const nextCandidatoId = useCallback(() => {
    const max = candidatos.reduce((m, c) => Math.max(m, parseInt(c.id.replace('CAN-', ''))), 0);
    return `CAN-${String(max + 1).padStart(3, '0')}`;
  }, [candidatos]);
  const nextEnvioId = useCallback(() => {
    const max = envios.reduce((m, e) => Math.max(m, parseInt(e.id.replace('ENV-', ''))), 0);
    return `ENV-${String(max + 1).padStart(3, '0')}`;
  }, [envios]);

  return (
    <AppContext.Provider value={{
      currentUser, setCurrentUser, users, setUsers, vagas, candidatos, envios,
      slaAceite, setSlaAceite,
      clientes: CLIENTES, unidadesNegocio: UNIDADES_NEGOCIO, categorias: CATEGORIAS,
      addVaga, updateVaga, deleteVaga, changeVagaStatus,
      addCandidato, updateCandidato, deleteCandidato,
      addEnvio, updateEnvioStatus,
      getEnviosByVaga, getEnviosByCandidato, getUserById,
      nextVagaId, nextCandidatoId, nextEnvioId,
    }}>
      {children}
    </AppContext.Provider>
  );
}
