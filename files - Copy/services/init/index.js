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

    localStorage.setItem('mindcheck_all_doctors', JSON.stringify(allDoctors));

    console.log('🧠 MindCheck Indonesia - Services Ready');
    console.log('   • Tes mental menyimpan hasil ke localStorage');
    console.log('   • Matchmaking menggunakan hasil tes terakhir');
    console.log('   • ' + allDoctors.length + ' dokter terdaftar');
});

