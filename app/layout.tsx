import { Inter, Poppins } from 'next/font/google';
import './globals.css';
import Link from 'next/link';
import { GoogleAnalytics } from '@next/third-parties/google';
import { ThemeProvider } from './components/ThemeProvider';
import { ThemeToggle } from './components/ThemeToggle';
import Starfield from './components/Starfield';
import CursorTrail from './components/CursorTrail';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

const poppins = Poppins({
  weight: ['400', '500', '600', '700', '800'],
  subsets: ['latin'],
  variable: '--font-heading',
});

export const metadata = {
  title: 'AgentBridge — Local Gemini Automation Bridge',
  description: 'Connect your local PyQt application with Gemini automation capabilities effortlessly. Complete local-cloud control dashboard.',
  openGraph: {
    title: 'AgentBridge — Local Gemini Automation Bridge',
    description: 'Connect your local PyQt application with Gemini automation capabilities effortlessly. Complete local-cloud control dashboard.',
    url: 'https://agentbridge.dev', // placeholder
    siteName: 'AgentBridge',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AgentBridge — Local Gemini Automation Bridge',
    description: 'Connect your local PyQt application with Gemini automation capabilities effortlessly. Complete local-cloud control dashboard.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`} suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {process.env.NEXT_PUBLIC_GA_ID && <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />}
          <Starfield />
          <CursorTrail />
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
                <ThemeToggle />
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
        </ThemeProvider>
      </body>
    </html>
  );
}
