-- 1. Tambah kolom user_id ke tabel pesan_kesan (kalau belum ada)
alter table pesan_kesan add column if not exists user_id uuid references auth.users(id);

-- 2. Aktifkan Row Level Security
alter table pesan_kesan enable row level security;

-- 3. Siapa saja boleh baca pesan (buat halaman publik)
create policy "Semua orang bisa baca pesan"
  on pesan_kesan for select
  using (true);

-- 4. Cuma user yang login boleh insert, dan hanya insert milik dirinya sendiri
create policy "User login bisa kirim pesan miliknya sendiri"
  on pesan_kesan for insert
  with check (auth.uid() = user_id);
