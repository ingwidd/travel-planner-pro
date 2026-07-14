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

    const BASE_URL = 'http://localhost:3000';

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

    return (
        <TripDataContext.Provider
            value={{
                trips,
                todos,
                diaryEntries,
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