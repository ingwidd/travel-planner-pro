import { useState, useContext, createContext } from 'react';
import { auth } from '../firebase';
import { getDiaryImageBucket } from '../supabase';

const TripDataContext = createContext(null);

async function readApiResponse(response, fallbackMessage) {
    const body = await response.text();
    let result;

    try {
        result = body ? JSON.parse(body) : {};
    } catch {
        throw new Error(
            `${fallbackMessage} (HTTP ${response.status}). The API returned a non-JSON response; check that VITE_API_URL points to the deployed API and that its latest version is deployed.`
        );
    }

    if (!response.ok) {
        throw new Error(result.error || `${fallbackMessage} (HTTP ${response.status})`);
    }
    return result;
}

export function TripDataProvider({ children }) {
    const [trips, setTrips] = useState([]);
    const [todos, setTodos] = useState([]);
    const [diaryEntries, setDiaryEntries] = useState([]);
    const [tripsLoading, setTripsLoading] = useState(false);
    const [todosLoading, setTodosLoading] = useState(false);
    const [entriesLoading, setEntriesLoading] = useState(false);
    const [error, setError] = useState(null);

    const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

    async function getDiaryAuthHeaders() {
        const user = auth.currentUser;
        if (!user) {
            throw new Error("You must be signed in to manage diary entries");
        }
        return { Authorization: `Bearer ${await user.getIdToken()}` };
    }

    function validateDiaryImage(file) {
        if (!file.type.startsWith("image/")) {
            throw new Error("Choose an image file to upload");
        }
        if (file.size > 10 * 1024 * 1024) {
            throw new Error("Diary photos must be 10 MB or smaller");
        }
    }

    async function uploadDiaryImage(tripId, file) {
        validateDiaryImage(file);
        const headers = await getDiaryAuthHeaders();
        const authorizationResponse = await fetch(`${BASE_URL}/diary-image-uploads`, {
            method: "POST",
            headers: { ...headers, "Content-Type": "application/json" },
            body: JSON.stringify({ tripId, contentType: file.type }),
        });
        const authorizationResult = await readApiResponse(
            authorizationResponse,
            "Failed to prepare diary photo upload"
        );

        const { path, token } = authorizationResult.data;
        const { error } = await getDiaryImageBucket().uploadToSignedUrl(path, token, file, {
            contentType: file.type,
            upsert: false,
        });
        if (error) throw new Error(error.message);
        return path;
    }

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

    const fetchDiaryEntriesByUser = async (tripId) => {
        try {
            setEntriesLoading(true);

            const params = new URLSearchParams();
            if (tripId && tripId !== 'null') params.append('tripId', tripId);
            const response = await fetch(`${BASE_URL}/diary-entries?${params.toString()}`, {
                headers: await getDiaryAuthHeaders(),
            });
            const result = await readApiResponse(response, "Error fetching diary entries");

            setDiaryEntries(result.data || []);
        } catch (error) {
            console.error("Diary Fetch Error: ", error.message);
            setDiaryEntries([]); // Clear entries on error to prevent stale data
        } finally {
            setEntriesLoading(false);
        }
    };

    async function saveDiaryEntry({ tripId, caption, file }) {
        if (!file) throw new Error("A photo is required to create a diary entry");
        const photoPath = await uploadDiaryImage(tripId, file);

        const response = await fetch(`${BASE_URL}/diary-entries`, {
            method: "POST",
            headers: { ...(await getDiaryAuthHeaders()), "Content-Type": "application/json" },
            body: JSON.stringify({ tripId, caption, photoPath }),
        });
        const result = await readApiResponse(response, "Failed to create diary entry");
        return result.data;
    }

    async function updateDiaryEntry({ entryId, tripId, caption, file }) {
        const photoPath = file ? await uploadDiaryImage(tripId, file) : undefined;

        const response = await fetch(`${BASE_URL}/diary-entries/${entryId}`, {
            method: "PUT",
            headers: { ...(await getDiaryAuthHeaders()), "Content-Type": "application/json" },
            body: JSON.stringify({ caption, photoPath }),
        });

        const result = await readApiResponse(response, "Failed to update diary entry");
        return result.data;
    }

    async function deleteDiaryEntry(entryId) {
        try {
            const response = await fetch(`${BASE_URL}/diary-entries/${entryId}`, {
                method: "DELETE",
                headers: await getDiaryAuthHeaders(),
            });

            const result = await readApiResponse(response, "Failed to delete diary entry");

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
        const response = await fetch(`${BASE_URL}/todos/${todoId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(todo), // { taskDescription, isCompleted }
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || "Failed to update todo");
        return result.data;
    }

    async function deleteTodo(todoId) {
        const response = await fetch(`${BASE_URL}/todos/${todoId}`, { method: "DELETE" });
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