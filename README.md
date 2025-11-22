# Oshikko 💧

A minimalist, "watery" themed Progressive Web App (PWA) for tracking urination frequency and urgency. Designed for simplicity and ease of use on Android devices.

## Features

### 📝 Log Urination (Anotar)
- **Quick Entry**: Log events with just a few taps.
- **Quantity**: Visual droplet icons (1-3) to represent amount (Poco, Normal, Mucho).
- **Urgency**: Color-coded abstract icons (Shield, Triangle, Siren) for urgency levels (Low, Medium, High).
- **Date/Time**: Defaults to now, but adjustable via a simple picker.

### 📅 Calendar View
- **Flexible Views**: Switch between Day, Week, and Month views.
- **Visual History**: See your logs with consistent iconography.
- **Daily Totals**: Quickly check your frequency per day.

### 📊 Dashboard
- **At a Glance**: Summary cards for Today, This Week, and This Month.
- **Clean UI**: Glassmorphic design that fits the watery theme.

## Tech Stack

- **Framework**: React + Vite
- **Styling**: Vanilla CSS (Variables, Glassmorphism, Animations)
- **Icons**: Lucide React
- **PWA**: Vite PWA Plugin (Installable on Android/iOS)
- **Persistence**: Local Storage (Data stays on your device)

## Getting Started

1.  Clone the repository:
    ```bash
    git clone https://github.com/erpallaga/Oshikko.git
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Run the development server:
    ```bash
    npm run dev
    ```
4.  Open `http://localhost:5173` in your browser.

## Installation (Android)

1.  Open the app in Chrome on Android.
2.  Tap the menu (three dots) or wait for the prompt.
3.  Select "Install App" or "Add to Home Screen".

## License

MIT
