function updateSlotTime() {
    const dokterVal = document.getElementById('bookDokter')?.value || '';
    const tglVal = document.getElementById('bookTanggal')?.value || '';
    const slotDiv = document.getElementById('slotGrid');

    if (!slotDiv) return;

    if (!dokterVal || !tglVal) {
        slotDiv.innerHTML = '<p style="color:var(--gray);font-size:0.85rem;">Pilih dokter & tanggal terlebih dahulu</p>';
        return;
    }

    const doctor = allDoctors.find(d => d.id === parseInt(dokterVal, 10));
    if (!doctor) return;

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

    const dokterVal = document.getElementById('bookDokter')?.value || '';
    const tglVal = document.getElementById('bookTanggal')?.value || '';
    const selectedSlot = document.querySelector('#slotGrid .slot-btn.selected');
    const keluhan = document.getElementById('bookKeluhan')?.value?.trim() || '';

    if (!dokterVal) return showToast('Pilih dokter', 'error');
    if (!tglVal) return showToast('Pilih tanggal', 'error');
    if (!selectedSlot) return showToast('Pilih jam konsultasi', 'error');
    if (!keluhan) return showToast('Isi keluhan', 'error');

    const doctor = allDoctors.find(d => d.id === parseInt(dokterVal, 10));
    if (!doctor) return;

    const jenis = document.querySelector('input[name="jenis"]:checked')?.value || 'online';

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
        const doctor = allDoctors.find(d => d.id === parseInt(b.dokterId, 10));
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
        userView?.classList.remove('hidden');
        dokterView?.classList.add('hidden');
    } else {
        userView?.classList.add('hidden');
        dokterView?.classList.remove('hidden');
        renderDokterJadwal();
    }
}

