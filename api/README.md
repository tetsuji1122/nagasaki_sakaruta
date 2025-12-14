# 長崎かるた API ドキュメント

## 概要

クライアント側のみで実装された擬似 API。
JSON ファイルからかるたデータを取得し、検索・フィルタリング機能を提供します。

## セットアップ

HTML ファイルで以下のように import して使用します：

```javascript
import API from './api/index.js';
```

### 外部サーバーから読み込む場合

公開しているビルド済み JS を直接読み込めます。

```html
<script type="module">
  import API from 'https://tetsuji1122.github.io/nagasaki_sakaruta/api/index.js';

  (async () => {
    const all = await API.karuta.getAll();
    console.log(all);
  })();
</script>
```

- `type="module"` を指定してください（ES Modules 用）
- データはモジュールと同じホスト上の `data/karuta.json` を参照します
- CORS を許可しているため、ローカル HTML や別ドメインからも利用できます

## API リファレンス

### かるたデータ取得

#### `API.karuta.getAll()`

すべてのかるたを取得します。

```javascript
const allKaruta = await API.karuta.getAll();
// 戻り値: 44個のかるたを含む配列
```

#### `API.karuta.getById(id)`

ID でかるたを取得します。

```javascript
const karuta = await API.karuta.getById(1);
// 戻り値: { id: 1, kashira: "あ", name: "ミルスの坂", ... }
// 見つからない場合: null
```

#### `API.karuta.getByIds(ids)`

複数の ID でかるたを取得します。

```javascript
const karutaList = await API.karuta.getByIds([1, 5, 10]);
// 戻り値: マッチしたかるたの配列
```

#### `API.karuta.getTotalCount()`

かるたの総数を取得します。

```javascript
const count = await API.karuta.getTotalCount();
// 戻り値: 44
```

#### `API.karuta.getKashiraList()`

頭文字（kashira）の一覧を取得します。

```javascript
const kashiraList = await API.karuta.getKashiraList();
// 戻り値: ["あ", "い", "う", "え", "お", "か", ...]
```

---

### 検索機能

#### `API.search.search(query)`

複合検索（名前、ふりがな、読み札、頭文字すべてを対象）

```javascript
const results = await API.search.search('坂');
// 戻り値: マッチしたかるたの配列
```

#### `API.search.searchByName(query)`

坂の名前で検索します。

```javascript
const results = await API.search.searchByName('オランダ');
// 戻り値: マッチしたかるたの配列
```

#### `API.search.searchByYomi(query)`

読み札で検索します。

```javascript
const results = await API.search.searchByYomi('天主堂');
// 戻り値: マッチしたかるたの配列
```

#### `API.search.searchByKashira(kashira)`

頭文字で検索します。

```javascript
const karutaA = await API.search.searchByKashira('あ');
// 戻り値: 「あ」行のかるたの配列
```

---

## データ構造

各かるたオブジェクトは以下の構造を持ちます：

```javascript
{
  id: 1,                                    // かるたID (1-44)
  kashira: "あ",                            // 頭文字
  name: "ミルスの坂",                        // 坂の名前
  furikana: "みるすのさか",                   // ふりがな
  saka_no: "NS206",                         // 坂番号
  yomi_kanji: "アメリカの 宣教師住む 鳴滝に",  // 読み札（漢字）
  yomi_hiragana: "あめりかの せんきょうしすむ なるたきに", // 読み札（ひらがな）
  img_yomi: "01_a_yomi.png",               // 読み札画像
  img_tori: "01_a_tori.png",               // 取り札画像
  photo_1: "01_あ_ミルスの坂.jpg",           // 写真1
  photo_2: "01_あ_ミルスの坂_p.jpg",         // 写真2（縦横）
  history: "県立鳴滝高校の南側の通りに...",   // 坂の歴史説明
  lat: 32.774246,                           // 緯度
  lon: 129.882859                           // 経度
}
```

---

## 使用例

### 例1: 検索フォームの実装

```javascript
import API from './api/index.js';

document.getElementById('searchBtn').addEventListener('click', async () => {
  const query = document.getElementById('searchInput').value;
  const results = await API.search.search(query);
  
  const html = results
    .map(k => `
      <div class="karuta-card">
        <h3>${k.name}</h3>
        <p>${k.yomi_kanji}</p>
        <img src="./images/${k.photo_1}" alt="">
      </div>
    `)
    .join('');
  
  document.getElementById('results').innerHTML = html;
});
```

### 例2: 頭文字フィルタリング

```javascript
import API from './api/index.js';

const kashiraList = await API.karuta.getKashiraList();

for (const kashira of kashiraList) {
  const btn = document.createElement('button');
  btn.textContent = kashira;
  btn.addEventListener('click', async () => {
    const karutaByKashira = await API.search.searchByKashira(kashira);
    displayKaruta(karutaByKashira);
  });
  document.getElementById('kashiraButtons').appendChild(btn);
}
```

### 例3: 地図表示への統合

```javascript
import API from './api/index.js';

async function addMarkersToMap(map) {
  const allKaruta = await API.karuta.getAll();
  
  allKaruta.forEach(k => {
    const marker = L.marker([k.lat, k.lon]).addTo(map);
    marker.bindPopup(`
      <strong>${k.name}</strong><br>
      ${k.yomi_kanji}<br>
      <img src="./images/${k.photo_1}" width="150" alt="">
    `);
  });
}
```

---

## トラブルシューティング

### データが取得できない場合

- ブラウザのコンソール（F12）でエラーメッセージを確認してください

### 検索結果がない場合

- 検索クエリが正しく入力されているか確認してください
- 大文字小文字は区別されません

### パフォーマンスが遅い場合

- データは初回読み込み時にキャッシュされます
- 2回目以降の呼び出しは高速になります

---

## 仕様

- **ファイルサイズ**: JSON データは約 100KB
- **読み込み時間**: ネットワーク接続によって異なります（通常 50-200ms）
- **キャッシュ**: 初回読み込み後、メモリにキャッシュされます
- **ブラウザ互換性**: ES6 Module をサポートするブラウザが必要です

---

## ライセンス

このデータのライセンスは、クリエイティブ・コモンズ・ライセンス 表示 4.0 国際 (CC BY 4.0) です。 以下のクレジットを表示することで、商用・非商用を問わず、自由に複製、頒布、改変して利用できます。

### 必須クレジット表示（例）

以下のいずれかの形式で、媒体に応じて見やすい場所に表示してください。

- 日本語例: 
  長崎坂るたデータ（CC BY 4.0）提供: 長崎坂るたプロジェクト（https://tetsuji1122.github.io/nagasaki_sakaruta/）

- 英語例:
  Nagasaki Sakaruta data (CC BY 4.0) by Nagasaki Sakaruta Project (https://tetsuji1122.github.io/nagasaki_sakaruta/)

CC BY 4.0 の詳細: https://creativecommons.org/licenses/by/4.0/deed.ja

