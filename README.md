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

## PWA Installation (Web)

1.  Open the app in Chrome on Android.
2.  Tap the menu (three dots) or wait for the prompt.
3.  Select "Install App" or "Add to Home Screen".

## Android Native Development (Capacitor)

This project uses **Capacitor** to run as a native Android app.

### Prerequisites
- **Android Studio** installed.
- Android device (USB debugging enabled) or Emulator.

### Running on Android
1.  **Open in Android Studio**:
    ```bash
    npx cap open android
    ```
    Or open the `android` folder manually in Android Studio.
2.  **Run**:
    - Wait for Gradle sync to finish.
    - Select your device/emulator.
    - Click the green **Run (Play)** button.

### Updating the App
When you make changes to the React code (`src/`), you must update the Android build:

1.  **Rebuild Web Assets**:
    ```bash
    npm run build
    ```
2.  **Sync to Android**:
    ```bash
    npx cap sync
    ```
3.  **Rerun**: Click "Run" in Android Studio again.

### Generating an APK (for sharing)
To share the app or install it manually without a PC connection:
1.  Open **Android Studio**.
2.  Go to **Build** > **Build Bundle(s) / APK(s)** > **Build APK(s)**.
3.  Wait for the build to finish.
4.  Click **locate** in the notification (or find it in `android/app/build/outputs/apk/debug/app-debug.apk`).
5.  Send this file to your phone and install it!

## License

MIT
