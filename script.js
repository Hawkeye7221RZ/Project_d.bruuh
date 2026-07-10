/* ==========================================================
   NAVBAR HEIGHT SYNC — supaya konten gak ketutup navbar fixed di HP
   ========================================================== */
const navbarEl = document.querySelector('.navbar');

function syncNavbarHeight() {
  if (!navbarEl) return;
  if (window.innerWidth <= 768) {
    const h = navbarEl.offsetHeight;
    document.documentElement.style.setProperty('--navbar-h', h + 'px');
  } else {
    document.documentElement.style.removeProperty('--navbar-h');
  }
}

syncNavbarHeight();
window.addEventListener('resize', syncNavbarHeight);
window.addEventListener('load', syncNavbarHeight);

/* ==========================================================
   MOBILE NAV — hamburger, backdrop, dropdown accordion
   ========================================================== */
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');
const navBackdrop = document.getElementById('navBackdrop');

function openMobileMenu() {
  navLinks.classList.add('open');
  navBackdrop.classList.add('open');
  menuToggle.classList.add('open');
  menuToggle.setAttribute('aria-expanded', 'true');
  document.body.style.overflow = 'hidden'; // biar konten belakang gak ikut kescroll
}

function closeMobileMenu() {
  navLinks.classList.remove('open');
  navBackdrop.classList.remove('open');
  menuToggle.classList.remove('open');
  menuToggle.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';

  // tutup juga semua accordion dropdown yang lagi kebuka
  document.querySelectorAll('.nav-dropdown.mobile-open').forEach((el) => {
    el.classList.remove('mobile-open');
  });
}

if (menuToggle && navLinks && navBackdrop) {
  menuToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.contains('open');
    isOpen ? closeMobileMenu() : openMobileMenu();
  });

  navBackdrop.addEventListener('click', closeMobileMenu);

  // tutup menu dengan tombol Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMobileMenu();
  });

  // dropdown "Konten" / "Komunitas" jadi accordion pas mobile
  document.querySelectorAll('.nav-dropdown-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      // di layar besar dropdown udah jalan otomatis lewat hover, jadi skip
      if (window.innerWidth > 768) return;

      e.preventDefault();
      const parent = btn.closest('.nav-dropdown');
      const isOpen = parent.classList.contains('mobile-open');

      // tutup dropdown lain biar cuma satu yang kebuka
      document.querySelectorAll('.nav-dropdown.mobile-open').forEach((el) => {
        if (el !== parent) el.classList.remove('mobile-open');
      });

      parent.classList.toggle('mobile-open', !isOpen);
    });
  });

  // klik link biasa di dalam menu mobile langsung nutup menu
  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 768) closeMobileMenu();
    });
  });

  // kalau layar di-resize balik ke ukuran desktop, reset state mobile menu
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) closeMobileMenu();
  });
}

/* ==========================================================
   HERO SLIDER — tombol panah (laptop) + swipe/geser (HP)
   ========================================================== */
const heroTrack = document.getElementById('heroTrack');

if (heroTrack) {
  const slides = heroTrack.querySelectorAll('.hero-slide');
  const dotsWrap = document.getElementById('heroDots');
  const prevBtn = document.getElementById('heroPrev');
  const nextBtn = document.getElementById('heroNext');
  let index = 0;

  // bikin dots otomatis sesuai jumlah foto
  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'hero-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', `Ke foto ${i + 1}`);
    dot.addEventListener('click', () => goToSlide(i));
    dotsWrap.appendChild(dot);
  });
  const dots = dotsWrap.querySelectorAll('.hero-dot');

  function goToSlide(newIndex) {
    index = (newIndex + slides.length) % slides.length; // muter balik ke awal/akhir
    heroTrack.style.transform = `translateX(-${index * 100}%)`;
    dots.forEach((d, i) => d.classList.toggle('active', i === index));
  }

  prevBtn.addEventListener('click', () => goToSlide(index - 1));
  nextBtn.addEventListener('click', () => goToSlide(index + 1));

  // ---- SWIPE / GESER JARI (touch, buat HP) ----
  let touchStartX = 0;
  let touchCurrentX = 0;
  let isSwiping = false;

  heroTrack.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
    touchCurrentX = touchStartX;
    isSwiping = true;
    heroTrack.style.transition = 'none'; // biar keikut jari tanpa delay
  }, { passive: true });

  heroTrack.addEventListener('touchmove', (e) => {
    if (!isSwiping) return;
    touchCurrentX = e.touches[0].clientX;
    const diff = touchCurrentX - touchStartX;
    heroTrack.style.transform = `translateX(calc(-${index * 100}% + ${diff}px))`;
  }, { passive: true });

  heroTrack.addEventListener('touchend', () => {
    if (!isSwiping) return;
    isSwiping = false;
    heroTrack.style.transition = ''; // balikin animasi transisi normal

    const diff = touchCurrentX - touchStartX;
    const threshold = 50; // minimal geser 50px baru dianggap ganti slide

    if (diff > threshold) {
      goToSlide(index - 1); // geser ke kanan -> foto sebelumnya
    } else if (diff < -threshold) {
      goToSlide(index + 1); // geser ke kiri -> foto berikutnya
    } else {
      goToSlide(index); // geseran kurang jauh -> balik ke posisi semula
    }
  });
}

/* ==========================================================
   FILTER KATEGORI — QUICK GALLERY
   ========================================================== */
const filterTabs = document.getElementById('filterTabs');
const quickGrid = document.getElementById('quickGrid');
const emptyState = document.getElementById('emptyState');

