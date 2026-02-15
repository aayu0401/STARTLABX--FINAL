import { LoginForm } from '../components/login-form';
import { AuthHeader } from '../components/auth-header';
import { AuthContainer } from '../components/auth-container';
import { AuthFooterLinks } from '../components/auth-footer-links';

export default function LoginPage() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background selection:bg-primary/30">
      {/* Dynamic Background Elements */}
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80"
          alt="Office Background"
          className="w-full h-full object-cover opacity-20 blur-sm brightness-50"
        />
        <div className="absolute inset-0 bg-background/80 backdrop-blur-[2px]" />

        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-600/30 rounded-full blur-[120px] animate-float opacity-70" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/30 rounded-full blur-[120px] animate-float opacity-70" style={{ animationDelay: '-3s' }} />
        <div className="absolute top-[20%] right-[20%] w-[30%] h-[30%] bg-pink-500/20 rounded-full blur-[100px] animate-pulse-subtle" />
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />

      <div className="relative z-10 w-full animate-in fade-in zoom-in duration-500 slide-in-from-bottom-5">
        <AuthContainer>
          <AuthHeader
            title="Welcome Back"
            subtitle="Enter your email to access your workspace"
            className="text-center"
          />
          <LoginForm />
          <AuthFooterLinks mode="login" />
        </AuthContainer>
      </div>
    </div>
  );
}
