'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  closestCenter, // closestCornersから変更
  pointerWithin,
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import Column from './Column';
import TaskCard from './TaskCard';
import TaskModal from './TaskModal';
import SearchBar from './SearchBar';
import { useTaskStore } from '@/lib/useTaskStore';
import { TASK_STATUS } from '@/lib/constants';

export default function Board() {
  const {
    tasks,
    searchQuery,
    filterStatus,
    filterPriority,
    loadTasks,
    addTask,
    updateTask,
    deleteTask,
    setSearchQuery,
    setFilterStatus,
    setFilterPriority,
    getTasksByStatus,
  } = useTaskStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [activeTask, setActiveTask] = useState(null);
  const [mounted, setMounted] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 200,
        tolerance: 5,
      },
    })
  );

  useEffect(() => {
    loadTasks();
    setMounted(true);
  }, [loadTasks]);

  const handleSaveTask = (taskData) => {
    if (editingTask) {
      updateTask(editingTask.id, taskData);
    } else {
      addTask(taskData);
    }
    setEditingTask(null);
  };

  const handleOpenModal = (task = null) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTask(null);
  };

  const handleDragStart = (event) => {
    const { active } = event;
    const task = tasks.find((t) => t.id === active.id);
    setActiveTask(task);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    // ステータス列に直接ドロップした場合
    if (Object.values(TASK_STATUS).includes(overId)) {
      const task = tasks.find((t) => t.id === activeId);
      if (task && task.status !== overId) {
        updateTask(activeId, { status: overId });
      }
      return;
    }

    // タスクカードの上にドロップした場合
    const activeTask = tasks.find((t) => t.id === activeId);
    const overTask = tasks.find((t) => t.id === overId);

    if (!activeTask || !overTask) return;

    const activeStatus = activeTask.status;
    const overStatus = overTask.status;

    // 異なるステータスへの移動
    if (activeStatus !== overStatus) {
      updateTask(activeId, { status: overStatus });
      return;
    }

    // 同じステータス内での並び替え
    if (activeStatus === overStatus) {
      const statusTasks = getTasksByStatus(activeStatus);
      const oldIndex = statusTasks.findIndex((t) => t.id === activeId);
      const newIndex = statusTasks.findIndex((t) => t.id === overId);

      if (oldIndex !== newIndex) {
        const reordered = arrayMove(statusTasks, oldIndex, newIndex);
        const otherTasks = tasks.filter((t) => t.status !== activeStatus);
        const newTasks = [...otherTasks, ...reordered];
        useTaskStore.setState({ tasks: newTasks });
        useTaskStore.getState().saveTasks();
      }
    }
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setFilterStatus(null);
    setFilterPriority(null);
  };

  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-gray-600 font-medium animate-pulse-slow">読み込み中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-2 sm:p-4">
      {/* ヘッダー */}
      <div className="max-w-7xl mx-auto mb-4 animate-fade-in">
        <div className="glass-effect rounded-2xl p-3 sm:p-4 shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
              <Link 
                href="/"
                className="text-xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all cursor-pointer"
              >
                タスク管理
              </Link>
              <Link
                href="/calendar"
                className="px-2 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs sm:text-sm rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all font-bold shadow-md btn-hover"
              >
                📅 カレンダー
              </Link>
              <Link
                href="/settings"
                className="px-2 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-gray-600 to-gray-700 text-white text-xs sm:text-sm rounded-lg hover:from-gray-700 hover:to-gray-800 transition-all font-bold shadow-md btn-hover"
              >
                ⚙️ 設定
              </Link>
            </div>
            <button
              onClick={() => handleOpenModal()}
              className="px-3 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm sm:text-base rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all font-bold shadow-md btn-hover"
            >
              + 新規
            </button>
          </div>

          {/* 検索バー */}
          <SearchBar
            searchQuery={searchQuery}
            filterStatus={filterStatus}
            filterPriority={filterPriority}
            onSearchChange={setSearchQuery}
            onStatusFilterChange={setFilterStatus}
            onPriorityFilterChange={setFilterPriority}
            onClearFilters={handleClearFilters}
          />
        </div>
      </div>

      {/* カンバンボード（縦3段） */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="max-w-7xl mx-auto space-y-4">
          {/* 未着手 */}
          <Column
            status={TASK_STATUS.TODO}
            tasks={getTasksByStatus(TASK_STATUS.TODO)}
            onEditTask={handleOpenModal}
            onDeleteTask={deleteTask}
          />
          
          {/* 進行中 */}
          <Column
            status={TASK_STATUS.IN_PROGRESS}
            tasks={getTasksByStatus(TASK_STATUS.IN_PROGRESS)}
            onEditTask={handleOpenModal}
            onDeleteTask={deleteTask}
          />
          
          {/* 完了 */}
          <Column
            status={TASK_STATUS.DONE}
            tasks={getTasksByStatus(TASK_STATUS.DONE)}
            onEditTask={handleOpenModal}
            onDeleteTask={deleteTask}
          />
        </div>

        <DragOverlay>
          {activeTask ? (
            <div className="rotate-3 opacity-90 w-32 sm:w-40">
              <TaskCard
                task={activeTask}
                onEdit={() => {}}
                onDelete={() => {}}
              />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      <TaskModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveTask}
        initialTask={editingTask}
      />
    </div>
  );
}