import { useState, useEffect } from 'react'
import { SplashScreen } from '@capacitor/splash-screen'
import Layout from './components/Layout'
import EntryForm from './components/EntryForm'
import CalendarView from './components/CalendarView'
import Dashboard from './components/Dashboard'
import './index.css'

function App() {
    const [activeTab, setActiveTab] = useState('log')

    useEffect(() => {
        const hideSplash = async () => {
            await SplashScreen.hide();
        };
        hideSplash();
    }, []);

    return (
        <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
            {activeTab === 'log' && <EntryForm />}
            {activeTab === 'calendar' && <CalendarView />}
            {activeTab === 'dashboard' && <Dashboard />}
        </Layout>
    )
}

export default App
