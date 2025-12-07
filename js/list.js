let karutaData = [];

// JSONデータを読み込む
async function loadKarutaData() {
    try {
        const response = await fetch('data/karuta.json');
        karutaData = await response.json();
        renderKarutaCards(karutaData);
        updateStats(karutaData.length);
    } catch (error) {
        console.error('データの読み込みに失敗しました:', error);
    }
}

// かるたカードを表示
function renderKarutaCards(data) {
    const grid = document.getElementById('karutaGrid');
    const noResults = document.getElementById('noResults');
    
    if (data.length === 0) {
        grid.style.display = 'none';
        noResults.style.display = 'block';
        return;
    }

    grid.style.display = 'grid';
    noResults.style.display = 'none';
    grid.innerHTML = '';

    data.forEach(karuta => {
        const card = document.createElement('div');
        card.className = 'karuta-card';
        card.onclick = () => showKarutaDetail(karuta);

        card.innerHTML = `
            <div class="karuta-images">
                <img src="img/${karuta.img_yomi}" alt="読み札" onerror="this.style.display='none'">
                <img src="img/${karuta.img_tori}" alt="取り札" onerror="this.style.display='none'">
            </div>
            <div class="karuta-info">
                <div class="karuta-header">
                    <div class="kashira">${karuta.kashira}</div>
                    <div class="karuta-name">${karuta.name}</div>
                </div>
                <div class="yomi-text">
                    ${karuta.yomi_kanji}
                    <div class="yomi-hiragana">${karuta.yomi_hiragana}</div>
                </div>
                <div class="saka-info">
                    <div><strong>読み:</strong> ${karuta.furikana}</div>
                </div>
            </div>
        `;

        grid.appendChild(card);
    });
}

// 検索機能
function searchKaruta(query) {
    if (!query.trim()) {
        renderKarutaCards(karutaData);
        updateStats(karutaData.length);
        return;
    }

    const lowerQuery = query.toLowerCase();
    const filtered = karutaData.filter(karuta => 
        karuta.name.includes(query) ||
        karuta.furikana.includes(lowerQuery) ||
        karuta.kashira === query ||
        karuta.yomi_kanji.includes(query) ||
        karuta.yomi_hiragana.includes(lowerQuery)
    );

    renderKarutaCards(filtered);
    updateStats(filtered.length, karutaData.length);
}

// 統計情報を更新
function updateStats(filtered, total = null) {
    const statsEl = document.getElementById('stats');
    if (total !== null && filtered !== total) {
        statsEl.textContent = `検索結果: ${filtered}件 / 全${total}件`;
    } else {
        statsEl.textContent = `全${filtered}件のかるた`;
    }
}

// モーダルウィンドウで詳細を表示
function showKarutaDetail(karuta) {
    const modal = document.getElementById('karutaModal');
    const modalKashira = document.getElementById('modalKashira');
    const modalName = document.getElementById('modalName');
    const modalBody = document.getElementById('modalBody');

    modalKashira.textContent = karuta.kashira;
    modalName.textContent = karuta.name;

    modalBody.innerHTML = `
        <div class="modal-images">
            <img src="img/${karuta.img_yomi}" alt="読み札" onerror="this.style.display='none'">
            <img src="img/${karuta.img_tori}" alt="取り札" onerror="this.style.display='none'">
        </div>
        <div class="modal-yomi-text">
            ${karuta.yomi_kanji}
            <div class="modal-yomi-hiragana">${karuta.yomi_hiragana}</div>
        </div>
        <div class="modal-saka-info">
            <div><strong>読み:</strong> ${karuta.furikana}</div>
        </div>
        ${karuta.history ? `
        <div class="modal-history">
            <div class="modal-history-title">歴史</div>
            <div class="modal-history-text">${karuta.history}</div>
        </div>
        ` : ''}
        <div class="modal-map-link">
            <a href="map.html?id=${karuta.id}" class="map-link-btn">
                <i class="fas fa-map-marked-alt"></i>
                地図で見る
            </a>
        </div>
    `;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// モーダルウィンドウを閉じる（グローバルスコープで使用可能にする）
window.closeModal = function() {
    const modal = document.getElementById('karutaModal');
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
};

// イベントリスナーの設定
document.addEventListener('DOMContentLoaded', function() {
    // 検索ボックスのイベント
    document.getElementById('searchBox').addEventListener('input', (e) => {
        searchKaruta(e.target.value);
    });

    // モーダルの外側をクリックで閉じる
    document.getElementById('karutaModal').addEventListener('click', function(event) {
        if (event.target === this) {
            closeModal();
        }
    });

    // ESCキーでモーダルを閉じる
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            closeModal();
        }
    });

    // 初期化
    loadKarutaData();
});

