'use client';

import { useState, useEffect } from 'react';
import { useTaskStore } from '@/lib/useTaskStore';
import { TASK_STATUS, STATUS_CONFIG } from '@/lib/constants';
import TaskModal from './TaskModal';

export default function Calendar() {
  const { tasks, loadTasks, updateTask, deleteTask } = useTaskStore();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedTask, setSelectedTask] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    loadTasks();
    setMounted(true);
  }, [loadTasks]);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // 月の最初の日と最後の日を取得
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startDayOfWeek = firstDay.getDay();

  // カレンダーの日付配列を生成
  const calendarDays = [];
  for (let i = 0; i < startDayOfWeek; i++) {
    calendarDays.push(null);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  // 特定の日付のタスクを取得
  const getTasksForDate = (day) => {
    if (!day) return [];
    const dateStr = new Date(year, month, day).toISOString().split('T')[0];
    return tasks.filter((task) => {
      if (task.dueDate) {
        const taskDate = task.dueDate.split('T')[0];
        return taskDate === dateStr;
      }
      if (task.status === TASK_STATUS.DONE && task.updatedAt) {
        const completedDate = task.updatedAt.split('T')[0];
        return completedDate === dateStr;
      }
      return false;
    });
  };

  // 前月・次月への移動
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const handleEditTask = (task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTask(null);
  };

  const handleSaveTask = (taskData) => {
    if (selectedTask) {
      updateTask(selectedTask.id, taskData);
    }
    setSelectedTask(null);
  };

  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-gray-600 font-medium animate-pulse-slow">読み込み中...</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* ヘッダー */}
      <div className="glass-effect rounded-2xl p-4 sm:p-6 shadow-lg mb-4 animate-fade-in">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
            {year}年 {month + 1}月
          </h2>
          <div className="flex gap-2">
            <button
              onClick={goToPreviousMonth}
              className="px-3 py-2 glass-effect rounded-lg hover:bg-gray-100 transition-all font-bold text-gray-700 btn-hover"
            >
              ←
            </button>
            <button
              onClick={goToToday}
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all font-bold shadow-md btn-hover text-sm"
            >
              今日
            </button>
            <button
              onClick={goToNextMonth}
              className="px-3 py-2 glass-effect rounded-lg hover:bg-gray-100 transition-all font-bold text-gray-700 btn-hover"
            >
              →
            </button>
          </div>
        </div>

        {/* 凡例 */}
        <div className="flex flex-wrap gap-3 text-xs sm:text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-300 rounded"></div>
            <span className="font-medium text-gray-700">未着手</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-300 rounded"></div>
            <span className="font-medium text-gray-700">進行中</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-300 rounded"></div>
            <span className="font-medium text-gray-700">完了</span>
          </div>
        </div>
      </div>

      {/* カレンダーグリッド */}
      <div className="glass-effect rounded-2xl p-4 shadow-lg animate-fade-in">
        {/* 曜日ヘッダー */}
        <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-2">
          {['日', '月', '火', '水', '木', '金', '土'].map((day, index) => (
            <div
              key={day}
              className={`text-center font-bold text-sm sm:text-base py-2 ${
                index === 0 ? 'text-red-600' : index === 6 ? 'text-blue-600' : 'text-gray-700'
              }`}
            >
              {day}
            </div>
          ))}
        </div>

        {/* カレンダー日付 */}
        <div className="grid grid-cols-7 gap-1 sm:gap-2">
          {calendarDays.map((day, index) => {
            const tasksForDay = day ? getTasksForDate(day) : [];
            const isToday =
              day &&
              year === new Date().getFullYear() &&
              month === new Date().getMonth() &&
              day === new Date().getDate();

            return (
              <div
                key={index}
                className={`min-h-[80px] sm:min-h-[120px] p-1 sm:p-2 rounded-lg border-2 ${
                  day
                    ? isToday
                      ? 'bg-yellow-50 border-yellow-400'
                      : 'bg-white border-gray-200 hover:border-gray-300'
                    : 'bg-gray-50 border-gray-100'
                } transition-all`}
              >
                {day && (
                  <>
                    <div
                      className={`text-right font-bold text-sm sm:text-base mb-1 ${
                        isToday ? 'text-yellow-600' : 'text-gray-700'
                      }`}
                    >
                      {day}
                    </div>
                    <div className="space-y-1">
                      {tasksForDay.map((task) => (
                        <div
                          key={task.id}
                          onClick={() => handleEditTask(task)}
                          className={`text-xs p-1 rounded cursor-pointer hover:opacity-80 transition-opacity ${
                            task.status === TASK_STATUS.TODO
                              ? 'bg-red-300 text-red-900'
                              : task.status === TASK_STATUS.IN_PROGRESS
                              ? 'bg-green-300 text-green-900'
                              : 'bg-blue-300 text-blue-900'
                          }`}
                          title={task.title}
                        >
                          <div className="truncate font-medium">{task.title}</div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* タスクモーダル */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveTask}
        initialTask={selectedTask}
      />
    </div>
  );
}