// AuthProvider.jsx
import { createContext, useEffect, useState } from "react";
import { auth } from '../firebase';
import { useLocalStorage } from "usehooks-ts";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [authToken, setAuthToken] = useLocalStorage('authToken', '');
    const [loading, setLoading] = useState(true);

    const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            if (user) {
                const token = await user.getIdToken();
                setAuthToken(token);
                
                try {
                    await fetch(`${BASE_URL}/sync-user`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            uid: user.uid,
                            email: user.email,
                        })
                    });
                    console.log("User successfully synced to Postgres");
                } catch (err) {
                    console.error("Sync error:", err);
                }
            } else {
                setAuthToken('');
            }
            
            setCurrentUser(user);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [setAuthToken, BASE_URL]);

    const value = { currentUser, authToken, loading };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}