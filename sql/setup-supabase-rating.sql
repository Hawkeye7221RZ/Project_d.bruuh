create table if not exists ratings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) not null unique, -- unique: 1 user cuma boleh 1 rating (bisa diupdate)
  nilai smallint not null check (nilai between 1 and 5),
  komentar text,
  created_at timestamptz default now()
);

alter table ratings enable row level security;

create policy "Semua orang bisa baca rating"
  on ratings for select
  using (true);

create policy "User login bisa insert rating miliknya sendiri"
  on ratings for insert
  with check (auth.uid() = user_id);

create policy "User login bisa update rating miliknya sendiri"
  on ratings for update
  using (auth.uid() = user_id);
