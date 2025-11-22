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
                    <Droplets size={24} />
                    <span>Anotar</span>
                </button>
                <button
                    className={`nav-item ${activeTab === 'calendar' ? 'active' : ''}`}
                    onClick={() => setActiveTab('calendar')}
                >
                    <Calendar size={24} />
                    <span>Calendario</span>
                </button>
                <button
                    className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
                    onClick={() => setActiveTab('dashboard')}
                >
                    <BarChart3 size={24} />
                    <span>Gráficos</span>
                </button>
            </nav>
        </div>
    );
}
