import type { User, Booking } from '../types';

// API Configuration
const API_BASE = '/api';

// Helper to handle API responses
async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
    const res = await fetch(url, options);
    if (!res.ok) {
        const error = await res.json().catch(() => ({ message: 'API Error' }));
        throw new Error(error.message || `Request failed: ${res.status}`);
    }
    return res.json();
}

// User operations
export async function getUsers(): Promise<User[]> {
    // Users are managed in the sheet, handled by login API
    return [];
}

export async function loginUser(username: string, password: string): Promise<User> {
    // Call the login API
    const res = await fetchJson<{ success: boolean; username: string }>(`${API_BASE}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
    });

    return { username: res.username, password: '' }; // Don't store password locally
}

export async function signupUser(user: User): Promise<void> {
    await fetchJson(`${API_BASE}/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user),
    });
}

// Booking operations
export async function getBookings(): Promise<Booking[]> {
    return fetchJson<Booking[]>(`${API_BASE}/bookings`);
}

export async function getBookingsByMonth(year: number, month: number): Promise<Booking[]> {
    const bookings = await getBookings();
    return bookings.filter(b => {
        const d = new Date(b.date);
        return d.getFullYear() === year && d.getMonth() === month;
    });
}

export async function addBooking(booking: Booking): Promise<void> {
    await fetchJson(`${API_BASE}/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(booking),
    });
}

export async function cancelBooking(date: string): Promise<void> {
    await fetchJson(`${API_BASE}/bookings`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date }),
    });
}

export async function getBookingByDate(date: string): Promise<Booking | null> {
    const bookings = await getBookings(); // Optimally, backend should support filtering
    return bookings.find(b => b.date === date) || null;
}
