// アプリケーション設定
export const APP_NAME = 'task-manager-pwa';
export const SCHEMA_VERSION = 1;
export const STORAGE_KEY = `${APP_NAME}:v${SCHEMA_VERSION}`;

// タスクステータス
export const TASK_STATUS = {
  TODO: 'todo',
  IN_PROGRESS: 'in-progress',
  DONE: 'done',
};

// ステータス表示設定
export const STATUS_CONFIG = {
  [TASK_STATUS.TODO]: {
    label: '未着手',
    color: 'bg-gray-100 text-gray-800 border-gray-300',
    columnColor: 'bg-gray-50',
  },
  [TASK_STATUS.IN_PROGRESS]: {
    label: '進行中',
    color: 'bg-blue-100 text-blue-800 border-blue-300',
    columnColor: 'bg-blue-50',
  },
  [TASK_STATUS.DONE]: {
    label: '完了',
    color: 'bg-green-100 text-green-800 border-green-300',
    columnColor: 'bg-green-50',
  },
};

// タスク優先度
export const TASK_PRIORITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
};

// 優先度表示設定
export const PRIORITY_CONFIG = {
  [TASK_PRIORITY.LOW]: {
    label: '低',
    color: 'text-gray-600',
    badge: 'bg-gray-200 text-gray-700',
  },
  [TASK_PRIORITY.MEDIUM]: {
    label: '中',
    color: 'text-yellow-600',
    badge: 'bg-yellow-200 text-yellow-700',
  },
  [TASK_PRIORITY.HIGH]: {
    label: '高',
    color: 'text-red-600',
    badge: 'bg-red-200 text-red-700',
  },
};

// LocalStorage容量上限（概算5MB）
export const STORAGE_LIMIT = 5 * 1024 * 1024;

// エラーメッセージ
export const ERROR_MESSAGES = {
  QUOTA_EXCEEDED: '保存に失敗しました（容量上限）。不要なタスクを削除するか、データをエクスポートして初期化してください。',
  PARSE_ERROR: 'データの読み込みに失敗しました。データが破損している可能性があります。',
  SAVE_ERROR: 'データの保存に失敗しました。',
  LOAD_ERROR: 'データの読み込みに失敗しました。',
};