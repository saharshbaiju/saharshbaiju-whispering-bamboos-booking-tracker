import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, ChevronLeft, ChevronRight, X, User, Phone, FileText, Calendar } from 'lucide-react';
import { getBookingsByMonth, addBooking, cancelBooking, getBookingByDate } from '../services/api';
import type { Booking } from '../types';
import './Dashboard.css';

interface DashboardProps {
    onLogout: () => void;
}

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

function Dashboard({ onLogout }: DashboardProps) {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
    const [modalMode, setModalMode] = useState<'add' | 'view' | null>(null);
    const [loading, setLoading] = useState(false);

    const username = localStorage.getItem('wb_user') || 'User';

    useEffect(() => {
        loadBookings();
    }, [currentDate]);

    const loadBookings = async () => {
        try {
            const data = await getBookingsByMonth(currentDate.getFullYear(), currentDate.getMonth());
            setBookings(data);
        } catch (error) {
            console.error('Failed to load bookings:', error);
        }
    };

    const getDaysInMonth = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        const days: (number | null)[] = [];
        for (let i = 0; i < firstDay; i++) {
            days.push(null);
        }
        for (let i = 1; i <= daysInMonth; i++) {
            days.push(i);
        }
        return days;
    };

    const isToday = (day: number) => {
        const today = new Date();
        return day === today.getDate() &&
            currentDate.getMonth() === today.getMonth() &&
            currentDate.getFullYear() === today.getFullYear();
    };

    const formatDate = (day: number) => {
        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        const d = String(day).padStart(2, '0');
        return `${year}-${month}-${d}`;
    };

    const isBooked = (day: number) => {
        const dateStr = formatDate(day);
        return bookings.some(b => b.date === dateStr);
    };

    const handleDayClick = async (day: number) => {
        const dateStr = formatDate(day);
        setSelectedDate(dateStr);

        const booking = await getBookingByDate(dateStr);
        if (booking) {
            setSelectedBooking(booking);
            setModalMode('view');
        } else {
            setSelectedBooking(null);
            setModalMode('add');
        }
    };

    const handlePrevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const handleNextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const closeModal = () => {
        setModalMode(null);
        setSelectedDate(null);
        setSelectedBooking(null);
    };

    return (
        <div className="dashboard">
            <header className="dashboard-header">
                <div className="dashboard-brand">
                    <h1>Whispering Bamboos</h1>
                    <span>Booking Tracker</span>
                </div>
                <div className="dashboard-user">
                    <span className="dashboard-username">Welcome, {username}</span>
                    <motion.button
                        className="btn btn-secondary"
                        onClick={onLogout}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <LogOut size={16} />
                        Logout
                    </motion.button>
                </div>
            </header>

            <main className="dashboard-content">
                <div className="calendar">
                    <div className="calendar-header">
                        <div className="calendar-selectors">
                            <select
                                className="calendar-select"
                                value={currentDate.getMonth()}
                                onChange={(e) => setCurrentDate(new Date(currentDate.getFullYear(), parseInt(e.target.value), 1))}
                            >
                                {MONTHS.map((month, index) => (
                                    <option key={month} value={index}>{month}</option>
                                ))}
                            </select>
                            <select
                                className="calendar-select"
                                value={currentDate.getFullYear()}
                                onChange={(e) => setCurrentDate(new Date(parseInt(e.target.value), currentDate.getMonth(), 1))}
                            >
                                {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - 2 + i).map(year => (
                                    <option key={year} value={year}>{year}</option>
                                ))}
                            </select>
                        </div>
                        <div className="calendar-nav">
                            <button onClick={handlePrevMonth} aria-label="Previous month">
                                <ChevronLeft size={18} />
                            </button>
                            <button onClick={handleNextMonth} aria-label="Next month">
                                <ChevronRight size={18} />
                            </button>
                        </div>
                    </div>

                    <div className="calendar-weekdays">
                        {WEEKDAYS.map(day => (
                            <div key={day} className="calendar-weekday">{day}</div>
                        ))}
                    </div>

                    <div className="calendar-grid">
                        {getDaysInMonth().map((day, index) => {
                            const weekdayIndex = index % 7;
                            const weekdayShort = WEEKDAYS[weekdayIndex].slice(0, 2);
                            return (
                                <motion.div
                                    key={index}
                                    className={`calendar-day ${day === null ? 'empty' : ''} ${day && isToday(day) ? 'today' : ''} ${day && isBooked(day) ? 'booked' : ''}`}
                                    onClick={() => day && handleDayClick(day)}
                                    whileHover={day ? { scale: 1.03 } : {}}
                                    whileTap={day ? { scale: 0.97 } : {}}
                                    data-weekday={weekdayShort}
                                >
                                    {day && <span className="day-weekday">{weekdayShort}</span>}
                                    <span className="day-number">{day}</span>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </main>

            <AnimatePresence>
                {modalMode && (
                    <motion.div
                        className="modal-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={closeModal}
                    >
                        <motion.div
                            className="modal card"
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            onClick={e => e.stopPropagation()}
                        >
                            {modalMode === 'add' && (
                                <AddBookingModal
                                    date={selectedDate!}
                                    onClose={closeModal}
                                    onSuccess={() => {
                                        loadBookings();
                                        closeModal();
                                    }}
                                    loading={loading}
                                    setLoading={setLoading}
                                />
                            )}
                            {modalMode === 'view' && selectedBooking && (
                                <ViewBookingModal
                                    booking={selectedBooking}
                                    onClose={closeModal}
                                    onCancelled={() => {
                                        loadBookings();
                                        closeModal();
                                    }}
                                    loading={loading}
                                    setLoading={setLoading}
                                />
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

interface AddBookingModalProps {
    date: string;
    onClose: () => void;
    onSuccess: () => void;
    loading: boolean;
    setLoading: (loading: boolean) => void;
}

function AddBookingModal({ date, onClose, onSuccess, loading, setLoading }: AddBookingModalProps) {
    const [name, setName] = useState('');
    const [mobile, setMobile] = useState('');
    const [description, setDescription] = useState('');
    const [error, setError] = useState('');

    const formattedDate = new Date(date).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!name.trim() || !mobile.trim()) {
            setError('Name and mobile number are required');
            return;
        }

        if (!/^\d{10}$/.test(mobile)) {
            setError('Please enter a valid 10-digit mobile number');
            return;
        }

        setLoading(true);
        try {
            await addBooking({ date, name: name.trim(), mobile: mobile.trim(), description: description.trim() || undefined });
            onSuccess();
        } catch {
            setError('Failed to add booking. Date might already be booked.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="modal-header">
                <h2>New Booking</h2>
                <button className="modal-close" onClick={onClose}>
                    <X size={20} />
                </button>
            </div>

            <div className="booking-detail">
                <span className="booking-detail-label">Date</span>
                <span className="booking-detail-value">
                    <Calendar size={16} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                    {formattedDate}
                </span>
            </div>

            <form className="modal-form" onSubmit={handleSubmit}>
                {error && <div className="auth-error">{error}</div>}

                <div className="form-group">
                    <label className="label" htmlFor="name">
                        <User size={14} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                        Guest Name *
                    </label>
                    <input
                        id="name"
                        type="text"
                        className="input"
                        placeholder="Enter guest name"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group">
                    <label className="label" htmlFor="mobile">
                        <Phone size={14} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                        Mobile Number *
                    </label>
                    <input
                        id="mobile"
                        type="tel"
                        className="input"
                        placeholder="10-digit mobile number"
                        value={mobile}
                        onChange={e => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
                        required
                    />
                </div>

                <div className="form-group">
                    <label className="label" htmlFor="description">
                        <FileText size={14} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                        Description (optional)
                    </label>
                    <input
                        id="description"
                        type="text"
                        className="input"
                        placeholder="Any notes about the booking"
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                    />
                </div>

                <div className="modal-actions">
                    <button type="button" className="btn btn-secondary" onClick={onClose}>
                        Cancel
                    </button>
                    <motion.button
                        type="submit"
                        className="btn btn-primary"
                        disabled={loading}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        {loading ? 'Booking...' : 'Confirm Booking'}
                    </motion.button>
                </div>
            </form>
        </>
    );
}

interface ViewBookingModalProps {
    booking: Booking;
    onClose: () => void;
    onCancelled: () => void;
    loading: boolean;
    setLoading: (loading: boolean) => void;
}

function ViewBookingModal({ booking, onClose, onCancelled, loading, setLoading }: ViewBookingModalProps) {
    const [pin, setPin] = useState('');
    const [error, setError] = useState('');
    const [showPinInput, setShowPinInput] = useState(false);

    const formattedDate = new Date(booking.date).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    const handleCancel = async () => {
        if (pin !== '1234') {
            setError('Invalid PIN. Please enter 1234 to confirm.');
            return;
        }

        setLoading(true);
        setError('');
        try {
            await cancelBooking(booking.date);
            onCancelled();
        } catch {
            setError('Failed to cancel booking');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="modal-header">
                <h2>Booking Details</h2>
                <button className="modal-close" onClick={onClose}>
                    <X size={20} />
                </button>
            </div>

            <div className="booking-detail">
                <span className="booking-detail-label">Date</span>
                <span className="booking-detail-value">{formattedDate}</span>
            </div>

            <div className="booking-detail">
                <span className="booking-detail-label">Guest Name</span>
                <span className="booking-detail-value">{booking.name}</span>
            </div>

            <div className="booking-detail">
                <span className="booking-detail-label">Mobile Number</span>
                <span className="booking-detail-value">{booking.mobile}</span>
            </div>

            {booking.description && (
                <div className="booking-detail">
                    <span className="booking-detail-label">Description</span>
                    <span className="booking-detail-value">{booking.description}</span>
                </div>
            )}

            {!showPinInput ? (
                <div className="modal-actions">
                    <button className="btn btn-secondary" onClick={onClose}>
                        Close
                    </button>
                    <motion.button
                        className="btn btn-danger"
                        onClick={() => setShowPinInput(true)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        Cancel Booking
                    </motion.button>
                </div>
            ) : (
                <div className="pin-section">
                    <p>Enter PIN to confirm cancellation:</p>
                    {error && <div className="auth-error" style={{ marginBottom: '12px' }}>{error}</div>}
                    <div className="pin-input-group">
                        <input
                            type="password"
                            className="input"
                            placeholder="PIN"
                            value={pin}
                            onChange={e => setPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
                            maxLength={4}
                            autoFocus
                        />
                        <motion.button
                            className="btn btn-danger"
                            onClick={handleCancel}
                            disabled={loading || pin.length < 4}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            {loading ? 'Cancelling...' : 'Confirm'}
                        </motion.button>
                    </div>
                </div>
            )}
        </>
    );
}

export default Dashboard;
