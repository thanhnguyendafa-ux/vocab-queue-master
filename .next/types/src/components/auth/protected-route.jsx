'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { Loader2 } from 'lucide-react';
export function ProtectedRoute(_a) {
    var children = _a.children, _b = _a.requireAuth, requireAuth = _b === void 0 ? true : _b, _c = _a.redirectTo, redirectTo = _c === void 0 ? '/login' : _c;
    var _d = useAuth(), user = _d.user, isLoading = _d.isLoading;
    var router = useRouter();
    useEffect(function () {
        if (!isLoading) {
            // If authentication is required and user is not logged in, redirect to login
            if (requireAuth && !user) {
                router.push(redirectTo);
            }
            // If authentication is not required and user is logged in, redirect to home
            if (!requireAuth && user) {
                router.push('/dashboard');
            }
        }
    }, [user, isLoading, requireAuth, redirectTo, router]);
    // Show loading indicator while checking auth state
    if (isLoading || (requireAuth && !user) || (!requireAuth && user)) {
        return (<div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin"/>
      </div>);
    }
    return <>{children}</>;
}
//# sourceMappingURL=protected-route.jsx.map