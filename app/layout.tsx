import { Inter } from 'next/font/google';
import './globals.css';
import Link from 'next/link';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata = {
  title: 'AgentBridge — Local Gemini Automation Bridge',
  description: 'Connect your local PyQt application with Gemini automation capabilities effortlessly. Complete local-cloud control dashboard.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body>
        <header className="header">
          <div className="container nav">
            <Link href="/" className="logo">
              <span className="logo-icon">▲</span>
              AgentBridge
            </Link>
            <nav className="nav-links">
              <Link href="/" className="nav-link">Home</Link>
              <Link href="/download" className="nav-link">Download</Link>
              <Link href="/feedback" className="nav-link">Feedback</Link>
              <Link href="/privacy" className="nav-link">Privacy Policy</Link>
            </nav>
          </div>
        </header>

        <main>{children}</main>

        <footer className="footer">
          <div className="container footer-content">
            <div className="footer-text" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <span>© {new Date().getFullYear()} AgentBridge. All rights reserved.</span>
              <span>Contact: <a href="mailto:sidhhukonduru@gmail.com" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>sidhhukonduru@gmail.com</a></span>
            </div>
            <nav className="nav-links">
              <Link href="/privacy" className="nav-link">Privacy</Link>
              <Link href="/download" className="nav-link">Download</Link>
              <Link href="/feedback" className="nav-link">Feedback</Link>
            </nav>
          </div>
        </footer>
      </body>
    </html>
  );
}
