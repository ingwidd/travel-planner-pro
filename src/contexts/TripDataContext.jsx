import { useState, useContext, createContext } from 'react';

const TripDataContext = createContext(null);

export function TripDataProvider({ children }) {
    const [trips, setTrips] = useState([]);
    const [todos, setTodos] = useState([]);
    const [diaryEntries, setDiaryEntries] = useState([]);
    const [tripsLoading, setTripsLoading] = useState(false);
    const [todosLoading, setTodosLoading] = useState(false);
    const [entriesLoading, setEntriesLoading] = useState(false);
    const [error, setError] = useState(null);

    async function fetchTrips(userId) {
        const url = userId ? `/trips?userId=${userId}` : "/trips";
        const response = await fetch(url);
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || "Failed to fetch trips");
        return result.data;
    }
 
    async function fetchTripsByUserId(tripId) {
        const response = await fetch(`/trips/${tripId}`);
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || "Failed to fetch trip");
        return result.data;
    }
 
    async function saveTrip(trip) {
        const response = await fetch("/trips", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(trip), // { userId, name, destination, startDate, endDate }
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || "Failed to create trip");
        return result.data;
    }

    async function updateTrip(tripId, trip) {
        const response = await fetch(`/trips/${tripId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(trip), // { name, destination, startDate, endDate }
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || "Failed to update trip");
        return result.data;
    }
 
    async function deleteTrip(tripId) {
        const response = await fetch(`/trips/${tripId}`, { method: "DELETE" });
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || "Failed to delete trip");
        return result;
    }

    const fetchDiaryEntriesByUser = async (tripId) => {
        try {
            setEntriesLoading(true);
            const response = await fetch(`/diary-entries?tripId=${tripId}`);

            if (!response.ok) {
                throw new Error("Error fetching diary entries");
            }

            const data = await response.json();
            setDiaryEntries(data);
        } catch (error) {
            console.error(error);
        } finally {
            setEntriesLoading(false);
        }
    };  

    async function saveDiaryEntry(entry) {
        const response = await fetch("/diary-entries", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(entry), // { tripId, caption, photoUrl }
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || "Failed to create diary entry");
        return result.data;
    }

    async function updateDiaryEntry(entryId, entry) {
        const response = await fetch(`/diary-entries/${entryId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(entry), // { caption, photoUrl }
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || "Failed to update diary entry");
        return result.data;
    }

    async function deleteDiaryEntry(entryId) {
        const response = await fetch(`/diary-entries/${entryId}`, { method: "DELETE" });
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || "Failed to delete diary entry");
        return result;
    }
    
    const fetchTodosByUser = async (tripId) => {
        const url = tripId ? `/todos?tripId=${tripId}` : "/todos";
        try {
            setTodosLoading(true);
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error("Error fetching todos");
            }

            const data = await response.json();
            setTodos(data);
        } catch (error) {
            console.error(error);
        } finally {
            setTodosLoading(false);
        }
    }

    async function saveTodo(todo) {
        const response = await fetch('/todos', {
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
                fetchTripsByUserId,
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