import './globals.css';

export const metadata = {
  title: 'タスク管理アプリ',
  description: 'ドラッグ&ドロップ対応のモダンなタスク管理PWA',
  manifest: '/manifest.json',
  themeColor: '#3b82f6',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="ja">
      <head>
        <link rel="icon" href="/icon-192.png" type="image/png" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </head>
      <body className="antialiased">
        {children}

        {/* クライアントサイドエラー監視 */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if (typeof window !== 'undefined') {
                window.onerror = function(msg, src, line, col, err) {
                  try {
                    const logs = JSON.parse(localStorage.getItem('error-logs') || '[]');
                    logs.push({
                      t: Date.now(),
                      msg: String(msg),
                      src: String(src),
                      line: line,
                      col: col,
                      stack: err ? String(err.stack) : ''
                    });
                    const trimmed = JSON.stringify(logs).slice(0, 5000);
                    localStorage.setItem('error-logs', trimmed);
                  } catch (e) {
                    console.error('Failed to log error:', e);
                  }
                };

                window.onunhandledrejection = function(e) {
                  try {
                    const logs = JSON.parse(localStorage.getItem('error-logs') || '[]');
                    logs.push({
                      t: Date.now(),
                      rej: String(e.reason),
                      stack: e.reason && e.reason.stack ? String(e.reason.stack) : ''
                    });
                    const trimmed = JSON.stringify(logs).slice(0, 5000);
                    localStorage.setItem('error-logs', trimmed);
                  } catch (err) {
                    console.error('Failed to log rejection:', err);
                  }
                };
              }
            `,
          }}
        />
      </body>
    </html>
  );
}