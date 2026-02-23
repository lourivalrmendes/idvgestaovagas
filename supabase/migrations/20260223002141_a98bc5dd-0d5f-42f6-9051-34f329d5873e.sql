
-- =============================================
-- ENUM: app_role
-- =============================================
CREATE TYPE public.app_role AS ENUM ('ADMIN', 'COORDENADOR_RH', 'RECRUTADOR', 'COMERCIAL');

-- =============================================
-- FUNCTION: updated_at trigger
-- =============================================
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- =============================================
-- TABLE: profiles
-- =============================================
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nome TEXT NOT NULL DEFAULT '',
  area TEXT DEFAULT '',
  email TEXT DEFAULT '',
  telefone TEXT DEFAULT '',
  ativo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =============================================
-- TABLE: user_roles (separate for security)
-- =============================================
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  UNIQUE(user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- =============================================
-- SECURITY DEFINER FUNCTIONS for role checks
-- =============================================
CREATE OR REPLACE FUNCTION public.get_user_role(_user_id UUID)
RETURNS app_role
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM public.user_roles WHERE user_id = _user_id LIMIT 1;
$$;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  );
$$;

CREATE OR REPLACE FUNCTION public.is_admin(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_role(_user_id, 'ADMIN');
$$;

CREATE OR REPLACE FUNCTION public.is_coord_rh(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_role(_user_id, 'COORDENADOR_RH');
$$;

CREATE OR REPLACE FUNCTION public.is_recrutador(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_role(_user_id, 'RECRUTADOR');
$$;

CREATE OR REPLACE FUNCTION public.is_comercial(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_role(_user_id, 'COMERCIAL');
$$;

-- =============================================
-- TRIGGER: auto-create profile on signup
-- =============================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, nome, email)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'nome', NEW.email), NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =============================================
-- TABLE: settings
-- =============================================
CREATE TABLE public.settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sla_dias_uteis INT NOT NULL DEFAULT 5,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER update_settings_updated_at BEFORE UPDATE ON public.settings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Seed 1 row
INSERT INTO public.settings (sla_dias_uteis) VALUES (5);

-- =============================================
-- TABLE: clientes
-- =============================================
CREATE TABLE public.clientes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL UNIQUE,
  ativo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.clientes ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER update_clientes_updated_at BEFORE UPDATE ON public.clientes FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =============================================
-- TABLE: unidades_negocio
-- =============================================
CREATE TABLE public.unidades_negocio (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL UNIQUE,
  ativo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.unidades_negocio ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER update_unidades_updated_at BEFORE UPDATE ON public.unidades_negocio FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =============================================
-- TABLE: categorias
-- =============================================
CREATE TABLE public.categorias (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL UNIQUE,
  ativo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.categorias ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER update_categorias_updated_at BEFORE UPDATE ON public.categorias FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Seed dimension data
INSERT INTO public.clientes (nome) VALUES ('Itaú Digital'), ('Ambev Tech'), ('Magazine Luiza'), ('Nubank'), ('Stone Pagamentos');
INSERT INTO public.unidades_negocio (nome) VALUES ('Enterprise'), ('Mid-Market'), ('Startups');
INSERT INTO public.categorias (nome) VALUES ('Tecnologia'), ('Engenharia de Dados'), ('Produto'), ('Design'), ('DevOps');

-- =============================================
-- SEQUENCE for vaga codigo
-- =============================================
CREATE SEQUENCE public.vaga_codigo_seq START WITH 1;

-- =============================================
-- TABLE: vagas
-- =============================================
CREATE TABLE public.vagas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  codigo TEXT UNIQUE,
  status TEXT NOT NULL DEFAULT 'EM_VALIDACAO_RH',
  proprietario_user_id UUID NOT NULL REFERENCES public.profiles(id),
  recrutador_user_id UUID REFERENCES public.profiles(id),
  data_criacao DATE NOT NULL DEFAULT CURRENT_DATE,
  data_validacao_rh DATE,
  data_ultima_alteracao DATE NOT NULL DEFAULT CURRENT_DATE,
  motivo_reprovacao_rh TEXT,
  -- Formulário
  data_solicitacao DATE,
  nome_solicitante TEXT DEFAULT '',
  area_solicitante TEXT DEFAULT '',
  nome_cliente TEXT DEFAULT '',
  motivo_abertura_vaga TEXT DEFAULT '',
  quantidade_de_vagas INT DEFAULT 1,
  funcao TEXT NOT NULL DEFAULT '',
  faixa_salarial TEXT DEFAULT '',
  tipo_contratacao TEXT DEFAULT 'CLT',
  tempo_de_contrato TEXT DEFAULT '',
  horario_trabalho TEXT DEFAULT '09:00 - 18:00',
  quantidade_horas_mes INT,
  modalidade TEXT DEFAULT 'PRESENCIAL',
  endereco_local_trabalho TEXT DEFAULT '',
  hibrido_dias_presencial INT,
  data_prevista_inicio DATE,
  principais_responsabilidades TEXT DEFAULT '',
  requisitos_tecnicos TEXT DEFAULT '',
  nivel_senioridade TEXT DEFAULT 'PLENO',
  formacao TEXT DEFAULT '',
  certificacoes TEXT DEFAULT '',
  linguagens_e_frameworks_necessarios TEXT DEFAULT '',
  soft_skills TEXT DEFAULT '',
  necessario_equipamento BOOLEAN DEFAULT false,
  ingles_nivel TEXT,
  espanhol_nivel TEXT,
  observacoes TEXT DEFAULT '',
  -- Dimensional FKs
  cliente_id UUID REFERENCES public.clientes(id),
  unidade_id UUID REFERENCES public.unidades_negocio(id),
  categoria_id UUID REFERENCES public.categorias(id),
  -- Audit
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.vagas ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER update_vagas_updated_at BEFORE UPDATE ON public.vagas FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Indexes
CREATE INDEX idx_vagas_status ON public.vagas(status);
CREATE INDEX idx_vagas_proprietario ON public.vagas(proprietario_user_id);
CREATE INDEX idx_vagas_recrutador ON public.vagas(recrutador_user_id);
CREATE INDEX idx_vagas_cliente_id ON public.vagas(cliente_id);
CREATE INDEX idx_vagas_unidade_id ON public.vagas(unidade_id);
CREATE INDEX idx_vagas_categoria_id ON public.vagas(categoria_id);
CREATE INDEX idx_vagas_data_criacao ON public.vagas(data_criacao);
CREATE INDEX idx_vagas_data_validacao ON public.vagas(data_validacao_rh);

-- TRIGGER: auto-generate codigo VAG-XXXX
CREATE OR REPLACE FUNCTION public.generate_vaga_codigo()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.codigo IS NULL THEN
    NEW.codigo := 'VAG-' || LPAD(nextval('public.vaga_codigo_seq')::TEXT, 4, '0');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER trg_vaga_codigo
  BEFORE INSERT ON public.vagas
  FOR EACH ROW EXECUTE FUNCTION public.generate_vaga_codigo();

-- =============================================
-- TABLE: candidatos
-- =============================================
CREATE TABLE public.candidatos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  cidade TEXT DEFAULT '',
  estado TEXT DEFAULT '',
  telefone_celular TEXT DEFAULT '',
  telefone_outro TEXT DEFAULT '',
  email TEXT DEFAULT '',
  linkedin TEXT DEFAULT '',
  ultimo_cv_nome TEXT,
  ultimo_cv_tipo TEXT,
  created_by_user_id UUID NOT NULL REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.candidatos ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER update_candidatos_updated_at BEFORE UPDATE ON public.candidatos FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =============================================
-- TABLE: envios
-- =============================================
CREATE TABLE public.envios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vaga_id UUID NOT NULL REFERENCES public.vagas(id) ON DELETE CASCADE,
  candidato_id UUID NOT NULL REFERENCES public.candidatos(id) ON DELETE CASCADE,
  data_envio DATE NOT NULL DEFAULT CURRENT_DATE,
  status_candidato_na_vaga TEXT NOT NULL DEFAULT 'EM_ENTREVISTA',
  observacoes TEXT DEFAULT '',
  created_by_user_id UUID NOT NULL REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(vaga_id, candidato_id)
);
ALTER TABLE public.envios ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER update_envios_updated_at BEFORE UPDATE ON public.envios FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =============================================
-- TABLE: vaga_status_historico
-- =============================================
CREATE TABLE public.vaga_status_historico (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vaga_id UUID NOT NULL REFERENCES public.vagas(id) ON DELETE CASCADE,
  status_anterior TEXT,
  status_novo TEXT NOT NULL,
  alterado_por UUID REFERENCES public.profiles(id),
  observacao TEXT,
  criado_em TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.vaga_status_historico ENABLE ROW LEVEL SECURITY;
CREATE INDEX idx_historico_vaga ON public.vaga_status_historico(vaga_id);

-- =============================================
-- TRIGGER: on vaga insert -> create history entry
-- =============================================
CREATE OR REPLACE FUNCTION public.trg_vaga_insert_historico()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.vaga_status_historico (vaga_id, status_anterior, status_novo, alterado_por)
  VALUES (NEW.id, NULL, NEW.status, NEW.proprietario_user_id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER trg_vaga_after_insert
  AFTER INSERT ON public.vagas
  FOR EACH ROW EXECUTE FUNCTION public.trg_vaga_insert_historico();

-- =============================================
-- TRIGGER: on vaga status update -> create history entry
-- =============================================
CREATE OR REPLACE FUNCTION public.trg_vaga_status_change()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO public.vaga_status_historico (vaga_id, status_anterior, status_novo, alterado_por)
    VALUES (NEW.id, OLD.status, NEW.status, auth.uid());
    NEW.data_ultima_alteracao = CURRENT_DATE;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER trg_vaga_before_update_status
  BEFORE UPDATE ON public.vagas
  FOR EACH ROW EXECUTE FUNCTION public.trg_vaga_status_change();

-- =============================================
-- RLS POLICIES
-- =============================================

-- ---- profiles ----
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT TO authenticated USING (id = auth.uid());
CREATE POLICY "Admin/Coord can view all profiles" ON public.profiles FOR SELECT TO authenticated USING (public.is_admin(auth.uid()) OR public.is_coord_rh(auth.uid()));
CREATE POLICY "Users can update own profile basics" ON public.profiles FOR UPDATE TO authenticated USING (id = auth.uid()) WITH CHECK (id = auth.uid());
CREATE POLICY "Admin can insert profiles" ON public.profiles FOR INSERT TO authenticated WITH CHECK (public.is_admin(auth.uid()));
-- Allow trigger to insert profiles
CREATE POLICY "Service role can insert profiles" ON public.profiles FOR INSERT TO service_role WITH CHECK (true);
-- Recrutadores and Comercial need to see other profiles for dropdowns
CREATE POLICY "Authenticated can view all profiles" ON public.profiles FOR SELECT TO authenticated USING (true);

-- ---- user_roles ----
CREATE POLICY "Users can view own role" ON public.user_roles FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Admin can manage roles" ON public.user_roles FOR ALL TO authenticated USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));
CREATE POLICY "Coord can view all roles" ON public.user_roles FOR SELECT TO authenticated USING (public.is_admin(auth.uid()) OR public.is_coord_rh(auth.uid()));
-- All authenticated can read roles (needed for UI)
CREATE POLICY "Authenticated can view roles" ON public.user_roles FOR SELECT TO authenticated USING (true);

-- ---- settings ----
CREATE POLICY "Authenticated can read settings" ON public.settings FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admin/Coord can update settings" ON public.settings FOR UPDATE TO authenticated USING (public.is_admin(auth.uid()) OR public.is_coord_rh(auth.uid()));

-- ---- clientes ----
CREATE POLICY "Authenticated can read clientes" ON public.clientes FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admin can manage clientes" ON public.clientes FOR ALL TO authenticated USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

-- ---- unidades_negocio ----
CREATE POLICY "Authenticated can read unidades" ON public.unidades_negocio FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admin can manage unidades" ON public.unidades_negocio FOR ALL TO authenticated USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

-- ---- categorias ----
CREATE POLICY "Authenticated can read categorias" ON public.categorias FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admin can manage categorias" ON public.categorias FOR ALL TO authenticated USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

-- ---- vagas ----
-- SELECT
CREATE POLICY "Admin/Coord see all vagas" ON public.vagas FOR SELECT TO authenticated USING (public.is_admin(auth.uid()) OR public.is_coord_rh(auth.uid()));
CREATE POLICY "Recrutador sees assigned vagas" ON public.vagas FOR SELECT TO authenticated USING (public.is_recrutador(auth.uid()) AND recrutador_user_id = auth.uid());
CREATE POLICY "Comercial sees own vagas" ON public.vagas FOR SELECT TO authenticated USING (public.is_comercial(auth.uid()) AND proprietario_user_id = auth.uid());
-- INSERT
CREATE POLICY "Comercial/Admin can create vagas" ON public.vagas FOR INSERT TO authenticated WITH CHECK (
  (public.is_comercial(auth.uid()) OR public.is_admin(auth.uid())) AND proprietario_user_id = auth.uid()
);
-- UPDATE
CREATE POLICY "Admin can update any vaga" ON public.vagas FOR UPDATE TO authenticated USING (public.is_admin(auth.uid()));
CREATE POLICY "Coord can update any vaga" ON public.vagas FOR UPDATE TO authenticated USING (public.is_coord_rh(auth.uid()));
CREATE POLICY "Recrutador updates assigned vagas" ON public.vagas FOR UPDATE TO authenticated USING (public.is_recrutador(auth.uid()) AND recrutador_user_id = auth.uid());
CREATE POLICY "Comercial updates own vagas in validation" ON public.vagas FOR UPDATE TO authenticated USING (
  public.is_comercial(auth.uid()) AND proprietario_user_id = auth.uid() AND (status = 'EM_VALIDACAO_RH' OR status = 'VAGA_REPROVADA')
);
-- DELETE
CREATE POLICY "Admin can delete any vaga" ON public.vagas FOR DELETE TO authenticated USING (public.is_admin(auth.uid()));
CREATE POLICY "Comercial deletes own in validation" ON public.vagas FOR DELETE TO authenticated USING (
  public.is_comercial(auth.uid()) AND proprietario_user_id = auth.uid() AND status = 'EM_VALIDACAO_RH'
);

-- ---- candidatos ----
CREATE POLICY "Admin/Coord/Recrutador see all candidatos" ON public.candidatos FOR SELECT TO authenticated USING (
  public.is_admin(auth.uid()) OR public.is_coord_rh(auth.uid()) OR public.is_recrutador(auth.uid())
);
CREATE POLICY "Comercial sees candidatos in own vagas" ON public.candidatos FOR SELECT TO authenticated USING (
  public.is_comercial(auth.uid()) AND EXISTS (
    SELECT 1 FROM public.envios e JOIN public.vagas v ON e.vaga_id = v.id WHERE e.candidato_id = candidatos.id AND v.proprietario_user_id = auth.uid()
  )
);
CREATE POLICY "Recrutador/Coord/Admin can create candidatos" ON public.candidatos FOR INSERT TO authenticated WITH CHECK (
  (public.is_recrutador(auth.uid()) OR public.is_coord_rh(auth.uid()) OR public.is_admin(auth.uid())) AND created_by_user_id = auth.uid()
);
CREATE POLICY "Admin/Coord can update any candidato" ON public.candidatos FOR UPDATE TO authenticated USING (public.is_admin(auth.uid()) OR public.is_coord_rh(auth.uid()));
CREATE POLICY "Recrutador updates own candidatos" ON public.candidatos FOR UPDATE TO authenticated USING (public.is_recrutador(auth.uid()) AND created_by_user_id = auth.uid());
CREATE POLICY "Admin/Coord can delete candidatos" ON public.candidatos FOR DELETE TO authenticated USING (public.is_admin(auth.uid()) OR public.is_coord_rh(auth.uid()));
CREATE POLICY "Recrutador deletes own candidatos" ON public.candidatos FOR DELETE TO authenticated USING (public.is_recrutador(auth.uid()) AND created_by_user_id = auth.uid());

-- ---- envios ----
CREATE POLICY "Admin/Coord see all envios" ON public.envios FOR SELECT TO authenticated USING (public.is_admin(auth.uid()) OR public.is_coord_rh(auth.uid()));
CREATE POLICY "Recrutador sees envios of assigned vagas" ON public.envios FOR SELECT TO authenticated USING (
  public.is_recrutador(auth.uid()) AND EXISTS (SELECT 1 FROM public.vagas WHERE id = envios.vaga_id AND recrutador_user_id = auth.uid())
);
CREATE POLICY "Comercial sees envios of own vagas" ON public.envios FOR SELECT TO authenticated USING (
  public.is_comercial(auth.uid()) AND EXISTS (SELECT 1 FROM public.vagas WHERE id = envios.vaga_id AND proprietario_user_id = auth.uid())
);
CREATE POLICY "Admin/Coord/Recrutador can insert envios" ON public.envios FOR INSERT TO authenticated WITH CHECK (
  (public.is_admin(auth.uid()) OR public.is_coord_rh(auth.uid()) OR (
    public.is_recrutador(auth.uid()) AND EXISTS (SELECT 1 FROM public.vagas WHERE id = vaga_id AND recrutador_user_id = auth.uid())
  )) AND created_by_user_id = auth.uid()
);
CREATE POLICY "Admin/Coord/Recrutador can update envios" ON public.envios FOR UPDATE TO authenticated USING (
  public.is_admin(auth.uid()) OR public.is_coord_rh(auth.uid()) OR (
    public.is_recrutador(auth.uid()) AND EXISTS (SELECT 1 FROM public.vagas WHERE id = envios.vaga_id AND recrutador_user_id = auth.uid())
  )
);
CREATE POLICY "Admin/Coord can delete envios" ON public.envios FOR DELETE TO authenticated USING (public.is_admin(auth.uid()) OR public.is_coord_rh(auth.uid()));

-- ---- vaga_status_historico ----
CREATE POLICY "Admin/Coord see all historico" ON public.vaga_status_historico FOR SELECT TO authenticated USING (public.is_admin(auth.uid()) OR public.is_coord_rh(auth.uid()));
CREATE POLICY "Recrutador sees historico of assigned vagas" ON public.vaga_status_historico FOR SELECT TO authenticated USING (
  public.is_recrutador(auth.uid()) AND EXISTS (SELECT 1 FROM public.vagas WHERE id = vaga_status_historico.vaga_id AND recrutador_user_id = auth.uid())
);
CREATE POLICY "Comercial sees historico of own vagas" ON public.vaga_status_historico FOR SELECT TO authenticated USING (
  public.is_comercial(auth.uid()) AND EXISTS (SELECT 1 FROM public.vagas WHERE id = vaga_status_historico.vaga_id AND proprietario_user_id = auth.uid())
);
-- Insert via trigger (service role / security definer)
CREATE POLICY "Triggers can insert historico" ON public.vaga_status_historico FOR INSERT TO authenticated WITH CHECK (true);
