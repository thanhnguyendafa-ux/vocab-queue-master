import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { User, Mail, Lock, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormGroup } from '@/components/ui/form';
import { registerSchema, type RegisterFormData } from '@/schemas/auth-schema';
import { registerWithEmail } from '@/services/auth-service';
import { useToast } from '@/components/ui/use-toast';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export function RegisterForm() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setIsLoading(true);
      const { user } = await registerWithEmail(data.email, data.password);
      
      // Update user profile with display name
      await updateUserProfile(user, { displayName: data.name });
      
      toast({
        title: 'Success',
        description: 'Your account has been created successfully!',
      });
      
      router.push('/dashboard');
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create account',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <FormGroup>
        <Input
          id="name"
          placeholder="Full Name"
          type="text"
          autoComplete="name"
          disabled={isLoading}
          startIcon={<User className="h-4 w-4 text-muted-foreground" />}
          error={!!errors.name}
          {...register('name')}
        />
        {errors.name && (
          <p className="text-sm text-red-500">{errors.name.message}</p>
        )}
      </FormGroup>

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

      <FormGroup>
        <Input
          id="password"
          placeholder="Password"
          type="password"
          autoComplete="new-password"
          disabled={isLoading}
          startIcon={<Lock className="h-4 w-4 text-muted-foreground" />}
          error={!!errors.password}
          {...register('password')}
        />
        {errors.password && (
          <p className="text-sm text-red-500">{errors.password.message}</p>
        )}
      </FormGroup>

      <FormGroup>
        <Input
          id="confirmPassword"
          placeholder="Confirm Password"
          type="password"
          autoComplete="new-password"
          disabled={isLoading}
          startIcon={<Lock className="h-4 w-4 text-muted-foreground" />}
          error={!!errors.confirmPassword}
          {...register('confirmPassword')}
        />
        {errors.confirmPassword && (
          <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>
        )}
      </FormGroup>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Create Account
      </Button>

      <div className="mt-4 text-center text-sm">
        Already have an account?{' '}
        <Link href="/login" className="font-medium text-primary hover:underline">
          Sign in
        </Link>
      </div>
    </Form>
  );
}
