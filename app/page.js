import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="glass-effect rounded-3xl shadow-2xl p-8 sm:p-16 animate-fade-in-up">
          {/* メインコンテンツ */}
          <div className="text-center mb-12">
            {/* アイコン */}
            <div className="inline-flex items-center justify-center w-28 h-28 bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 rounded-3xl mb-8 shadow-2xl animate-scale-in transform hover:scale-110 transition-transform duration-300">
              <svg
                className="w-16 h-16 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                />
              </svg>
            </div>
            
            {/* タイトル */}
            <h1 className="text-5xl sm:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 mb-4 leading-tight">
              タスク管理
            </h1>
            <p className="text-xl sm:text-2xl text-gray-700 font-semibold mb-3">
              シンプルで美しいカンバンボード
            </p>
            <p className="text-base text-gray-600 max-w-2xl mx-auto leading-relaxed">
              ドラッグ&ドロップでタスクを直感的に管理。<br className="hidden sm:block" />
              スマホでもPCでも快適に使える、モダンなタスク管理アプリ。
            </p>
          </div>

          {/* 機能カード */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
            <FeatureCard
              icon={
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11" />
                </svg>
              }
              title="直感的な操作"
              description="ドラッグ&ドロップでタスクを自由に移動"
              gradient="from-blue-500 to-cyan-500"
            />
            <FeatureCard
              icon={
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              }
              title="スマホ対応"
              description="モバイルで快適に使えるレスポンシブデザイン"
              gradient="from-purple-500 to-pink-500"
            />
            <FeatureCard
              icon={
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              }
              title="自動保存"
              description="LocalStorageでデータを安全に保存"
              gradient="from-green-500 to-emerald-500"
            />
            <FeatureCard
              icon={
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              }
              title="検索・フィルター"
              description="必要なタスクをすぐに見つけられる"
              gradient="from-orange-500 to-red-500"
            />
          </div>

          {/* スタートボタン */}
          <div className="text-center">
            <Link
              href="/board"
              className="inline-flex items-center gap-3 px-12 py-5 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white text-xl font-black rounded-2xl hover:shadow-2xl transition-all transform hover:-translate-y-1 hover:scale-105 shadow-xl"
            >
              <span>今すぐ始める</span>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>

          {/* フッター */}
          <div className="mt-12 pt-8 border-t border-gray-300">
            <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
              <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
              <span className="font-medium">PWA対応 - ホーム画面に追加して快適に使えます</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// 機能カードコンポーネント
function FeatureCard({ icon, title, description, gradient }) {
  return (
    <div className="group relative overflow-hidden bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 animate-slide-in-right">
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
      <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${gradient} rounded-2xl mb-4 text-white shadow-lg`}>
        {icon}
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </div>
  );
}