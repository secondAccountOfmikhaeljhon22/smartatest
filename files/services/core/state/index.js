
let currentUser = JSON.parse(localStorage.getItem('mindcheck_user')) || null;
let currentPage = 'home';
let currentTesStep = 0;
let tesAnswers = [];
let currentTesQuestion = 0;
let activeChatId = null;
let jadwalMode = 'user';
let mapInstance = null;
let mapMarkers = [];
let userLocation = null;
let mapsDokterList = [];
let currentFilter = 'semua';
let currentSort = 'jarak';
let selectedDokterMap = null;
let sidebarOpen = false;

let chatHistory = JSON.parse(localStorage.getItem('mindcheck_chats')) || {};

