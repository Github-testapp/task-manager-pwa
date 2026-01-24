'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { TASK_PRIORITY, TASK_STATUS } from '@/lib/constants';

export default function TaskCard({ task, onEdit, onDelete }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  // ステータスのみで背景色を決定（統一色）
  const getCardColor = () => {
    const { status } = task;
    
    if (status === TASK_STATUS.TODO) {
      return 'bg-gradient-to-br from-red-200 to-red-300 border-red-400 hover:from-red-300 hover:to-red-400';
    }
    
    if (status === TASK_STATUS.IN_PROGRESS) {
      return 'bg-gradient-to-br from-green-200 to-green-300 border-green-400 hover:from-green-300 hover:to-green-400';
    }
    
    if (status === TASK_STATUS.DONE) {
      return 'bg-gradient-to-br from-blue-200 to-blue-300 border-blue-400 hover:from-blue-300 hover:to-blue-400';
    }
    
    return 'bg-gradient-to-br from-gray-100 to-gray-200 border-gray-300 hover:from-gray-200 hover:to-gray-300';
  };

  // 優先度バッジの取得
  const getPriorityBadge = () => {
    switch (task.priority) {
      case TASK_PRIORITY.HIGH:
        return { icon: '🔴', label: '高', color: 'bg-red-500 text-white' };
      case TASK_PRIORITY.MEDIUM:
        return { icon: '🟡', label: '中', color: 'bg-yellow-400 text-gray-900' };
      case TASK_PRIORITY.LOW:
        return { icon: '🟢', label: '低', color: 'bg-green-500 text-white' };
      default:
        return { icon: '⚪', label: '低', color: 'bg-gray-400 text-white' };
    }
  };

  // 期限ステータスの取得
  const getDueDateInfo = () => {
    if (!task.dueDate) return null;

    const today = new Date();
    const dueDate = new Date(task.dueDate);
    const diffDays = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));

    const dateStr = dueDate.toLocaleDateString('ja-JP', {
      month: 'numeric',
      day: 'numeric',
    });

    if (diffDays < 0) {
      return { text: `${dateStr}`, icon: '⚠️', urgent: true };
    } else if (diffDays === 0) {
      return { text: `${dateStr}`, icon: '⏰', urgent: true };
    } else if (diffDays <= 3) {
      return { text: `${dateStr}`, icon: '📅', urgent: false };
    }

    return { text: dateStr, icon: '📅', urgent: false };
  };

  const priorityBadge = getPriorityBadge();
  const dueDateInfo = getDueDateInfo();

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`${getCardColor()} rounded-lg shadow-md border-2 p-2 sm:p-3 cursor-move transition-all duration-200 touch-none relative aspect-square flex flex-col justify-between overflow-hidden`}
    >
      {/* 削除ボタン（右上） */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          if (window.confirm(`「${task.title}」を削除しますか？`)) {
            onDelete(task.id);
          }
        }}
        className="absolute top-1 right-1 text-red-600 hover:text-red-800 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center text-xs sm:text-sm font-bold shadow-md transition-all z-10"
        title="削除"
      >
        ×
      </button>

      {/* 優先度バッジ（左上） */}
      <div className="absolute top-1 left-1 z-10">
        <div 
          className={`${priorityBadge.color} rounded-full px-1.5 py-0.5 text-[9px] sm:text-[10px] font-bold shadow-md flex items-center gap-0.5`}
          title={`優先度: ${priorityBadge.label}`}
        >
          <span>{priorityBadge.icon}</span>
          <span>{priorityBadge.label}</span>
        </div>
      </div>

      {/* タスクタイトル */}
      <div 
        onClick={(e) => {
          if (e.target.tagName !== 'BUTTON') {
            onEdit(task);
          }
        }}
        className="cursor-pointer flex-grow flex items-center justify-center px-6 pt-6"
      >
        <h3 className="text-xs sm:text-sm font-bold text-gray-900 line-clamp-3 break-words text-center">
          {task.title}
        </h3>
      </div>

      {/* 下部情報エリア */}
      <div className="flex-shrink-0 space-y-1">
        {/* 説明文（1行のみ） */}
        {task.description && (
          <p 
            onClick={(e) => {
              if (e.target.tagName !== 'BUTTON') {
                onEdit(task);
              }
            }}
            className="text-[10px] text-gray-700 opacity-80 line-clamp-1 break-words cursor-pointer text-center"
          >
            {task.description}
          </p>
        )}

        {/* 期限日 */}
        {dueDateInfo && (
          <div className={`flex items-center justify-center gap-1 ${dueDateInfo.urgent ? 'animate-pulse' : ''}`}>
            <span className="text-xs">{dueDateInfo.icon}</span>
            <span className="text-[10px] text-gray-900 font-medium">
              {dueDateInfo.text}
            </span>
          </div>
        )}

        {/* タグ（最大1つ表示） */}
        {task.tags && task.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 justify-center">
            <span className="inline-block bg-white bg-opacity-80 text-gray-700 text-[9px] px-1.5 py-0.5 rounded font-medium">
              {task.tags[0]}
            </span>
            {task.tags.length > 1 && (
              <span className="inline-block bg-white bg-opacity-80 text-gray-600 text-[9px] px-1.5 py-0.5 rounded font-medium">
                +{task.tags.length - 1}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}