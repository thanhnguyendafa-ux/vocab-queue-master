import { LoginForm } from '@/components/auth/login-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
export var metadata = {
    title: 'Login',
    description: 'Login to your account',
};
export default function LoginPage() {
    return (<div className="container relative min-h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
        <div className="absolute inset-0 bg-zinc-900"/>
        <div className="relative z-20 flex items-center text-lg font-medium">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-6 w-6">
            <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3"/>
          </svg>
          Vocab Queue Master
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">
              "The limits of my language mean the limits of my world."
            </p>
            <footer className="text-sm">Ludwig Wittgenstein</footer>
          </blockquote>
        </div>
      </div>
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <Card>
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl">Welcome back</CardTitle>
              <CardDescription>
                Enter your email and password to sign in to your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <LoginForm />
              <p className="mt-4 px-8 text-center text-sm text-muted-foreground">
                By clicking continue, you agree to our{' '}
                <Link href="/terms" className="underline underline-offset-4 hover:text-primary">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="/privacy" className="underline underline-offset-4 hover:text-primary">
                  Privacy Policy
                </Link>
                .
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>);
}
//# sourceMappingURL=page.jsx.map