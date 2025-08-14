import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from '@/contexts/auth-context';
import { LoadingProvider } from '@/contexts/loading-context';

export const metadata: Metadata = {
  title: 'StartLabX',
  description: 'Launch your startup with the right team. Connect with professionals ready to build for equity.',
  viewport: 'width=device-width, initial-scale=1',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&family=Lexend+Deca:wght@300;400;500&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <LoadingProvider>
          <AuthProvider>
            {children}
            <Toaster />
          </AuthProvider>
        </LoadingProvider>
      </body>
    </html>
  );
}
