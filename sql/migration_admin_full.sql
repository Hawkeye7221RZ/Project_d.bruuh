-- ============================================================
-- MIGRATION: Full Admin CRUD (Member, Video, Pesan)
-- Jalankan SEMUA blok ini sekaligus di Supabase SQL Editor
-- (bikin tab SQL Editor baru, paste semua, klik Run)
-- ============================================================

-- ============================================================
-- 1. TABEL MEMBERS (Profil Teman)
-- ============================================================
create table if not exists public.members (
  id uuid primary key default gen_random_uuid(),
  nama text not null,
  username text,
  quote text,
  avatar_url text,
  created_at timestamptz not null default now()
);

alter table public.members enable row level security;

drop policy if exists "Publik boleh lihat member" on public.members;
create policy "Publik boleh lihat member"
on public.members for select
to anon, authenticated
using (true);

drop policy if exists "Admin boleh tambah member" on public.members;
create policy "Admin boleh tambah member"
on public.members for insert
to authenticated
with check (exists (select 1 from public.admins a where a.user_id = auth.uid()));

drop policy if exists "Admin boleh update member" on public.members;
create policy "Admin boleh update member"
on public.members for update
to authenticated
using (exists (select 1 from public.admins a where a.user_id = auth.uid()));

drop policy if exists "Admin boleh hapus member" on public.members;
create policy "Admin boleh hapus member"
on public.members for delete
to authenticated
using (exists (select 1 from public.admins a where a.user_id = auth.uid()));

-- pindahin data member yang sudah ada biar gak hilang (avatar tetap pakai file lokal assets/)
insert into public.members (nama, username, quote, avatar_url)
select * from (values
  ('Abi', '@caesarabigail', 'Every step matters.', 'assets/abi.jpeg'),
  ('Ahmed', '@nbltdz', 'Gapapa asing yang penting udah gaya miring #bebaskanresbob', 'assets/ahmed.jpeg'),
  ('Arap', '@middleast_', 'Hai, aku araf', 'assets/arap.jpeg'),
  ('Azril', '@azrlazraa', 'Yang sudah liat, boleh exit', 'assets/azril.jpeg'),
  ('Dary', '@darywjdn', 'Orang gendut mirip babi', 'assets/dary.jpeg'),
  ('Evan', '@epan.mlyn', 'Kitchen', 'assets/evan.jpeg'),
  ('Fakhri', '@fkhri.adty', 'Pembenci paris dan dary', 'assets/fakhri.jpeg'),
  ('Faris', '@far1ses', 'Pas kecil adu ranking, pas dewasa adu alat kencing.', 'assets/faris.jpeg'),
  ('Iyan', '@febry4nz', 'Semangat semuanya, jangan lupa tidur.', 'assets/iyan.jpeg'),
  ('Koko', '@putrarizsky', 'Sehat-sehat orang sehat', 'assets/koko.jpeg'),
  ('Nabil/Cumy', '@cumy_la', 'Haters faris dan fakhri sejak 2k26', 'assets/cumy.jpeg'),
  ('Rafi (ndrong)', '@ravso07', 'Gadis koleris yang suka berimajinasi.', 'assets/ndrong.jpeg'),
  ('Rafi (abah)', '@its.piii_', 'Gitar dan api unggun, cukup itu aja.', 'assets/abah.jpeg'),
  ('Raihan', '@mhmmdrhnkbr_', 'Gitar dan api unggun, cukup itu aja.', 'assets/raihan.jpeg'),
  ('Rendy', '@rndy.nvy', 'Ga bisa di ulang, cukup di kenang.', 'assets/rendy.jpeg'),
  ('Reno', '@renooree_', 'Gitar dan api unggun, cukup itu aja.', 'assets/reno.jpeg')
) as seed(nama, username, quote, avatar_url)
where not exists (select 1 from public.members limit 1);

-- ============================================================
-- 2. TABEL VIDEOS (Video Momen)
-- ============================================================
create table if not exists public.videos (
  id uuid primary key default gen_random_uuid(),
  judul text not null,
  durasi text,
  video_url text not null,
  created_at timestamptz not null default now()
);

alter table public.videos enable row level security;

drop policy if exists "Publik boleh lihat video" on public.videos;
create policy "Publik boleh lihat video"
on public.videos for select
to anon, authenticated
using (true);

drop policy if exists "Admin boleh tambah video" on public.videos;
create policy "Admin boleh tambah video"
on public.videos for insert
to authenticated
with check (exists (select 1 from public.admins a where a.user_id = auth.uid()));

drop policy if exists "Admin boleh update video" on public.videos;
create policy "Admin boleh update video"
on public.videos for update
to authenticated
using (exists (select 1 from public.admins a where a.user_id = auth.uid()));

drop policy if exists "Admin boleh hapus video" on public.videos;
create policy "Admin boleh hapus video"
on public.videos for delete
to authenticated
using (exists (select 1 from public.admins a where a.user_id = auth.uid()));

-- pindahin video yang sudah ada biar gak hilang (tetap pakai file lokal assets/videos/)
insert into public.videos (judul, durasi, video_url)
select * from (values
  ('Bikin kopi', '0:21', 'assets/videos/bikinkopi.mp4'),
  ('Riam Merasap 2024', '0:31', 'assets/videos/perjalananRiam.mp4'),
  ('Pantai SamudraIndah - Singkawang', '0:35', 'assets/videos/pantai.mp4')
) as seed(judul, durasi, video_url)
where not exists (select 1 from public.videos limit 1);

-- ============================================================
-- 3. ADMIN BOLEH HAPUS PESAN & KESAN SIAPAPUN (moderasi)
-- ============================================================
drop policy if exists "Admin boleh hapus pesan siapapun" on public.pesan_kesan;
create policy "Admin boleh hapus pesan siapapun"
on public.pesan_kesan for delete
to authenticated
using (
  exists (select 1 from public.admins a where a.user_id = auth.uid())
);

-- ============================================================
-- 4. STORAGE: admin boleh update & hapus file di bucket 'galeri'
--    (dipakai bareng buat foto galeri, avatar member, dan file video)
-- ============================================================
drop policy if exists "Admin boleh update file di galeri" on storage.objects;
create policy "Admin boleh update file di galeri"
on storage.objects for update
to authenticated
using (
  bucket_id = 'galeri'
  and exists (select 1 from public.admins a where a.user_id = auth.uid())
);

drop policy if exists "Admin boleh hapus file di galeri" on storage.objects;
create policy "Admin boleh hapus file di galeri"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'galeri'
  and exists (select 1 from public.admins a where a.user_id = auth.uid())
);
