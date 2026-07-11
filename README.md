# 🌲 d.bruuh — Website Kenang-Kenangan

<p align="center">
  <img src="assets/logo.png" alt="d.bruuh logo" width="220" />
</p>

<p align="center">
  <em>Bukan cuma galeri foto. Ini rumah buat semua momen yang gak mau kita lupain.</em>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/status-live-2D5A4A?style=flat-square" />
  <img src="https://img.shields.io/badge/HTML-CSS-JS-2D5A4A?style=flat-square" />
  <img src="https://img.shields.io/badge/backend-Supabase-3ECF8E?style=flat-square" />
  <img src="https://img.shields.io/badge/made%20with-%E2%98%95%EF%B8%8F%20%26%20nostalgia-6F4E37?style=flat-square" />
</p>

---

## 📖 Tentang

Tiga tahun itu gak lama, tapi juga gak sebentar untuk dilupain begitu saja.

`d.bruuh` adalah Website yang dibuat karena satu hal kecil yang mungkin terdengar sepele, takut lupa. Foto, video, dan semua kenangan yang tersebar di aplikasi seperti WhatsApp, Instagram, ataupun galeri pribadi masing-masing bisa saja terhapus karena alasan seperti tidak sengaja terhapus atau memori penyimpanan yang penuh. Jadi, website ini ada untuk menjadi tempat khusus untuk menyimpan foto atau video yang pernah tertangkap oleh kamera. Website ini akan menjadi rumah untuk semua kenangan yang terekam dan rumah ini tak akan tertimbun oleh waktu.

## ✨ Fitur

| Fitur | Deskripsi |
|---|---|
| 🏠 **Beranda** | Hero slider, filter kategori cepat, dan preview konten |
| 🖼️ **Galeri** | Foto kenangan tersimpan di Supabase, bisa difilter per kategori, upload/edit/hapus khusus admin |
| 🎬 **Video** | Rekap video dengan player modal inline, CRUD khusus admin |
| 👥 **Profil Teman (Member)** | Kartu profil tiap member bruh, dikelola admin |
| 💌 **Pesan & Kesan** | Dinding pesan perpisahan dari siapa aja yang login, bisa dikirim atas nama sendiri atau Anonim |
| ⭐ **Rating Website** | User login bisa kasih rating 1–5 bintang, rata-rata ditampilkan real-time |
| 🔐 **Login & Daftar** | Autentikasi lewat Supabase Auth (email + password) |
| 🛡️ **Admin Panel** | Akun tertentu bisa tambah/edit/hapus member, video, dan foto galeri, serta moderasi pesan |
| 📝 **Tentang** | Cerita di balik kenapa website ini dibuat |

## 🎨 Palette — *Forest Coffee*

Hangat, alami, dan nyaman. Cocok buat tema adventure, ngopi, dan kebersamaan.

| Warna | Hex | Kegunaan |
|---|---|---|
| 🟢 Forest Green | `#2D5A4A` | Primary — navigasi, tombol utama |
| 🟤 Coffee Brown | `#6F4E37` | Sekunder — kartu, elemen aksen |
| 🟠 Sunset Orange | `#E07A5F` | Aksen penting — highlight, hover |
| ⚪ Cream | `#F4F1EA` | Background utama |
| ⚫ Dark Charcoal | `#2B2B2B` | Teks utama |

**Font:** [Cormorant Garamond](https://fonts.google.com/specimen/Cormorant+Garamond) (heading) + [Plus Jakarta Sans](https://fonts.google.com/specimen/Plus+Jakarta+Sans) (body)

## 🛠️ Tech Stack

- **Frontend:** HTML5, CSS3 (custom properties, no framework), Vanilla JavaScript
- **Backend:** [Supabase](https://supabase.com) — Auth, Postgres Database, Storage, dan Row Level Security (RLS)


## 📂 Struktur Project

```
d-bruuh/
├── index.html            # Beranda (hero, galeri, video preview)
├── profil-teman.html     # Halaman Member
├── pesan-kesan.html      # Dinding pesan & kesan + rating
├── tentang.html          # Cerita di balik website ini
├── style.css              # Semua styling
├── script.js               # Auth, CRUD Supabase, interaktivitas (modal, filter, dll)
├── assets/
│   └── logo.png
└── supabase/
    ├── setup-galeri-foto.sql       # Tabel admins + galeri_foto + storage bucket
    ├── migration_admin_full.sql    # Tabel members, videos + policy admin
    ├── setup-supabase.sql          # RLS pesan_kesan
    ├── setup-supabase-rating.sql   # Tabel ratings
    └── alter-ratings-add-nama.sql  # Kolom nama di ratings
```

## 🗄️ Setup Supabase

Website ini butuh project Supabase sendiri buat jalan penuh (auth, database, storage).

1. Buat project baru di [supabase.com](https://supabase.com)
2. Buka **SQL Editor**, jalankan file-file di folder `supabase/` **secara berurutan**:
   1. `setup-galeri-foto.sql`
   2. `migration_admin_full.sql`
   3. `setup-supabase.sql`
   4. `setup-supabase-rating.sql`
   5. `alter-ratings-add-nama.sql`
3. Tambahkan URL & anon key project ke `script.js` (bagian `createClient(...)`)
4. Buat akun admin pertama secara manual: daftar lewat form Daftar di web, lalu insert `user_id` akunnya ke tabel `admins` lewat SQL Editor:
   ```sql
   insert into public.admins (user_id) values ('uuid-user-kamu');
   ```

> Semua tabel sudah pakai Row Level Security — publik cuma bisa baca, insert/update/delete dibatasi ke pemilik data atau akun admin.

## 🚀 Cara Menjalankan

1. Clone repo ini
   ```bash
   git clone https://github.com/Hawkeye7221RZ/Project_d.bruuh.git
   cd Project_d.bruuh
   ```
2. Selesaikan [Setup Supabase](#️-setup-supabase) di atas
3. Buka `index.html` langsung di browser, **atau** pakai Live Server (disarankan):
   - Buka folder ini di VSCode
   - Install extension **Live Server**
   - Klik kanan `index.html` → **Open with Live Server**

## 🗺️ Roadmap

- [x] Desain visual & struktur halaman
- [x] Navbar dengan dropdown (Konten & Komunitas), responsive + hamburger menu
- [x] Halaman Beranda, Galeri, Video
- [x] Halaman Profil Teman & Pesan Kesan
- [x] Halaman Tentang
- [x] Setup Supabase (auth + database + storage)
- [x] Sistem login & daftar akun
- [x] CRUD admin untuk member, video, dan foto galeri
- [x] Rating & pesan kesan dari user login
- [ ] Edit nama tampilan / mode Anonim permanen buat user
- [ ] Deploy ke hosting publik (Vercel/Netlify)

## 🤝 Kontribusi

Project ini dikerjain bareng, dengan branch masing-masing lalu digabung ke `main` lewat Pull Request. Kalau kamu bagian dari tim ini dan mau nambahin sesuatu:

```bash
git checkout -b nama-branch-kamu
# ...ngerjain sesuatu...
git add .
git commit -m "deskripsi perubahan"
git push -u origin nama-branch-kamu
```
Lalu buka Pull Request ke `main` di GitHub.

## 💌 Dibuat oleh

**iyn** & **r4ps** — sambil libur, sambil belajar

<p align="center">✦ ✦ ✦</p>
