import { create } from 'zustand';
var useAuthStore = create(function (set) { return ({
    user: null,
    isLoading: false,
    error: null,
    setUser: function (user) { return set({ user: user }); },
    setLoading: function (isLoading) { return set({ isLoading: isLoading }); },
    setError: function (error) { return set({ error: error }); },
    clearError: function () { return set({ error: null }); },
}); });
export default useAuthStore;
//# sourceMappingURL=auth-store.js.map