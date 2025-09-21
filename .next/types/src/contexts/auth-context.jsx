import { createContext, useContext, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import useAuthStore from '@/store/auth-store';
var AuthContext = createContext(undefined);
export var AuthProvider = function (_a) {
    var children = _a.children;
    var _b = useAuthStore(), user = _b.user, setUser = _b.setUser, isLoading = _b.isLoading, setLoading = _b.setLoading, error = _b.error, setError = _b.setError, clearError = _b.clearError;
    useEffect(function () {
        var unsubscribe = onAuthStateChanged(auth, function (user) {
            setUser(user);
            setLoading(false);
        }, function (error) {
            setError(error.message);
            setLoading(false);
        });
        return function () { return unsubscribe(); };
    }, [setUser, setLoading, setError]);
    return (<AuthContext.Provider value={{ user: user, isLoading: isLoading, error: error, clearError: clearError }}>
      {children}
    </AuthContext.Provider>);
};
export var useAuth = function () {
    var context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
//# sourceMappingURL=auth-context.jsx.map