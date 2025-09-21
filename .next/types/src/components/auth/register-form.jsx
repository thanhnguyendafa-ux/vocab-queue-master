import { __awaiter, __generator } from "tslib";
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { User, Mail, Lock, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormGroup } from '@/components/ui/form';
import { registerSchema } from '@/schemas/auth-schema';
import { registerWithEmail } from '@/services/auth-service';
import { useToast } from '@/components/ui/use-toast';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
export function RegisterForm() {
    var _this = this;
    var _a = useState(false), isLoading = _a[0], setIsLoading = _a[1];
    var toast = useToast().toast;
    var router = useRouter();
    var _b = useForm({
        resolver: zodResolver(registerSchema),
    }), register = _b.register, handleSubmit = _b.handleSubmit, errors = _b.formState.errors;
    var onSubmit = function (data) { return __awaiter(_this, void 0, void 0, function () {
        var user, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, 4, 5]);
                    setIsLoading(true);
                    return [4 /*yield*/, registerWithEmail(data.email, data.password)];
                case 1:
                    user = (_a.sent()).user;
                    // Update user profile with display name
                    return [4 /*yield*/, updateUserProfile(user, { displayName: data.name })];
                case 2:
                    // Update user profile with display name
                    _a.sent();
                    toast({
                        title: 'Success',
                        description: 'Your account has been created successfully!',
                    });
                    router.push('/dashboard');
                    return [3 /*break*/, 5];
                case 3:
                    error_1 = _a.sent();
                    toast({
                        title: 'Error',
                        description: error_1.message || 'Failed to create account',
                        variant: 'destructive',
                    });
                    return [3 /*break*/, 5];
                case 4:
                    setIsLoading(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    return (<Form onSubmit={handleSubmit(onSubmit)}>
      <FormGroup>
        <Input id="name" placeholder="Full Name" type="text" autoComplete="name" disabled={isLoading} startIcon={<User className="h-4 w-4 text-muted-foreground"/>} error={!!errors.name} {...register('name')}/>
        {errors.name && (<p className="text-sm text-red-500">{errors.name.message}</p>)}
      </FormGroup>

      <FormGroup>
        <Input id="email" placeholder="Email" type="email" autoCapitalize="none" autoComplete="email" autoCorrect="off" disabled={isLoading} startIcon={<Mail className="h-4 w-4 text-muted-foreground"/>} error={!!errors.email} {...register('email')}/>
        {errors.email && (<p className="text-sm text-red-500">{errors.email.message}</p>)}
      </FormGroup>

      <FormGroup>
        <Input id="password" placeholder="Password" type="password" autoComplete="new-password" disabled={isLoading} startIcon={<Lock className="h-4 w-4 text-muted-foreground"/>} error={!!errors.password} {...register('password')}/>
        {errors.password && (<p className="text-sm text-red-500">{errors.password.message}</p>)}
      </FormGroup>

      <FormGroup>
        <Input id="confirmPassword" placeholder="Confirm Password" type="password" autoComplete="new-password" disabled={isLoading} startIcon={<Lock className="h-4 w-4 text-muted-foreground"/>} error={!!errors.confirmPassword} {...register('confirmPassword')}/>
        {errors.confirmPassword && (<p className="text-sm text-red-500">{errors.confirmPassword.message}</p>)}
      </FormGroup>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
        Create Account
      </Button>

      <div className="mt-4 text-center text-sm">
        Already have an account?{' '}
        <Link href="/login" className="font-medium text-primary hover:underline">
          Sign in
        </Link>
      </div>
    </Form>);
}
//# sourceMappingURL=register-form.jsx.map