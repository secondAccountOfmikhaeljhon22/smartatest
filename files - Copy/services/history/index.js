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

