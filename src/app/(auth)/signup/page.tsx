import { SignUpForm } from '@/app/(auth)/components/signup-form';
import { AuthSidePanel } from '../components/auth-side-panel';
import { AuthHeader } from '../components/auth-header';
import { AuthContainer } from '../components/auth-container';
import { AuthFooterLinks } from '../components/auth-footer-links';

export default function SignUpPage() {
  return (
    <div className="container relative h-full flex items-center justify-center lg:grid lg:max-w-none lg:grid-cols-2 lg:px-0 overflow-hidden">
      <AuthSidePanel />
      <div className="relative flex h-full flex-col items-center justify-center p-4 lg:p-8 animate-in fade-in slide-in-from-right-10 duration-700">
        {/* Background Image Overlay */}
        <div className="absolute inset-0 -z-20">
          <img
            src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80"
            alt="Tech Pattern"
            className="w-full h-full object-cover opacity-5 grayscale invert dark:invert-0"
          />
        </div>
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-purple-500/10 via-background/90 to-background dark:from-purple-900/20" />

        <AuthContainer widthClass="sm:w-[480px]">
          <AuthHeader
            title="Join the Future"
            subtitle="Create your founder account and start building."
            className="mb-6 text-center"
          />
          <SignUpForm />
          <AuthFooterLinks mode="signup" />
        </AuthContainer>
      </div>
    </div>
  );
}