if (filterTabs && quickGrid) {
  const tabs = filterTabs.querySelectorAll('.tab');

  filterTabs.addEventListener('click', (e) => {
    const btn = e.target.closest('.tab');
    if (!btn) return;

    // toggle active state pada tab
    tabs.forEach((t) => t.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;
    let visibleCount = 0;

    // query ulang setiap klik, biar foto yang baru diupload ikut kefilter juga
    const cards = quickGrid.querySelectorAll('.photo-card');

    cards.forEach((card) => {
      const match = filter === 'Semua' || card.dataset.category === filter;
      card.style.display = match ? '' : 'none';
      if (match) visibleCount++;
    });

    if (emptyState) {
      emptyState.hidden = visibleCount !== 0;
    }
  });
}

/* ==========================================================
   TOMBOL "TULIS PESAN" — placeholder sebelum sistem login teman jadi
   ========================================================== */
// 1. KONFIGURASI SUPABASE (Ganti dengan URL & Anon Key dari Project Supabase Anda)
const SUPABASE_URL = 'https://efuqbrjuzmoxptqsstke.supabase.co'; 
const SUPABASE_KEY = 'sb_publishable_j8xH6yMBL8QFYE-E1oohZQ_BhSMFWuU'; // Anon Key Anda

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// 2. AMBIL ELEMEN HTML
const modal = document.getElementById('modalPesan');
const btnTulisPesan = document.getElementById('btnTulisPesan');
const btnTutup = document.getElementById('btnTutup');
const formPesan = document.getElementById('form-pesan');
const inputIsiPesan = document.getElementById('input-pesan');
const pesanNamaDisplay = document.getElementById('pesanNamaDisplay');
const containerPesan = document.querySelector('.message-list'); // Tempat list pesan di HTML
const checkAnonim = document.getElementById('checkAnonim');

// -- Ubah Nama --
const btnUbahNama = document.getElementById('btnUbahNama');
const ubahNamaGroup = document.getElementById('ubahNamaGroup');
const inputNamaBaru = document.getElementById('input-nama-baru');
const btnSimpanNama = document.getElementById('btnSimpanNama');
const btnBatalNama = document.getElementById('btnBatalNama');
const ubahNamaMsg = document.getElementById('ubahNamaMsg');

const modalAuth = document.getElementById('modalAuth');
const btnMasuk = document.getElementById('btnMasuk');
const btnMasukText = document.getElementById('btnMasukText');
const btnLoginInitial = document.getElementById('btnLoginInitial');
const navAccountStatus = document.getElementById('navAccountStatus');
const btnTutupAuth = document.getElementById('btnTutupAuth');
const authTabs = document.querySelectorAll('.auth-tab');
const formLogin = document.getElementById('form-login');
const formDaftar = document.getElementById('form-daftar');
const loginMsg = document.getElementById('loginMsg');
const daftarMsg = document.getElementById('daftarMsg');

let currentUser = null; // { id, nama, email }

// 3. STATUS LOGIN — cek sesi saat load & pantau perubahan (login/logout)
//    Status ditandai lewat 3 hal biar jelas di HP maupun laptop:
//    1) warna tombol (abu-abu = tamu, oranye = udah masuk)
//    2) titik kecil di avatar (abu-abu = belum masuk, hijau = udah masuk)
//    3) baris status di dalam panel menu HP ("Belum masuk" / "Masuk sebagai ...")
async function refreshUserUI() {
    const { data: { session } } = await supabaseClient.auth.getSession();

    if (session && session.user) {
        currentUser = {
            id: session.user.id,
            email: session.user.email,
            nama: session.user.user_metadata?.nama || session.user.email,
        };
        const inisial = currentUser.nama.trim().charAt(0).toUpperCase();

        if (btnMasuk) {
            btnMasuk.classList.add('is-logged-in');
            btnMasuk.title = `Masuk sebagai ${currentUser.nama} — klik untuk keluar`;
        }
        if (btnMasukText) btnMasukText.textContent = 'Keluar';
        if (btnLoginInitial) btnLoginInitial.textContent = inisial;
        if (pesanNamaDisplay) pesanNamaDisplay.textContent = currentUser.nama;
        if (navAccountStatus) {
            navAccountStatus.textContent = `Masuk sebagai ${currentUser.nama}`;
            navAccountStatus.classList.add('is-logged-in');
        }
    } else {
        currentUser = null;

        if (btnMasuk) {
            btnMasuk.classList.remove('is-logged-in');
            btnMasuk.title = 'Klik untuk masuk';
        }
        if (btnMasukText) btnMasukText.textContent = 'Masuk';
        if (btnLoginInitial) btnLoginInitial.textContent = '';
        if (pesanNamaDisplay) pesanNamaDisplay.textContent = '-';
        if (navAccountStatus) {
            navAccountStatus.textContent = 'Belum masuk';
            navAccountStatus.classList.remove('is-logged-in');
        }
    }
}

supabaseClient.auth.onAuthStateChange(() => {
    refreshUserUI().then(checkIsAdmin);
});
refreshUserUI().then(checkIsAdmin);

// 3a. CEK STATUS ADMIN — dipakai di semua halaman buat nampilin tombol admin (foto/member/video/pesan)
const btnTambahFoto = document.getElementById('btnTambahFoto');
const btnTambahMember = document.getElementById('btnTambahMember');
const btnTambahVideo = document.getElementById('btnTambahVideo');
let isAdmin = false;

async function checkIsAdmin() {
    if (!currentUser) {
        isAdmin = false;
        document.body.classList.remove('is-admin');
        if (btnTambahFoto) btnTambahFoto.style.display = 'none';
        if (btnTambahMember) btnTambahMember.style.display = 'none';
        if (btnTambahVideo) btnTambahVideo.style.display = 'none';
        return;
    }

    const { data, error } = await supabaseClient
        .from('admins')
        .select('user_id')
        .eq('user_id', currentUser.id)
        .maybeSingle();

    isAdmin = !error && !!data;
    document.body.classList.toggle('is-admin', isAdmin);

    if (btnTambahFoto) btnTambahFoto.style.display = isAdmin ? '' : 'none';
    if (btnTambahMember) btnTambahMember.style.display = isAdmin ? '' : 'none';
    if (btnTambahVideo) btnTambahVideo.style.display = isAdmin ? '' : 'none';
}

// 3b. UBAH NAMA — user bisa ganti nama tampilan akunnya sendiri
if (btnUbahNama) {
    btnUbahNama.addEventListener('click', () => {
        if (!currentUser) {
            alert('Silakan masuk dulu untuk mengubah nama.');
            if (modalAuth) modalAuth.style.display = 'flex';
            return;
        }
        inputNamaBaru.value = currentUser.nama;
        if (ubahNamaMsg) ubahNamaMsg.textContent = '';
        ubahNamaGroup.style.display = 'block';
        inputNamaBaru.focus();
    });
}

if (btnBatalNama) {
    btnBatalNama.addEventListener('click', () => {
        ubahNamaGroup.style.display = 'none';
        if (ubahNamaMsg) ubahNamaMsg.textContent = '';
    });
}

if (btnSimpanNama) {
    btnSimpanNama.addEventListener('click', async () => {
        const namaBaru = inputNamaBaru.value.trim();

        if (!namaBaru) {
            ubahNamaMsg.textContent = 'Nama tidak boleh kosong.';
            return;
        }
        if (namaBaru.length > 40) {
            ubahNamaMsg.textContent = 'Nama maksimal 40 karakter.';
            return;
        }

        ubahNamaMsg.style.color = '#666';
        ubahNamaMsg.textContent = 'Menyimpan...';

        const { error } = await supabaseClient.auth.updateUser({
            data: { nama: namaBaru },
        });

        if (error) {
            ubahNamaMsg.style.color = '#c0392b';
            ubahNamaMsg.textContent = 'Gagal menyimpan: ' + error.message;
            return;
        }

        await refreshUserUI(); // update tampilan nama di navbar & modal
        ubahNamaGroup.style.display = 'none';
        ubahNamaMsg.textContent = '';
    });
}

// 4. TOMBOL MASUK / KELUAR DI NAVBAR
if (btnMasuk) {
    btnMasuk.addEventListener('click', async () => {
        if (currentUser) {
            const yakin = confirm(`Keluar dari akun ${currentUser.nama}?`);
            if (!yakin) return;
            await supabaseClient.auth.signOut();
        } else if (modalAuth) {
            modalAuth.style.display = 'flex';
        }
    });
}

if (btnTutupAuth) {
    btnTutupAuth.addEventListener('click', () => {
        if (modalAuth) modalAuth.style.display = 'none';
    });
}

window.addEventListener('click', (e) => {
    if (e.target === modalAuth) modalAuth.style.display = 'none';
});

// tab switch: Masuk <-> Daftar
authTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
        authTabs.forEach((t) => t.classList.remove('active'));
        tab.classList.add('active');
        const target = tab.dataset.tab;
        formLogin.style.display = target === 'login' ? 'block' : 'none';
        formDaftar.style.display = target === 'daftar' ? 'block' : 'none';
        if (loginMsg) loginMsg.textContent = '';
        if (daftarMsg) daftarMsg.textContent = '';
    });
});

