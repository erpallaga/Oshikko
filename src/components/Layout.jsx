import React from 'react';
import { Droplets, Calendar, BarChart3 } from 'lucide-react';

export default function Layout({ children, activeTab, setActiveTab }) {
    return (
        <div className="layout">
            <main className="content">
                {children}
            </main>
            <nav className="bottom-nav">
                <button
                    className={`nav-item ${activeTab === 'log' ? 'active' : ''}`}
                    onClick={() => setActiveTab('log')}
                >
                    <Droplets size={32} />
                </button>
                <button
                    className={`nav-item ${activeTab === 'calendar' ? 'active' : ''}`}
                    onClick={() => setActiveTab('calendar')}
                >
                    <Calendar size={32} />
                </button>
                <button
                    className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
                    onClick={() => setActiveTab('dashboard')}
                >
                    <BarChart3 size={32} />
                </button>
            </nav>
        </div>
    );
}
