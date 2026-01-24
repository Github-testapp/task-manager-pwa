'use client';

import Link from 'next/link';
import Calendar from '@/components/Calendar';

export default function CalendarPage() {
  return (
    <div className="min-h-screen p-2 sm:p-4">
      {/* ヘッダー */}
      <div className="max-w-6xl mx-auto mb-4 animate-fade-in">
        <div className="glass-effect rounded-2xl p-3 sm:p-4 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
              <Link 
                href="/"
                className="text-xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all cursor-pointer"
              >
                タスク管理
              </Link>
              <Link
                href="/board"
                className="px-2 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs sm:text-sm rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all font-bold shadow-md btn-hover"
              >
                📋 ボード
              </Link>
              <Link
                href="/settings"
                className="px-2 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-gray-600 to-gray-700 text-white text-xs sm:text-sm rounded-lg hover:from-gray-700 hover:to-gray-800 transition-all font-bold shadow-md btn-hover"
              >
                ⚙️ 設定
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* カレンダー */}
      <Calendar />
    </div>
  );
}