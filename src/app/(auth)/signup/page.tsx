import { SignUpForm } from '@/app/(auth)/components/signup-form';
import { AuthSidePanel } from '../components/auth-side-panel';
import { AuthHeader } from '../components/auth-header';
import { AuthContainer } from '../components/auth-container';
import { AuthFooterLinks } from '../components/auth-footer-links';

export default function SignUpPage() {
  return (
    <div className="container grid h-full flex-col items-center justify-center lg:max-w-none lg:grid-cols-2 lg:px-0">
      <AuthSidePanel />
      <div className="lg:p-8">
        <AuthContainer widthClass="sm:w-[400px]">
          <AuthHeader title="Create an account" subtitle="Fill in the details below to request access." />
          <SignUpForm />
          <AuthFooterLinks mode="signup" />
        </AuthContainer>
      </div>
    </div>
  );
}
