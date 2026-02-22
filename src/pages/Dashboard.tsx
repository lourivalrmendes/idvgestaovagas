import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '@/data/store';
import { GlobalFilters, Filters, defaultFilters } from '@/components/GlobalFilters';
import { VagaStatusBadge } from '@/components/StatusBadge';
import { Card, CardContent } from '@/components/ui/card';
import { Vaga, VagaStatus } from '@/types';
import { TrendingUp, TrendingDown, Briefcase, Clock, AlertTriangle, CheckCircle, XCircle, FileText } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

function filterVagas(vagas: Vaga[], filters: Filters) {
  return vagas.filter(v => {
    if (filters.recrutador !== 'todos' && v.recrutador_user_id !== filters.recrutador) return false;
    if (filters.cliente !== 'todos' && v.nome_cliente !== filters.cliente) return false;
    if (filters.unidade !== 'todos' && v.unidade_negocio !== filters.unidade) return false;
    if (filters.categoria !== 'todos' && v.categoria !== filters.categoria) return false;
    if (filters.periodo !== 'total') {
      const days = parseInt(filters.periodo);
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - days);
      if (new Date(v.data_criacao) < cutoff) return false;
    }
    return true;
  });
}

const openStatuses: VagaStatus[] = ['EM_VALIDACAO_RH', 'SEM_CVS_DENTRO_SLA', 'SEM_CVS_FORA_SLA', 'COM_CVS_ENVIADOS', 'COM_CVS_MAIS_15_DIAS_SEM_RETORNO', 'EM_FECHAMENTO'];

