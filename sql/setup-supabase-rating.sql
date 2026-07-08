-- 1. Bikin tabel ratings
create table if not exists ratings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) not null unique, -- unique: 1 user cuma boleh 1 rating (bisa diupdate)
  nilai smallint not null check (nilai between 1 and 5),
  komentar text,
  created_at timestamptz default now()
);

-- 2. Aktifkan Row Level Security
alter table ratings enable row level security;

-- 3. Semua orang boleh baca rating (buat hitung rata-rata & tampilkan di halaman publik)
create policy "Semua orang bisa baca rating"
  on ratings for select
  using (true);

-- 4. User yang login boleh kasih rating miliknya sendiri
create policy "User login bisa insert rating miliknya sendiri"
  on ratings for insert
  with check (auth.uid() = user_id);

-- 5. User yang login boleh update rating miliknya sendiri (biar bisa ganti nilai)
create policy "User login bisa update rating miliknya sendiri"
  on ratings for update
  using (auth.uid() = user_id);
