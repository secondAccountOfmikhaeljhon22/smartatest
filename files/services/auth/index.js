function openModal(type) {
    const modal = document.getElementById('authModal');
    const overlay = document.getElementById('modalOverlay');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    if (!modal || !overlay || !loginForm || !registerForm) return;

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
    if (modal) modal.classList.remove('active');
    if (overlay) overlay.classList.remove('active');
    document.body.style.overflow = '';
}

function switchForm(type) {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    if (!loginForm || !registerForm) return;
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
    if (!input || !icon) return;
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
    const email = document.getElementById('loginEmail')?.value?.trim() || '';
    const pass = document.getElementById('loginPass')?.value || '';

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
    const name = document.getElementById('regName')?.value?.trim() || '';
    const email = document.getElementById('regEmail')?.value?.trim() || '';
    const pass = document.getElementById('regPass')?.value || '';
    const pass2 = document.getElementById('regPass2')?.value || '';

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
        if (guestDiv) guestDiv.classList.add('hidden');
        if (userDiv) userDiv.classList.remove('hidden');

        const initial = currentUser.name.charAt(0).toUpperCase();
        if (navAvatar) navAvatar.textContent = initial;
        if (navName) navName.textContent = currentUser.name;
        if (sidebarAvatar) sidebarAvatar.textContent = initial;
        if (sidebarName) sidebarName.textContent = currentUser.name;
        if (sidebarEmail) sidebarEmail.textContent = currentUser.email;
    } else {
        if (guestDiv) guestDiv.classList.remove('hidden');
        if (userDiv) userDiv.classList.add('hidden');
    }

    updateProfileFromLocal();
}

function updateProfileFromLocal() {
    const profileAvatarBig = document.getElementById('profileAvatarBig');
    const profileFullName = document.getElementById('profileFullName');
    const profileFullEmail = document.getElementById('profileFullEmail');

    if (currentUser && profileAvatarBig) {
        profileAvatarBig.textContent = currentUser.name.charAt(0).toUpperCase();
    }
    if (currentUser && profileFullName) {
        profileFullName.textContent = currentUser.name;
    }
    if (currentUser && profileFullEmail) {
        profileFullEmail.textContent = currentUser.email;
    }

    const testHistory = JSON.parse(localStorage.getItem('mindcheck_tests')) || [];
    if (document.getElementById('pStatTes')) {
        document.getElementById('pStatTes').textContent = testHistory.length;
    }
}

