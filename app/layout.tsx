import { Barlow_Condensed, Barlow } from 'next/font/google';
import './globals.css';
import Link from 'next/link';
import Image from 'next/image';
import { GoogleAnalytics } from '@next/third-parties/google';
import { ThemeProvider } from './components/ThemeProvider';
import { ThemeToggle } from './components/ThemeToggle';

const barlowCondensed = Barlow_Condensed({
  weight: ['300', '400', '600', '700', '800'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  variable: '--font-heading',
});

const barlow = Barlow({
  weight: ['300', '400', '500'],
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata = {
  title: 'AgentBridge — Local Gemini Automation Bridge',
  description: 'Connect your local PyQt application with Gemini automation capabilities effortlessly. Complete local-cloud control dashboard.',
  openGraph: {
    title: 'AgentBridge — Local Gemini Automation Bridge',
    description: 'Connect your local PyQt application with Gemini automation capabilities effortlessly.',
    url: 'https://agentbridge.dev',
    siteName: 'AgentBridge',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AgentBridge — Local Gemini Automation Bridge',
    description: 'Connect your local PyQt application with Gemini automation capabilities effortlessly.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${barlowCondensed.variable} ${barlow.variable}`} suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          {process.env.NEXT_PUBLIC_GA_ID && <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />}

          <header className="header">
            <div className="nav">
              <Link href="/" className="logo">
                <Image src="/logo-bg.webp" alt="AgentBridge" width={32} height={32} style={{ borderRadius: '50%', background: '#fff', padding: '2px' }} />
                AgentBridge
              </Link>
              <nav className="nav-links">
                <Link href="/" className="nav-link">Home</Link>
                <Link href="/download" className="nav-link">Download</Link>
                <Link href="/feedback" className="nav-link">Feedback</Link>
                <Link href="/privacy" className="nav-link">Privacy</Link>
                <ThemeToggle />
              </nav>
            </div>
          </header>

          <main>{children}</main>

          <footer className="footer">
            <div className="container">
              <div className="footer-grid">
                <div>
                  <h3 className="footer-brand-title">AgentBridge</h3>
                  <p className="footer-brand-desc">
                    Local desktop automation bridge connecting PyQt applications with Gemini AI capabilities. Built for precision, engineered for performance.
                  </p>
                </div>
                <div>
                  <p className="footer-col-title">Product</p>
                  <ul className="footer-links">
                    <li><Link href="/download">Download</Link></li>
                    <li><a href="https://yogarathinam.github.io/AgentBridge/" target="_blank" rel="noopener noreferrer">Documentation</a></li>
                    <li><Link href="/feedback">Feedback</Link></li>
                  </ul>
                </div>
                <div>
                  <p className="footer-col-title">Company</p>
                  <ul className="footer-links">
                    <li><Link href="/privacy">Privacy Policy</Link></li>
                  </ul>
                </div>
                <div>
                  <p className="footer-col-title">Contact</p>
                  <ul className="footer-links">
                    <li><a href="mailto:sidhhukonduru@gmail.com">sidhhukonduru@gmail.com</a></li>
                  </ul>
                </div>
              </div>
              <div className="footer-bottom">
                <p className="footer-copyright">© {new Date().getFullYear()} AgentBridge. All rights reserved.</p>
                <nav className="nav-links">
                  <Link href="/privacy" className="nav-link">Privacy</Link>
                  <Link href="/download" className="nav-link">Download</Link>
                </nav>
              </div>
            </div>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}

