import { createContext, useEffect, useState, useCallback } from "react";
import { auth, db, storage } from '../firebase';
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { collection, deleteDoc, doc, getDoc, getDocs, setDoc, updateDoc } from "firebase/firestore";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [lessons, setLessons] = useState([]);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            setCurrentUser(user);
            setLoading(false);
        });

        const fetchLessons = async () => {
            try {
                const lessonsSnapshot = await getDocs(collection(db, "classes"));
                const lessonsData = lessonsSnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setLessons(lessonsData);
            } catch (error) {
                console.error("Error fetching lessons:", error);
            }
        };

        fetchLessons();
        return unsubscribe;
    }, []);

    const uploadFile = useCallback(async (file) => {
        const storageRef = ref(storage, `classes/${file.name}`);
        const response = await uploadBytes(storageRef, file);
        const url = await getDownloadURL(response.ref);
        return url;
    }, []);

    const saveCard = useCallback(async (cardTitle, cardContent, file) => {
        try {
            let imageUrl = null;
            if (file) {
                imageUrl = await uploadFile(file);
            }

            const cardRef = collection(db, "classes");
            const newCardRef = doc(cardRef);
            const cardData = {
                title: cardTitle,
                content: cardContent,
                imageUrl,
            };

            await setDoc(newCardRef, cardData);

            setLessons((prev) => [{ id: newCardRef.id, ...cardData }, ...prev]);
        } catch (error) {
            console.error("Error saving card:", error);
        }
    }, [uploadFile]);

    const updateCard = useCallback(
        async (userId, lessonId, newCardTitle, newCardContent, newFile) => {
            try {
                const cardRef = doc(db, "classes", lessonId);
                const cardSnap = await getDoc(cardRef);
                if (!cardSnap.exists()) throw new Error("Class does not exist");

                let newImageUrl = null;
                if (newFile) {
                    newImageUrl = await uploadFile(newFile);
                }

                const cardData = cardSnap.data();
                const updatedData = {
                    ...cardData,
                    title: newCardTitle || cardData.title,
                    content: newCardContent || cardData.content,
                    imageUrl: newImageUrl || cardData.imageUrl,
                };

                await updateDoc(cardRef, updatedData);

                setLessons((prev) =>
                    prev.map((lesson) => (lesson.id === lessonId ? { id: lessonId, ...updatedData } : lesson))
                );
            } catch (error) {
                console.error("Error updating card:", error);
            }
        },
        [uploadFile]
    );

    const deleteCard = useCallback(async (lessonId) => {
        try {
            const cardRef = doc(db, "classes", lessonId);
            await deleteDoc(cardRef);

            setLessons((prev) => prev.filter((card) => card.id !== lessonId));
        } catch (error) {
            console.error("Error deleting card:", error);
        }
    }, []);

    const value = {
        currentUser,
        lessons,
        saveCard,
        updateCard,
        deleteCard,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}