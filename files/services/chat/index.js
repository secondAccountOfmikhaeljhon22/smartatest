function renderChatList() {
    const container = document.getElementById('chatList');
    if (!container) return;

    const contacts = allDoctors.slice(0, 5);

    let html = '';
    contacts.forEach(d => {
        const chatKey = `chat_${d.id}_${currentUser?.email || 'guest'}`;
        const chatData = chatHistory[chatKey] || { messages: [], unread: 0 };

        html += `
            <div class="chat-list-item" onclick="openChat(${d.id})" id="chat-item-${d.id}">
                <div class="cli-avatar" style="background:${d.avatarBg};color:white;">
                    ${d.avatarIcon}
                    <span class="cli-online-dot ${d.online ? 'online' : 'offline'}"></span>
                </div>
                <div class="cli-info">
                    <span class="cli-name">${d.name}</span>
                    <span class="cli-preview">${chatData.messages.length > 0 ? escapeHtml(chatData.messages[chatData.messages.length - 1].text).substring(0, 30) : 'Klik untuk memulai chat'}</span>
                </div>
                <div class="cli-meta">
                    <span class="cli-time">${d.online ? 'Online' : 'Offline'}</span>
                    ${chatData.unread > 0 ? `<span class="cli-unread">${chatData.unread}</span>` : ''}
                </div>
            </div>
        `;
    });

    container.innerHTML = html;
}

function openChat(doctorId) {
    const doctor = allDoctors.find(d => d.id === doctorId);
    if (!doctor) return;

    activeChatId = doctorId;

    document.getElementById('chatEmpty')?.classList.add('hidden');
    document.getElementById('chatActive')?.classList.remove('hidden');

    const avatar = document.getElementById('chatHeaderAvatar');
    if (avatar) {
        avatar.style.background = doctor.avatarBg;
        avatar.style.color = 'white';
        avatar.textContent = doctor.avatarIcon;
    }
    const name = document.getElementById('chatHeaderName');
    const status = document.getElementById('chatHeaderStatus');
    if (name) name.textContent = doctor.name;
    if (status) status.textContent = doctor.online ? '🟢 Online' : '⚫ Offline';

    document.querySelectorAll('.chat-list-item').forEach(el => el.classList.remove('active'));
    const item = document.getElementById('chat-item-' + doctorId);
    if (item) item.classList.add('active');

    renderChatMessages(doctorId);
}

function closeChatActive() {
    document.getElementById('chatEmpty')?.classList.remove('hidden');
    document.getElementById('chatActive')?.classList.add('hidden');
    activeChatId = null;
    document.querySelectorAll('.chat-list-item').forEach(el => el.classList.remove('active'));
}

function renderChatMessages(doctorId) {
    const container = document.getElementById('chatMessages');
    if (!container) return;

    const chatKey = `chat_${doctorId}_${currentUser?.email || 'guest'}`;
    const chatData = chatHistory[chatKey] || { messages: [], unread: 0 };

    if (chatData.messages.length === 0) {
        chatData.messages.push({
            type: 'system',
            text: `Percakapan dengan ${allDoctors.find(d => d.id === doctorId)?.name || 'Dokter'} dimulai. Semua percakapan bersifat rahasia.`,
            time: ''
        });
        chatHistory[chatKey] = chatData;
        localStorage.setItem('mindcheck_chats', JSON.stringify(chatHistory));
    }

    let html = '';
    chatData.messages.forEach(msg => {
        const safeText = escapeHtml(msg.text || '');
        if (msg.type === 'system') {
            html += `<div class="msg-system">${safeText}</div>`;
        } else if (msg.type === 'sent') {
            html += `
                <div class="msg-row sent">
                    <div class="msg-avatar-small" style="background:var(--green-dark);color:white;">👤</div>
                    <div>
                        <div class="msg-bubble">${safeText}</div>
                        <div class="msg-time">${escapeHtml(msg.time || '')}</div>
                    </div>
                </div>
            `;
        } else {
            const doctor = allDoctors.find(d => d.id === doctorId);
            html += `
                <div class="msg-row received">
                    <div class="msg-avatar-small" style="background:${doctor?.avatarBg || 'var(--teal)'};color:white;">${doctor?.avatarIcon || '👨‍⚕️'}</div>
                    <div>
                        <div class="msg-bubble">${safeText}</div>
                        <div class="msg-time">${escapeHtml(msg.time || '')}</div>
                    </div>
                </div>
            `;
        }
    });

    container.innerHTML = html;
    container.scrollTop = container.scrollHeight;
}

function sendMessage() {
    if (!activeChatId) return;

    const input = document.getElementById('chatInput');
    if (!input || !input.value.trim()) return;

    const text = input.value.trim();
    input.value = '';

    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    const chatKey = `chat_${activeChatId}_${currentUser?.email || 'guest'}`;
    if (!chatHistory[chatKey]) chatHistory[chatKey] = { messages: [], unread: 0 };

    chatHistory[chatKey].messages.push({ type: 'sent', text, time: timeStr });
    localStorage.setItem('mindcheck_chats', JSON.stringify(chatHistory));

    renderChatMessages(activeChatId);

    setTimeout(() => {
        const responses = [
            'Terima kasih sudah berbagi. Bisa ceritakan lebih detail?',
            'Saya memahami. Mari kita diskusikan lebih lanjut saat sesi konsultasi.',
            'Baik, saya catat. Apakah ada hal lain yang ingin kamu sampaikan?',
            'Ini penting untuk diperhatikan. Saya sarankan kita bahas lebih dalam ya.',
            'Terima kasih informasinya. Itu membantu saya memahami situasi.'
        ];
        const reply = responses[Math.floor(Math.random() * responses.length)];

        chatHistory[chatKey].messages.push({ type: 'received', text: reply, time: timeStr });
        chatHistory[chatKey].unread = 0;
        localStorage.setItem('mindcheck_chats', JSON.stringify(chatHistory));

        if (activeChatId) renderChatMessages(activeChatId);
    }, 1000 + Math.random() * 2000);
}

function handleChatKey(event) {
    if (event.key === 'Enter') sendMessage();
}

function filterChat(query) {
    document.querySelectorAll('.chat-list-item').forEach(item => {
        const name = item.querySelector('.cli-name')?.textContent?.toLowerCase() || '';
        item.style.display = name.includes(query.toLowerCase()) ? '' : 'none';
    });
}

function showNewChatModal() {
    const overlay = document.getElementById('newChatOverlay');
    const modal = document.getElementById('newChatModal');
    const list = document.getElementById('newChatDokterList');
    if (!overlay || !modal || !list) return;

    let html = '';
    allDoctors.forEach(d => {
        html += `
            <div class="new-chat-item" onclick="openChatFromNew(${d.id})">
                <div class="nc-avatar" style="background:${d.avatarBg};color:white;">${d.avatarIcon}</div>
                <div class="nc-info">
                    <h4>${d.name}</h4>
                    <p>${d.spesialis} · ${d.city}</p>
                </div>
                <span class="nc-status ${d.online ? 'online' : 'offline'}">${d.online ? 'Online' : 'Offline'}</span>
            </div>
        `;
    });
    list.innerHTML = html;

    overlay.classList.add('active');
    modal.classList.add('active');
}

function closeNewChatModal() {
    document.getElementById('newChatOverlay')?.classList.remove('active');
    document.getElementById('newChatModal')?.classList.remove('active');
}

function openChatFromNew(doctorId) {
    closeNewChatModal();
    showPage('chat');
    setTimeout(() => openChat(doctorId), 300);
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

