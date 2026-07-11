-- ============================================================
-- FIX: Policy UPDATE yang belum ada di tabel galeri_foto
-- Ini yang bikin fitur "Edit Foto" di galeri gagal buat admin.
-- Jalankan sekali aja di Supabase SQL Editor.
-- ============================================================

create policy "Admin boleh update foto galeri"
on public.galeri_foto for update
to authenticated
using (
  exists (select 1 from public.admins a where a.user_id = auth.uid())
);
