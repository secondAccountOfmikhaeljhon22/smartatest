function initMaps() {
    const mapEl = document.getElementById('mainMap');
    if (!mapEl || mapInstance) return;

    mapInstance = L.map('mainMap').setView([-6.2088, 106.8456], 12);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 18
    }).addTo(mapInstance);

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

                const bar = document.getElementById('mapsLocationBar');
                if (bar) {
                    bar.innerHTML = `
                        <i class="fa fa-check-circle"></i>
                        <span>Lokasi ditemukan</span>
                    `;
                    bar.className = 'maps-location-bar found';
                }

                renderMapsDokterList();
            },
            () => {
                const bar = document.getElementById('mapsLocationBar');
                if (bar) {
                    bar.innerHTML = `
                        <i class="fa fa-exclamation-triangle"></i>
                        <span>Lokasi tidak tersedia</span>
                    `;
                    bar.className = 'maps-location-bar error';
                }
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

    if (currentFilter !== 'semua') {
        filtered = filtered.filter(d => d.type === currentFilter);
    }

    if (search) {
        filtered = filtered.filter(d =>
            d.name.toLowerCase().includes(search) ||
            d.city.toLowerCase().includes(search) ||
            d.spesialis.toLowerCase().includes(search)
        );
    }

    if (currentSort === 'jarak') {
        filtered.sort((a, b) => a.distance - b.distance);
    } else if (currentSort === 'rating') {
        filtered.sort((a, b) => b.rating - a.rating);
    } else {
        filtered.sort((a, b) => a.name.localeCompare(b.name));
    }

    mapsDokterList = filtered;

    const count = document.getElementById('dokterCount');
    if (count) count.textContent = `${filtered.length} dokter ditemukan`;

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

    updateMapMarkers(filtered);
}

function setFilter(filter, el) {
    document.querySelectorAll('.mfilter').forEach(b => b.classList.remove('active'));
    el.classList.add('active');
    currentFilter = filter;
    filterDokterList();
}

function sortDokterList() {
    currentSort = document.getElementById('sortSelect')?.value || 'jarak';
    filterDokterList();
}

function updateMapMarkers(dokterList) {
    if (!mapInstance) {
        setTimeout(() => initMaps(), 100);
        return;
    }

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

    const detailCard = document.getElementById('mapsDetailCard');
    const detailInner = document.getElementById('detailInner');
    if (!detailCard || !detailInner) return;

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

    if (mapInstance) {
        mapInstance.setView([doctor.lat, doctor.lng], 14);
    }

    document.querySelectorAll('.mdokter-card').forEach(c => c.classList.remove('active'));
}

function closeDokterDetail() {
    document.getElementById('mapsDetailCard')?.classList.add('hidden');
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
    panel?.classList.toggle('hidden-panel');
    if (mapInstance) setTimeout(() => mapInstance.invalidateSize(), 300);
}

function closeDokterModal() {
    document.getElementById('dokterModalOverlay')?.classList.remove('active');
    document.getElementById('dokterModal')?.classList.remove('active');
}

const mapsObserver = new MutationObserver(() => {
    if (currentPage === 'maps' && !mapInstance) {
        setTimeout(initMaps, 200);
    }
});

document.querySelectorAll('.page').forEach(page => {
    mapsObserver.observe(page, { attributes: true, attributeFilter: ['class'] });
});

