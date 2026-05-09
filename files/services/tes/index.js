function tesMulai() {
    tesAnswers = [];
    currentTesQuestion = 0;

    document.getElementById('tes-step-0')?.classList.add('hidden');
    document.getElementById('tes-step-questions')?.classList.remove('hidden');
    document.getElementById('tes-step-hasil')?.classList.add('hidden');

    renderQuestion();
}

function renderQuestion() {
    const q = tesQuestions[currentTesQuestion];
    const total = tesQuestions.length;
    const progressPct = ((currentTesQuestion) / total) * 100;

    const bar = document.getElementById('tesProgressBar');
    const label = document.getElementById('tesStepLabel');
    if (bar) bar.style.width = progressPct + '%';
    if (label) label.textContent = `Pertanyaan ${currentTesQuestion + 1} dari ${total}`;

    const btnBack = document.getElementById('tesBtnBack');
    const btnNext = document.getElementById('tesBtnNext');
    if (btnBack) btnBack.style.display = currentTesQuestion === 0 ? 'none' : 'block';
    if (btnNext) btnNext.textContent = currentTesQuestion === total - 1 ? 'Lihat Hasil →' : 'Lanjut →';

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
        const defaultVal = existingValue !== null ? existingValue : Math.round((q.max - q.min) / 2);
        html += `
            <div class="tes-slider-wrap">
                <input type="range" class="tes-slider" id="tesSlider" 
                    min="${q.min}" max="${q.max}" step="${q.step}" 
                    value="${defaultVal}"
                    oninput="updateSliderValue(this.value, '${q.labels[0]}', '${q.labels[1]}')" />
                <div class="tes-slider-labels">
                    <span>${q.labels[0]}</span>
                    <span>${q.labels[1]}</span>
                </div>
                <div class="tes-slider-value" id="tesSliderValue">${defaultVal}</div>
            </div>
        `;
    }

    const card = document.getElementById('tesQuestionCard');
    if (card) card.innerHTML = html;

    if (btnNext) btnNext.disabled = false;
}

function updateSliderValue(val) {
    const el = document.getElementById('tesSliderValue');
    if (el) el.textContent = val;
}

function tesNext() {
    const slider = document.getElementById('tesSlider');
    if (slider) {
        tesAnswers[currentTesQuestion] = parseInt(slider.value, 10);
    }

    if (currentTesQuestion < tesQuestions.length - 1) {
        currentTesQuestion++;
        renderQuestion();
    } else {
        tampilkanHasilTes();
    }
}

function tesPrev() {
    const slider = document.getElementById('tesSlider');
    if (slider) {
        tesAnswers[currentTesQuestion] = parseInt(slider.value, 10);
    }

    if (currentTesQuestion > 0) {
        currentTesQuestion--;
        renderQuestion();
    }
}

function tampilkanHasilTes() {
    document.getElementById('tes-step-questions')?.classList.add('hidden');
    document.getElementById('tes-step-hasil')?.classList.remove('hidden');

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

    const normalizedScore = Math.round((totalScore / maxScore) * 100);

    let level, levelEmoji, levelColor, deskripsi, recommendation;

    const criticalAnswer = tesAnswers[7];

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
    testHistory.unshift(testResult);
    if (testHistory.length > 10) testHistory = testHistory.slice(0, 10);
    localStorage.setItem('mindcheck_tests', JSON.stringify(testHistory));

    const recommendedDoctors = getRecommendedDoctors(recommendation, normalizedScore);
    renderHasilTes(testResult, recommendedDoctors);
}

function getRecommendedDoctors(recommendedType, score) {
    let filtered;

    if (score >= 65 || tesAnswers[7] >= 5) {
        filtered = allDoctors.filter(d => d.type === 'psikiater');
    } else if (score >= 35) {
        filtered = allDoctors.filter(d => d.type === recommendedType);
        if (filtered.length < 3) {
            filtered = allDoctors;
        }
    } else {
        filtered = allDoctors.filter(d => d.type === 'psikolog');
    }

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
    if (!wrap) return;

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
    document.getElementById('tes-step-hasil')?.classList.add('hidden');
    document.getElementById('tes-step-0')?.classList.remove('hidden');
}

