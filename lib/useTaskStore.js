'use client';

import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { TASK_STATUS, TASK_PRIORITY } from './constants';
import { loadFromStorage, saveToStorage, exportToJSON, importFromJSON } from './storage';

/**
 * タスクストアの初期状態
 */
const initialState = {
  tasks: [],
  searchQuery: '',
  filterStatus: null,
  filterPriority: null,
};

/**
 * Zustandストア - タスク管理
 */
export const useTaskStore = create((set, get) => ({
  ...initialState,

  /**
   * LocalStorageからタスクを読み込み
   */
  loadTasks: () => {
    const data = loadFromStorage();
    if (data && Array.isArray(data.tasks)) {
      set({
        tasks: data.tasks,
        searchQuery: data.searchQuery || '',
        filterStatus: data.filterStatus || null,
        filterPriority: data.filterPriority || null,
      });
    }
  },

  /**
   * タスクをLocalStorageに保存
   */
  saveTasks: () => {
    const state = get();
    const data = {
      tasks: state.tasks,
      searchQuery: state.searchQuery,
      filterStatus: state.filterStatus,
      filterPriority: state.filterPriority,
    };
    saveToStorage(data);
  },

  /**
   * 新しいタスクを追加
   * @param {Object} taskData タスクデータ
   */
  addTask: (taskData) => {
    const newTask = {
      id: uuidv4(),
      title: taskData.title || '新規タスク',
      description: taskData.description || '',
      status: taskData.status || TASK_STATUS.TODO,
      priority: taskData.priority || TASK_PRIORITY.MEDIUM,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      dueDate: taskData.dueDate || null,
      tags: taskData.tags || [],
    };

    set((state) => ({
      tasks: [...state.tasks, newTask],
    }));

    // 保存
    get().saveTasks();
  },

  /**
   * タスクを更新
   * @param {string} id タスクID
   * @param {Object} updates 更新内容
   */
  updateTask: (id, updates) => {
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === id
          ? { ...task, ...updates, updatedAt: new Date().toISOString() }
          : task
      ),
    }));

    get().saveTasks();
  },

  /**
   * タスクを削除
   * @param {string} id タスクID
   */
  deleteTask: (id) => {
    set((state) => ({
      tasks: state.tasks.filter((task) => task.id !== id),
    }));

    get().saveTasks();
  },

  /**
   * タスクのステータスを変更
   * @param {string} id タスクID
   * @param {string} newStatus 新しいステータス
   */
  changeTaskStatus: (id, newStatus) => {
    get().updateTask(id, { status: newStatus });
  },

  /**
   * タスクの並び順を変更（ドラッグ&ドロップ用）
   * @param {string} taskId タスクID
   * @param {string} newStatus 新しいステータス
   * @param {number} newIndex 新しいインデックス
   */
  reorderTasks: (taskId, newStatus, newIndex) => {
    set((state) => {
      const tasks = [...state.tasks];
      const taskIndex = tasks.findIndex((t) => t.id === taskId);
      
      if (taskIndex === -1) return state;

      // タスクを取り出す
      const [movedTask] = tasks.splice(taskIndex, 1);
      
      // ステータスを更新
      movedTask.status = newStatus;
      movedTask.updatedAt = new Date().toISOString();

      // 同じステータスのタスクを取得
      const sameStatusTasks = tasks.filter((t) => t.status === newStatus);
      const otherTasks = tasks.filter((t) => t.status !== newStatus);

      // 新しい位置に挿入
      sameStatusTasks.splice(newIndex, 0, movedTask);

      return { tasks: [...otherTasks, ...sameStatusTasks] };
    });

    get().saveTasks();
  },

  /**
   * 検索クエリを設定
   * @param {string} query 検索文字列
   */
  setSearchQuery: (query) => {
    set({ searchQuery: query });
  },

  /**
   * ステータスフィルターを設定
   * @param {string|null} status フィルターするステータス
   */
  setFilterStatus: (status) => {
    set({ filterStatus: status });
  },

  /**
   * 優先度フィルターを設定
   * @param {string|null} priority フィルターする優先度
   */
  setFilterPriority: (priority) => {
    set({ filterPriority: priority });
  },

  /**
   * フィルター済みタスクを取得
   * @returns {Array} フィルター済みタスク配列
   */
  getFilteredTasks: () => {
    const state = get();
    let filtered = [...state.tasks];

    // 検索クエリでフィルター
    if (state.searchQuery) {
      const query = state.searchQuery.toLowerCase();
      filtered = filtered.filter(
        (task) =>
          task.title.toLowerCase().includes(query) ||
          task.description.toLowerCase().includes(query) ||
          task.tags.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    // ステータスでフィルター
    if (state.filterStatus) {
      filtered = filtered.filter((task) => task.status === state.filterStatus);
    }

    // 優先度でフィルター
    if (state.filterPriority) {
      filtered = filtered.filter((task) => task.priority === state.filterPriority);
    }

    return filtered;
  },

  /**
   * 特定ステータスのタスクを取得
   * @param {string} status ステータス
   * @returns {Array} タスク配列
   */
  getTasksByStatus: (status) => {
    const filtered = get().getFilteredTasks();
    return filtered.filter((task) => task.status === status);
  },

  /**
   * データをエクスポート
   */
  exportData: () => {
    const state = get();
    const data = {
      tasks: state.tasks,
      searchQuery: state.searchQuery,
      filterStatus: state.filterStatus,
      filterPriority: state.filterPriority,
    };
    exportToJSON(data);
  },

  /**
   * データをインポート
   * @param {File} file JSONファイル
   */
  importData: async (file) => {
    const data = await importFromJSON(file);
    if (data && Array.isArray(data.tasks)) {
      const confirm = window.confirm(
        `${data.tasks.length}件のタスクをインポートします。現在のデータは上書きされます。よろしいですか？`
      );
      
      if (confirm) {
        set({
          tasks: data.tasks,
          searchQuery: data.searchQuery || '',
          filterStatus: data.filterStatus || null,
          filterPriority: data.filterPriority || null,
        });
        get().saveTasks();
        return true;
      }
    }
    return false;
  },

  /**
   * 全データをリセット
   */
  resetData: () => {
    const confirm = window.confirm(
      '全てのタスクを削除します。この操作は元に戻せません。よろしいですか？'
    );
    
    if (confirm) {
      set(initialState);
      get().saveTasks();
      return true;
    }
    return false;
  },
}));