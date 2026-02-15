import './globals.css';
import { Providers } from './providers';
import NoSSR from '@/components/no-ssr';

export const metadata = {
  title: 'StartLabX V2 - Launch Your Startup',
  description: 'AI-powered platform to validate ideas, build MVPs, and hire talent for your startup.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&family=Inter:wght@300;400;500;600;700&family=Lexend+Deca:wght@300;400;500&display=swap" rel="stylesheet" />
      </head>
      <body className="font-sans antialiased">
        <NoSSR>
          <Providers>
            {children}
          </Providers>
        </NoSSR>
      </body>
    </html>
  );
}

