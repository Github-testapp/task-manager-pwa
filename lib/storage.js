import { STORAGE_KEY, SCHEMA_VERSION, ERROR_MESSAGES } from './constants';

/**
 * LocalStorageからデータを取得
 * @returns {Object|null} 保存されたデータまたはnull
 */
export function loadFromStorage() {
  try {
    if (typeof window === 'undefined') return null;
    
    const rawData = localStorage.getItem(STORAGE_KEY);
    if (!rawData) return null;

    const parsed = JSON.parse(rawData);
    
    // スキーマバージョンチェック
    if (parsed.schemaVersion !== SCHEMA_VERSION) {
      console.warn(`スキーマバージョン不一致: ${parsed.schemaVersion} → ${SCHEMA_VERSION}`);
      // バージョンアップ時のマイグレーション処理をここに追加可能
      return null;
    }

    return parsed.data;
  } catch (error) {
    console.error('loadFromStorage error:', error);
    
    // JSON破損の場合は警告してnullを返す
    if (error instanceof SyntaxError) {
      console.error(ERROR_MESSAGES.PARSE_ERROR);
    }
    
    return null;
  }
}

/**
 * LocalStorageにデータを保存
 * @param {Object} data 保存するデータ
 * @returns {boolean} 成功したかどうか
 */
export function saveToStorage(data) {
  try {
    if (typeof window === 'undefined') return false;

    const payload = {
      schemaVersion: SCHEMA_VERSION,
      data,
      savedAt: new Date().toISOString(),
    };

    const jsonString = JSON.stringify(payload);
    localStorage.setItem(STORAGE_KEY, jsonString);
    
    return true;
  } catch (error) {
    console.error('saveToStorage error:', error);
    
    // 容量超過エラー
    if (error.name === 'QuotaExceededError') {
      alert(ERROR_MESSAGES.QUOTA_EXCEEDED);
    } else {
      alert(ERROR_MESSAGES.SAVE_ERROR);
    }
    
    return false;
  }
}

/**
 * LocalStorageのデータをクリア
 * @returns {boolean} 成功したかどうか
 */
export function clearStorage() {
  try {
    if (typeof window === 'undefined') return false;
    
    localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch (error) {
    console.error('clearStorage error:', error);
    return false;
  }
}

/**
 * データをJSON形式でエクスポート
 * @param {Object} data エクスポートするデータ
 * @param {string} filename ファイル名（省略時は自動生成）
 */
export function exportToJSON(data, filename) {
  try {
    const payload = {
      schemaVersion: SCHEMA_VERSION,
      exportedAt: new Date().toISOString(),
      data,
    };

    const jsonString = JSON.stringify(payload, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const defaultFilename = `task-backup-${new Date().toISOString().slice(0, 10)}.json`;
    const link = document.createElement('a');
    link.href = url;
    link.download = filename || defaultFilename;
    link.click();

    URL.revokeObjectURL(url);
    return true;
  } catch (error) {
    console.error('exportToJSON error:', error);
    alert('エクスポートに失敗しました。');
    return false;
  }
}

/**
 * JSONファイルからデータをインポート
 * @param {File} file インポートするJSONファイル
 * @returns {Promise<Object|null>} インポートしたデータまたはnull
 */
export async function importFromJSON(file) {
  try {
    const text = await file.text();
    const parsed = JSON.parse(text);

    // スキーマバージョンチェック
    if (parsed.schemaVersion !== SCHEMA_VERSION) {
      const confirm = window.confirm(
        `異なるバージョンのデータです（v${parsed.schemaVersion}）。インポートを続けますか？`
      );
      if (!confirm) return null;
    }

    return parsed.data;
  } catch (error) {
    console.error('importFromJSON error:', error);
    
    if (error instanceof SyntaxError) {
      alert('無効なJSONファイルです。');
    } else {
      alert('インポートに失敗しました。');
    }
    
    return null;
  }
}

/**
 * 現在のストレージ使用量を取得（概算）
 * @returns {number} 使用量（バイト）
 */
export function getStorageSize() {
  try {
    if (typeof window === 'undefined') return 0;
    
    const rawData = localStorage.getItem(STORAGE_KEY);
    if (!rawData) return 0;
    
    return new Blob([rawData]).size;
  } catch (error) {
    console.error('getStorageSize error:', error);
    return 0;
  }
}