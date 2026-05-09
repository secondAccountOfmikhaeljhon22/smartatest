function openMatchmaking() {
    const overlay = document.getElementById('matchmakingOverlay');
    const modal = document.getElementById('matchmakingModal');
    const loadingDiv = document.getElementById('mmLoading');
    const resultDiv = document.getElementById('mmResult');
    if (!overlay || !modal || !loadingDiv || !resultDiv) return;

    overlay.classList.add('active');
    modal.classList.add('active');
    loadingDiv.classList.remove('hidden');
    resultDiv.classList.add('hidden');

    const testHistory = JSON.parse(localStorage.getItem('mindcheck_tests')) || [];
    const lastTest = testHistory.length > 0 ? testHistory[0] : null;

    const steps = document.querySelectorAll('.mm-step');
    steps.forEach(s => {
        s.classList.remove('active', 'done');
    });
    if (steps[0]) steps[0].classList.add('active');

    setTimeout(() => {
        if (steps[0]) steps[0].classList.add('done');
        if (steps[1]) steps[1].classList.add('active');
    }, 600);

    setTimeout(() => {
        if (steps[1]) steps[1].classList.add('done');
        if (steps[2]) steps[2].classList.add('active');
    }, 1200);

    setTimeout(() => {
        if (steps[2]) steps[2].classList.add('done');
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
    document.getElementById('matchmakingOverlay')?.classList.remove('active');
    document.getElementById('matchmakingModal')?.classList.remove('active');
    document.body.style.overflow = '';
}

function renderMatchmakingResult(doctors, testResult) {
    const content = document.getElementById('mmResultContent');
    if (!content) return;
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

