
create table if not exists public.admins (
  user_id uuid primary key references auth.users(id) on delete cascade
);

alter table public.admins enable row level security;

create policy "Lihat status admin sendiri"
on public.admins for select
to authenticated
using (auth.uid() = user_id);


create table if not exists public.galeri_foto (
  id uuid primary key default gen_random_uuid(),
  url text not null,
  caption text not null,
  kategori text not null check (kategori in ('Foto', 'Perjalanan', 'Camping')),
  uploaded_by uuid references auth.users(id),
  created_at timestamptz not null default now()
);

alter table public.galeri_foto enable row level security;

create policy "Semua orang boleh lihat galeri"
on public.galeri_foto for select
to anon, authenticated
using (true);

create policy "Hanya admin boleh tambah foto"
on public.galeri_foto for insert
to authenticated
with check (
  exists (select 1 from public.admins a where a.user_id = auth.uid())
);

create policy "Hanya admin boleh hapus foto"
on public.galeri_foto for delete
to authenticated
using (
  exists (select 1 from public.admins a where a.user_id = auth.uid())
);


insert into storage.buckets (id, name, public)
values ('galeri', 'galeri', true)
on conflict (id) do nothing;

create policy "Publik boleh lihat file galeri"
on storage.objects for select
to anon, authenticated
using (bucket_id = 'galeri');

create policy "Hanya admin boleh upload file galeri"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'galeri'
  and exists (select 1 from public.admins a where a.user_id = auth.uid())
);

create policy "Hanya admin boleh hapus file galeri"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'galeri'
  and exists (select 1 from public.admins a where a.user_id = auth.uid())
);
