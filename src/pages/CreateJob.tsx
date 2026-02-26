import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAppStore } from "@/data/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function CreateJob() {
  const navigate = useNavigate();
  const store = useAppStore();
  const [submitting, setSubmitting] = useState(false);
  const [areas, setAreas] = useState<{ id: string; codigo: string; nome: string }[]>([]);
  const [funcoes, setFuncoes] = useState<{ id: string; codigo: string; nome: string }[]>([]);
  const [unidades, setUnidades] = useState<{ id: string; nome: string }[]>([]);
  const [categorias, setCategorias] = useState<{ id: string; nome: string }[]>([]);
  const [clientes, setClientes] = useState<{ id: string; nome: string }[]>([]);
  const [motivos, setMotivos] = useState<{ id: string; nome: string }[]>([]);

  useEffect(() => {
    supabase
      .from("areas")
      .select("id, codigo, nome")
      .eq("ativo", true)
      .order("codigo")
      .then(({ data }) => {
        if (data) setAreas(data as any);
      });
    supabase
      .from("funcoes")
      .select("id, codigo, nome")
      .eq("ativo", true)
      .order("codigo")
      .then(({ data }) => {
        if (data) setFuncoes(data as any);
      });
    supabase
      .from("unidades_negocio")
      .select("id, nome")
      .eq("ativo", true)
      .order("nome")
      .then(({ data }) => {
        if (data) setUnidades(data as any);
      });
    supabase
      .from("categorias")
      .select("id, nome")
      .eq("ativo", true)
      .order("nome")
      .then(({ data }) => {
        if (data) setCategorias(data as any);
      });
    supabase
      .from("clientes")
      .select("id, nome")
      .eq("ativo", true)
      .order("nome")
      .then(({ data }) => {
        if (data) setClientes(data as any);
      });
    supabase
      .from("motivos_abertura")
      .select("id, nome")
      .eq("ativo", true)
      .order("nome")
      .then(({ data }) => {
        if (data) setMotivos(data as any);
      });
  }, []);

  const [form, setForm] = useState({
    nome_cliente: "",
    funcao: "",
    quantidade_de_vagas: 1,
    faixa_salarial: "",
    motivo_abertura_vaga: "",
    data_solicitacao: new Date().toISOString().split("T")[0],
    nome_solicitante: store.currentUser?.nome || "",
    area_solicitante: store.currentUser?.area || "",
    tipo_clt: false,
    tipo_pj: false,
    tipo_alocacao: false,
    tempo_de_contrato: "",
    horario_trabalho: "09:00 - 18:00",
    quantidade_horas_mes: 168,
    mod_presencial: false,
    mod_hibrido: false,
    mod_remoto: false,
    endereco_local_trabalho: "",
    hibrido_dias_presencial: 3,
    data_prevista_inicio: "",
    principais_responsabilidades: "",
    requisitos_tecnicos: "",
    nivel_senioridade: "PLENO",
    formacao: "",
    certificacoes: "",
    linguagens_e_frameworks_necessarios: "",
    soft_skills: "",
    necessario_equipamento: false,
    idioma_ingles: "",
    idioma_espanhol: "",
    observacoes: "",
    unidade_negocio: "",
    categoria: "",
  });

  const set = (key: string, val: any) => setForm((p) => ({ ...p, [key]: val }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nome_cliente.trim()) {
      toast.error("Cliente é obrigatório");
      return;
    }
    if (!form.funcao.trim()) {
      toast.error("Função é obrigatória");
      return;
    }
    if (!form.quantidade_de_vagas) {
      toast.error("Quantidade de vagas é obrigatória");
      return;
    }
    if (!form.tipo_clt && !form.tipo_pj && !form.tipo_alocacao) {
      toast.error("Selecione pelo menos um tipo de contratação");
      return;
    }
    if (!form.mod_presencial && !form.mod_hibrido && !form.mod_remoto) {
      toast.error("Selecione pelo menos uma modalidade");
      return;
    }
    if ((form.mod_presencial || form.mod_hibrido) && !form.endereco_local_trabalho.trim()) {
      toast.error("Endereço é obrigatório para modalidade presencial/híbrida");
      return;
    }

    // Resolve dimension IDs
    const clienteId = clientes.find((c) => c.nome === form.nome_cliente)?.id || null;
    const unidadeId = unidades.find((u) => u.nome === form.unidade_negocio)?.id || null;
    const categoriaId = categorias.find((c) => c.nome === form.categoria)?.id || null;

    const tipo = form.tipo_clt ? "CLT" : form.tipo_pj ? "PJ" : "ALOCACAO";
    const modalidade = form.mod_presencial ? "PRESENCIAL" : form.mod_hibrido ? "HIBRIDO" : "REMOTO";

    setSubmitting(true);
    const vagaId = await store.addVaga({
      status: "EM_VALIDACAO_RH",
      proprietario_user_id: store.currentUser!.id,
      data_criacao: new Date().toISOString().split("T")[0],
      data_ultima_alteracao: new Date().toISOString().split("T")[0],
      data_solicitacao: form.data_solicitacao || null,
      nome_solicitante: form.nome_solicitante,
      area_solicitante: form.area_solicitante,
      nome_cliente: form.nome_cliente,
      motivo_abertura_vaga: form.motivo_abertura_vaga,
      quantidade_de_vagas: form.quantidade_de_vagas,
      funcao: form.funcao,
      faixa_salarial: form.faixa_salarial,
      tipo_contratacao: tipo,
      tempo_de_contrato: form.tempo_de_contrato,
      horario_trabalho: form.horario_trabalho,
      quantidade_horas_mes: form.quantidade_horas_mes,
      modalidade,
      endereco_local_trabalho: form.endereco_local_trabalho,
      hibrido_dias_presencial: form.mod_hibrido ? form.hibrido_dias_presencial : null,
      data_prevista_inicio: form.data_prevista_inicio || null,
      principais_responsabilidades: form.principais_responsabilidades,
      requisitos_tecnicos: form.requisitos_tecnicos,
      nivel_senioridade: form.nivel_senioridade,
      formacao: form.formacao,
      certificacoes: form.certificacoes,
      linguagens_e_frameworks_necessarios: form.linguagens_e_frameworks_necessarios,
      soft_skills: form.soft_skills,
      necessario_equipamento: form.necessario_equipamento,
      ingles_nivel: form.idioma_ingles || null,
      espanhol_nivel: form.idioma_espanhol || null,
      observacoes: form.observacoes,
      cliente_id: clienteId,
      unidade_id: unidadeId,
      categoria_id: categoriaId,
    });
    setSubmitting(false);

    if (vagaId) {
      toast.success("Vaga criada com sucesso!");
      navigate(`/vagas/${vagaId}`);
    }
  };

  return (
    <div className="page-container animate-fade-in max-w-4xl">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Solicitante */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Solicitante</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>Data Solicitação</Label>
              <Input
                type="date"
                value={form.data_solicitacao}
                onChange={(e) => set("data_solicitacao", e.target.value)}
              />
            </div>
            <div>
              <Label>Solicitante</Label>
              <Input value={form.nome_solicitante} onChange={(e) => set("nome_solicitante", e.target.value)} />
            </div>
            <div>
              <Label>Área</Label>
              <Select value={form.area_solicitante} onValueChange={(v) => set("area_solicitante", v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a área" />
                </SelectTrigger>
                <SelectContent className="bg-popover z-50">
                  {areas.map((a) => (
                    <SelectItem key={a.id} value={a.nome}>
                      {a.codigo} - {a.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Cliente e Vaga */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Cliente e Vaga</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Cliente *</Label>
              <Select value={form.nome_cliente} onValueChange={(v) => set("nome_cliente", v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o cliente" />
                </SelectTrigger>
                <SelectContent>
                  {clientes.map((c) => (
                    <SelectItem key={c.id} value={c.nome}>
                      {c.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Função *</Label>
              <Select value={form.funcao} onValueChange={(v) => set("funcao", v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a função" />
                </SelectTrigger>
                <SelectContent className="bg-popover z-50">
                  {funcoes.map((f) => (
                    <SelectItem key={f.id} value={f.nome}>
                      {f.codigo} - {f.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Quantidade de Vagas *</Label>
              <Input
                type="number"
                min={1}
                value={form.quantidade_de_vagas}
                onChange={(e) => set("quantidade_de_vagas", parseInt(e.target.value) || 1)}
              />
            </div>
            <div>
              <Label>Faixa Salarial Candidato</Label>
              <Input
                value={form.faixa_salarial}
                onChange={(e) => set("faixa_salarial", e.target.value)}
                placeholder="R$ 10.000 - R$ 15.000"
              />
            </div>
            <div>
              <Label>Motivo Abertura</Label>
              <Select value={form.motivo_abertura_vaga} onValueChange={(v) => set("motivo_abertura_vaga", v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o motivo" />
                </SelectTrigger>
                <SelectContent className="bg-popover z-50">
                  {motivos.map((m) => (
                    <SelectItem key={m.id} value={m.nome}>
                      {m.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Unidade de Negócio</Label>
              <Select value={form.unidade_negocio} onValueChange={(v) => set("unidade_negocio", v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {unidades.map((u) => (
                    <SelectItem key={u.id} value={u.nome}>
                      {u.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Categoria</Label>
              <Select value={form.categoria} onValueChange={(v) => set("categoria", v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {categorias.map((c) => (
                    <SelectItem key={c.id} value={c.nome}>
                      {c.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Contratação */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Contratação e Modalidade</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="mb-2 block">Tipo de Contratação *</Label>
              <div className="flex gap-6">
                {(["tipo_clt", "tipo_pj", "tipo_alocacao"] as const).map((key) => (
                  <label key={key} className="flex items-center gap-2 text-sm">
                    <Checkbox checked={form[key]} onCheckedChange={(v) => set(key, v)} />
                    {key.replace("tipo_", "").toUpperCase()}
                  </label>
                ))}
              </div>
            </div>
            <div>
              <Label className="mb-2 block">Modalidade *</Label>
              <div className="flex gap-6">
                {[
                  ["mod_presencial", "Presencial"],
                  ["mod_hibrido", "Híbrido"],
                  ["mod_remoto", "Remoto"],
                ].map(([key, label]) => (
                  <label key={key} className="flex items-center gap-2 text-sm">
                    <Checkbox checked={(form as any)[key]} onCheckedChange={(v) => set(key, v)} />
                    {label}
                  </label>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Horário de Trabalho</Label>
                <Input value={form.horario_trabalho} onChange={(e) => set("horario_trabalho", e.target.value)} />
              </div>
              <div>
                <Label>Horas/Mês</Label>
                <Input
                  type="number"
                  value={form.quantidade_horas_mes}
                  onChange={(e) => set("quantidade_horas_mes", parseInt(e.target.value) || 0)}
                />
              </div>
              <div>
                <Label>Endereço {form.mod_presencial || form.mod_hibrido ? "*" : ""}</Label>
                <Input
                  value={form.endereco_local_trabalho}
                  onChange={(e) => set("endereco_local_trabalho", e.target.value)}
                />
              </div>
              {form.mod_hibrido && (
                <div>
                  <Label>Dias Presenciais *</Label>
                  <Input
                    type="number"
                    min={1}
                    max={5}
                    value={form.hibrido_dias_presencial}
                    onChange={(e) => set("hibrido_dias_presencial", parseInt(e.target.value) || 1)}
                  />
                </div>
              )}
              <div>
                <Label>Data Prevista Início</Label>
                <Input
                  type="date"
                  value={form.data_prevista_inicio}
                  onChange={(e) => set("data_prevista_inicio", e.target.value)}
                />
              </div>
              <div>
                <Label>Tempo de Contrato</Label>
                <Input
                  value={form.tempo_de_contrato}
                  onChange={(e) => set("tempo_de_contrato", e.target.value)}
                  placeholder="Indeterminado"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Requisitos */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Requisitos e Senioridade</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Principais Responsabilidades</Label>
              <Textarea
                value={form.principais_responsabilidades}
                onChange={(e) => set("principais_responsabilidades", e.target.value)}
                rows={3}
              />
            </div>
            <div>
              <Label>Requisitos Técnicos</Label>
              <Textarea
                value={form.requisitos_tecnicos}
                onChange={(e) => set("requisitos_tecnicos", e.target.value)}
                rows={3}
              />
            </div>
            <div>
              <Label>Linguagens e Frameworks</Label>
              <Input
                value={form.linguagens_e_frameworks_necessarios}
                onChange={(e) => set("linguagens_e_frameworks_necessarios", e.target.value)}
              />
            </div>
            <div>
              <Label className="mb-2 block">Senioridade</Label>
              <RadioGroup
                value={form.nivel_senioridade}
                onValueChange={(v) => set("nivel_senioridade", v)}
                className="flex flex-wrap gap-4"
              >
                {[
                  ["JUNIOR", "Júnior"],
                  ["PLENO", "Pleno"],
                  ["SENIOR", "Sênior"],
                  ["ESPECIALISTA", "Especialista"],
                  ["LIDER_TECNICO", "Líder Técnico"],
                ].map(([val, label]) => (
                  <label key={val} className="flex items-center gap-2 text-sm">
                    <RadioGroupItem value={val} />
                    {label}
                  </label>
                ))}
              </RadioGroup>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Formação</Label>
                <Input value={form.formacao} onChange={(e) => set("formacao", e.target.value)} />
              </div>
              <div>
                <Label>Certificações</Label>
                <Input value={form.certificacoes} onChange={(e) => set("certificacoes", e.target.value)} />
              </div>
              <div>
                <Label>Soft Skills</Label>
                <Input value={form.soft_skills} onChange={(e) => set("soft_skills", e.target.value)} />
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={form.necessario_equipamento}
                  onCheckedChange={(v) => set("necessario_equipamento", v)}
                />
                <Label>Necessário Equipamento</Label>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Idiomas */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Idiomas e Observações</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Inglês</Label>
                <Select value={form.idioma_ingles} onValueChange={(v) => set("idioma_ingles", v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="nenhum">Não necessário</SelectItem>
                    <SelectItem value="BASICO">Básico</SelectItem>
                    <SelectItem value="INTERMEDIARIO">Intermediário</SelectItem>
                    <SelectItem value="AVANCADO">Avançado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Espanhol</Label>
                <Select value={form.idioma_espanhol} onValueChange={(v) => set("idioma_espanhol", v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="nenhum">Não necessário</SelectItem>
                    <SelectItem value="BASICO">Básico</SelectItem>
                    <SelectItem value="INTERMEDIARIO">Intermediário</SelectItem>
                    <SelectItem value="AVANCADO">Avançado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label>Observações</Label>
              <Textarea value={form.observacoes} onChange={(e) => set("observacoes", e.target.value)} rows={3} />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={() => navigate("/vagas")}>
            Cancelar
          </Button>
          <Button type="submit" disabled={submitting}>
            {submitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Criar Vaga
          </Button>
        </div>
      </form>
    </div>
  );
}
