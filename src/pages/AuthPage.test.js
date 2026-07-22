import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import AuthPage from './AuthPage';
import { AuthContext } from '../components/AuthProvider';
import { BrowserRouter } from 'react-router-dom';
import * as firebaseAuth from 'firebase/auth';
import '@testing-library/jest-dom'; 

// Mock Firebase Auth
vi.mock('firebase/auth', () => ({
    getAuth: vi.fn(),
    createUserWithEmailAndPassword: vi.fn(),
    signInWithEmailAndPassword: vi.fn(),
}));

// Mock Navigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

const renderAuthPage = (user = null) => {
    return render(
        <AuthContext.Provider value={{ currentUser: user }}>
            <BrowserRouter>
                <AuthPage />
            </BrowserRouter>
        </AuthContext.Provider>
    );
};

describe('AuthPage Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        window.alert = vi.fn(); // Mock alert
    });

    it('renders the landing page correctly', () => {
        renderAuthPage();
        expect(screen.getByText(/Travel Planner Pro/i)).toBeInTheDocument();
    });

    it('successfully calls login function', async () => {
        firebaseAuth.signInWithEmailAndPassword.mockResolvedValue({ user: { email: 'test@test.com' } });

        renderAuthPage();

        fireEvent.click(screen.getByRole('button', { name: /Log in/i }));

        fireEvent.change(screen.getByPlaceholderText(/Enter email/i), { target: { value: 'user@test.com' } });
        fireEvent.change(screen.getByPlaceholderText(/Password/i), { target: { value: 'password123' } });
        
        // Use a regex to find the button inside the modal
        fireEvent.click(screen.getByRole('button', { name: /^Log in$/i }));

        await waitFor(() => {
            expect(firebaseAuth.signInWithEmailAndPassword).toHaveBeenCalled();
        });
    });
});