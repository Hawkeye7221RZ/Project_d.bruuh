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
  const cards = quickGrid.querySelectorAll('.photo-card');

  filterTabs.addEventListener('click', (e) => {
    const btn = e.target.closest('.tab');
    if (!btn) return;

    // toggle active state pada tab
    tabs.forEach((t) => t.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;
    let visibleCount = 0;

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

const modalAuth = document.getElementById('modalAuth');
const btnMasuk = document.getElementById('btnMasuk');
const btnMasukText = document.getElementById('btnMasukText');
const btnTutupAuth = document.getElementById('btnTutupAuth');
const authTabs = document.querySelectorAll('.auth-tab');
const formLogin = document.getElementById('form-login');
const formDaftar = document.getElementById('form-daftar');
const loginMsg = document.getElementById('loginMsg');
const daftarMsg = document.getElementById('daftarMsg');

let currentUser = null; // { id, nama, email }

// 3. STATUS LOGIN — cek sesi saat load & pantau perubahan (login/logout)
async function refreshUserUI() {
    const { data: { session } } = await supabaseClient.auth.getSession();

    if (session && session.user) {
        currentUser = {
            id: session.user.id,
            email: session.user.email,
            nama: session.user.user_metadata?.nama || session.user.email,
        };
        if (btnMasukText) btnMasukText.textContent = `Keluar (${currentUser.nama})`;
        if (pesanNamaDisplay) pesanNamaDisplay.textContent = currentUser.nama;
    } else {
        currentUser = null;
        if (btnMasukText) btnMasukText.textContent = 'Masuk';
        if (pesanNamaDisplay) pesanNamaDisplay.textContent = '-';
    }
}

supabaseClient.auth.onAuthStateChange(() => refreshUserUI());
refreshUserUI();

// 4. TOMBOL MASUK / KELUAR DI NAVBAR
if (btnMasuk) {
    btnMasuk.addEventListener('click', async () => {
        if (currentUser) {
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
            <h3>${item.nama}</h3>
            <p>"${item.pesan}"</p>
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

      const { error } = await supabaseClient.from('pesan_kesan')
     .insert([{ nama: currentUser.nama, pesan: pesan, user_id: currentUser.id }]);

        if (error) {
            alert('Gagal mengirim: ' + error.message);
            return;
        }

        // kalau user milih bintang, kirim/update rating-nya juga (nggak wajib, opsional)
        if (ratingDipilih > 0) {
            const { error: ratingError } = await supabaseClient.from('ratings').upsert(
                {
                    user_id: currentUser.id,
                    nama: currentUser.nama,
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
    // ada file video -> tampilkan player asli
    videoModalContent.innerHTML = `
      <button class="modal-close" id="modalClose">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
      <video src="${src}" controls autoplay style="width:100%;border-radius:8px;"></video>
    `;
  } else {
    // belum ada file video -> placeholder seperti biasa
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
