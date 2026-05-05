create policy "Admin/Coord can update historico"
on public.vaga_status_historico
for update
to authenticated
using (
  is_admin(auth.uid())
  or is_coord_rh(auth.uid())
)
with check (
  is_admin(auth.uid())
  or is_coord_rh(auth.uid())
);

create policy "Comercial can update historico of own vagas"
on public.vaga_status_historico
for update
to authenticated
using (
  is_comercial(auth.uid())
  and exists (
    select 1
    from public.vagas
    where vagas.id = vaga_status_historico.vaga_id
      and vagas.proprietario_user_id = auth.uid()
  )
)
with check (
  is_comercial(auth.uid())
  and exists (
    select 1
    from public.vagas
    where vagas.id = vaga_status_historico.vaga_id
      and vagas.proprietario_user_id = auth.uid()
  )
);

create policy "Recrutador can update historico of assigned vagas"
on public.vaga_status_historico
for update
to authenticated
using (
  is_recrutador(auth.uid())
  and exists (
    select 1
    from public.vagas
    where vagas.id = vaga_status_historico.vaga_id
      and vagas.recrutador_user_id = auth.uid()
  )
)
with check (
  is_recrutador(auth.uid())
  and exists (
    select 1
    from public.vagas
    where vagas.id = vaga_status_historico.vaga_id
      and vagas.recrutador_user_id = auth.uid()
  )
);