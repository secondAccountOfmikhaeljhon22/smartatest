// ==================== APP.JS - MINDCHECK INDONESIA ====================

// ==================== GLOBAL STATE ====================
let currentUser = JSON.parse(localStorage.getItem('mindcheck_user')) || null;
let currentPage = 'home';
let currentTesStep = 0;
let tesAnswers = [];
let currentTesQuestion = 0;
let activeChatId = null;
let jadwalMode = 'user';
let mapInstance = null;
let mapMarkers = [];
let userLocation = null;
let mapsDokterList = [];
let currentFilter = 'semua';
let currentSort = 'jarak';
let selectedDokterMap = null;
let sidebarOpen = false;

// ==================== DATA DUMMY DOKTER ====================
const allDoctors = [
    {
        id: 1,
        name: 'Dr. Ratna Dewi, Sp.KJ',
        type: 'psikiater',
        spesialis: 'Psikiater',
        subSpesialis: 'Depresi & Kecemasan',
        city: 'Jakarta Pusat',
        distance: 2.3,
        rating: 4.9,
        reviewCount: 128,
        online: true,
        schedule: ['Senin', 'Rabu', 'Jumat'],
        timeSlots: ['09:00', '10:00', '13:00', '15:00', '16:30'],
        avatarBg: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
        avatarIcon: '👩‍⚕️',
        price: 'Rp 250.000 - 400.000',
        pengalaman: '12 tahun',
        alumni: 'Universitas Indonesia',
        lat: -6.2088,
        lng: 106.8456
    },
    {
        id: 2,
        name: 'Dr. Ahmad Fauzi, M.Psi',
        type: 'psikolog',
        spesialis: 'Psikolog Klinis',
        subSpesialis: 'Terapi CBT & Trauma',
        city: 'Jakarta Selatan',
        distance: 3.8,
        rating: 4.8,
        reviewCount: 96,
        online: true,
        schedule: ['Selasa', 'Kamis', 'Sabtu'],
        timeSlots: ['08:30', '10:30', '14:00', '16:00', '19:00'],
        avatarBg: 'linear-gradient(135deg, #059669, #10b981)',
        avatarIcon: '🧑‍⚕️',
        price: 'Rp 200.000 - 350.000',
        pengalaman: '8 tahun',
        alumni: 'Universitas Gadjah Mada',
        lat: -6.2608,
        lng: 106.8216
    },
    {
        id: 3,
        name: 'Dr. Maya Sari, Sp.KJ',
        type: 'psikiater',
        spesialis: 'Psikiater',
        subSpesialis: 'Gangguan Bipolar & Mood',
        city: 'Bandung',
        distance: 5.1,
        rating: 4.7,
        reviewCount: 84,
        online: true,
        schedule: ['Senin', 'Selasa', 'Kamis'],
        timeSlots: ['09:30', '11:00', '14:30', '17:00'],
        avatarBg: 'linear-gradient(135deg, #dc2626, #f97316)',
        avatarIcon: '👩‍⚕️',
        price: 'Rp 300.000 - 450.000',
        pengalaman: '15 tahun',
        alumni: 'Universitas Padjadjaran',
        lat: -6.9175,
        lng: 107.6191
    },
    {
        id: 4,
        name: 'Budi Hartono, M.Psi',
        type: 'psikolog',
        spesialis: 'Psikolog',
        subSpesialis: 'Konseling Keluarga & Anak',
        city: 'Surabaya',
        distance: 7.2,
        rating: 4.6,
        reviewCount: 67,
        online: false,
        schedule: ['Rabu', 'Jumat', 'Minggu'],
        timeSlots: ['08:00', '10:00', '13:30', '15:30'],
        avatarBg: 'linear-gradient(135deg, #2563eb, #06b6d4)',
        avatarIcon: '🧑‍⚕️',
        price: 'Rp 175.000 - 300.000',
        pengalaman: '6 tahun',
        alumni: 'Universitas Airlangga',
        lat: -7.2575,
        lng: 112.7521
    },
    {
        id: 5,
        name: 'Dr. Siti Rahayu, Sp.KJ',
        type: 'psikiater',
        spesialis: 'Psikiater',
        subSpesialis: 'Psikosis & Skizofrenia',
        city: 'Yogyakarta',
        distance: 4.5,
        rating: 4.8,
        reviewCount: 112,
        online: true,
        schedule: ['Senin', 'Rabu', 'Jumat'],
        timeSlots: ['09:00', '11:30', '15:00', '17:30'],
        avatarBg: 'linear-gradient(135deg, #b45309, #d97706)',
        avatarIcon: '👩‍⚕️',
        price: 'Rp 275.000 - 425.000',
        pengalaman: '14 tahun',
        alumni: 'Universitas Indonesia',
        lat: -7.7956,
        lng: 110.3695
    },
    {
        id: 6,
        name: 'Dian Pratama, M.Psi',
        type: 'psikolog',
        spesialis: 'Psikolog Klinis',
        subSpesialis: 'Terapi Mindfulness & Stress',
        city: 'Jakarta Timur',
        distance: 6.0,
        rating: 4.5,
        reviewCount: 53,
        online: true,
        schedule: ['Selasa', 'Kamis', 'Sabtu'],
        timeSlots: ['08:00', '09:30', '13:00', '16:30', '20:00'],
        avatarBg: 'linear-gradient(135deg, #0d9488, #14b8a6)',
        avatarIcon: '🧑‍⚕️',
        price: 'Rp 180.000 - 320.000',
        pengalaman: '5 tahun',
        alumni: 'Universitas Diponegoro',
        lat: -6.2285,
        lng: 106.8915
    },
    {
        id: 7,
        name: 'Dr. Reza Firmansyah, Sp.KJ',
        type: 'psikiater',
        spesialis: 'Psikiater',
        subSpesialis: 'Gangguan Kecemasan & Panik',
        city: 'Tangerang',
        distance: 8.3,
        rating: 4.7,
        reviewCount: 75,
        online: true,
        schedule: ['Senin', 'Kamis', 'Sabtu'],
        timeSlots: ['10:00', '12:00', '15:30', '18:00'],
        avatarBg: 'linear-gradient(135deg, #1e40af, #3b82f6)',
        avatarIcon: '👨‍⚕️',
        price: 'Rp 260.000 - 400.000',
        pengalaman: '10 tahun',
        alumni: 'Universitas Sumatera Utara',
        lat: -6.1783,
        lng: 106.6319
    },
    {
        id: 8,
        name: 'Nurul Hidayah, M.Psi',
        type: 'psikolog',
        spesialis: 'Psikolog',
        subSpesialis: 'Konseling Remaja & Dewasa Muda',
        city: 'Depok',
        distance: 3.2,
        rating: 4.6,
        reviewCount: 61,
        online: false,
        schedule: ['Rabu', 'Jumat', 'Minggu'],
        timeSlots: ['09:00', '11:00', '14:00', '16:00'],
        avatarBg: 'linear-gradient(135deg, #be185d, #ec4899)',
        avatarIcon: '👩‍⚕️',
        price: 'Rp 160.000 - 280.000',
        pengalaman: '7 tahun',
        alumni: 'Universitas Indonesia',
        lat: -6.3940,
        lng: 106.8242
    }
];