// 5. LOGIN
if (formLogin) {
    formLogin.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value.trim();
        const password = document.getElementById('login-password').value;
        loginMsg.textContent = 'Memproses...';

        const { error } = await supabaseClient.auth.signInWithPassword({ email, password });

        if (error) {
            loginMsg.textContent = 'Gagal masuk: ' + error.message;
        } else {
            loginMsg.textContent = '';
            formLogin.reset();
            if (modalAuth) modalAuth.style.display = 'none';
        }
    });
}

// 6. DAFTAR (SIGN UP)
if (formDaftar) {
    formDaftar.addEventListener('submit', async (e) => {
        e.preventDefault();
        const nama = document.getElementById('daftar-nama').value.trim();
        const email = document.getElementById('daftar-email').value.trim();
        const password = document.getElementById('daftar-password').value;
        daftarMsg.textContent = 'Memproses...';

        const { error } = await supabaseClient.auth.signUp({
            email,
            password,
            options: { data: { nama } },
        });

        if (error) {
            daftarMsg.textContent = 'Gagal daftar: ' + error.message;
        } else {
            daftarMsg.style.color = '#2D5A4A';
            daftarMsg.textContent = 'Berhasil daftar! Cek email untuk konfirmasi (jika diaktifkan), lalu masuk.';
            formDaftar.reset();
        }
    });
}

// 7. LOGIKA POP-UP MODAL PESAN (Buka & Tutup) — wajib login dulu
if (btnTulisPesan) {
    btnTulisPesan.addEventListener('click', (e) => {
        e.preventDefault();
        if (!currentUser) {
            alert('Silakan masuk dulu untuk menulis pesan.');
            if (modalAuth) modalAuth.style.display = 'flex';
            return;
        }
        if (modal) modal.style.display = 'flex';
    });
}

if (btnTutup) {
    btnTutup.addEventListener('click', () => {
        if (modal) modal.style.display = 'none';
    });
}

window.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.style.display = 'none';
    }
});

// 8. AMBIL DATA DARI SUPABASE (FETCH DATA)
async function muatPesan() {
    if (!containerPesan) return;

   const { data, error } = await supabaseClient.from('pesan_kesan') // <-- Ganti di sini
    .select('*')
    .order('created_at', { ascending: false });

    if (error) {
        console.error('Gagal memuat pesan:', error.message);
        return;
    }

    containerPesan.innerHTML = ''; // Hapus pesan tiruan (Alya, Bima, dll)

    data.forEach(item => {
        const card = document.createElement('div');
        card.className = 'message-card'; // Sesuaikan dengan nama class CSS kartu pesan Anda
        card.dataset.pesanId = item.id;
        card.innerHTML = `
            <p class="pesan-nama"><strong>Pengirim:</strong> ${item.nama}</p>
            <p class="pesan-isi"><strong>Pesan:</strong> ${item.pesan}</p>
            <div class="pesan-admin-row">
              <button type="button" class="pesan-delete-btn" title="Hapus pesan ini">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg>
                Hapus
              </button>
            </div>
        `;
        containerPesan.appendChild(card);
    });
}

// klik tombol hapus pesan (khusus admin, buat moderasi pesan orang lain)
if (containerPesan) {
    containerPesan.addEventListener('click', async (e) => {
        const delBtn = e.target.closest('.pesan-delete-btn');
        if (!delBtn) return;
        if (!isAdmin) return;

        const card = e.target.closest('.message-card');
        const pesanId = card?.dataset.pesanId;
        if (!card || !pesanId) return;

        const yakin = confirm('Yakin mau hapus pesan ini?');
        if (!yakin) return;

        const { error } = await supabaseClient.from('pesan_kesan').delete().eq('id', pesanId);

        if (error) {
            alert('Gagal menghapus pesan: ' + error.message);
            return;
        }

        card.remove();
    });
}

// 9. KIRIM DATA KE SUPABASE (INSERT DATA) — nama diambil otomatis dari akun
if (formPesan) {
    formPesan.addEventListener('submit', async (e) => {
        e.preventDefault();

        if (!currentUser) {
            alert('Sesi kamu berakhir, silakan masuk lagi.');
            if (modal) modal.style.display = 'none';
            if (modalAuth) modalAuth.style.display = 'flex';
            return;
        }

        const pesan = inputIsiPesan.value.trim();

        if (!pesan) {
            alert('Pesan tidak boleh kosong!');
            return;
        }

        // kalau centang "Kirim sebagai Anonim", nama akun asli tidak dipakai buat pesan ini
        const namaKirim = (checkAnonim && checkAnonim.checked) ? 'Anonim' : currentUser.nama;

      const { error } = await supabaseClient.from('pesan_kesan')
     .insert([{ nama: namaKirim, pesan: pesan, user_id: currentUser.id }]);

        if (error) {
            alert('Gagal mengirim: ' + error.message);
            return;
        }

        // kalau user milih bintang, kirim/update rating-nya juga (nggak wajib, opsional)
        if (ratingDipilih > 0) {
            const { error: ratingError } = await supabaseClient.from('ratings').upsert(
                {
                    user_id: currentUser.id,
                    nama: namaKirim,
                    nilai: ratingDipilih,
                    komentar: pesan,
                },
                { onConflict: 'user_id' }
            );
            if (ratingError) {
                console.error('Gagal mengirim rating:', ratingError.message);
                alert('Pesan terkirim, tapi rating gagal: ' + ratingError.message);
            } else {
                muatRating(); // refresh rata-rata di halaman
            }
        }

        alert('Pesan berhasil terkirim!');
        formPesan.reset(); // Kosongkan form
        if (ratingStarsWrap) {
            ratingStarsWrap.querySelectorAll('.star-btn').forEach((btn) => btn.classList.remove('active'));
        }
        ratingDipilih = 0;
        if (checkAnonim) checkAnonim.checked = false;
        if (modal) modal.style.display = 'none'; // Tutup pop-up otomatis
        muatPesan(); // Refresh daftar pesan agar langsung muncul yang baru
    });
}

