import { __assign, __awaiter, __generator } from "tslib";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, GithubAuthProvider, sendPasswordResetEmail, signOut as firebaseSignOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import useAuthStore from '@/store/auth-store';
var googleProvider = new GoogleAuthProvider();
var githubProvider = new GithubAuthProvider();
export var signInWithGoogle = function () { return __awaiter(void 0, void 0, void 0, function () {
    var error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, 3, 4]);
                useAuthStore.getState().setLoading(true);
                useAuthStore.getState().clearError();
                return [4 /*yield*/, signInWithPopup(auth, googleProvider)];
            case 1: return [2 /*return*/, _a.sent()];
            case 2:
                error_1 = _a.sent();
                useAuthStore.getState().setError(error_1.message);
                throw error_1;
            case 3:
                useAuthStore.getState().setLoading(false);
                return [7 /*endfinally*/];
            case 4: return [2 /*return*/];
        }
    });
}); };
export var signInWithGitHub = function () { return __awaiter(void 0, void 0, void 0, function () {
    var error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, 3, 4]);
                useAuthStore.getState().setLoading(true);
                useAuthStore.getState().clearError();
                return [4 /*yield*/, signInWithPopup(auth, githubProvider)];
            case 1: return [2 /*return*/, _a.sent()];
            case 2:
                error_2 = _a.sent();
                useAuthStore.getState().setError(error_2.message);
                throw error_2;
            case 3:
                useAuthStore.getState().setLoading(false);
                return [7 /*endfinally*/];
            case 4: return [2 /*return*/];
        }
    });
}); };
export var signInWithEmail = function (email, password) { return __awaiter(void 0, void 0, void 0, function () {
    var error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, 3, 4]);
                useAuthStore.getState().setLoading(true);
                useAuthStore.getState().clearError();
                return [4 /*yield*/, signInWithEmailAndPassword(auth, email, password)];
            case 1: return [2 /*return*/, _a.sent()];
            case 2:
                error_3 = _a.sent();
                useAuthStore.getState().setError(error_3.message);
                throw error_3;
            case 3:
                useAuthStore.getState().setLoading(false);
                return [7 /*endfinally*/];
            case 4: return [2 /*return*/];
        }
    });
}); };
export var registerWithEmail = function (email, password) { return __awaiter(void 0, void 0, void 0, function () {
    var error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, 3, 4]);
                useAuthStore.getState().setLoading(true);
                useAuthStore.getState().clearError();
                return [4 /*yield*/, createUserWithEmailAndPassword(auth, email, password)];
            case 1: return [2 /*return*/, _a.sent()];
            case 2:
                error_4 = _a.sent();
                useAuthStore.getState().setError(error_4.message);
                throw error_4;
            case 3:
                useAuthStore.getState().setLoading(false);
                return [7 /*endfinally*/];
            case 4: return [2 /*return*/];
        }
    });
}); };
export var resetPassword = function (email) { return __awaiter(void 0, void 0, void 0, function () {
    var error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, 3, 4]);
                useAuthStore.getState().setLoading(true);
                useAuthStore.getState().clearError();
                return [4 /*yield*/, sendPasswordResetEmail(auth, email)];
            case 1:
                _a.sent();
                return [3 /*break*/, 4];
            case 2:
                error_5 = _a.sent();
                useAuthStore.getState().setError(error_5.message);
                throw error_5;
            case 3:
                useAuthStore.getState().setLoading(false);
                return [7 /*endfinally*/];
            case 4: return [2 /*return*/];
        }
    });
}); };
export var signOut = function () { return __awaiter(void 0, void 0, void 0, function () {
    var error_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, 3, 4]);
                useAuthStore.getState().setLoading(true);
                useAuthStore.getState().clearError();
                return [4 /*yield*/, firebaseSignOut(auth)];
            case 1:
                _a.sent();
                return [3 /*break*/, 4];
            case 2:
                error_6 = _a.sent();
                useAuthStore.getState().setError(error_6.message);
                throw error_6;
            case 3:
                useAuthStore.getState().setLoading(false);
                return [7 /*endfinally*/];
            case 4: return [2 /*return*/];
        }
    });
}); };
export var updateUserProfile = function (user, updates) { return __awaiter(void 0, void 0, void 0, function () {
    var error_7;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, 3, 4]);
                useAuthStore.getState().setLoading(true);
                useAuthStore.getState().clearError();
                return [4 /*yield*/, updateProfile(user, updates)];
            case 1:
                _a.sent();
                useAuthStore.getState().setUser(__assign(__assign({}, user), updates));
                return [3 /*break*/, 4];
            case 2:
                error_7 = _a.sent();
                useAuthStore.getState().setError(error_7.message);
                throw error_7;
            case 3:
                useAuthStore.getState().setLoading(false);
                return [7 /*endfinally*/];
            case 4: return [2 /*return*/];
        }
    });
}); };
//# sourceMappingURL=auth-service.js.map