import { createContext, useEffect, useState } from "react";
import { auth } from '../firebase';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        return auth.onAuthStateChanged(async (user) => {
            if (user) {
                try {
                    const response = await fetch('http://localhost:3000/sync-user', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            uid: user.uid,
                            email: user.email,
                        })
                    });

                    if (!response.ok) throw new Error("Backend sync failed");

                    console.log("User successfully synced to Postgres");
                } catch (err) {
                    console.error("Sync error:", err);
                }
            }
            setCurrentUser(user);
            setLoading(false);
        });
    }, []);

    const value = { currentUser };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}