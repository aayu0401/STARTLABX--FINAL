import { SignUpForm } from '@/components/auth/signup-form';

export default function SignUpPage() {
  return (
    <div className="container grid h-full flex-col items-center justify-center lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
        <div
          className="absolute inset-0 bg-cover"
          style={{
            backgroundImage: 'url(https://placehold.co/1080x1920.png)',
          }}
          data-ai-hint="startup office"
        />
        <div className="relative z-20 flex items-center text-lg font-medium">
          StartLabX
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">
              &ldquo;The best way to predict the future is to create it.&rdquo;
            </p>
            <footer className="text-sm">Peter Drucker</footer>
          </blockquote>
        </div>
      </div>
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight font-headline">
              Create an account
            </h1>
            <p className="text-sm text-muted-foreground">
              Fill in the details below to request access.
            </p>
          </div>
          <SignUpForm />
        </div>
      </div>
    </div>
  );
}
