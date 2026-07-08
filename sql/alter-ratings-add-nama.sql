-- Tambah kolom nama ke tabel ratings (kalau belum ada)
alter table ratings add column if not exists nama text;
