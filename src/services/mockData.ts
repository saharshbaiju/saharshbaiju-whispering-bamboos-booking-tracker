import type { User, Booking } from '../types';

// Mock data storage (in production, this would be Google Sheets)
let mockUsers: User[] = [
    { username: 'admin', password: 'admin' },
    { username: 'demo', password: 'demo' }
];

let mockBookings: Booking[] = [
    { date: '2026-02-10', name: 'John Doe', mobile: '9876543210', description: 'Family vacation' },
    { date: '2026-02-14', name: 'Jane Smith', mobile: '9123456789', description: 'Anniversary stay' },
    { date: '2026-02-20', name: 'Robert Wilson', mobile: '9988776655' }
];

// Simulate async operations (like Google Sheets API calls)
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// User operations
export async function getUsers(): Promise<User[]> {
    await delay(200);
    return [...mockUsers];
}

export async function addUser(user: User): Promise<void> {
    await delay(300);
    mockUsers.push(user);
}

// Booking operations
export async function getBookings(): Promise<Booking[]> {
    await delay(200);
    return [...mockBookings];
}

export async function getBookingsByMonth(year: number, month: number): Promise<Booking[]> {
    await delay(200);
    return mockBookings.filter(b => {
        const d = new Date(b.date);
        return d.getFullYear() === year && d.getMonth() === month;
    });
}

export async function addBooking(booking: Booking): Promise<void> {
    await delay(300);
    // Check if date already booked
    const exists = mockBookings.some(b => b.date === booking.date);
    if (exists) {
        throw new Error('Date already booked');
    }
    mockBookings.push(booking);
}

export async function cancelBooking(date: string): Promise<void> {
    await delay(300);
    mockBookings = mockBookings.filter(b => b.date !== date);
}

export async function getBookingByDate(date: string): Promise<Booking | null> {
    await delay(100);
    return mockBookings.find(b => b.date === date) || null;
}
