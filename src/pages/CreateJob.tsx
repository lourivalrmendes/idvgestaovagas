import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '@/data/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Vaga } from '@/types';

export default function CreateJob() {
  const navigate = useNavigate();
  const store = useAppStore();

  const [form, setForm] = useState({
    nome_cliente: '', funcao: '', quantidade_de_vagas: 1, faixa_salarial: '',
    motivo_abertura_vaga: '', data_solicitacao: new Date().toISOString().split('T')[0],
    nome_solicitante: store.currentUser.nome, area_solicitante: store.currentUser.area,
    tipo_clt: false, tipo_pj: false, tipo_alocacao: false,
    tempo_de_contrato: '', horario_trabalho: '09:00 - 18:00', quantidade_horas_mes: 168,
    mod_presencial: false, mod_hibrido: false, mod_remoto: false,
    endereco_local_trabalho: '', hibrido_dias_presencial: 3,
    data_prevista_inicio: '', principais_responsabilidades: '', requisitos_tecnicos: '',
    nivel_senioridade: 'Pleno',
    formacao: '', certificacoes: '', linguagens_e_frameworks_necessarios: '',
    soft_skills: '', necessario_equipamento: false,
    idioma_ingles: '', idioma_espanhol: '', observacoes: '',
    unidade_negocio: '', categoria: '',
  });

  const set = (key: string, val: any) => setForm(p => ({ ...p, [key]: val }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nome_cliente.trim()) { toast.error('Cliente é obrigatório'); return; }
    if (!form.funcao.trim()) { toast.error('Função é obrigatória'); return; }
    if (!form.quantidade_de_vagas) { toast.error('Quantidade de vagas é obrigatória'); return; }
    if (!form.tipo_clt && !form.tipo_pj && !form.tipo_alocacao) { toast.error('Selecione pelo menos um tipo de contratação'); return; }
    if (!form.mod_presencial && !form.mod_hibrido && !form.mod_remoto) { toast.error('Selecione pelo menos uma modalidade'); return; }
    if ((form.mod_presencial || form.mod_hibrido) && !form.endereco_local_trabalho.trim()) { toast.error('Endereço é obrigatório para modalidade presencial/híbrida'); return; }

    const vaga: Vaga = {
      id: store.nextVagaId(), status: 'EM_VALIDACAO_RH',
      proprietario_user_id: store.currentUser.id, recrutador_user_id: null,
      data_criacao: new Date().toISOString().split('T')[0], data_validacao_rh: null,
      data_ultima_alteracao: new Date().toISOString().split('T')[0],
      historico_status: [{ status: 'EM_VALIDACAO_RH', alterado_por: store.currentUser.id, data: new Date().toISOString().split('T')[0] }],
      data_solicitacao: form.data_solicitacao, nome_solicitante: form.nome_solicitante,
      area_solicitante: form.area_solicitante, nome_cliente: form.nome_cliente,
      motivo_abertura_vaga: form.motivo_abertura_vaga, quantidade_de_vagas: form.quantidade_de_vagas,
      funcao: form.funcao, faixa_salarial: form.faixa_salarial,
      tipo_contratacao: { pj: form.tipo_pj, clt: form.tipo_clt, alocacao: form.tipo_alocacao },
      tempo_de_contrato: form.tempo_de_contrato, horario_trabalho: form.horario_trabalho,
      quantidade_horas_mes: form.quantidade_horas_mes,
      modalidade_contratacao: { presencial: form.mod_presencial, hibrido: form.mod_hibrido, remoto: form.mod_remoto },
      endereco_local_trabalho: form.endereco_local_trabalho,
      hibrido_dias_presencial: form.mod_hibrido ? form.hibrido_dias_presencial : null,
      data_prevista_inicio: form.data_prevista_inicio,
      principais_responsabilidades: form.principais_responsabilidades,
      requisitos_tecnicos: form.requisitos_tecnicos, nivel_senioridade: form.nivel_senioridade,
      formacao: form.formacao, certificacoes: form.certificacoes,
      linguagens_e_frameworks_necessarios: form.linguagens_e_frameworks_necessarios,
      soft_skills: form.soft_skills, necessario_equipamento: form.necessario_equipamento,
      idioma_ingles: form.idioma_ingles, idioma_espanhol: form.idioma_espanhol,
      observacoes: form.observacoes, unidade_negocio: form.unidade_negocio, categoria: form.categoria,
      tags: [],
    };

    store.addVaga(vaga);
    toast.success('Vaga criada com sucesso!');
    navigate(`/vagas/${vaga.id}`);
  };

  return (
    <div className="page-container animate-fade-in max-w-4xl">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Solicitante */}
        <Card>
          <CardHeader><CardTitle className="text-base">Solicitante</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div><Label>Data Solicitação</Label><Input type="date" value={form.data_solicitacao} onChange={e => set('data_solicitacao', e.target.value)} /></div>
            <div><Label>Solicitante</Label><Input value={form.nome_solicitante} onChange={e => set('nome_solicitante', e.target.value)} /></div>
            <div><Label>Área</Label><Input value={form.area_solicitante} onChange={e => set('area_solicitante', e.target.value)} /></div>
          </CardContent>
        </Card>

        {/* Cliente e Vaga */}
        <Card>
          <CardHeader><CardTitle className="text-base">Cliente e Vaga</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Cliente *</Label>
              <Select value={form.nome_cliente} onValueChange={v => set('nome_cliente', v)}>
                <SelectTrigger><SelectValue placeholder="Selecione o cliente" /></SelectTrigger>
                <SelectContent>{store.clientes.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div><Label>Função *</Label><Input value={form.funcao} onChange={e => set('funcao', e.target.value)} placeholder="Ex: Desenvolvedor Full Stack" /></div>
            <div><Label>Quantidade de Vagas *</Label><Input type="number" min={1} value={form.quantidade_de_vagas} onChange={e => set('quantidade_de_vagas', parseInt(e.target.value) || 1)} /></div>
            <div><Label>Faixa Salarial</Label><Input value={form.faixa_salarial} onChange={e => set('faixa_salarial', e.target.value)} placeholder="R$ 10.000 - R$ 15.000" /></div>
            <div><Label>Motivo Abertura</Label><Input value={form.motivo_abertura_vaga} onChange={e => set('motivo_abertura_vaga', e.target.value)} /></div>
            <div>
              <Label>Unidade de Negócio</Label>
              <Select value={form.unidade_negocio} onValueChange={v => set('unidade_negocio', v)}>
                <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                <SelectContent>{store.unidadesNegocio.map(u => <SelectItem key={u} value={u}>{u}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <Label>Categoria</Label>
              <Select value={form.categoria} onValueChange={v => set('categoria', v)}>
                <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                <SelectContent>{store.categorias.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Contratação */}
        <Card>
          <CardHeader><CardTitle className="text-base">Contratação e Modalidade</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="mb-2 block">Tipo de Contratação *</Label>
              <div className="flex gap-6">
                {(['tipo_clt', 'tipo_pj', 'tipo_alocacao'] as const).map(key => (
                  <label key={key} className="flex items-center gap-2 text-sm">
                    <Checkbox checked={form[key]} onCheckedChange={v => set(key, v)} />{key.replace('tipo_', '').toUpperCase()}
                  </label>
                ))}
              </div>
            </div>
            <div>
              <Label className="mb-2 block">Modalidade *</Label>
              <div className="flex gap-6">
                {[['mod_presencial', 'Presencial'], ['mod_hibrido', 'Híbrido'], ['mod_remoto', 'Remoto']].map(([key, label]) => (
                  <label key={key} className="flex items-center gap-2 text-sm">
                    <Checkbox checked={(form as any)[key]} onCheckedChange={v => set(key, v)} />{label}
                  </label>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><Label>Horário de Trabalho</Label><Input value={form.horario_trabalho} onChange={e => set('horario_trabalho', e.target.value)} /></div>
              <div><Label>Horas/Mês</Label><Input type="number" value={form.quantidade_horas_mes} onChange={e => set('quantidade_horas_mes', parseInt(e.target.value) || 0)} /></div>
              <div><Label>Endereço {(form.mod_presencial || form.mod_hibrido) ? '*' : ''}</Label><Input value={form.endereco_local_trabalho} onChange={e => set('endereco_local_trabalho', e.target.value)} /></div>
              {form.mod_hibrido && <div><Label>Dias Presenciais *</Label><Input type="number" min={1} max={5} value={form.hibrido_dias_presencial} onChange={e => set('hibrido_dias_presencial', parseInt(e.target.value) || 1)} /></div>}
              <div><Label>Data Prevista Início</Label><Input type="date" value={form.data_prevista_inicio} onChange={e => set('data_prevista_inicio', e.target.value)} /></div>
              <div><Label>Tempo de Contrato</Label><Input value={form.tempo_de_contrato} onChange={e => set('tempo_de_contrato', e.target.value)} placeholder="Indeterminado" /></div>
            </div>
          </CardContent>
        </Card>

        {/* Requisitos */}
        <Card>
          <CardHeader><CardTitle className="text-base">Requisitos e Senioridade</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div><Label>Principais Responsabilidades</Label><Textarea value={form.principais_responsabilidades} onChange={e => set('principais_responsabilidades', e.target.value)} rows={3} /></div>
            <div><Label>Requisitos Técnicos</Label><Textarea value={form.requisitos_tecnicos} onChange={e => set('requisitos_tecnicos', e.target.value)} rows={3} /></div>
            <div><Label>Linguagens e Frameworks</Label><Input value={form.linguagens_e_frameworks_necessarios} onChange={e => set('linguagens_e_frameworks_necessarios', e.target.value)} /></div>
            <div>
              <Label className="mb-2 block">Senioridade</Label>
              <RadioGroup value={form.nivel_senioridade} onValueChange={v => set('nivel_senioridade', v)} className="flex flex-wrap gap-4">
                {['Júnior', 'Pleno', 'Sênior', 'Especialista', 'Líder Técnico'].map(n => (
                  <label key={n} className="flex items-center gap-2 text-sm"><RadioGroupItem value={n} />{n}</label>
                ))}
              </RadioGroup>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><Label>Formação</Label><Input value={form.formacao} onChange={e => set('formacao', e.target.value)} /></div>
              <div><Label>Certificações</Label><Input value={form.certificacoes} onChange={e => set('certificacoes', e.target.value)} /></div>
              <div><Label>Soft Skills</Label><Input value={form.soft_skills} onChange={e => set('soft_skills', e.target.value)} /></div>
              <div className="flex items-center gap-2">
                <Checkbox checked={form.necessario_equipamento} onCheckedChange={v => set('necessario_equipamento', v)} />
                <Label>Necessário Equipamento</Label>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Idiomas */}
        <Card>
          <CardHeader><CardTitle className="text-base">Idiomas e Observações</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Inglês</Label>
                <Select value={form.idioma_ingles} onValueChange={v => set('idioma_ingles', v)}>
                  <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="nenhum">Não necessário</SelectItem>
                    <SelectItem value="Básico">Básico</SelectItem>
                    <SelectItem value="Intermediário">Intermediário</SelectItem>
                    <SelectItem value="Avançado">Avançado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Espanhol</Label>
                <Select value={form.idioma_espanhol} onValueChange={v => set('idioma_espanhol', v)}>
                  <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="nenhum">Não necessário</SelectItem>
                    <SelectItem value="Básico">Básico</SelectItem>
                    <SelectItem value="Intermediário">Intermediário</SelectItem>
                    <SelectItem value="Avançado">Avançado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div><Label>Observações</Label><Textarea value={form.observacoes} onChange={e => set('observacoes', e.target.value)} rows={3} /></div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={() => navigate('/vagas')}>Cancelar</Button>
          <Button type="submit">Criar Vaga</Button>
        </div>
      </form>
    </div>
  );
}