// Jalankan otomatis saat halaman selesai di-load
document.addEventListener('DOMContentLoaded', muatPesan);

/* ==========================================================
   10. RATING WEBSITE (digabung ke form Tulis Pesan)
   ========================================================== */
const ratingStarsWrap = document.getElementById('ratingStars');
const ratingAvgText = document.getElementById('ratingAvgText');

let ratingDipilih = 0; // bintang yang lagi dipilih user di modal Tulis Pesan

if (ratingStarsWrap) {
    const starBtns = ratingStarsWrap.querySelectorAll('.star-btn');

    function tampilkanBintang(jumlah) {
        starBtns.forEach((btn) => {
            const val = Number(btn.dataset.value);
            btn.classList.toggle('active', val <= jumlah);
        });
    }

    // klik bintang -> pilih rating
    starBtns.forEach((btn) => {
        btn.addEventListener('click', () => {
            ratingDipilih = Number(btn.dataset.value);
            tampilkanBintang(ratingDipilih);
        });
        // hover kasih preview juga
        btn.addEventListener('mouseenter', () => tampilkanBintang(Number(btn.dataset.value)));
    });
    ratingStarsWrap.addEventListener('mouseleave', () => tampilkanBintang(ratingDipilih));
}

// ambil rata-rata rating dari semua orang, ditampilkan di halaman utama
async function muatRating() {
    if (!ratingAvgText) return;

    const { data, error } = await supabaseClient.from('ratings').select('nilai');

    if (error) {
        console.error('Gagal memuat rating:', error.message);
        ratingAvgText.textContent = 'Rating belum bisa dimuat.';
        return;
    }

    if (!data || data.length === 0) {
        ratingAvgText.textContent = 'Belum ada yang kasih rating. Jadi yang pertama!';
        return;
    }

    const total = data.reduce((sum, r) => sum + r.nilai, 0);
    const rataRata = (total / data.length).toFixed(1);
    ratingAvgText.textContent = `⭐ ${rataRata} dari ${data.length} rating`;
}

