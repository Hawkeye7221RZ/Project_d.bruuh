
create policy "Admin boleh update foto galeri"
on public.galeri_foto for update
to authenticated
using (
  exists (select 1 from public.admins a where a.user_id = auth.uid())
);
