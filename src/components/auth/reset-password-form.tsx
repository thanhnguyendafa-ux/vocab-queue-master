'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, Loader2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormGroup } from '@/components/ui/form';
import { resetPasswordSchema, type ResetPasswordFormData } from '@/schemas/auth-schema';
import { resetPassword } from '@/services/auth-service';
import { useToast } from '@/components/ui/use-toast';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export function ResetPasswordForm() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    try {
      setIsLoading(true);
      await resetPassword(data.email);
      setIsSubmitted(true);
      
      toast({
        title: 'Password reset email sent',
        description: 'Check your email for a link to reset your password.',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to send password reset email',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="space-y-6 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
          <Mail className="h-6 w-6 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold">Check your email</h2>
        <p className="text-muted-foreground">
          We've sent a password reset link to your email address.
        </p>
        <Button
          variant="outline"
          className="w-full"
          onClick={() => router.push('/login')}
        >
          Back to login
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-bold">Forgot your password?</h1>
        <p className="text-muted-foreground">
          Enter your email and we'll send you a link to reset your password.
        </p>
      </div>

      <Form onSubmit={handleSubmit(onSubmit)}>
        <FormGroup>
          <Input
            id="email"
            placeholder="Email"
            type="email"
            autoCapitalize="none"
            autoComplete="email"
            autoCorrect="off"
            disabled={isLoading}
            startIcon={<Mail className="h-4 w-4 text-muted-foreground" />}
            error={!!errors.email}
            {...register('email')}
          />
          {errors.email && (
            <p className="text-sm text-red-500">{errors.email.message}</p>
          )}
        </FormGroup>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Send reset link
        </Button>

        <div className="mt-4 text-center text-sm">
          <Link
            href="/login"
            className="inline-flex items-center font-medium text-primary hover:underline"
          >
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back to login
          </Link>
        </div>
      </Form>
    </div>
  );
}
