/**
 * かるた検索機能
 * 名前、ふりがな、読み札、頭文字による検索を提供
 */

import { getAllKaruta } from './karuta.js';

/**
 * 複合検索（名前、ふりがな、読み札、頭文字）
 * @param {string} query - 検索クエリ
 * @returns {Promise<Array>} マッチしたかるたの配列
 */
export async function search(query) {
  const data = await getAllKaruta();
  const q = query.toLowerCase();
  
  return data.filter(k => 
    k.name.toLowerCase().includes(q) ||
    k.furikana.toLowerCase().includes(q) ||
    k.yomi_kanji.toLowerCase().includes(q) ||
    k.yomi_hiragana.toLowerCase().includes(q) ||
    k.kashira.includes(q)
  );
}

/**
 * 坂の名前で検索
 * @param {string} query - 検索クエリ
 * @returns {Promise<Array>} マッチしたかるたの配列
 */
export async function searchByName(query) {
  const data = await getAllKaruta();
  return data.filter(k => 
    k.name.includes(query) || 
    k.furikana.includes(query)
  );
}

/**
 * 読み札で検索
 * @param {string} query - 検索クエリ
 * @returns {Promise<Array>} マッチしたかるたの配列
 */
export async function searchByYomi(query) {
  const data = await getAllKaruta();
  return data.filter(k => 
    k.yomi_kanji.includes(query) ||
    k.yomi_hiragana.includes(query)
  );
}

/**
 * 頭文字（kashira）で検索
 * @param {string} kashira - 頭文字（あ、い、う、え、お、etc.）
 * @returns {Promise<Array>} マッチしたかるたの配列
 */
export async function searchByKashira(kashira) {
  const data = await getAllKaruta();
  return data.filter(k => k.kashira === kashira);
}

/**
 * ページネーション付き検索
 * @param {string} query - 検索クエリ（空文字列の場合はすべて取得）
 * @param {number} page - ページ番号（1始まり）
 * @param {number} limit - 1ページあたりの件数
 * @returns {Promise<Object>} ページネーション情報付きの結果
 */
export async function searchPaginated(query = '', page = 1, limit = 12) {
  let results;
  
  if (query === '') {
    results = await getAllKaruta();
  } else {
    results = await search(query);
  }
  
  const start = (page - 1) * limit;
  const end = start + limit;
  
  return {
    data: results.slice(start, end),
    total: results.length,
    page: page,
    limit: limit,
    totalPages: Math.ceil(results.length / limit),
    hasNext: end < results.length,
    hasPrev: page > 1,
  };
}
