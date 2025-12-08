/**
 * 長崎かるた API
 * すべての API 機能の統一エントリーポイント
 */

import { getAllKaruta, getKarutaById, getKarutaByIds, getTotalCount, getKashiraList } from './karuta.js';
import { search, searchByName, searchByYomi, searchByKashira } from './search.js';

/**
 * API の公開インターフェース
 */
export const API = {
  karuta: {
    getAll: getAllKaruta,
    getById: getKarutaById,
    getByIds: getKarutaByIds,
    getTotalCount,
    getKashiraList,
  },
  search: {
    search,
    searchByName,
    searchByYomi,
    searchByKashira,
  },
};

export default API;
