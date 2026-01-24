'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTaskStore } from '@/lib/useTaskStore';

export default function SettingsPage() {
  const { tasks, resetData } = useTaskStore();
  const [mounted, setMounted] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleDeleteAll = () => {
    const confirmMessage = `全てのタスク（${tasks.length}件）を削除します。\n\nこの操作は元に戻せません。\n\n本当に削除しますか？`;
    
    if (window.confirm(confirmMessage)) {
      const doubleConfirm = window.confirm('最終確認：本当に全削除しますか？');
      
      if (doubleConfirm) {
        setIsDeleting(true);
        setTimeout(() => {
          const success = resetData();
          setIsDeleting(false);
          
          if (success) {
            alert('全てのタスクを削除しました。');
          }
        }, 500);
      }
    }
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
      <div className="max-w-4xl mx-auto mb-4 animate-fade-in">
        <div className="glass-effect rounded-2xl p-3 sm:p-4 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 sm:gap-4">
              <Link 
                href="/"
                className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all cursor-pointer"
              >
                タスク管理
              </Link>
              <Link
                href="/board"
                className="px-3 sm:px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs sm:text-sm rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all font-bold shadow-md btn-hover"
              >
                📋 ボード
              </Link>
              <Link
                href="/calendar"
                className="px-3 sm:px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs sm:text-sm rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all font-bold shadow-md btn-hover"
              >
                📅 カレンダー
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* 設定コンテンツ */}
      <div className="max-w-4xl mx-auto">
        <div className="glass-effect rounded-2xl p-6 sm:p-8 shadow-lg animate-fade-in">
          {/* タイトル */}
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-700 to-gray-900 mb-2">
              設定
            </h1>
            <p className="text-gray-600 text-sm sm:text-base">
              アプリケーションの設定を管理します
            </p>
          </div>

          {/* データ管理セクション */}
          <div className="mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-gray-300">
              データ管理
            </h2>

            {/* 現在のタスク数 */}
            <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 mb-6">
              <div className="flex items-center gap-3">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <div>
                  <p className="text-sm text-gray-600 font-medium">現在のタスク数</p>
                  <p className="text-3xl font-bold text-gray-900">{tasks.length} 件</p>
                </div>
              </div>
            </div>

            {/* 全削除ボタン */}
            <div className="bg-red-50 border-2 border-red-300 rounded-xl p-6">
              <div className="flex items-start gap-4 mb-4">
                <svg className="w-8 h-8 text-red-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-red-900 mb-2">全タスク削除</h3>
                  <p className="text-sm text-red-800 mb-4 leading-relaxed">
                    全てのタスクを削除します。この操作は取り消すことができません。<br />
                    削除する前に、必要に応じてエクスポート機能でバックアップを取ることをお勧めします。
                  </p>
                  <button
                    onClick={handleDeleteAll}
                    disabled={isDeleting || tasks.length === 0}
                    className={`px-6 py-3 rounded-xl font-bold shadow-lg transition-all ${
                      isDeleting || tasks.length === 0
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800 btn-hover'
                    }`}
                  >
                    {isDeleting ? '削除中...' : tasks.length === 0 ? 'タスクがありません' : '全てのタスクを削除'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* アプリ情報セクション */}
          <div className="mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-gray-300">
              アプリ情報
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white border-2 border-gray-200 rounded-xl p-4">
                <p className="text-sm text-gray-600 font-medium mb-1">バージョン</p>
                <p className="text-lg font-bold text-gray-900">1.0.0</p>
              </div>
              <div className="bg-white border-2 border-gray-200 rounded-xl p-4">
                <p className="text-sm text-gray-600 font-medium mb-1">データ保存</p>
                <p className="text-lg font-bold text-gray-900">LocalStorage</p>
              </div>
              <div className="bg-white border-2 border-gray-200 rounded-xl p-4">
                <p className="text-sm text-gray-600 font-medium mb-1">PWA対応</p>
                <p className="text-lg font-bold text-gray-900">はい</p>
              </div>
              <div className="bg-white border-2 border-gray-200 rounded-xl p-4">
                <p className="text-sm text-gray-600 font-medium mb-1">最終更新</p>
                <p className="text-lg font-bold text-gray-900">2026/01/24</p>
              </div>
            </div>
          </div>

          {/* 戻るボタン */}
          <div className="text-center pt-4 border-t-2 border-gray-200">
            <Link
              href="/board"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all font-bold shadow-lg btn-hover"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>ボードに戻る</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}