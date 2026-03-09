-- Políticas de Storage para o bucket candidate-cvs

-- 1. Permitir upload (INSERT) para Recrutadores, Coordenadores e Admins
CREATE POLICY "Recrutador/Coord/Admin can upload CVs"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'candidate-cvs' 
  AND (
    public.is_admin(auth.uid()) 
    OR public.is_coord_rh(auth.uid()) 
    OR public.is_recrutador(auth.uid())
  )
);

-- 2. Permitir leitura (SELECT) para usuários autenticados
CREATE POLICY "Authenticated can read CVs"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'candidate-cvs');

-- 3. Permitir atualização (UPDATE) para quem pode fazer upload
CREATE POLICY "Recrutador/Coord/Admin can update CVs"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'candidate-cvs' 
  AND (
    public.is_admin(auth.uid()) 
    OR public.is_coord_rh(auth.uid()) 
    OR public.is_recrutador(auth.uid())
  )
);

-- 4. Permitir exclusão (DELETE) para Admins e Coordenadores
CREATE POLICY "Admin/Coord can delete CVs"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'candidate-cvs' 
  AND (
    public.is_admin(auth.uid()) 
    OR public.is_coord_rh(auth.uid())
  )
);