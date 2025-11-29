"use client";

import { createContext, useContext, useEffect, useState } from "react";
import {
    User,
    signInWithPopup,
    signInAnonymously,
    signOut,
    onAuthStateChanged,
    updateProfile
} from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";

interface AuthContextType {
    user: User | null;
    loading: boolean;
    signInWithGoogle: () => Promise<void>;
    signInAsGuest: () => Promise<void>;
    logout: () => Promise<void>;
    updateUserProfile: (name: string, photoURL: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    signInWithGoogle: async () => { },
    signInAsGuest: async () => { },
    logout: async () => { },
    updateUserProfile: async () => { },
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!auth) {
            console.error("Firebase auth is not initialized. Check your environment variables.");
            setLoading(false);
            return;
        }

        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const signInWithGoogle = async () => {
        if (!auth) return;
        try {
            await signInWithPopup(auth, googleProvider);
        } catch (error) {
            console.error("Error signing in with Google", error);
            throw error;
        }
    };

    const signInAsGuest = async () => {
        if (!auth) return;
        try {
            const result = await signInAnonymously(auth);
            // Generate random profile for guest
            const randomId = Math.floor(Math.random() * 10000);
            const randomName = `Guest #${randomId}`;
            const randomAvatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${randomId}`;

            await updateProfile(result.user, {
                displayName: randomName,
                photoURL: randomAvatar
            });

            // Force update local state
            setUser({ ...result.user, displayName: randomName, photoURL: randomAvatar });
        } catch (error) {
            console.error("Error signing in anonymously", error);
            throw error;
        }
    };

    const logout = async () => {
        if (!auth) return;
        try {
            await signOut(auth);
        } catch (error) {
            console.error("Error signing out", error);
            throw error;
        }
    };

    const updateUserProfile = async (name: string, photoURL: string) => {
        if (!auth || !auth.currentUser) return;
        try {
            await updateProfile(auth.currentUser, {
                displayName: name,
                photoURL: photoURL
            });
            // Force update local state to reflect changes immediately
            setUser({ ...auth.currentUser, displayName: name, photoURL: photoURL });
        } catch (error) {
            console.error("Error updating profile", error);
            throw error;
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, signInWithGoogle, signInAsGuest, logout, updateUserProfile }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