// isi ulang bintang sesuai rating milik user sendiri kalau sudah pernah kasih rating sebelumnya
async function muatRatingSaya() {
    if (!currentUser || !ratingStarsWrap) return;

    const { data } = await supabaseClient
        .from('ratings')
        .select('nilai')
        .eq('user_id', currentUser.id)
        .maybeSingle();

    if (data) {
        ratingDipilih = data.nilai;
        const starBtns = ratingStarsWrap.querySelectorAll('.star-btn');
        starBtns.forEach((btn) => {
            btn.classList.toggle('active', Number(btn.dataset.value) <= ratingDipilih);
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    muatRating();
    // tunggu sesi login kebaca dulu baru cek rating milik user
    setTimeout(muatRatingSaya, 600);
});

/* ==========================================================
   GALERI FOTO — upload oleh admin, tayang otomatis (tanpa VSCode)
   ========================================================== */
const modalFoto = document.getElementById('modalFoto');
const btnTutupFoto = document.getElementById('btnTutupFoto');
const formFoto = document.getElementById('form-foto');
const inputFotoFile = document.getElementById('input-foto-file');
const inputFotoCaption = document.getElementById('input-foto-caption');
const inputFotoKategori = document.getElementById('input-foto-kategori');
const modalFotoTitle = document.getElementById('modalFotoTitle');
const btnUnggahFoto = document.getElementById('btnUnggahFoto');

// state buat nandain lagi mode edit atau tambah baru
let editingFotoId = null;
let editingFotoCard = null;
let editingFotoUrl = null;
const fotoMsg = document.getElementById('fotoMsg');

// escape teks user biar aman dimasukkan lewat innerHTML
function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str ?? '';
    return div.innerHTML;
}

function buatPhotoCard(item) {
    const div = document.createElement('div');
    div.className = 'photo-card';
    div.dataset.category = item.kategori;

    // foto yang datang dari database punya id -> bisa diedit/dihapus
    // foto statis (ditulis langsung di HTML) gak punya id -> gak dikasih tombol admin
    if (item.id) {
        div.dataset.photoId = item.id;
        div.dataset.caption = item.caption;
        div.dataset.kategori = item.kategori;
        div.dataset.url = item.url;
    }

    div.innerHTML = `
        <img src="${item.url}" alt="${escapeHtml(item.caption)}" style="width:100%; height:100%; object-fit:cover;">
        <div class="photo-caption">${escapeHtml(item.caption)}</div>
        ${item.id ? `
        <div class="photo-admin-actions">
          <button type="button" class="photo-edit-btn" title="Edit foto" aria-label="Edit foto">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
          </button>
          <button type="button" class="photo-delete-btn" title="Hapus foto" aria-label="Hapus foto">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"/></svg>
          </button>
        </div>` : ''}
    `;
    return div;
}

// tempel 1 foto baru di paling atas quickGrid aja (bagian atas galeri kenangan), langsung ikut filter aktif
function tempelFotoBaru(item) {
    if (quickGrid) {
        const card = buatPhotoCard(item);
        const filterAktif = filterTabs?.querySelector('.tab.active')?.dataset.filter || 'Semua';
        if (filterAktif !== 'Semua' && filterAktif !== item.kategori) {
            card.style.display = 'none';
        }
        quickGrid.prepend(card);
        if (emptyState) {
            const adaYangKeliatan = [...quickGrid.querySelectorAll('.photo-card')].some(c => c.style.display !== 'none');
            emptyState.hidden = adaYangKeliatan;
        }
    }
}

// ambil semua foto yang pernah diupload, taruh di atas foto statis yang lama
async function muatGaleriFoto() {
    if (!quickGrid) return; // bukan halaman beranda, skip

    const { data, error } = await supabaseClient
        .from('galeri_foto')
        .select('*')
        .order('created_at', { ascending: true }); // urut lama->baru, ditempel satu-satu di atas

    if (error) {
        console.error('Gagal memuat galeri foto:', error.message);
        return;
    }

    data.forEach((item) => tempelFotoBaru(item));
}

document.addEventListener('DOMContentLoaded', muatGaleriFoto);

// buka modal upload (tombol ini cuma keliatan kalau isAdmin true)
if (btnTambahFoto) {
    btnTambahFoto.addEventListener('click', () => {
        if (!isAdmin) return; // jaga-jaga

        // pastikan modal dalam mode "tambah baru", bukan nyangkut dari mode edit
        editingFotoId = null;
        editingFotoCard = null;
        editingFotoUrl = null;
        if (modalFotoTitle) modalFotoTitle.textContent = 'Tambah Foto ke Galeri';
        if (btnUnggahFoto) btnUnggahFoto.textContent = 'Unggah Foto';
        if (inputFotoFile) inputFotoFile.required = true;
        formFoto?.reset();

        if (fotoMsg) fotoMsg.textContent = '';
        if (modalFoto) modalFoto.style.display = 'flex';
    });
}

if (btnTutupFoto) {
    btnTutupFoto.addEventListener('click', () => {
        if (modalFoto) modalFoto.style.display = 'none';
    });
}

window.addEventListener('click', (e) => {
    if (e.target === modalFoto) modalFoto.style.display = 'none';
});

// buka modal dalam mode EDIT, isi form dengan data foto yang mau diubah
function bukaEditFoto(photoId, card) {
    editingFotoId = photoId;
    editingFotoCard = card;
    editingFotoUrl = card.dataset.url || '';

    if (modalFotoTitle) modalFotoTitle.textContent = 'Edit Foto';
    if (btnUnggahFoto) btnUnggahFoto.textContent = 'Simpan Perubahan';
    if (inputFotoCaption) inputFotoCaption.value = card.dataset.caption || '';
    if (inputFotoKategori) inputFotoKategori.value = card.dataset.kategori || 'Foto';
    if (inputFotoFile) {
        inputFotoFile.required = false; // ganti file itu opsional pas edit
        inputFotoFile.value = '';
    }
    if (fotoMsg) fotoMsg.textContent = '';
    if (modalFoto) modalFoto.style.display = 'flex';
}

// hapus foto dari storage + tabel, lalu hilangin card-nya dari tampilan
async function hapusFoto(photoId, card) {
    const yakin = confirm('Yakin mau hapus foto ini? Foto yang udah dihapus gak bisa dikembalikan.');
    if (!yakin) return;

    const url = card.dataset.url || '';
    const namaFile = url.split('/galeri/').pop();

    if (namaFile) {
        await supabaseClient.storage.from('galeri').remove([namaFile]);
    }

    const { error } = await supabaseClient.from('galeri_foto').delete().eq('id', photoId);

    if (error) {
        alert('Gagal menghapus foto: ' + error.message);
        return;
    }

    card.remove();

    if (emptyState && quickGrid) {
        const adaYangKeliatan = [...quickGrid.querySelectorAll('.photo-card')].some(c => c.style.display !== 'none');
        emptyState.hidden = adaYangKeliatan;
    }
}

// klik tombol edit/hapus di dalam kartu foto (delegasi event, biar foto baru ikut ke-handle juga)
if (quickGrid) {
    quickGrid.addEventListener('click', (e) => {
        const editBtn = e.target.closest('.photo-edit-btn');
        const delBtn = e.target.closest('.photo-delete-btn');
        if (!editBtn && !delBtn) return;

        if (!isAdmin) return; // jaga-jaga

        const card = e.target.closest('.photo-card');
        const photoId = card?.dataset.photoId;
        if (!card || !photoId) return; // foto statis, gak ada di database, gak bisa diedit/dihapus

        if (editBtn) bukaEditFoto(photoId, card);
        if (delBtn) hapusFoto(photoId, card);
    });
}

// submit form: kalau lagi mode edit -> update data lama, kalau enggak -> upload foto baru
if (formFoto) {
    formFoto.addEventListener('submit', async (e) => {
        e.preventDefault();

        if (!currentUser || !isAdmin) {
            alert('Hanya admin yang bisa menambah/mengubah foto.');
            return;
        }

        const file = inputFotoFile.files[0];
        const caption = inputFotoCaption.value.trim();
        const kategori = inputFotoKategori.value;
        const modeEdit = !!editingFotoId;

        if (!modeEdit && !file) {
            fotoMsg.textContent = 'Pilih file foto dulu.';
            return;
        }
        if (!caption) {
            fotoMsg.textContent = 'Keterangan foto tidak boleh kosong.';
            return;
        }

        fotoMsg.style.color = '#666';
        fotoMsg.textContent = modeEdit ? 'Menyimpan perubahan...' : 'Mengunggah foto...';

        // url foto: pakai yang lama kalau edit & gak ganti file, upload baru kalau ada file
        let publicUrl = modeEdit ? editingFotoUrl : null;

        if (file) {
            const ext = file.name.split('.').pop();
            const namaFile = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

            const { error: uploadError } = await supabaseClient.storage
                .from('galeri')
                .upload(namaFile, file);

            if (uploadError) {
                fotoMsg.style.color = '#c0392b';
                fotoMsg.textContent = 'Gagal upload file: ' + uploadError.message;
                return;
            }

            const { data: urlData } = supabaseClient.storage.from('galeri').getPublicUrl(namaFile);
            publicUrl = urlData.publicUrl;
        }

        if (modeEdit) {
            // -- UPDATE FOTO YANG SUDAH ADA --
            const { error: updateError } = await supabaseClient
                .from('galeri_foto')
                .update({ url: publicUrl, caption, kategori })
                .eq('id', editingFotoId);

            if (updateError) {
                fotoMsg.style.color = '#c0392b';
                fotoMsg.textContent = 'Gagal menyimpan perubahan: ' + updateError.message;
                return;
            }

            // update tampilan card yang lagi kebuka tanpa perlu reload halaman
            if (editingFotoCard) {
                editingFotoCard.dataset.category = kategori;
                editingFotoCard.dataset.caption = caption;
                editingFotoCard.dataset.kategori = kategori;
                editingFotoCard.dataset.url = publicUrl;
                const img = editingFotoCard.querySelector('img');
                if (img) { img.src = publicUrl; img.alt = caption; }
                const capEl = editingFotoCard.querySelector('.photo-caption');
                if (capEl) capEl.textContent = caption;
            }

            formFoto.reset();
            fotoMsg.textContent = '';
            if (modalFoto) modalFoto.style.display = 'none';
            editingFotoId = null;
            editingFotoCard = null;
            editingFotoUrl = null;
            alert('Perubahan foto berhasil disimpan!');
        } else {
            // -- TAMBAH FOTO BARU --
            const itemBaru = { url: publicUrl, caption, kategori, uploaded_by: currentUser.id };

            const { data: inserted, error: insertError } = await supabaseClient
                .from('galeri_foto')
                .insert([itemBaru])
                .select()
                .single();

            if (insertError) {
                fotoMsg.style.color = '#c0392b';
                fotoMsg.textContent = 'Foto keupload, tapi gagal disimpan: ' + insertError.message;
                return;
            }

            tempelFotoBaru(inserted || itemBaru);
            formFoto.reset();
            fotoMsg.textContent = '';
            if (modalFoto) modalFoto.style.display = 'none';
            alert('Foto berhasil ditambahkan ke galeri!');
        }
    });
}

/* ==========================================================
   MODAL VIDEO
   ========================================================== */
const videoGrid = document.getElementById('videoGrid');
const videoModal = document.getElementById('videoModal');
const modalClose = document.getElementById('modalClose');
const modalVideoTitle = document.getElementById('modalVideoTitle');

const videoModalContent = document.querySelector('.video-modal-content');

function openVideoModal(title, src) {
  if (!videoModalContent) return;

  if (src) {
    // ada file video -> tampilkan player asli, ukuran nyesuaiin video aslinya
    videoModalContent.classList.remove('is-placeholder');
    videoModalContent.innerHTML = `
      <button class="modal-close" id="modalClose">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
      <video src="${src}" controls autoplay></video>
    `;
  } else {
    // belum ada file video -> placeholder kotak 16:9 seperti biasa
    videoModalContent.classList.add('is-placeholder');
    videoModalContent.innerHTML = `
      <button class="modal-close" id="modalClose">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
      <div class="video-modal-placeholder">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
        <p>Video akan tampil di sini setelah diunggah: ${title}</p>
      </div>
    `;
  }

  // pasang ulang listener tombol close karena elemen baru dibuat
  videoModalContent.querySelector('#modalClose').addEventListener('click', closeVideoModal);

  videoModal.classList.add('open');
}

function closeVideoModal() {
  videoModal.classList.remove('open');
  const video = videoModalContent?.querySelector('video');
  if (video) video.pause(); // stop video pas modal ditutup
}

if (videoGrid && videoModal) {
  videoGrid.addEventListener('click', (e) => {
    if (e.target.closest('.card-admin-actions')) return; // klik tombol admin, jangan buka player video
    const card = e.target.closest('.video-card');
    if (!card) return;
    openVideoModal(card.dataset.title, card.dataset.src);
  });

  // tutup modal kalau klik area gelap di luar konten
  videoModal.addEventListener('click', (e) => {
    if (e.target === videoModal) closeVideoModal();
  });

  // tutup modal dengan tombol Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeVideoModal();
  });
}

