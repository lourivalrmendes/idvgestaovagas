
GRANT EXECUTE ON FUNCTION public.is_admin(uuid) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.is_coord_rh(uuid) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.is_recrutador(uuid) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.is_comercial(uuid) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, app_role) TO anon, authenticated;
