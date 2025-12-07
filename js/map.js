let karutaData = [];
let map = null;
let markers = [];

// JSONデータを読み込む
async function loadKarutaData() {
    try {
        const response = await fetch('data/karuta.json');
        karutaData = await response.json();
        initMap();
    } catch (error) {
        console.error('データの読み込みに失敗しました:', error);
    }
}

// 地図を初期化
function initMap() {
    map = L.map('map').setView([32.76, 129.87], 15);

    const gsiStandard = L.tileLayer('https://cyberjapandata.gsi.go.jp/xyz/std/{z}/{x}/{y}.png', {
        attribution: '<a href="https://maps.gsi.go.jp/development/ichiran.html" target="_blank">国土地理院</a>',
        maxZoom: 18,
        minZoom: 5
    });

    const gsiPale = L.tileLayer('https://cyberjapandata.gsi.go.jp/xyz/pale/{z}/{x}/{y}.png', {
        attribution: '<a href="https://maps.gsi.go.jp/development/ichiran.html" target="_blank">国土地理院</a>',
        maxZoom: 18,
        minZoom: 5
    });

    const gsiBlank = L.tileLayer('https://cyberjapandata.gsi.go.jp/xyz/blank/{z}/{x}/{y}.png', {
        attribution: '<a href="https://maps.gsi.go.jp/development/ichiran.html" target="_blank">国土地理院</a>',
        maxZoom: 18,
        minZoom: 5
    });

    const osmStandard = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19
    });

    const baseLayers = {
        "国土地理院（標準）": gsiStandard,
        "国土地理院（淡色）": gsiPale,
        "国土地理院（白地図）": gsiBlank,
        "OpenStreetMap": osmStandard
    };

    gsiStandard.addTo(map);
    L.control.layers(baseLayers).addTo(map);

    updateMap();
}

// 地図を更新
function updateMap(data = karutaData) {
    markers.forEach(marker => map.removeLayer(marker));
    markers = [];

    data.forEach(karuta => {
        if (karuta.lat && karuta.lon) {
            const karutaIcon = L.icon({
                iconUrl: `img/${karuta.img_tori}`,
                iconSize: [60, 80],
                iconAnchor: [30, 80],
                popupAnchor: [0, -80]
            });

            const marker = L.marker([karuta.lat, karuta.lon], {
                icon: karutaIcon
            })
                .addTo(map)
                .bindPopup(`
                    <div style="text-align: center; min-width: 200px;">
                        <div style="font-size: 1.5rem; margin-bottom: 0.5rem; color: #8b4513;">${karuta.kashira}</div>
                        <div style="font-weight: bold; font-size: 1.1rem; margin-bottom: 0.5rem;">${karuta.name}</div>
                        <div style="font-size: 0.9rem; color: #666; margin-bottom: 0.5rem;">${karuta.yomi_kanji}</div>
                        <div style="font-size: 0.85rem; color: #888;">${karuta.furikana}</div>
                    </div>
                `);
            
            marker.karutaId = karuta.id;
            markers.push(marker);
        }
    });

    if (data.length > 0 && data.every(k => k.lat && k.lon)) {
        const urlParams = new URLSearchParams(window.location.search);
        const karutaId = urlParams.get('id');
        
        if (karutaId) {
            const targetMarker = markers.find(m => m.karutaId === parseInt(karutaId));
            const targetKaruta = data.find(k => k.id === parseInt(karutaId));
            if (targetMarker && targetKaruta) {
                map.setView([targetKaruta.lat, targetKaruta.lon], 16);
                targetMarker.openPopup();
                const highlightIcon = L.icon({
                    iconUrl: `img/${targetKaruta.img_tori}`,
                    iconSize: [75, 100],
                    iconAnchor: [37.5, 100],
                    popupAnchor: [0, -100]
                });
                targetMarker.setIcon(highlightIcon);
            }
        } else {
            const group = new L.featureGroup(markers);
            map.fitBounds(group.getBounds().pad(0.1));
        }
    }
}

// 初期化
document.addEventListener('DOMContentLoaded', function() {
    loadKarutaData();
});

