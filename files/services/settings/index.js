function saveSettings() {
    const name = document.getElementById('settingName')?.value?.trim() || '';
    const email = document.getElementById('settingEmail')?.value?.trim() || '';
    const pass = document.getElementById('settingPass')?.value || '';

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

