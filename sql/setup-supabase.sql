alter table pesan_kesan add column if not exists user_id uuid references auth.users(id);

alter table pesan_kesan enable row level security;

create policy "Semua orang bisa baca pesan"
  on pesan_kesan for select
  using (true);

create policy "User login bisa kirim pesan miliknya sendiri"
  on pesan_kesan for insert
  with check (auth.uid() = user_id);
