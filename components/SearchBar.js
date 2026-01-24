'use client';

import { TASK_STATUS, TASK_PRIORITY, STATUS_CONFIG, PRIORITY_CONFIG } from '@/lib/constants';

export default function SearchBar({
  searchQuery,
  filterStatus,
  filterPriority,
  onSearchChange,
  onStatusFilterChange,
  onPriorityFilterChange,
  onClearFilters,
}) {
  const hasActiveFilters = searchQuery || filterStatus || filterPriority;

  return (
    <div className="glass-effect rounded-xl shadow-sm border border-gray-200 p-4 mb-4">
      {/* 検索バー */}
      <div className="relative mb-3">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="タスクを検索..."
          className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent font-medium"
        />
        <svg
          className="absolute left-3 top-3.5 w-5 h-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>

      {/* フィルター */}
      <div className="flex flex-wrap gap-2 mb-3">
        <select
          value={filterStatus || ''}
          onChange={(e) => onStatusFilterChange(e.target.value || null)}
          className="flex-1 min-w-[120px] px-3 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent font-medium"
        >
          <option value="">全ステータス</option>
          {Object.entries(STATUS_CONFIG).map(([key, config]) => (
            <option key={key} value={key}>
              {config.label}
            </option>
          ))}
        </select>

        <select
          value={filterPriority || ''}
          onChange={(e) => onPriorityFilterChange(e.target.value || null)}
          className="flex-1 min-w-[120px] px-3 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent font-medium"
        >
          <option value="">全優先度</option>
          {Object.entries(PRIORITY_CONFIG).map(([key, config]) => (
            <option key={key} value={key}>
              {config.label}
            </option>
          ))}
        </select>
      </div>

      {/* フィルタークリアボタン */}
      {hasActiveFilters && (
        <button
          onClick={onClearFilters}
          className="w-full px-4 py-2 text-sm text-blue-600 hover:text-blue-800 transition-colors font-bold btn-hover"
        >
          フィルターをクリア
        </button>
      )}
    </div>
  );
}