/* ==========================================================
   VIDEO MOMEN — CRUD penuh khusus admin (tambah/edit/hapus dari HP)
   ========================================================== */
const btnTutupVideoForm = document.getElementById('btnTutupVideoForm');
const formVideo = document.getElementById('form-video');
const inputVideoFile = document.getElementById('input-video-file');
const inputVideoJudul = document.getElementById('input-video-judul');
const inputVideoDurasi = document.getElementById('input-video-durasi');
const videoFormMsg = document.getElementById('videoFormMsg');
const modalVideoForm = document.getElementById('modalVideoForm');
const modalVideoFormTitle = document.getElementById('modalVideoFormTitle');
const btnSimpanVideo = document.getElementById('btnSimpanVideo');

let editingVideoId = null;
let editingVideoCard = null;
let editingVideoUrl = null;

function buatVideoCard(item) {
    const div = document.createElement('div');
    div.className = 'video-card';
    div.dataset.title = item.judul;
    div.dataset.duration = item.durasi || '';
    div.dataset.src = item.video_url;

    if (item.id) {
        div.dataset.videoId = item.id;
        div.dataset.judul = item.judul;
        div.dataset.durasi = item.durasi || '';
        div.dataset.url = item.video_url;
    }

    div.innerHTML = `
        <span class="play-btn">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
        </span>
        <div class="video-info">
          <p class="video-title">${escapeHtml(item.judul)}</p>
          <span class="video-duration">${escapeHtml(item.durasi || '')}</span>
        </div>
        ${item.id ? `
        <div class="card-admin-actions">
          <button type="button" class="photo-edit-btn video-edit-btn" title="Edit video" aria-label="Edit video">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
          </button>
          <button type="button" class="photo-delete-btn video-delete-btn" title="Hapus video" aria-label="Hapus video">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"/></svg>
          </button>
        </div>` : ''}
    `;
    return div;
}

async function muatVideo() {
    if (!videoGrid) return; // bukan halaman beranda, skip

    const { data, error } = await supabaseClient
        .from('videos')
        .select('*')
        .order('created_at', { ascending: true });

    if (error) {
        console.error('Gagal memuat video:', error.message);
        return;
    }

    videoGrid.innerHTML = '';
    data.forEach((item) => videoGrid.appendChild(buatVideoCard(item)));
}

document.addEventListener('DOMContentLoaded', muatVideo);

function resetFormVideo() {
    editingVideoId = null;
    editingVideoCard = null;
    editingVideoUrl = null;
    if (modalVideoFormTitle) modalVideoFormTitle.textContent = 'Tambah Video';
    if (btnSimpanVideo) btnSimpanVideo.textContent = 'Simpan Video';
    if (inputVideoFile) inputVideoFile.required = true;
    formVideo?.reset();
    if (videoFormMsg) videoFormMsg.textContent = '';
}

if (btnTambahVideo) {
    btnTambahVideo.addEventListener('click', () => {
        if (!isAdmin) return;
        resetFormVideo();
        if (modalVideoForm) modalVideoForm.style.display = 'flex';
    });
}

if (btnTutupVideoForm) {
    btnTutupVideoForm.addEventListener('click', () => {
        if (modalVideoForm) modalVideoForm.style.display = 'none';
    });
}

window.addEventListener('click', (e) => {
    if (e.target === modalVideoForm) modalVideoForm.style.display = 'none';
});

function bukaEditVideo(videoId, card) {
    editingVideoId = videoId;
    editingVideoCard = card;
    editingVideoUrl = card.dataset.url || '';

    if (modalVideoFormTitle) modalVideoFormTitle.textContent = 'Edit Video';
    if (btnSimpanVideo) btnSimpanVideo.textContent = 'Simpan Perubahan';
    if (inputVideoJudul) inputVideoJudul.value = card.dataset.judul || '';
    if (inputVideoDurasi) inputVideoDurasi.value = card.dataset.durasi || '';
    if (inputVideoFile) {
        inputVideoFile.required = false; // ganti file video itu opsional pas edit
        inputVideoFile.value = '';
    }
    if (videoFormMsg) videoFormMsg.textContent = '';
    if (modalVideoForm) modalVideoForm.style.display = 'flex';
}

