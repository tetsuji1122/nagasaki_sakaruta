/**
 * かるたデータの取得・管理
 * JSON ファイルからかるたデータをロードし、各種操作を提供
 */

let karutaCache = null;

/**
 * JSON からかるたデータを初期化（キャッシュ）
 */
async function initCache() {
  if (!karutaCache) {
    // fetch はページの URL を基準に解決されるため、モジュール位置からの相対パスを明示する
    const dataUrl = new URL('../data/karuta.json', import.meta.url);
    const response = await fetch(dataUrl);
    if (!response.ok) {
      throw new Error(`Failed to load karuta data: ${response.statusText}`);
    }
    karutaCache = await response.json();
  }
  return karutaCache;
}

/**
 * すべてのかるたを取得
 * @returns {Promise<Array>} かるたデータの配列
 */
export async function getAllKaruta() {
  return await initCache();
}

/**
 * ID でかるたを取得
 * @param {number} id - かるたのID
 * @returns {Promise<Object|null>} マッチしたかるた、見つからない場合は null
 */
export async function getKarutaById(id) {
  const data = await initCache();
  return data.find(k => k.id === id) || null;
}

/**
 * 複数の ID でかるたを取得
 * @param {Array<number>} ids - かるたのID配列
 * @returns {Promise<Array>} マッチしたかるたの配列
 */
export async function getKarutaByIds(ids) {
  const data = await initCache();
  return data.filter(k => ids.includes(k.id));
}

/**
 * かるたの総数を取得
 * @returns {Promise<number>} かるたの総数
 */
export async function getTotalCount() {
  const data = await initCache();
  return data.length;
}

/**
 * 頭文字（kashira）の一覧を取得
 * @returns {Promise<Array<string>>} 頭文字の配列（ソート済み）
 */
export async function getKashiraList() {
  const data = await initCache();
  return [...new Set(data.map(k => k.kashira))].sort();
}

/**
 * キャッシュをクリア（開発用）
 */
export function clearCache() {
  karutaCache = null;
}
