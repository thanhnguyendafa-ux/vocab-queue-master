import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider, 
  GithubAuthProvider, 
  sendPasswordResetEmail,
  signOut as firebaseSignOut,
  UserCredential,
  User
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import useAuthStore from '@/store/auth-store';

const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();

export const signInWithGoogle = async (): Promise<UserCredential> => {
  try {
    useAuthStore.getState().setLoading(true);
    useAuthStore.getState().clearError();
    return await signInWithPopup(auth, googleProvider);
  } catch (error: any) {
    useAuthStore.getState().setError(error.message);
    throw error;
  } finally {
    useAuthStore.getState().setLoading(false);
  }
};

export const signInWithGitHub = async (): Promise<UserCredential> => {
  try {
    useAuthStore.getState().setLoading(true);
    useAuthStore.getState().clearError();
    return await signInWithPopup(auth, githubProvider);
  } catch (error: any) {
    useAuthStore.getState().setError(error.message);
    throw error;
  } finally {
    useAuthStore.getState().setLoading(false);
  }
};

export const signInWithEmail = async (email: string, password: string): Promise<UserCredential> => {
  try {
    useAuthStore.getState().setLoading(true);
    useAuthStore.getState().clearError();
    return await signInWithEmailAndPassword(auth, email, password);
  } catch (error: any) {
    useAuthStore.getState().setError(error.message);
    throw error;
  } finally {
    useAuthStore.getState().setLoading(false);
  }
};

export const registerWithEmail = async (email: string, password: string): Promise<UserCredential> => {
  try {
    useAuthStore.getState().setLoading(true);
    useAuthStore.getState().clearError();
    return await createUserWithEmailAndPassword(auth, email, password);
  } catch (error: any) {
    useAuthStore.getState().setError(error.message);
    throw error;
  } finally {
    useAuthStore.getState().setLoading(false);
  }
};

export const resetPassword = async (email: string): Promise<void> => {
  try {
    useAuthStore.getState().setLoading(true);
    useAuthStore.getState().clearError();
    await sendPasswordResetEmail(auth, email);
  } catch (error: any) {
    useAuthStore.getState().setError(error.message);
    throw error;
  } finally {
    useAuthStore.getState().setLoading(false);
  }
};

export const signOut = async (): Promise<void> => {
  try {
    useAuthStore.getState().setLoading(true);
    useAuthStore.getState().clearError();
    await firebaseSignOut(auth);
  } catch (error: any) {
    useAuthStore.getState().setError(error.message);
    throw error;
  } finally {
    useAuthStore.getState().setLoading(false);
  }
};

export const updateUserProfile = async (user: User, updates: { displayName?: string; photoURL?: string }): Promise<void> => {
  try {
    useAuthStore.getState().setLoading(true);
    useAuthStore.getState().clearError();
    await updateProfile(user, updates);
    useAuthStore.getState().setUser({ ...user, ...updates });
  } catch (error: any) {
    useAuthStore.getState().setError(error.message);
    throw error;
  } finally {
    useAuthStore.getState().setLoading(false);
  }
};
