import { LoginForm } from '../components/login-form';
import { AuthHeader } from '../components/auth-header';
import { AuthContainer } from '../components/auth-container';
import { AuthFooterLinks } from '../components/auth-footer-links';

export default function LoginPage() {
  return (
    <div className="container flex h-full w-full flex-col items-center justify-center">
      <AuthContainer>
        <AuthHeader title="Welcome Back" subtitle="Enter your email and password to sign in to your account" />
        <LoginForm />
        <AuthFooterLinks mode="login" />
      </AuthContainer>
    </div>
  );
}