async function hapusVideo(videoId, card) {
    const yakin = confirm('Yakin mau hapus video ini? Tindakan ini gak bisa dibatalin.');
    if (!yakin) return;

    const url = card.dataset.url || '';
    const namaFile = url.split('/galeri/').pop();
    if (namaFile && !url.startsWith('assets/')) {
        await supabaseClient.storage.from('galeri').remove([namaFile]);
    }

    const { error } = await supabaseClient.from('videos').delete().eq('id', videoId);

    if (error) {
        alert('Gagal menghapus video: ' + error.message);
        return;
    }

    card.remove();
}

if (videoGrid) {
    videoGrid.addEventListener('click', (e) => {
        const editBtn = e.target.closest('.video-edit-btn');
        const delBtn = e.target.closest('.video-delete-btn');
        if (!editBtn && !delBtn) return;

        if (!isAdmin) return;

        const card = e.target.closest('.video-card');
        const videoId = card?.dataset.videoId;
        if (!card || !videoId) return; // video statis lama, gak ada di database

        if (editBtn) bukaEditVideo(videoId, card);
        if (delBtn) hapusVideo(videoId, card);
    });
}

if (formVideo) {
    formVideo.addEventListener('submit', async (e) => {
        e.preventDefault();

        if (!currentUser || !isAdmin) {
            alert('Hanya admin yang bisa menambah/mengubah video.');
            return;
        }

        const file = inputVideoFile.files[0];
        const judul = inputVideoJudul.value.trim();
        const durasi = inputVideoDurasi.value.trim();
        const modeEdit = !!editingVideoId;

        if (!modeEdit && !file) {
            videoFormMsg.textContent = 'Pilih file video dulu.';
            return;
        }
        if (!judul) {
            videoFormMsg.textContent = 'Judul video tidak boleh kosong.';
            return;
        }

        videoFormMsg.style.color = '#666';
        videoFormMsg.textContent = modeEdit ? 'Menyimpan perubahan...' : 'Mengunggah video...';

        let publicUrl = modeEdit ? editingVideoUrl : null;

        if (file) {
            const ext = file.name.split('.').pop();
            const namaFile = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

            const { error: uploadError } = await supabaseClient.storage
                .from('galeri')
                .upload(namaFile, file);

            if (uploadError) {
                videoFormMsg.style.color = '#c0392b';
                videoFormMsg.textContent = 'Gagal upload file: ' + uploadError.message;
                return;
            }

            const { data: urlData } = supabaseClient.storage.from('galeri').getPublicUrl(namaFile);
            publicUrl = urlData.publicUrl;
        }

        if (modeEdit) {
            const { error: updateError } = await supabaseClient
                .from('videos')
                .update({ judul, durasi, video_url: publicUrl })
                .eq('id', editingVideoId);

            if (updateError) {
                videoFormMsg.style.color = '#c0392b';
                videoFormMsg.textContent = 'Gagal menyimpan perubahan: ' + updateError.message;
                return;
            }

            if (editingVideoCard) {
                editingVideoCard.dataset.title = judul;
                editingVideoCard.dataset.duration = durasi;
                editingVideoCard.dataset.src = publicUrl;
                editingVideoCard.dataset.judul = judul;
                editingVideoCard.dataset.durasi = durasi;
                editingVideoCard.dataset.url = publicUrl;
                const titleEl = editingVideoCard.querySelector('.video-title');
                if (titleEl) titleEl.textContent = judul;
                const durasiEl = editingVideoCard.querySelector('.video-duration');
                if (durasiEl) durasiEl.textContent = durasi;
            }

            if (modalVideoForm) modalVideoForm.style.display = 'none';
            alert('Perubahan video berhasil disimpan!');
        } else {
            const itemBaru = { judul, durasi, video_url: publicUrl };

            const { data: inserted, error: insertError } = await supabaseClient
                .from('videos')
                .insert([itemBaru])
                .select()
                .single();

            if (insertError) {
                videoFormMsg.style.color = '#c0392b';
                videoFormMsg.textContent = 'Video keupload, tapi gagal disimpan: ' + insertError.message;
                return;
            }

            videoGrid.appendChild(buatVideoCard(inserted || itemBaru));
            if (modalVideoForm) modalVideoForm.style.display = 'none';
            alert('Video berhasil ditambahkan!');
        }

        resetFormVideo();
    });
}

/* ==========================================================
   MEMBER / PROFIL TEMAN — CRUD penuh khusus admin (tambah/edit/hapus dari HP)
   ========================================================== */
const memberGrid = document.getElementById('memberGrid');
const modalMember = document.getElementById('modalMember');
const modalMemberTitle = document.getElementById('modalMemberTitle');
const btnTutupMember = document.getElementById('btnTutupMember');
const formMember = document.getElementById('form-member');
const inputMemberAvatar = document.getElementById('input-member-avatar');
const inputMemberNama = document.getElementById('input-member-nama');
const inputMemberUsername = document.getElementById('input-member-username');
const inputMemberQuote = document.getElementById('input-member-quote');
const memberMsg = document.getElementById('memberMsg');
const btnSimpanMember = document.getElementById('btnSimpanMember');

let editingMemberId = null;
let editingMemberCard = null;
let editingMemberAvatarUrl = null;

function buatMemberCard(item) {
    const div = document.createElement('div');
    div.className = 'profile-card';

    if (item.id) {
        div.dataset.memberId = item.id;
        div.dataset.nama = item.nama;
        div.dataset.username = item.username || '';
        div.dataset.quote = item.quote || '';
        div.dataset.avatarUrl = item.avatar_url || '';
    }

    div.innerHTML = `
        <div class="profile-avatar"><img src="${item.avatar_url || ''}" alt="${escapeHtml(item.nama)}"></div>
        <p class="profile-name">${escapeHtml(item.nama)}</p>
        <p class="profile-class">${escapeHtml(item.username || '')}</p>
        <p class="profile-quote">"${escapeHtml(item.quote || '')}"</p>
        ${item.id ? `
        <div class="card-admin-actions">
          <button type="button" class="photo-edit-btn member-edit-btn" title="Edit member" aria-label="Edit member">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
          </button>
          <button type="button" class="photo-delete-btn member-delete-btn" title="Hapus member" aria-label="Hapus member">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"/></svg>
          </button>
        </div>` : ''}
    `;
    return div;
}

