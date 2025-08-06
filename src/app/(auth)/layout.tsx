import { Rocket } from 'lucide-react';
import Link from 'next/link';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="container z-40 bg-background">
        <div className="flex h-20 items-center justify-between py-6">
          <Link href="/" className="flex items-center gap-2">
            <Rocket className="h-7 w-7 text-primary" />
            <span className="text-2xl font-bold font-headline">StartLabX</span>
          </Link>
        </div>
      </header>
      <main className="flex-grow">{children}</main>
    </div>
  );
}