// ==================== PERTANYAAN TES MENTAL ====================
const tesQuestions = [
    {
        category: 'Suasana Hati',
        categoryColor: '#dbeafe',
        categoryText: '#1d4ed8',
        text: 'Seberapa sering kamu merasa sedih, murung, atau putus asa dalam 2 minggu terakhir?',
        hint: 'Pilih salah satu yang paling menggambarkan kondisimu',
        type: 'slider',
        min: 0,
        max: 10,
        step: 1,
        labels: ['Tidak pernah', 'Sering sekali'],
        weight: 2 // Bobot untuk scoring
    },
    {
        category: 'Kecemasan',
        categoryColor: '#fce7f3',
        categoryText: '#9d174d',
        text: 'Seberapa sering kamu merasa cemas, khawatir berlebihan, atau sulit mengendalikan rasa takut?',
        hint: 'Pilih berdasarkan 2 minggu terakhir',
        type: 'slider',
        min: 0,
        max: 10,
        step: 1,
        labels: ['Tidak pernah', 'Hampir setiap hari'],
        weight: 2
    },
    {
        category: 'Tidur',
        categoryColor: '#dcfce7',
        categoryText: '#166534',
        text: 'Bagaimana kualitas tidurmu dalam seminggu terakhir?',
        hint: 'Nilai 0 = sangat buruk, 10 = sangat baik',
        type: 'slider',
        min: 0,
        max: 10,
        step: 1,
        labels: ['Sangat buruk', 'Sangat baik'],
        weight: 1.5,
        reverse: true // Nilai rendah = masalah
    },
    {
        category: 'Energi',
        categoryColor: '#fef3c7',
        categoryText: '#92400e',
        text: 'Seberapa sering kamu merasa lelah, kurang energi, atau sulit berkonsentrasi?',
        hint: 'Pilih berdasarkan 2 minggu terakhir',
        type: 'slider',
        min: 0,
        max: 10,
        step: 1,
        labels: ['Tidak pernah', 'Hampir setiap hari'],
        weight: 1.5
    },
    {
        category: 'Sosial',
        categoryColor: '#e0e7ff',
        categoryText: '#3730a3',
        text: 'Apakah kamu cenderung menghindari interaksi sosial atau merasa tidak nyaman saat bersama orang lain?',
        hint: 'Nilai 0 = tidak sama sekali, 10 = sangat menghindar',
        type: 'slider',
        min: 0,
        max: 10,
        step: 1,
        labels: ['Tidak menghindar', 'Sangat menghindar'],
        weight: 1
    },
    {
        category: 'Fisik',
        categoryColor: '#fce4ec',
        categoryText: '#c62828',
        text: 'Apakah kamu mengalami gejala fisik seperti sakit kepala, nyeri otot, atau gangguan pencernaan tanpa penyebab medis yang jelas?',
        hint: 'Pilih berdasarkan 2 minggu terakhir',
        type: 'slider',
        min: 0,
        max: 10,
        step: 1,
        labels: ['Tidak ada gejala', 'Banyak gejala'],
        weight: 1
    },
    {
        category: 'Harga Diri',
        categoryColor: '#e8eaf6',
        categoryText: '#283593',
        text: 'Bagaimana perasaanmu tentang diri sendiri akhir-akhir ini?',
        hint: 'Nilai 0 = sangat negatif, 10 = sangat positif',
        type: 'slider',
        min: 0,
        max: 10,
        step: 1,
        labels: ['Sangat negatif', 'Sangat positif'],
        weight: 1.5,
        reverse: true
    },
    {
        category: 'Keselamatan',
        categoryColor: '#ffebee',
        categoryText: '#b71c1c',
        text: 'Apakah kamu memiliki pikiran untuk menyakiti diri sendiri atau mengakhiri hidup?',
        hint: 'Jawab dengan jujur. Jika nilaimu tinggi, kami sangat menyarankanmu segera mencari bantuan profesional.',
        type: 'slider',
        min: 0,
        max: 10,
        step: 1,
        labels: ['Tidak sama sekali', 'Sangat sering'],
        weight: 3,
        critical: true
    }
];

// ==================== CHAT DATA ====================
let chatHistory = JSON.parse(localStorage.getItem('mindcheck_chats')) || {};

// ==================== INISIALISASI ====================
document.addEventListener('DOMContentLoaded', function () {
    initAuth();
    showPage('home');
    initMaps();
    renderDokterList();
    updateProfileFromLocal();
    generateRekomendasi();
    renderUserJadwal();
    renderDokterJadwal();
    renderChatList();
});

