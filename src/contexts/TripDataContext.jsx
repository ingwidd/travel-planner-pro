import { useState, useContext, createContext, useCallback } from 'react';
import { storage } from '../firebase';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';

const TripDataContext = createContext(null);

export function TripDataProvider({ children }) {
    const [trips, setTrips] = useState([]);
    const [todos, setTodos] = useState([]);
    const [diaryEntries, setDiaryEntries] = useState([]);
    const [tripsLoading, setTripsLoading] = useState(false);
    const [todosLoading, setTodosLoading] = useState(false);
    const [entriesLoading, setEntriesLoading] = useState(false);
    const [error, setError] = useState(null);

    const BASE_URL = "http://localhost:3000";

    const uploadFile = useCallback(async (file) => {
        const storageRef = ref(storage, `diaryEntries/${file.name}`);
        const response = await uploadBytes(storageRef, file);
        const url = await getDownloadURL(response.ref);
        return url;
    }, []);

    async function fetchTrips(userId) {
        try {
            const response = await fetch(`${BASE_URL}/trips?userId=${userId}`);
            const result = await response.json();

            if (!response.ok) throw new Error(result.error || "Failed to fetch trips");

            setTrips(result.data || []);
        } catch (error) {
            console.error("Fetch trips error: ", error);
        } finally {
            setTripsLoading(false);
        }
    }

    async function saveTrip(tripData) {
        const response = await fetch(`${BASE_URL}/trips`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(tripData), // { userId, name, destination, startDate, endDate }
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || "Failed to create trip");
        return result.data;
    }

    async function updateTrip(tripId, trip) {
        const response = await fetch(`${BASE_URL}/trips/${tripId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(trip), // { name, destination, startDate, endDate }
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || "Failed to update trip");
        return result.data;
    }

    async function deleteTrip(tripId) {
        const response = await fetch(`${BASE_URL}/trips/${tripId}`, { method: "DELETE" });
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || "Failed to delete trip");
        return result;
    }

    // TripDataContext.jsx

    const fetchDiaryEntriesByUser = async (tripId, userId) => {
        try {
            setEntriesLoading(true);

            // Build URL parameters cleanly
            const params = new URLSearchParams();
            if (tripId && tripId !== 'null') params.append('tripId', tripId);
            if (userId) params.append('userId', userId);

            const response = await fetch(`${BASE_URL}/diary-entries?${params.toString()}`);
            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || "Error fetching diary entries");
            }

            setDiaryEntries(result.data || []);
        } catch (error) {
            console.error("Diary Fetch Error: ", error.message);
            setDiaryEntries([]); // Clear entries on error to prevent stale data
        } finally {
            setEntriesLoading(false);
        }
    };

    async function createDiaryEntry(entry) {
        const response = await fetch(`${BASE_URL}/diary-entries`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(entry), // { tripId, caption, photoUrl }
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || "Failed to create diary entry");
        return result.data;
    }

    async function saveDiaryEntry({ tripId, caption, file }) {
        let photoUrl = null;
        if (file) {
            photoUrl = await uploadFile(file);
        }

        if (!photoUrl) throw new Error("A photo is required to create a diary entry");

        return createDiaryEntry({ tripId, caption, photoUrl });
    }

    async function updateDiaryEntry({ entryId, caption, file, existingPhotoUrl }) {
        let photoUrl = existingPhotoUrl;

        // If a new file is provided, upload it and get the new URL
        if (file) {
            photoUrl = await uploadFile(file);
        }

        const response = await fetch(`${BASE_URL}/diary-entries/${entryId}`, { // Added BASE_URL
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ caption, photoUrl }),
        });

        const result = await response.json();
        if (!response.ok) throw new Error(result.error || "Failed to update diary entry");
        return result.data;
    }

    async function deleteDiaryEntry(entryId) {
        try {
            const response = await fetch(`${BASE_URL}/diary-entries/${entryId}`, {
                method: "DELETE"
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || "Failed to delete diary entry");
            }

            return result;
        } catch (error) {
            console.error("Delete Diary Entry Error:", error.message);
            throw error; // Re-throw so the UI can show an alert
        }
    }

    const fetchTodosByUser = async (tripId, userId) => {
        try {
            setTodosLoading(true);

            // Build URL with search parameters
            const params = new URLSearchParams();
            if (userId) params.append('userId', userId);
            if (tripId && tripId !== 'null') params.append('tripId', tripId);

            const response = await fetch(`${BASE_URL}/todos?${params.toString()}`);
            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || "Error fetching todos");
            }

            setTodos(result.data || []);
        } catch (error) {
            console.error("Todo Fetch Error:", error);
            setTodos([]); // Clear state on error
        } finally {
            setTodosLoading(false);
        }
    }

    async function saveTodo(todo) {
        const response = await fetch(`${BASE_URL}/todos`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(todo),
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || 'Failed to create todo');
        return result.data;
    }

    async function updateTodo(todoId, todo) {
        const response = await fetch(`/todos/${todoId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(todo), // { taskDescription, isCompleted }
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || "Failed to update todo");
        return result.data;
    }

    async function deleteTodo(todoId) {
        const response = await fetch(`/todos/${todoId}`, { method: "DELETE" });
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || "Failed to delete todo");
        return result;
    }

    return (
        <TripDataContext.Provider
            value={{
                trips,
                todos,
                setTodos,
                fetchTrips,
                saveTodo,
                updateTodo,
                deleteTodo,
                fetchTodosByUser,
                diaryEntries,
                fetchDiaryEntriesByUser,
                saveDiaryEntry,
                updateDiaryEntry,
                deleteDiaryEntry,
                saveTrip,
                updateTrip,
                deleteTrip,
                tripsLoading,
                todosLoading,
                entriesLoading,
                error
            }}
        >
            {children}
        </TripDataContext.Provider>
    )
}

export function useTripData() {
    return useContext(TripDataContext);
}