async function muatMember() {
    if (!memberGrid) return; // bukan halaman member, skip

    const { data, error } = await supabaseClient
        .from('members')
        .select('*')
        .order('created_at', { ascending: true });

    if (error) {
        console.error('Gagal memuat member:', error.message);
        return;
    }

    memberGrid.innerHTML = '';
    data.forEach((item) => memberGrid.appendChild(buatMemberCard(item)));
}

document.addEventListener('DOMContentLoaded', muatMember);

function resetFormMember() {
    editingMemberId = null;
    editingMemberCard = null;
    editingMemberAvatarUrl = null;
    if (modalMemberTitle) modalMemberTitle.textContent = 'Tambah Member';
    if (btnSimpanMember) btnSimpanMember.textContent = 'Simpan Member';
    if (inputMemberAvatar) inputMemberAvatar.required = true;
    formMember?.reset();
    if (memberMsg) memberMsg.textContent = '';
}

if (btnTambahMember) {
    btnTambahMember.addEventListener('click', () => {
        if (!isAdmin) return;
        resetFormMember();
        if (modalMember) modalMember.style.display = 'flex';
    });
}

if (btnTutupMember) {
    btnTutupMember.addEventListener('click', () => {
        if (modalMember) modalMember.style.display = 'none';
    });
}

window.addEventListener('click', (e) => {
    if (e.target === modalMember) modalMember.style.display = 'none';
});

function bukaEditMember(memberId, card) {
    editingMemberId = memberId;
    editingMemberCard = card;
    editingMemberAvatarUrl = card.dataset.avatarUrl || '';

    if (modalMemberTitle) modalMemberTitle.textContent = 'Edit Member';
    if (btnSimpanMember) btnSimpanMember.textContent = 'Simpan Perubahan';
    if (inputMemberNama) inputMemberNama.value = card.dataset.nama || '';
    if (inputMemberUsername) inputMemberUsername.value = card.dataset.username || '';
    if (inputMemberQuote) inputMemberQuote.value = card.dataset.quote || '';
    if (inputMemberAvatar) {
        inputMemberAvatar.required = false; // ganti foto itu opsional pas edit
        inputMemberAvatar.value = '';
    }
    if (memberMsg) memberMsg.textContent = '';
    if (modalMember) modalMember.style.display = 'flex';
}

async function hapusMember(memberId, card) {
    const yakin = confirm('Yakin mau hapus member ini?');
    if (!yakin) return;

    const url = card.dataset.avatarUrl || '';
    if (url.includes('/galeri/')) {
        const namaFile = url.split('/galeri/').pop();
        if (namaFile) await supabaseClient.storage.from('galeri').remove([namaFile]);
    }

    const { error } = await supabaseClient.from('members').delete().eq('id', memberId);

    if (error) {
        alert('Gagal menghapus member: ' + error.message);
        return;
    }

    card.remove();
}

if (memberGrid) {
    memberGrid.addEventListener('click', (e) => {
        const editBtn = e.target.closest('.member-edit-btn');
        const delBtn = e.target.closest('.member-delete-btn');
        if (!editBtn && !delBtn) return;

        if (!isAdmin) return;

        const card = e.target.closest('.profile-card');
        const memberId = card?.dataset.memberId;
        if (!card || !memberId) return; // member statis lama, gak ada di database

        if (editBtn) bukaEditMember(memberId, card);
        if (delBtn) hapusMember(memberId, card);
    });
}

if (formMember) {
    formMember.addEventListener('submit', async (e) => {
        e.preventDefault();

        if (!currentUser || !isAdmin) {
            alert('Hanya admin yang bisa menambah/mengubah member.');
            return;
        }

        const file = inputMemberAvatar.files[0];
        const nama = inputMemberNama.value.trim();
        const username = inputMemberUsername.value.trim();
        const quote = inputMemberQuote.value.trim();
        const modeEdit = !!editingMemberId;

        if (!modeEdit && !file) {
            memberMsg.textContent = 'Pilih foto profil dulu.';
            return;
        }
        if (!nama) {
            memberMsg.textContent = 'Nama tidak boleh kosong.';
            return;
        }

        memberMsg.style.color = '#666';
        memberMsg.textContent = modeEdit ? 'Menyimpan perubahan...' : 'Menambah member...';

        let avatarUrl = modeEdit ? editingMemberAvatarUrl : null;

        if (file) {
            const ext = file.name.split('.').pop();
            const namaFile = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

            const { error: uploadError } = await supabaseClient.storage
                .from('galeri')
                .upload(namaFile, file);

            if (uploadError) {
                memberMsg.style.color = '#c0392b';
                memberMsg.textContent = 'Gagal upload foto: ' + uploadError.message;
                return;
            }

            const { data: urlData } = supabaseClient.storage.from('galeri').getPublicUrl(namaFile);
            avatarUrl = urlData.publicUrl;
        }

        if (modeEdit) {
            const { error: updateError } = await supabaseClient
                .from('members')
                .update({ nama, username, quote, avatar_url: avatarUrl })
                .eq('id', editingMemberId);

            if (updateError) {
                memberMsg.style.color = '#c0392b';
                memberMsg.textContent = 'Gagal menyimpan perubahan: ' + updateError.message;
                return;
            }

            if (editingMemberCard) {
                editingMemberCard.dataset.nama = nama;
                editingMemberCard.dataset.username = username;
                editingMemberCard.dataset.quote = quote;
                editingMemberCard.dataset.avatarUrl = avatarUrl;
                const img = editingMemberCard.querySelector('.profile-avatar img');
                if (img) img.src = avatarUrl;
                const namaEl = editingMemberCard.querySelector('.profile-name');
                if (namaEl) namaEl.textContent = nama;
                const usernameEl = editingMemberCard.querySelector('.profile-class');
                if (usernameEl) usernameEl.textContent = username;
                const quoteEl = editingMemberCard.querySelector('.profile-quote');
                if (quoteEl) quoteEl.textContent = `"${quote}"`;
            }

            if (modalMember) modalMember.style.display = 'none';
            alert('Perubahan member berhasil disimpan!');
        } else {
            const itemBaru = { nama, username, quote, avatar_url: avatarUrl };

            const { data: inserted, error: insertError } = await supabaseClient
                .from('members')
                .insert([itemBaru])
                .select()
                .single();

            if (insertError) {
                memberMsg.style.color = '#c0392b';
                memberMsg.textContent = 'Gagal menyimpan member: ' + insertError.message;
                return;
            }

            memberGrid.appendChild(buatMemberCard(inserted || itemBaru));
            if (modalMember) modalMember.style.display = 'none';
            alert('Member berhasil ditambahkan!');
        }

        resetFormMember();
    });
}
