
-- 1. Profiles: drop the broad "true" SELECT policy
DROP POLICY IF EXISTS "Authenticated can view all profiles" ON public.profiles;

-- 2. user_roles: drop the broad "true" SELECT policy
DROP POLICY IF EXISTS "Authenticated can view roles" ON public.user_roles;

-- 3. vaga_status_historico: drop the always-true INSERT policy.
-- The status-change trigger runs as SECURITY DEFINER (owned by postgres, BYPASSRLS),
-- so removing this policy does not block the trigger.
DROP POLICY IF EXISTS "Triggers can insert historico" ON public.vaga_status_historico;

-- 4. Restrict areas / funcoes / motivos_abertura to authenticated role only
DROP POLICY IF EXISTS "Authenticated can read areas" ON public.areas;
CREATE POLICY "Authenticated can read areas"
  ON public.areas FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Admin can manage areas" ON public.areas;
CREATE POLICY "Admin can manage areas"
  ON public.areas FOR ALL TO authenticated
  USING (is_admin(auth.uid())) WITH CHECK (is_admin(auth.uid()));

DROP POLICY IF EXISTS "Authenticated can read funcoes" ON public.funcoes;
CREATE POLICY "Authenticated can read funcoes"
  ON public.funcoes FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Admin can manage funcoes" ON public.funcoes;
CREATE POLICY "Admin can manage funcoes"
  ON public.funcoes FOR ALL TO authenticated
  USING (is_admin(auth.uid())) WITH CHECK (is_admin(auth.uid()));

DROP POLICY IF EXISTS "Authenticated can read motivos_abertura" ON public.motivos_abertura;
CREATE POLICY "Authenticated can read motivos_abertura"
  ON public.motivos_abertura FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Admin can manage motivos_abertura" ON public.motivos_abertura;
CREATE POLICY "Admin can manage motivos_abertura"
  ON public.motivos_abertura FOR ALL TO authenticated
  USING (is_admin(auth.uid())) WITH CHECK (is_admin(auth.uid()));

-- 5. Make candidate-cvs bucket private
UPDATE storage.buckets SET public = false WHERE id = 'candidate-cvs';

-- 6. Revoke direct EXECUTE on SECURITY DEFINER role-check functions.
-- They're invoked from RLS policies (which run as the table owner), so policy
-- evaluation still works, but clients cannot call them directly via PostgREST.
REVOKE EXECUTE ON FUNCTION public.is_admin(uuid) FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.is_coord_rh(uuid) FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.is_recrutador(uuid) FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.is_comercial(uuid) FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM anon, authenticated, public;
