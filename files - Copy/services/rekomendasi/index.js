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

