import { useState } from 'react'
import Layout from './components/Layout'
import EntryForm from './components/EntryForm'
import CalendarView from './components/CalendarView'
import Dashboard from './components/Dashboard'
import './index.css'

function App() {
    const [activeTab, setActiveTab] = useState('log')

    return (
        <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
            {activeTab === 'log' && <EntryForm />}
            {activeTab === 'calendar' && <CalendarView />}
            {activeTab === 'dashboard' && <Dashboard />}
        </Layout>
    )
}

export default App
