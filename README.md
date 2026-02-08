# Whispering Bamboos Booking Tracker

A modern, minimal booking tracker for the Whispering Bamboos resort. Features a dark theme, smooth animations, and an intuitive calendar interface.

## Features

- 🔐 **User Authentication**: Login/Signup with unique username
- 📅 **Calendar View**: Navigate months, view bookings at a glance
- ✅ **Add Bookings**: Guest name, mobile (required), description (optional)
- ❌ **Cancel Bookings**: Secure cancellation with PIN `1234`
- 🌙 **Dark Theme**: Modern, minimal dark UI

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Then open http://localhost:5173 in your browser.

## Demo Credentials

- **Username**: `demo`
- **Password**: `demo`

Or create a new account via the signup page.

## Deploying to Vercel

1. Push this project to a GitHub repository
2. Go to [vercel.com](https://vercel.com) and import your repo
3. Deploy!

## Google Sheets Integration (Optional)

The app currently uses mock data. To connect to Google Sheets:

1. Create a Google Cloud project
2. Enable Google Sheets API
3. Create a Service Account and download JSON key
4. Share your Google Sheet with the service account email
5. Add environment variables in Vercel:
   - `GOOGLE_SERVICE_ACCOUNT_EMAIL`
   - `GOOGLE_PRIVATE_KEY`
   - `GOOGLE_SHEET_ID`

---

Built with React + Vite + TypeScript
# saharshbaiju-whispering-bamboos-booking-tracker
