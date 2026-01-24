'use client';

import { useDroppable } from '@dnd-kit/core';
import { SortableContext, rectSortingStrategy } from '@dnd-kit/sortable';
import TaskCard from './TaskCard';
import { STATUS_CONFIG } from '@/lib/constants';

export default function Column({ status, tasks, onEditTask, onDeleteTask }) {
  const { setNodeRef } = useDroppable({ id: status });
  const statusConfig = STATUS_CONFIG[status];

  return (
    <div className="w-full">
      <div className={`${statusConfig.columnColor} rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-lg glass-effect animate-fade-in`}>
        {/* 列ヘッダー */}
        <div className="flex items-center justify-between mb-3 pb-3 border-b-2 border-gray-300">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900">
            {statusConfig.label}
          </h2>
          <span className="bg-white text-gray-800 text-sm font-bold px-3 py-1.5 rounded-full shadow-sm">
            {tasks.length}
          </span>
        </div>

        {/* タスクリスト（スマホ2列、PC4列グリッド） */}
        <div
          ref={setNodeRef}
          className="min-h-[150px]"
        >
          <SortableContext
            items={tasks.map((t) => t.id)}
            strategy={rectSortingStrategy}
          >
            {tasks.length === 0 ? (
              <div className="text-center text-gray-500 text-sm py-12 font-medium">
                タスクがありません
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
                {tasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onEdit={onEditTask}
                    onDelete={onDeleteTask}
                  />
                ))}
              </div>
            )}
          </SortableContext>
        </div>
      </div>
    </div>
  );
}