function showPage(pageName) {
    document.querySelectorAll('.page').forEach(p => p.classList.add('hidden'));

    const page = document.getElementById('page-' + pageName);
    if (!page) return;

    page.classList.remove('hidden');
    currentPage = pageName;

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

    if (pageName === 'maps') {
        setTimeout(() => {
            if (mapInstance) mapInstance.invalidateSize();
        }, 100);
    }

    if (pageName === 'rekomendasi') {
        generateRekomendasi();
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