export default function Dashboard() {
  const { vagas, unidadesNegocio, categorias, getUserById } = useAppStore();
  const [filters, setFilters] = useState<Filters>(defaultFilters);
  const navigate = useNavigate();

  const filtered = useMemo(() => filterVagas(vagas, filters), [vagas, filters]);

  const kpis = useMemo(() => {
    const total = filtered.length;
    const abertas = filtered.filter(v => openStatuses.includes(v.status));
    const ate5 = filtered.filter(v => {
      if (!v.data_validacao_rh || !openStatuses.includes(v.status)) return false;
      const diff = (Date.now() - new Date(v.data_validacao_rh).getTime()) / 86400000;
      return diff <= 5;
    });
    const mais5 = filtered.filter(v => {
      if (!v.data_validacao_rh || !openStatuses.includes(v.status)) return false;
      const diff = (Date.now() - new Date(v.data_validacao_rh).getTime()) / 86400000;
      return diff > 5 && diff <= 15;
    });
    const mais15 = filtered.filter(v => {
      if (!v.data_validacao_rh || !openStatuses.includes(v.status)) return false;
      const diff = (Date.now() - new Date(v.data_validacao_rh).getTime()) / 86400000;
      return diff > 15;
    });
    const encerradas = filtered.filter(v => v.status === 'VAGA_APROVADA' || v.status === 'VAGA_REPROVADA');
    const ganhas = filtered.filter(v => v.status === 'VAGA_APROVADA');
    const perdidas = filtered.filter(v => v.status === 'VAGA_REPROVADA');
    return [
      { label: 'Total Vagas', value: total, icon: Briefcase, color: 'text-primary', delta: '+12%' },
      { label: 'Abertas ≤ 5 dias', value: ate5.length, icon: Clock, color: 'text-status-dentro-sla', delta: '+3' },
      { label: 'Abertas + 5 dias', value: mais5.length, icon: AlertTriangle, color: 'text-status-sem-retorno', delta: '-1' },
      { label: 'Abertas + 15 dias', value: mais15.length, icon: AlertTriangle, color: 'text-status-fora-sla', delta: '+2' },
      { label: 'Encerradas', value: encerradas.length, icon: FileText, color: 'text-muted-foreground', delta: '+4' },
      { label: 'Vagas Ganhas', value: ganhas.length, icon: CheckCircle, color: 'text-status-aprovada', delta: '+3' },
      { label: 'Vagas Perdidas', value: perdidas.length, icon: XCircle, color: 'text-status-reprovada', delta: '0' },
    ];
  }, [filtered]);

  const lineData = useMemo(() => {
    return unidadesNegocio.map(u => ({
      name: u,
      total: filtered.filter(v => v.unidade_negocio === u).length,
      abertas: filtered.filter(v => v.unidade_negocio === u && openStatuses.includes(v.status)).length,
    }));
  }, [filtered, unidadesNegocio]);

  const barData = useMemo(() => {
    return categorias.map(c => ({
      name: c,
      abertas: filtered.filter(v => v.categoria === c && openStatuses.includes(v.status)).length,
      ganhas: filtered.filter(v => v.categoria === c && v.status === 'VAGA_APROVADA').length,
      perdidas: filtered.filter(v => v.categoria === c && v.status === 'VAGA_REPROVADA').length,
    }));
  }, [filtered, categorias]);

  const insights = useMemo(() => {
    const byUnidade = unidadesNegocio.map(u => ({
      name: u,
      perdas: filtered.filter(v => v.unidade_negocio === u && v.status === 'VAGA_REPROVADA').length,
      total: filtered.filter(v => v.unidade_negocio === u).length,
    })).sort((a, b) => b.perdas - a.perdas);

    const slaEstourado = filtered.filter(v => v.status === 'SEM_CVS_FORA_SLA' || v.status === 'COM_CVS_MAIS_15_DIAS_SEM_RETORNO').length;
    const totalAbertas = filtered.filter(v => openStatuses.includes(v.status)).length;
    const slaPct = totalAbertas > 0 ? Math.round((slaEstourado / totalAbertas) * 100) : 0;

    const topClientes = [...new Set(filtered.filter(v => openStatuses.includes(v.status)).map(v => v.nome_cliente))]
      .map(c => ({ name: c, count: filtered.filter(v => v.nome_cliente === c && openStatuses.includes(v.status)).length }))
      .sort((a, b) => b.count - a.count).slice(0, 3);

    return [
      { title: 'SLA Estourado', text: `${slaPct}% das vagas abertas (${slaEstourado}) estão fora do SLA`, cta: 'Ver Vagas' },
      { title: 'Maior taxa de perdas', text: byUnidade[0] ? `${byUnidade[0].name} tem ${byUnidade[0].perdas} vaga(s) perdida(s)` : 'Sem dados', cta: 'Ver Vagas' },
      { title: 'Top clientes com vagas abertas', text: topClientes.map(c => `${c.name} (${c.count})`).join(', ') || 'Sem dados', cta: 'Ver Vagas' },
    ];
  }, [filtered, unidadesNegocio]);

  return (
    <div className="page-container animate-fade-in">
      <GlobalFilters filters={filters} onChange={setFilters} />

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        {kpis.map((kpi, i) => (
          <Card key={i} className="kpi-card cursor-pointer" onClick={() => navigate('/vagas')}>
            <CardContent className="p-0">
              <div className="flex items-center justify-between mb-2">
                <kpi.icon className={`h-5 w-5 ${kpi.color}`} />
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  {kpi.delta.startsWith('+') ? <TrendingUp className="h-3 w-3 text-status-aprovada" /> : kpi.delta.startsWith('-') ? <TrendingDown className="h-3 w-3 text-status-reprovada" /> : null}
                  {kpi.delta}
                </span>
              </div>
              <p className="text-2xl font-bold text-foreground">{kpi.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{kpi.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="section-title mb-4">Vagas por Unidade de Negócio</h3>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={lineData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="total" stroke="hsl(var(--primary))" strokeWidth={2} name="Total" />
              <Line type="monotone" dataKey="abertas" stroke="hsl(var(--status-sem-retorno))" strokeWidth={2} name="Abertas" />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6">
          <h3 className="section-title mb-4">Abertas, Ganhas e Perdidas por Categoria</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="abertas" fill="hsl(var(--primary))" name="Abertas" radius={[4, 4, 0, 0]} />
              <Bar dataKey="ganhas" fill="hsl(var(--status-aprovada))" name="Ganhas" radius={[4, 4, 0, 0]} />
              <Bar dataKey="perdidas" fill="hsl(var(--status-reprovada))" name="Perdidas" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Insights */}
      <div>
        <h3 className="section-title mb-3">Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {insights.map((ins, i) => (
            <Card key={i} className="insight-card">
              <CardContent className="p-0">
                <h4 className="font-semibold text-foreground mb-1">{ins.title}</h4>
                <p className="text-sm text-muted-foreground mb-3">{ins.text}</p>
                <button onClick={() => navigate('/vagas')} className="text-sm font-medium text-primary hover:underline">{ins.cta} →</button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
