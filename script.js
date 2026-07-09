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

// 3a. CEK STATUS ADMIN — dipakai buat nampilin tombol "Tambah Foto"
const btnTambahFoto = document.getElementById('btnTambahFoto');
let isAdmin = false;

async function checkIsAdmin() {
    if (!btnTambahFoto) return; // halaman ini gak punya tombol upload foto

    if (!currentUser) {
        isAdmin = false;
        btnTambahFoto.style.display = 'none';
        return;
    }

    const { data, error } = await supabaseClient
        .from('admins')
        .select('user_id')
        .eq('user_id', currentUser.id)
        .maybeSingle();

    isAdmin = !error && !!data;
    btnTambahFoto.style.display = isAdmin ? '' : 'none';
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
        card.innerHTML = `
            <p class="pesan-nama"><strong>Pengirim:</strong> ${item.nama}</p>
            <p class="pesan-isi"><strong>Pesan:</strong> ${item.pesan}</p>
        `;
        containerPesan.appendChild(card);
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
const fotoMsg = document.getElementById('fotoMsg');
const galleryGridEl = document.querySelector('.gallery-grid');

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
    div.innerHTML = `
        <img src="${item.url}" alt="${escapeHtml(item.caption)}" style="width:100%; height:100%; object-fit:cover;">
        <div class="photo-caption">${escapeHtml(item.caption)}</div>
    `;
    return div;
}

function buatGalleryCard(item) {
    const div = document.createElement('div');
    div.className = 'gallery-card';
    div.innerHTML = `
        <img src="${item.url}" alt="${escapeHtml(item.caption)}" style="width:100%; height:100%; object-fit:cover;">
        <div class="gallery-overlay"><span class="tag">${escapeHtml(item.kategori)}</span><span class="caption">${escapeHtml(item.caption)}</span></div>
    `;
    return div;
}

// tempel 1 foto baru di paling atas kedua grid, langsung ikut filter aktif
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
    if (galleryGridEl) {
        galleryGridEl.prepend(buatGalleryCard(item));
    }
}

// ambil semua foto yang pernah diupload, taruh di atas foto statis yang lama
async function muatGaleriFoto() {
    if (!quickGrid && !galleryGridEl) return; // bukan halaman beranda, skip

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

// submit form upload: kirim file ke Storage, lalu simpan metadatanya ke tabel
if (formFoto) {
    formFoto.addEventListener('submit', async (e) => {
        e.preventDefault();

        if (!currentUser || !isAdmin) {
            alert('Hanya admin yang bisa menambah foto.');
            return;
        }

        const file = inputFotoFile.files[0];
        const caption = inputFotoCaption.value.trim();
        const kategori = inputFotoKategori.value;

        if (!file) {
            fotoMsg.textContent = 'Pilih file foto dulu.';
            return;
        }
        if (!caption) {
            fotoMsg.textContent = 'Keterangan foto tidak boleh kosong.';
            return;
        }

        fotoMsg.style.color = '#666';
        fotoMsg.textContent = 'Mengunggah foto...';

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
        const publicUrl = urlData.publicUrl;

        const itemBaru = { url: publicUrl, caption, kategori, uploaded_by: currentUser.id };

        const { error: insertError } = await supabaseClient.from('galeri_foto').insert([itemBaru]);

        if (insertError) {
            fotoMsg.style.color = '#c0392b';
            fotoMsg.textContent = 'Foto keupload, tapi gagal disimpan: ' + insertError.message;
            return;
        }

        tempelFotoBaru(itemBaru); // langsung tampil tanpa perlu reload
        formFoto.reset();
        fotoMsg.textContent = '';
        if (modalFoto) modalFoto.style.display = 'none';
        alert('Foto berhasil ditambahkan ke galeri!');
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