// ==================== NAVIGASI HALAMAN ====================
function showPage(pageName) {
    // Sembunyikan semua halaman
    document.querySelectorAll('.page').forEach(p => p.classList.add('hidden'));

    // Tampilkan halaman yang dipilih
    const page = document.getElementById('page-' + pageName);
    if (page) {
        page.classList.remove('hidden');
        currentPage = pageName;

        // Update nav aktif
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        const navMap = {
            'home': 0,
            'articles': 1,
            'tes': 2,
            'dokter': 3,
            'jadwal': 4,
            'maps': 5,
            'tentang': 6
        };
        const idx = navMap[pageName] !== undefined ? navMap[pageName] : -1;
        if (idx >= 0) {
            const links = document.querySelectorAll('.nav-link');
            if (links[idx]) links[idx].classList.add('active');
        }

        // Inisialisasi peta jika ke halaman maps
        if (pageName === 'maps') {
            setTimeout(() => {
                if (mapInstance) mapInstance.invalidateSize();
            }, 100);
        }

        // Generate rekomendasi jika ke halaman rekomendasi
        if (pageName === 'rekomendasi') {
            generateRekomendasi();
        }

        // Scroll ke atas
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

// ==================== TOAST ====================
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast ${type} show`;
    clearTimeout(toast._timeout);
    toast._timeout = setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// ==================== SIDEBAR ====================
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    if (sidebar.classList.contains('open')) {
        closeSidebar();
    } else {
        sidebar.classList.add('open');
        overlay.classList.add('active');
        sidebarOpen = true;
    }
}

function closeSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    sidebar.classList.remove('open');
    overlay.classList.remove('active');
    sidebarOpen = false;
}

// ==================== MODAL LOGIN ====================
function openModal(type) {
    const modal = document.getElementById('authModal');
    const overlay = document.getElementById('modalOverlay');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');

    if (type === 'login') {
        loginForm.classList.remove('hidden');
        registerForm.classList.add('hidden');
    } else {
        registerForm.classList.remove('hidden');
        loginForm.classList.add('hidden');
    }

    modal.classList.add('active');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    const modal = document.getElementById('authModal');
    const overlay = document.getElementById('modalOverlay');
    modal.classList.remove('active');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
}

function switchForm(type) {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    if (type === 'register') {
        loginForm.classList.add('hidden');
        registerForm.classList.remove('hidden');
    } else {
        registerForm.classList.add('hidden');
        loginForm.classList.remove('hidden');
    }
}

function togglePass(inputId, icon) {
    const input = document.getElementById(inputId);
    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        input.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
}

function doLogin() {
    const email = document.getElementById('loginEmail').value.trim();
    const pass = document.getElementById('loginPass').value;

    if (!email || !pass) {
        showToast('Mohon isi semua field', 'error');
        return;
    }

    const userData = localStorage.getItem('mindcheck_user');
    if (!userData) {
        showToast('Akun belum terdaftar. Silakan daftar dahulu.', 'error');
        return;
    }

    const user = JSON.parse(userData);
    if (user.email === email && user.password === pass) {
        currentUser = user;
        showToast('Login berhasil! Selamat datang.', 'success');
        updateUIAfterAuth();
        closeModal();
    } else {
        showToast('Email atau password salah', 'error');
    }
}

function doRegister() {
    const name = document.getElementById('regName').value.trim();
    const email = document.getElementById('regEmail').value.trim();
    const pass = document.getElementById('regPass').value;
    const pass2 = document.getElementById('regPass2').value;

    if (!name || !email || !pass || !pass2) {
        showToast('Mohon isi semua field', 'error');
        return;
    }

    if (pass !== pass2) {
        showToast('Konfirmasi password tidak cocok', 'error');
        return;
    }

    if (pass.length < 8) {
        showToast('Password minimal 8 karakter', 'error');
        return;
    }

    const user = {
        name: name,
        email: email,
        password: pass,
        registeredAt: new Date().toISOString()
    };

    localStorage.setItem('mindcheck_user', JSON.stringify(user));
    currentUser = user;
    showToast('Pendaftaran berhasil!', 'success');
    updateUIAfterAuth();
    closeModal();
}

function logout() {
    currentUser = null;
    localStorage.removeItem('mindcheck_user');
    showToast('Anda telah keluar', 'success');
    updateUIAfterAuth();
    closeSidebar();
}

function initAuth() {
    if (currentUser) {
        updateUIAfterAuth();
    }
}

function updateUIAfterAuth() {
    const guestDiv = document.getElementById('nav-guest');
    const userDiv = document.getElementById('nav-user');
    const navAvatar = document.getElementById('navAvatar');
    const navName = document.getElementById('navName');
    const sidebarAvatar = document.getElementById('sidebarAvatar');
    const sidebarName = document.getElementById('sidebarName');
    const sidebarEmail = document.getElementById('sidebarEmail');

    if (currentUser) {
        guestDiv.classList.add('hidden');
        userDiv.classList.remove('hidden');

        const initial = currentUser.name.charAt(0).toUpperCase();
        navAvatar.textContent = initial;
        navName.textContent = currentUser.name;
        sidebarAvatar.textContent = initial;
        sidebarName.textContent = currentUser.name;
        sidebarEmail.textContent = currentUser.email;
    } else {
        guestDiv.classList.remove('hidden');
        userDiv.classList.add('hidden');
    }

    updateProfileFromLocal();
}

function updateProfileFromLocal() {
    const profileAvatarBig = document.getElementById('profileAvatarBig');
    const profileFullName = document.getElementById('profileFullName');
    const profileFullEmail = document.getElementById('profileFullEmail');

    if (currentUser && profileAvatarBig) {
        profileAvatarBig.textContent = currentUser.name.charAt(0).toUpperCase();
        profileFullName.textContent = currentUser.name;
        profileFullEmail.textContent = currentUser.email;
    }

    // Update stats
    const testHistory = JSON.parse(localStorage.getItem('mindcheck_tests')) || [];
    if (document.getElementById('pStatTes')) {
        document.getElementById('pStatTes').textContent = testHistory.length;
    }
}

// ==================== TES MENTAL ====================
function tesMulai() {
    tesAnswers = [];
    currentTesQuestion = 0;

    // Sembunyikan step 0, tampilkan step questions
    document.getElementById('tes-step-0').classList.add('hidden');
    document.getElementById('tes-step-questions').classList.remove('hidden');
    document.getElementById('tes-step-hasil').classList.add('hidden');

    renderQuestion();
}

function renderQuestion() {
    const q = tesQuestions[currentTesQuestion];
    const total = tesQuestions.length;
    const progressPct = ((currentTesQuestion) / total) * 100;

    document.getElementById('tesProgressBar').style.width = progressPct + '%';
    document.getElementById('tesStepLabel').textContent = `Pertanyaan ${currentTesQuestion + 1} dari ${total}`;

    const btnBack = document.getElementById('tesBtnBack');
    const btnNext = document.getElementById('tesBtnNext');

    btnBack.style.display = currentTesQuestion === 0 ? 'none' : 'block';
    btnNext.textContent = currentTesQuestion === total - 1 ? 'Lihat Hasil →' : 'Lanjut →';

    // Cek apakah sudah ada jawaban
    const existingAnswer = tesAnswers[currentTesQuestion];
    const existingValue = existingAnswer !== undefined ? existingAnswer : null;

    let html = `
        <span class="tes-q-category" style="background:${q.categoryColor};color:${q.categoryText};">
            ${q.category}
        </span>
        <div class="tes-q-number">Pertanyaan ${currentTesQuestion + 1} dari ${total}</div>
        <div class="tes-q-text">${q.text}</div>
        <div class="tes-q-hint">${q.hint}</div>
    `;

    if (q.type === 'slider') {
        html += `
            <div class="tes-slider-wrap">
                <input type="range" class="tes-slider" id="tesSlider" 
                    min="${q.min}" max="${q.max}" step="${q.step}" 
                    value="${existingValue !== null ? existingValue : Math.round((q.max - q.min) / 2)}"
                    oninput="updateSliderValue(this.value, '${q.labels[0]}', '${q.labels[1]}')" />
                <div class="tes-slider-labels">
                    <span>${q.labels[0]}</span>
                    <span>${q.labels[1]}</span>
                </div>
                <div class="tes-slider-value" id="tesSliderValue">${existingValue !== null ? existingValue : Math.round((q.max - q.min) / 2)}</div>
            </div>
        `;
    }

    document.getElementById('tesQuestionCard').innerHTML = html;

    // Enable/disable next button
    if (existingValue !== null) {
        btnNext.disabled = false;
    } else {
        btnNext.disabled = false; // Karena slider selalu punya nilai default
    }
}

function updateSliderValue(val, labelLow, labelHigh) {
    document.getElementById('tesSliderValue').textContent = val;
}

function tesNext() {
    // Simpan jawaban
    const slider = document.getElementById('tesSlider');
    if (slider) {
        tesAnswers[currentTesQuestion] = parseInt(slider.value);
    }

    if (currentTesQuestion < tesQuestions.length - 1) {
        currentTesQuestion++;
        renderQuestion();
    } else {
        // Tampilkan hasil
        tampilkanHasilTes();
    }
}

function tesPrev() {
    // Simpan jawaban
    const slider = document.getElementById('tesSlider');
    if (slider) {
        tesAnswers[currentTesQuestion] = parseInt(slider.value);
    }

    if (currentTesQuestion > 0) {
        currentTesQuestion--;
        renderQuestion();
    }
}

function tampilkanHasilTes() {
    document.getElementById('tes-step-questions').classList.add('hidden');
    document.getElementById('tes-step-hasil').classList.remove('hidden');

    // Hitung skor
    let totalScore = 0;
    let maxScore = 0;
    let detectedSymptoms = [];
    let depressionScore = 0;
    let anxietyScore = 0;
    let sleepScore = 0;

    tesQuestions.forEach((q, i) => {
        const answer = tesAnswers[i];
        const weight = q.weight || 1;
        const maxQ = q.max;

        let weightedScore;
        if (q.reverse) {
            weightedScore = (maxQ - answer) * weight;
        } else {
            weightedScore = answer * weight;
        }

        totalScore += weightedScore;
        maxScore += maxQ * weight;

        // Deteksi gejala
        if (q.category === 'Suasana Hati') {
            depressionScore = answer;
            if (answer >= 6) detectedSymptoms.push('Suasana hati menurun (depresi)');
        }
        if (q.category === 'Kecemasan') {
            anxietyScore = answer;
            if (answer >= 6) detectedSymptoms.push('Kecemasan berlebihan');
        }
        if (q.category === 'Tidur') {
            sleepScore = answer;
            if (answer <= 4) detectedSymptoms.push('Gangguan tidur');
        }
        if (q.category === 'Energi' && answer >= 6) {
            detectedSymptoms.push('Kelelahan / kurang energi');
        }
        if (q.category === 'Sosial' && answer >= 6) {
            detectedSymptoms.push('Menghindari interaksi sosial');
        }
        if (q.category === 'Fisik' && answer >= 6) {
            detectedSymptoms.push('Gejala fisik tanpa penyebab medis');
        }
        if (q.category === 'Harga Diri' && answer <= 4) {
            detectedSymptoms.push('Harga diri rendah');
        }
        if (q.category === 'Keselamatan') {
            const criticalAnswer = answer;
            if (criticalAnswer >= 5) {
                detectedSymptoms.push('⚠️ Pikiran menyakiti diri sendiri (URGENT)');
            }
        }
    });

    // Normalisasi ke 0-100
    const normalizedScore = Math.round((totalScore / maxScore) * 100);

    // Tentukan level
    let level, levelEmoji, levelColor, deskripsi, recommendation;

    const criticalAnswer = tesAnswers[7]; // Pertanyaan keselamatan

    if (criticalAnswer >= 7) {
        level = 'Berat (Krisis)';
        levelEmoji = '🆘';
        levelColor = '#dc2626';
        deskripsi = 'Kamu menunjukkan tanda-tanda krisis yang memerlukan bantuan segera. Mohon jangan ragu untuk mencari pertolongan profesional sekarang juga.';
        recommendation = 'psikiater';
    } else if (normalizedScore >= 65) {
        level = 'Berat';
        levelEmoji = '🔴';
        levelColor = '#ef4444';
        deskripsi = 'Kondisi kesehatan mentalmu menunjukkan gejala yang signifikan. Kami sangat menyarankan kamu untuk berkonsultasi dengan psikiater untuk evaluasi lebih lanjut.';
        recommendation = 'psikiater';
    } else if (normalizedScore >= 35) {
        level = 'Sedang';
        levelEmoji = '🟡';
        levelColor = '#f59e0b';
        deskripsi = 'Kondisimu menunjukkan beberapa gejala yang perlu diperhatikan. Konsultasi dengan psikolog atau psikiater dapat membantu kamu mengelola kondisi ini.';
        recommendation = 'psikolog';
    } else {
        level = 'Ringan';
        levelEmoji = '🟢';
        levelColor = '#22c55e';
        deskripsi = 'Kondisi kesehatan mentalmu terpantau baik. Tetap jaga dengan rutinitas sehat dan jangan ragu mencari bantuan jika gejala meningkat.';
        recommendation = 'psikolog';
    }

    if (detectedSymptoms.length === 0) {
        detectedSymptoms.push('Tidak ada gejala signifikan terdeteksi');
    }

    // Simpan hasil ke localStorage
    const testResult = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        answers: [...tesAnswers],
        totalScore: normalizedScore,
        maxScore: 100,
        level: level,
        depressionScore: depressionScore,
        anxietyScore: anxietyScore,
        sleepScore: sleepScore,
        recommendation: recommendation,
        detectedSymptoms: detectedSymptoms.slice(0, 6),
        deskripsi: deskripsi
    };

    let testHistory = JSON.parse(localStorage.getItem('mindcheck_tests')) || [];
    testHistory.unshift(testResult); // Tambahkan di awal
    if (testHistory.length > 10) testHistory = testHistory.slice(0, 10); // Batasi 10
    localStorage.setItem('mindcheck_tests', JSON.stringify(testHistory));

    // Dapatkan rekomendasi dokter berdasarkan hasil
    const recommendedDoctors = getRecommendedDoctors(recommendation, normalizedScore);

    // Render tampilan hasil
    renderHasilTes(testResult, recommendedDoctors);
}

function getRecommendedDoctors(recommendedType, score) {
    let filtered;

    if (score >= 65 || tesAnswers[7] >= 5) {
        // Rekomendasi kuat untuk psikiater
        filtered = allDoctors.filter(d => d.type === 'psikiater');
    } else if (score >= 35) {
        // Campuran, tapi prioritas sesuai rekomendasi
        filtered = allDoctors.filter(d => d.type === recommendedType);
        if (filtered.length < 3) {
            filtered = allDoctors; // Fallback ke semua
        }
    } else {
        filtered = allDoctors.filter(d => d.type === 'psikolog');
    }

    // Hitung skor kecocokan
    const scored = filtered.map(d => {
        let matchScore = 50;
        matchScore += d.rating * 8;
        matchScore -= Math.min(d.distance * 2, 20);
        matchScore += d.online ? 10 : 0;
        matchScore += Math.min(d.reviewCount / 5, 10);
        matchScore = Math.round(matchScore);
        matchScore = Math.max(30, Math.min(98, matchScore));
        return { ...d, matchScore: matchScore };
    });

    scored.sort((a, b) => b.matchScore - a.matchScore);
    return scored.slice(0, 4);
}

function renderHasilTes(result, recommendedDoctors) {
    const wrap = document.getElementById('tesHasilWrap');

    let dokterCards = '';
    recommendedDoctors.forEach((d, i) => {
        const isTop = i === 0;
        dokterCards += `
            <div class="hasil-dokter-card" style="${isTop ? 'border-color:var(--green);background:var(--green-light);' : ''}">
                <div class="hd-avatar" style="background:${d.avatarBg};color:white;">${d.avatarIcon}</div>
                <h4>${d.name}</h4>
                <p class="sp">${d.spesialis} · ⭐ ${d.rating}</p>
                <p style="font-size:0.72rem;color:var(--gray);margin-bottom:6px;">📍 ${d.distance} km · ${d.city}</p>
                <button class="btn-hd-konsul" onclick="showPage('jadwal');setTimeout(()=>document.getElementById('bookDokter').value='${d.id}',500);">Konsultasi</button>
            </div>
        `;
    });

    let gejalaTags = '';
    result.detectedSymptoms.forEach(s => {
        let bg, color;
        if (s.includes('URGENT') || s.includes('menyakiti')) {
            bg = '#fee2e2';
            color = '#991b1b';
        } else if (s.includes('depresi') || s.includes('Kecemasan')) {
            bg = '#dbeafe';
            color = '#1e40af';
        } else {
            bg = '#fef3c7';
            color = '#92400e';
        }
        gejalaTags += `<span class="gejala-tag" style="background:${bg};color:${color};">${s}</span>`;
    });

    wrap.innerHTML = `
        <div class="hasil-header" style="background:linear-gradient(135deg, ${result.levelColor}, ${result.levelColor}dd);">
            <span class="hasil-level-badge">${result.levelEmoji} ${result.level}</span>
            <span class="hasil-icon">${result.levelEmoji}</span>
            <h2>${result.level}</h2>
            <p>${result.deskripsi}</p>
        </div>
        
        <div class="hasil-score-section">
            <div class="hasil-score-label">
                <span>Skor Kesehatan Mental</span>
                <span>${result.totalScore}/100</span>
            </div>
            <div class="hasil-score-bar-wrap">
                <div class="hasil-score-bar" style="width:${result.totalScore}%;background:${result.levelColor};"></div>
            </div>
        </div>
        
        <div class="hasil-rekomendasi">
            <h3>💡 Rekomendasi Tenaga Ahli</h3>
            <div class="rekomen-card ${result.recommendation === 'psikiater' ? 'utama' : 'alternatif'}">
                ${result.recommendation === 'psikiater' ? '<span class="rekomen-badge-utama">Rekomendasi Utama</span>' : ''}
                <div class="rekomen-icon">${result.recommendation === 'psikiater' ? '💊' : '🗣️'}</div>
                <div class="rekomen-info">
                    <h4>${result.recommendation === 'psikiater' ? 'Psikiater' : 'Psikolog'}</h4>
                    <p>${result.recommendation === 'psikiater' ? 'Untuk diagnosis klinis dan penanganan dengan terapi obat jika diperlukan.' : 'Untuk konseling, terapi bicara, dan dukungan mental non-obat.'}</p>
                </div>
            </div>
            ${result.recommendation === 'psikiater' ? `
            <div class="rekomen-card alternatif">
                <div class="rekomen-icon">🗣️</div>
                <div class="rekomen-info">
                    <h4>Psikolog (Alternatif)</h4>
                    <p>Untuk terapi pendampingan dan konseling rutin.</p>
                </div>
            </div>` : `
            <div class="rekomen-card alternatif">
                <div class="rekomen-icon">💊</div>
                <div class="rekomen-info">
                    <h4>Psikiater (Alternatif)</h4>
                    <p>Jika gejala memburuk atau memerlukan evaluasi obat.</p>
                </div>
            </div>`}
        </div>
        
        <div class="hasil-gejala">
            <h3>📋 Gejala Terdeteksi</h3>
            <div class="gejala-list">${gejalaTags}</div>
        </div>
        
        <div class="hasil-dokter">
            <h3>👨‍⚕️ Dokter Terdekat yang Cocok</h3>
            <div class="hasil-dokter-grid">${dokterCards}</div>
        </div>
        
        <div class="hasil-footer">
            <button class="btn-tes-ulang" onclick="tesUlang()">🔄 Ulangi Tes</button>
            <a href="maps.html" class="btn-cari-dokter">
            🤝 Cari Dokter dengan Matchmaking
            </a>
        </div>
    `;
}

function tesUlang() {
    tesAnswers = [];
    currentTesQuestion = 0;
    document.getElementById('tes-step-hasil').classList.add('hidden');
    document.getElementById('tes-step-0').classList.remove('hidden');
}

// ==================== MATCHMAKING ====================
function openMatchmaking() {
    const overlay = document.getElementById('matchmakingOverlay');
    const modal = document.getElementById('matchmakingModal');
    const loadingDiv = document.getElementById('mmLoading');
    const resultDiv = document.getElementById('mmResult');

    overlay.classList.add('active');
    modal.classList.add('active');
    loadingDiv.classList.remove('hidden');
    resultDiv.classList.add('hidden');

    // Ambil hasil tes terakhir dari localStorage
    const testHistory = JSON.parse(localStorage.getItem('mindcheck_tests')) || [];
    const lastTest = testHistory.length > 0 ? testHistory[0] : null;

    // Simulasi loading bertahap
    const steps = document.querySelectorAll('.mm-step');
    steps.forEach(s => {
        s.classList.remove('active', 'done');
    });
    steps[0].classList.add('active');

    setTimeout(() => {
        steps[0].classList.add('done');
        steps[1].classList.add('active');
    }, 600);

    setTimeout(() => {
        steps[1].classList.add('done');
        steps[2].classList.add('active');
    }, 1200);

    setTimeout(() => {
        steps[2].classList.add('done');
        loadingDiv.classList.add('hidden');

        const recommendedDoctors = lastTest
            ? getRecommendedDoctors(lastTest.recommendation, lastTest.totalScore)
            : getRecommendedDoctors('psikolog', 30);

        renderMatchmakingResult(recommendedDoctors, lastTest);
        resultDiv.classList.remove('hidden');
    }, 2000);

    document.body.style.overflow = 'hidden';
}

function closeMatchmaking() {
    document.getElementById('matchmakingOverlay').classList.remove('active');
    document.getElementById('matchmakingModal').classList.remove('active');
    document.body.style.overflow = '';
}

function renderMatchmakingResult(doctors, testResult) {
    const content = document.getElementById('mmResultContent');
    let html = '';

    if (testResult) {
        html += `
            <div class="mm-reason">
                <span class="mm-reason-icon">💡</span>
                <span>Berdasarkan hasil tes mental terakhirmu (Skor: <strong>${testResult.totalScore}/100</strong>, Level: <strong>${testResult.level}</strong>), kami merekomendasikan ${testResult.recommendation === 'psikiater' ? 'Psikiater' : 'Psikolog'} untukmu.</span>
            </div>
        `;
    }

    html += `<div class="mm-list">`;

    doctors.forEach((d, i) => {
        const isTop = i === 0;
        const circumference = 2 * Math.PI * 20;
        const offset = circumference - (d.matchScore / 100) * circumference;

        html += `
            <div class="mm-card ${isTop ? 'top-match' : ''}" onclick="showPage('jadwal');setTimeout(()=>document.getElementById('bookDokter').value='${d.id}',500);closeMatchmaking();">
                ${isTop ? '<span class="mm-top-badge">⭐ Rekomendasi Terbaik</span>' : ''}
                <div class="mm-card-left">
                    <span class="mm-rank">${['🥇', '🥈', '🥉', '4️⃣'][i] || '👤'}</span>
                    <div class="mm-avatar" style="background:${d.avatarBg};color:white;">${d.avatarIcon}</div>
                </div>
                <div class="mm-card-body">
                    <h4>${d.name}</h4>
                    <div class="mm-meta">
                        <span style="background:#dbeafe;color:#1d4ed8;padding:2px 8px;border-radius:50px;font-size:0.7rem;">${d.spesialis}</span>
                        <span>⭐ ${d.rating}</span>
                        <span class="mm-jarak">📍 ${d.distance} km</span>
                    </div>
                    <div class="mm-status">
                        <span style="width:8px;height:8px;border-radius:50%;background:${d.online ? 'var(--green)' : 'var(--gray)'};display:inline-block;"></span>
                        ${d.online ? 'Online' : 'Offline'} · ${d.subSpesialis}
                    </div>
                </div>
                <div class="mm-card-right">
                    <div class="mm-score-ring">
                        <svg viewBox="0 0 48 48">
                            <circle cx="24" cy="24" r="20" fill="none" stroke="var(--gray-light)" stroke-width="5"/>
                            <circle cx="24" cy="24" r="20" fill="none" stroke="var(--green)" stroke-width="5"
                                stroke-dasharray="${circumference}" stroke-dashoffset="${offset}" stroke-linecap="round"/>
                        </svg>
                        <span>${d.matchScore}%</span>
                    </div>
                    <button class="mm-btn-konsul" onclick="event.stopPropagation();showPage('jadwal');setTimeout(()=>document.getElementById('bookDokter').value='${d.id}',500);closeMatchmaking();">
                        <i class="fa fa-calendar-check"></i> Pesan
                    </button>
                </div>
            </div>
        `;
    });

    html += `</div>`;
    content.innerHTML = html;
}

// ==================== REKOMENDASI ====================
function generateRekomendasi() {
    const container = document.getElementById('rekomendasiContent');
    if (!container) return;

    const testHistory = JSON.parse(localStorage.getItem('mindcheck_tests')) || [];
    const lastTest = testHistory.length > 0 ? testHistory[0] : null;

    let recommendedDoctors;
    if (lastTest) {
        recommendedDoctors = getRecommendedDoctors(lastTest.recommendation, lastTest.totalScore);
    } else {
        recommendedDoctors = allDoctors.sort((a, b) => b.rating - a.rating).slice(0, 4);
    }

    let html = `
        <div class="rek-section">
            <div class="rek-section-title">👨‍⚕️ Dokter yang Cocok Untukmu</div>
            <div class="rek-dokter-grid">
    `;

    recommendedDoctors.forEach(d => {
        html += `
            <div class="rek-dokter-card">
                <span class="rek-match-badge">${d.rating >= 4.8 ? '⭐ Top' : '✓ Cocok'}</span>
                <div class="rek-doc-top">
                    <div class="rek-doc-avatar" style="background:${d.avatarBg};color:white;">${d.avatarIcon}</div>
                    <div class="rek-doc-info">
                        <h4>${d.name}</h4>
                        <p>${d.spesialis}</p>
                    </div>
                </div>
                <div class="rek-doc-tags">
                    <span class="rek-tag">${d.subSpesialis}</span>
                    <span class="rek-tag">📍 ${d.distance} km</span>
                </div>
                <div class="rek-doc-meta">
                    <span>⭐ ${d.rating} (${d.reviewCount})</span>
                    <button class="btn-rek-chat" onclick="showPage('jadwal');setTimeout(()=>document.getElementById('bookDokter').value='${d.id}',500);">Konsultasi</button>
                </div>
            </div>
        `;
    });

    html += `
            </div>
        </div>
        <div class="rek-section">
            <div class="rek-section-title">📚 Artikel Rekomendasi</div>
            <div class="rek-artikel-list">
                <div class="rek-artikel-item" onclick="showPage('articles')">
                    <div class="rek-artikel-icon" style="background:linear-gradient(135deg,#6ee7b7,#3b82f6);">🧘</div>
                    <div class="rek-artikel-info">
                        <h4>Teknik Mindfulness untuk Pemula</h4>
                        <p>5 menit membaca · Mindfulness</p>
                    </div>
                </div>
                <div class="rek-artikel-item" onclick="showPage('articles')">
                    <div class="rek-artikel-icon" style="background:linear-gradient(135deg,#fde68a,#f59e0b);">😊</div>
                    <div class="rek-artikel-info">
                        <h4>Cara Mengatasi Overthinking</h4>
                        <p>7 menit membaca · Self-Care</p>
                    </div>
                </div>
            </div>
        </div>
    `;

    container.innerHTML = html;
}

// ==================== JADWAL ====================
function updateSlotTime() {
    const dokterVal = document.getElementById('bookDokter').value;
    const tglVal = document.getElementById('bookTanggal').value;
    const slotDiv = document.getElementById('slotGrid');

    if (!dokterVal || !tglVal) {
        slotDiv.innerHTML = '<p style="color:var(--gray);font-size:0.85rem;">Pilih dokter & tanggal terlebih dahulu</p>';
        return;
    }

    const doctor = allDoctors.find(d => d.id === parseInt(dokterVal));
    if (!doctor) return;

    // Simulasi slot (beberapa penuh)
    const isWeekend = [0, 6].includes(new Date(tglVal).getDay());
    let html = '';
    doctor.timeSlots.forEach((t, i) => {
        const isFull = isWeekend ? i >= doctor.timeSlots.length - 1 : i >= doctor.timeSlots.length - 2;
        html += `
            <button class="slot-btn ${isFull ? 'penuh' : ''}" ${isFull ? 'disabled' : ''} onclick="selectSlot(this)" data-slot="${t}">
                ${t} WIB ${isFull ? '(Penuh)' : ''}
            </button>
        `;
    });
    slotDiv.innerHTML = html;
}

function selectSlot(btn) {
    document.querySelectorAll('#slotGrid .slot-btn:not(.penuh)').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
}

function submitBooking() {
    if (!currentUser) {
        showToast('Silakan login terlebih dahulu', 'error');
        openModal('login');
        return;
    }

    const dokterVal = document.getElementById('bookDokter').value;
    const tglVal = document.getElementById('bookTanggal').value;
    const selectedSlot = document.querySelector('#slotGrid .slot-btn.selected');
    const keluhan = document.getElementById('bookKeluhan').value.trim();

    if (!dokterVal) return showToast('Pilih dokter', 'error');
    if (!tglVal) return showToast('Pilih tanggal', 'error');
    if (!selectedSlot) return showToast('Pilih jam konsultasi', 'error');
    if (!keluhan) return showToast('Isi keluhan', 'error');

    const doctor = allDoctors.find(d => d.id === parseInt(dokterVal));
    if (!doctor) return;

    const jenis = document.querySelector('input[name="jenis"]:checked')?.value || 'online';

    // Simpan booking
    const bookings = JSON.parse(localStorage.getItem('mindcheck_bookings')) || [];
    bookings.push({
        id: Date.now(),
        dokterId: doctor.id,
        dokterName: doctor.name,
        tanggal: tglVal,
        jam: selectedSlot.dataset.slot,
        jenis: jenis,
        keluhan: keluhan,
        status: 'pending',
        userId: currentUser.email,
        createdAt: new Date().toISOString()
    });
    localStorage.setItem('mindcheck_bookings', JSON.stringify(bookings));

    showToast('Booking berhasil dikirim! Dokter akan mengkonfirmasi.', 'success');
    renderUserJadwal();

    // Reset form
    document.getElementById('bookDokter').value = '';
    document.getElementById('bookTanggal').value = '';
    document.getElementById('bookKeluhan').value = '';
    document.getElementById('slotGrid').innerHTML = '<p style="color:var(--gray);font-size:0.85rem;">Pilih dokter & tanggal terlebih dahulu</p>';
}

function renderUserJadwal() {
    const container = document.getElementById('userJadwalList');
    if (!container) return;

    const bookings = JSON.parse(localStorage.getItem('mindcheck_bookings')) || [];
    const userEmail = currentUser?.email || '';
    const userBookings = bookings.filter(b => b.userId === userEmail);

    if (userBookings.length === 0) {
        container.innerHTML = '<p style="color:var(--gray);text-align:center;padding:2rem;">Belum ada jadwal konsultasi</p>';
        return;
    }

    let html = '';
    userBookings.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).forEach(b => {
        const doctor = allDoctors.find(d => d.id === parseInt(b.dokterId));
        const statusClass = {
            'pending': 'pending',
            'diterima': 'diterima',
            'ditolak': 'ditolak'
        }[b.status] || '';

        html += `
            <div class="jadwal-item status-${statusClass}">
                <div class="jadwal-doc-avatar" style="background:${doctor?.avatarBg || 'var(--green)'};color:white;">${doctor?.avatarIcon || '👨‍⚕️'}</div>
                <div class="jadwal-info">
                    <h4>${b.dokterName}</h4>
                    <p>📅 ${b.tanggal} · 🕐 ${b.jam} WIB · ${b.jenis === 'online' ? '💻 Online' : '🏥 Tatap Muka'}</p>
                </div>
                <span class="jadwal-status-badge ${statusClass}">${b.status.charAt(0).toUpperCase() + b.status.slice(1)}</span>
            </div>
        `;
    });
    container.innerHTML = html;
}

function renderDokterJadwal() {
    const container = document.getElementById('dokterJadwalList');
    if (!container) return;

    const bookings = JSON.parse(localStorage.getItem('mindcheck_bookings')) || [];
    const pendingBookings = bookings.filter(b => b.status === 'pending');

    if (pendingBookings.length === 0) {
        container.innerHTML = '<p style="color:var(--gray);text-align:center;padding:2rem;">Tidak ada permintaan jadwal baru</p>';
        return;
    }

    let html = '';
    pendingBookings.forEach(b => {
        html += `
            <div class="dokter-jadwal-item">
                <div class="djadwal-header">
                    <div class="djadwal-pasien-avatar">👤</div>
                    <div class="djadwal-info">
                        <h4>${b.userId}</h4>
                        <p>📅 ${b.tanggal} · 🕐 ${b.jam} WIB</p>
                    </div>
                </div>
                <div class="djadwal-keluhan">${b.keluhan}</div>
                <div class="djadwal-actions">
                    <button class="btn-terima" onclick="respondBooking(${b.id}, 'diterima')">✓ Terima</button>
                    <button class="btn-tolak" onclick="respondBooking(${b.id}, 'ditolak')">✕ Tolak</button>
                </div>
            </div>
        `;
    });
    container.innerHTML = html;
}

function respondBooking(bookingId, status) {
    const bookings = JSON.parse(localStorage.getItem('mindcheck_bookings')) || [];
    const idx = bookings.findIndex(b => b.id === bookingId);
    if (idx === -1) return;

    bookings[idx].status = status;
    localStorage.setItem('mindcheck_bookings', JSON.stringify(bookings));

    showToast(`Permintaan ${status === 'diterima' ? 'diterima' : 'ditolak'}`, 'success');
    renderDokterJadwal();
    renderUserJadwal();
}

function setJadwalMode(mode, el) {
    document.querySelectorAll('.jmode').forEach(b => b.classList.remove('active'));
    el.classList.add('active');

    const userView = document.getElementById('jadwal-user-view');
    const dokterView = document.getElementById('jadwal-dokter-view');

    if (mode === 'user') {
        userView.classList.remove('hidden');
        dokterView.classList.add('hidden');
    } else {
        userView.classList.add('hidden');
        dokterView.classList.remove('hidden');
        renderDokterJadwal();
    }
}

// ==================== CHAT ====================
function renderChatList() {
    const container = document.getElementById('chatList');
    if (!container) return;

    // Gunakan beberapa dokter sebagai kontak chat
    const contacts = allDoctors.slice(0, 5);

    let html = '';
    contacts.forEach(d => {
        const chatKey = `chat_${d.id}_${currentUser?.email || 'guest'}`;
        const chatData = chatHistory[chatKey] || { messages: [], unread: 0 };

        html += `
            <div class="chat-list-item" onclick="openChat(${d.id})" id="chat-item-${d.id}">
                <div class="cli-avatar" style="background:${d.avatarBg};color:white;">
                    ${d.avatarIcon}
                    <span class="cli-online-dot ${d.online ? 'online' : 'offline'}"></span>
                </div>
                <div class="cli-info">
                    <span class="cli-name">${d.name}</span>
                    <span class="cli-preview">${chatData.messages.length > 0 ? chatData.messages[chatData.messages.length - 1].text.substring(0, 30) : 'Klik untuk memulai chat'}</span>
                </div>
                <div class="cli-meta">
                    <span class="cli-time">${d.online ? 'Online' : 'Offline'}</span>
                    ${chatData.unread > 0 ? `<span class="cli-unread">${chatData.unread}</span>` : ''}
                </div>
            </div>
        `;
    });

    container.innerHTML = html;
}

function openChat(doctorId) {
    const doctor = allDoctors.find(d => d.id === doctorId);
    if (!doctor) return;

    activeChatId = doctorId;

    document.getElementById('chatEmpty').classList.add('hidden');
    document.getElementById('chatActive').classList.remove('hidden');

    document.getElementById('chatHeaderAvatar').style.background = doctor.avatarBg;
    document.getElementById('chatHeaderAvatar').style.color = 'white';
    document.getElementById('chatHeaderAvatar').textContent = doctor.avatarIcon;
    document.getElementById('chatHeaderName').textContent = doctor.name;
    document.getElementById('chatHeaderStatus').textContent = doctor.online ? '🟢 Online' : '⚫ Offline';

    // Highlight chat item
    document.querySelectorAll('.chat-list-item').forEach(el => el.classList.remove('active'));
    const item = document.getElementById('chat-item-' + doctorId);
    if (item) item.classList.add('active');

    renderChatMessages(doctorId);
}

function closeChatActive() {
    document.getElementById('chatEmpty').classList.remove('hidden');
    document.getElementById('chatActive').classList.add('hidden');
    activeChatId = null;
    document.querySelectorAll('.chat-list-item').forEach(el => el.classList.remove('active'));
}

function renderChatMessages(doctorId) {
    const container = document.getElementById('chatMessages');
    if (!container) return;

    const chatKey = `chat_${doctorId}_${currentUser?.email || 'guest'}`;
    const chatData = chatHistory[chatKey] || { messages: [], unread: 0 };

    if (chatData.messages.length === 0) {
        chatData.messages.push({
            type: 'system',
            text: `Percakapan dengan ${allDoctors.find(d => d.id === doctorId)?.name || 'Dokter'} dimulai. Semua percakapan bersifat rahasia.`,
            time: ''
        });
        chatHistory[chatKey] = chatData;
        localStorage.setItem('mindcheck_chats', JSON.stringify(chatHistory));
    }

    let html = '';
    chatData.messages.forEach(msg => {
        if (msg.type === 'system') {
            html += `<div class="msg-system">${msg.text}</div>`;
        } else if (msg.type === 'sent') {
            html += `
                <div class="msg-row sent">
                    <div class="msg-avatar-small" style="background:var(--green-dark);color:white;">👤</div>
                    <div>
                        <div class="msg-bubble">${msg.text}</div>
                        <div class="msg-time">${msg.time || ''}</div>
                    </div>
                </div>
            `;
        } else {
            const doctor = allDoctors.find(d => d.id === doctorId);
            html += `
                <div class="msg-row received">
                    <div class="msg-avatar-small" style="background:${doctor?.avatarBg || 'var(--teal)'};color:white;">${doctor?.avatarIcon || '👨‍⚕️'}</div>
                    <div>
                        <div class="msg-bubble">${msg.text}</div>
                        <div class="msg-time">${msg.time || ''}</div>
                    </div>
                </div>
            `;
        }
    });

    container.innerHTML = html;
    container.scrollTop = container.scrollHeight;
}

function sendMessage() {
    if (!activeChatId) return;

    const input = document.getElementById('chatInput');
    if (!input || !input.value.trim()) return;

    const text = input.value.trim();
    input.value = '';

    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    const chatKey = `chat_${activeChatId}_${currentUser?.email || 'guest'}`;
    if (!chatHistory[chatKey]) chatHistory[chatKey] = { messages: [], unread: 0 };

    chatHistory[chatKey].messages.push({ type: 'sent', text, time: timeStr });
    localStorage.setItem('mindcheck_chats', JSON.stringify(chatHistory));

    renderChatMessages(activeChatId);

    // Simulasi balasan otomatis
    setTimeout(() => {
        const responses = [
            'Terima kasih sudah berbagi. Bisa ceritakan lebih detail?',
            'Saya memahami. Mari kita diskusikan lebih lanjut saat sesi konsultasi.',
            'Baik, saya catat. Apakah ada hal lain yang ingin kamu sampaikan?',
            'Ini penting untuk diperhatikan. Saya sarankan kita bahas lebih dalam ya.',
            'Terima kasih informasinya. Itu membantu saya memahami situasi.'
        ];
        const reply = responses[Math.floor(Math.random() * responses.length)];

        chatHistory[chatKey].messages.push({ type: 'received', text: reply, time: timeStr });
        chatHistory[chatKey].unread = 0;
        localStorage.setItem('mindcheck_chats', JSON.stringify(chatHistory));

        if (activeChatId) renderChatMessages(activeChatId);
    }, 1000 + Math.random() * 2000);
}

function handleChatKey(event) {
    if (event.key === 'Enter') sendMessage();
}

function filterChat(query) {
    document.querySelectorAll('.chat-list-item').forEach(item => {
        const name = item.querySelector('.cli-name')?.textContent?.toLowerCase() || '';
        item.style.display = name.includes(query.toLowerCase()) ? '' : 'none';
    });
}

function showNewChatModal() {
    const overlay = document.getElementById('newChatOverlay');
    const modal = document.getElementById('newChatModal');
    const list = document.getElementById('newChatDokterList');

    let html = '';
    allDoctors.forEach(d => {
        html += `
            <div class="new-chat-item" onclick="openChatFromNew(${d.id})">
                <div class="nc-avatar" style="background:${d.avatarBg};color:white;">${d.avatarIcon}</div>
                <div class="nc-info">
                    <h4>${d.name}</h4>
                    <p>${d.spesialis} · ${d.city}</p>
                </div>
                <span class="nc-status ${d.online ? 'online' : 'offline'}">${d.online ? 'Online' : 'Offline'}</span>
            </div>
        `;
    });
    list.innerHTML = html;

    overlay.classList.add('active');
    modal.classList.add('active');
}

function closeNewChatModal() {
    document.getElementById('newChatOverlay').classList.remove('active');
    document.getElementById('newChatModal').classList.remove('active');
}

function openChatFromNew(doctorId) {
    closeNewChatModal();
    showPage('chat');
    setTimeout(() => openChat(doctorId), 300);
}

// ==================== HISTORY ====================
function switchHistoryTab(tab, el) {
    document.querySelectorAll('.htab').forEach(b => b.classList.remove('active'));
    el.classList.add('active');

    const container = document.getElementById('historyContent');
    if (!container) return;

    if (tab === 'tes') {
        const testHistory = JSON.parse(localStorage.getItem('mindcheck_tests')) || [];
        if (testHistory.length === 0) {
            container.innerHTML = '<div class="empty-state"><i class="fa fa-clipboard-check"></i><p>Belum ada tes mental yang diselesaikan</p></div>';
            return;
        }

        let html = '';
        testHistory.forEach(t => {
            html += `
                <div class="history-item">
                    <div class="history-icon" style="background:var(--green-light);color:var(--green-dark);">🧩</div>
                    <div class="history-info">
                        <h4>Tes Mental - ${t.level}</h4>
                        <p>Skor: ${t.totalScore}/100 · ${new Date(t.timestamp).toLocaleDateString('id-ID')}</p>
                    </div>
                    <span class="history-badge badge-selesai">Selesai</span>
                </div>
            `;
        });
        container.innerHTML = html;
    } else if (tab === 'konsul') {
        const bookings = JSON.parse(localStorage.getItem('mindcheck_bookings')) || [];
        const userBookings = bookings.filter(b => b.userId === (currentUser?.email || ''));

        if (userBookings.length === 0) {
            container.innerHTML = '<div class="empty-state"><i class="fa fa-calendar-check"></i><p>Belum ada riwayat konsultasi</p></div>';
            return;
        }

        let html = '';
        userBookings.forEach(b => {
            const statusClass = b.status === 'diterima' ? 'badge-selesai' : b.status === 'ditolak' ? 'badge-sedang' : 'badge-sedang';
            html += `
                <div class="history-item">
                    <div class="history-icon" style="background:var(--green-light);color:var(--green-dark);">📅</div>
                    <div class="history-info">
                        <h4>${b.dokterName}</h4>
                        <p>${b.tanggal} · ${b.jam} WIB · ${b.jenis === 'online' ? 'Online' : 'Tatap Muka'}</p>
                    </div>
                    <span class="history-badge ${statusClass}">${b.status}</span>
                </div>
            `;
        });
        container.innerHTML = html;
    } else {
        container.innerHTML = '<div class="empty-state"><i class="fa fa-book-open"></i><p>Belum ada artikel yang dibaca</p></div>';
    }
}

// ==================== SETTINGS ====================
function saveSettings() {
    const name = document.getElementById('settingName').value.trim();
    const email = document.getElementById('settingEmail').value.trim();
    const pass = document.getElementById('settingPass').value;

    if (!currentUser) {
        showToast('Silakan login terlebih dahulu', 'error');
        return;
    }

    if (name) currentUser.name = name;
    if (email) currentUser.email = email;
    if (pass && pass.length >= 8) currentUser.password = pass;

    localStorage.setItem('mindcheck_user', JSON.stringify(currentUser));
    updateUIAfterAuth();
    showToast('Pengaturan berhasil disimpan', 'success');
}

function toggleDark(checkbox) {
    const html = document.documentElement;
    html.setAttribute('data-theme', checkbox.checked ? 'dark' : 'light');
}

function confirmDelete() {
    if (confirm('Apakah kamu yakin ingin menghapus akun? Tindakan ini tidak dapat dibatalkan.')) {
        localStorage.removeItem('mindcheck_user');
        currentUser = null;
        updateUIAfterAuth();
        showToast('Akun berhasil dihapus', 'error');
    }
}

// ==================== MAPS ====================
function initMaps() {
    // Inisialisasi peta saat halaman maps pertama kali ditampilkan
    const mapEl = document.getElementById('mainMap');
    if (!mapEl || mapInstance) return;

    mapInstance = L.map('mainMap').setView([-6.2088, 106.8456], 12);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 18
    }).addTo(mapInstance);

    // Dapatkan lokasi user
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            pos => {
                userLocation = {
                    lat: pos.coords.latitude,
                    lng: pos.coords.longitude
                };

                const marker = L.circleMarker([userLocation.lat, userLocation.lng], {
                    radius: 8,
                    fillColor: '#3b82f6',
                    color: '#fff',
                    weight: 2,
                    fillOpacity: 1
                }).addTo(mapInstance);
                marker.bindPopup('<b>Lokasi Anda</b>').openPopup();

                mapInstance.setView([userLocation.lat, userLocation.lng], 12);

                document.getElementById('mapsLocationBar').innerHTML = `
                    <i class="fa fa-check-circle"></i>
                    <span>Lokasi ditemukan</span>
                `;
                document.getElementById('mapsLocationBar').className = 'maps-location-bar found';

                renderMapsDokterList();
            },
            err => {
                document.getElementById('mapsLocationBar').innerHTML = `
                    <i class="fa fa-exclamation-triangle"></i>
                    <span>Lokasi tidak tersedia</span>
                `;
                document.getElementById('mapsLocationBar').className = 'maps-location-bar error';
                renderMapsDokterList();
            }
        );
    } else {
        renderMapsDokterList();
    }
}

function renderMapsDokterList() {
    mapsDokterList = [...allDoctors];
    filterDokterList();
}

function filterDokterList() {
    const search = document.getElementById('mapsSearch')?.value?.toLowerCase() || '';
    let filtered = [...allDoctors];

    // Filter by type
    if (currentFilter !== 'semua') {
        filtered = filtered.filter(d => d.type === currentFilter);
    }

    // Filter by search
    if (search) {
        filtered = filtered.filter(d =>
            d.name.toLowerCase().includes(search) ||
            d.city.toLowerCase().includes(search) ||
            d.spesialis.toLowerCase().includes(search)
        );
    }

    // Sort
    if (currentSort === 'jarak') {
        filtered.sort((a, b) => a.distance - b.distance);
    } else if (currentSort === 'rating') {
        filtered.sort((a, b) => b.rating - a.rating);
    } else {
        filtered.sort((a, b) => a.name.localeCompare(b.name));
    }

    mapsDokterList = filtered;

    // Update count
    document.getElementById('dokterCount').textContent = `${filtered.length} dokter ditemukan`;

    // Render list
    const listContainer = document.getElementById('mapsDokterList');
    if (!listContainer) return;

    let html = '';
    filtered.forEach(d => {
        html += `
            <div class="mdokter-card" onclick="selectDokterOnMap(${d.id})">
                <div class="mdokter-avatar" style="background:${d.avatarBg};color:white;">${d.avatarIcon}</div>
                <div class="mdokter-info">
                    <h4>${d.name}</h4>
                    <span class="mdokter-spesialis ${d.type === 'psikiater' ? 'sp-psikiater' : 'sp-psikolog'}">${d.spesialis}</span>
                    <div class="mdokter-meta">
                        <span class="rating-star">⭐ ${d.rating}</span>
                        <span class="jarak-badge">📍 ${d.distance} km</span>
                    </div>
                </div>
                <div class="mdokter-status">
                    <span class="status-dot ${d.online ? '' : 'offline'}"></span>
                    <span class="status-label">${d.online ? 'Online' : 'Offline'}</span>
                </div>
            </div>
        `;
    });

    listContainer.innerHTML = html || '<p style="padding:2rem;text-align:center;color:var(--gray);">Tidak ada dokter ditemukan</p>';

    // Update markers di peta
    updateMapMarkers(filtered);
}

function setFilter(filter, el) {
    document.querySelectorAll('.mfilter').forEach(b => b.classList.remove('active'));
    el.classList.add('active');
    currentFilter = filter;
    filterDokterList();
}

function sortDokterList() {
    currentSort = document.getElementById('sortSelect').value;
    filterDokterList();
}

function updateMapMarkers(dokterList) {
    if (!mapInstance) {
        setTimeout(() => initMaps(), 100);
        return;
    }

    // Hapus marker lama
    mapMarkers.forEach(m => mapInstance.removeLayer(m));
    mapMarkers = [];

    dokterList.forEach(d => {
        const marker = L.marker([d.lat, d.lng], {
            icon: L.divIcon({
                className: 'custom-marker',
                html: `<span>${d.avatarIcon}</span>`,
                iconSize: [36, 36],
                iconAnchor: [18, 18]
            })
        }).addTo(mapInstance);

        marker.bindPopup(`
            <div class="popup-name">${d.name}</div>
            <div class="popup-sp">${d.spesialis} · ⭐ ${d.rating}</div>
            <div class="popup-jarak">📍 ${d.distance} km</div>
            <button class="popup-btn" onclick="selectDokterOnMap(${d.id})">Lihat Detail</button>
        `);

        marker.on('click', () => selectDokterOnMap(d.id));
        mapMarkers.push(marker);
    });
}

function selectDokterOnMap(dokterId) {
    const doctor = allDoctors.find(d => d.id === dokterId);
    if (!doctor) return;

    selectedDokterMap = doctor;

    // Tampilkan detail card
    const detailCard = document.getElementById('mapsDetailCard');
    const detailInner = document.getElementById('detailInner');

    detailInner.innerHTML = `
        <div class="detail-dokter-header">
            <div class="detail-avatar" style="background:${doctor.avatarBg};color:white;">${doctor.avatarIcon}</div>
            <div class="detail-info">
                <h3>${doctor.name}</h3>
                <div class="detail-tags">
                    <span style="background:#dbeafe;color:#1d4ed8;padding:2px 8px;border-radius:50px;font-size:0.72rem;">${doctor.spesialis}</span>
                    <span style="color:var(--gray);font-size:0.75rem;">⭐ ${doctor.rating} (${doctor.reviewCount})</span>
                </div>
                <div class="detail-meta">
                    <span>📍 ${doctor.distance} km · ${doctor.city}</span>
                </div>
            </div>
        </div>
        <div class="detail-address">
            <i class="fa fa-info-circle"></i>
            <span>${doctor.subSpesialis} · ${doctor.pengalaman} pengalaman · ${doctor.alumni}</span>
        </div>
        <div class="detail-schedule">
            ${doctor.schedule.map(s => `<span class="sch-chip">📅 ${s}</span>`).join('')}
        </div>
        <div class="detail-actions">
            <button class="btn-konsul-maps" onclick="showPage('jadwal');setTimeout(()=>document.getElementById('bookDokter').value='${doctor.id}',500);">Konsultasi</button>
            <button class="btn-direction" onclick="openGoogleMaps(${doctor.lat},${doctor.lng})">📍 Rute</button>
        </div>
    `;

    detailCard.classList.remove('hidden');

    // Pan peta ke dokter
    if (mapInstance) {
        mapInstance.setView([doctor.lat, doctor.lng], 14);
    }

    // Highlight di list
    document.querySelectorAll('.mdokter-card').forEach(c => c.classList.remove('active'));
    // (Perlu mencari card yang sesuai - ini bisa dioptimalkan)
}

function closeDokterDetail() {
    document.getElementById('mapsDetailCard').classList.add('hidden');
    selectedDokterMap = null;
}

function openGoogleMaps(lat, lng) {
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, '_blank');
}

function goToMyLocation() {
    if (userLocation && mapInstance) {
        mapInstance.setView([userLocation.lat, userLocation.lng], 14);
        showToast('Menuju lokasi Anda', 'success');
    } else {
        showToast('Lokasi tidak tersedia. Izinkan akses GPS.', 'error');
    }
}

function toggleMapPanel() {
    const panel = document.getElementById('mapsPanel');
    panel.classList.toggle('hidden-panel');
    if (mapInstance) setTimeout(() => mapInstance.invalidateSize(), 300);
}

// ==================== RENDER DOKTER LIST ====================
function renderDokterList() {
    // Digunakan untuk halaman dokter (page-dokter)
    // Bisa dirender ulang saat diperlukan
}

// ==================== INISIALISASI TAMBAHAN ====================
// Deteksi perubahan halaman maps
const observer = new MutationObserver(() => {
    if (currentPage === 'maps' && !mapInstance) {
        setTimeout(initMaps, 200);
    }
});

document.querySelectorAll('.page').forEach(page => {
    observer.observe(page, { attributes: true, attributeFilter: ['class'] });
});

console.log('🧠 MindCheck Indonesia - App.js Loaded');
console.log('   • Tes mental menyimpan hasil ke localStorage');
console.log('   • Matchmaking menggunakan hasil tes terakhir');
console.log('   • ' + allDoctors.length + ' dokter terdaftar');

// ==================== INIT ====================
document.addEventListener('DOMContentLoaded', function () {
    renderDokterGrid();

    // ✅ TAMBAHKAN BARIS INI - Simpan data dokter ke localStorage
    localStorage.setItem('mindcheck_all_doctors', JSON.stringify(allDoctors));

    console.log('🧠 MindCheck Indonesia — Matchmaking Ready');
    console.log('   • ' + allDoctors.length + ' dokter tersedia');
    const tests = JSON.parse(localStorage.getItem('mindcheck_tests')) || [];
    console.log('   • ' + tests.length + ' hasil tes tersimpan di localStorage');
    if (tests.length > 0) {
        console.log('   • Tes terakhir: Skor ' + tests[0].totalScore + '/100, Level: ' + tests[0].level);
    }
});