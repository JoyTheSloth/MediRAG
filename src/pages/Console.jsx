import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Evaluate from './Evaluate';
import Dashboard from './Dashboard';
import Governance from './Governance';
import PatientExperience from './PatientExperience';
import './Console.css';

const Console = () => {
    const location = useLocation();
    const [activeSection, setActiveSection] = useState('dashboard');
    const [activeSubSection, setActiveSubSection] = useState(null);

    // Initial section based on route or state
    useEffect(() => {
        if (location.pathname.includes('dashboard')) {
            setActiveSection('dashboard');
        } else if (location.pathname.includes('evaluate')) {
            setActiveSection('evaluate');
            setActiveSubSection('researcher'); 
        } else if (location.pathname === '/console') {
            setActiveSection('evaluate');
            setActiveSubSection('researcher');
        }
    }, [location]);

    const handleNav = (section, sub = null) => {
        setActiveSection(section);
        setActiveSubSection(sub);
        window.scrollTo(0, 0);
    };

    return (
        <div className="console-page">
            <div className="console-layout">
                
                {/* --- SIDEBAR --- */}
                <aside className="console-sidebar">
                    <div className="console-nav-group">
                        <div className="console-nav-label">EVALUATE</div>
                        <button 
                            className={`console-nav-link ${activeSection === 'evaluate' && activeSubSection === 'researcher' ? 'active' : ''}`}
                            onClick={() => handleNav('evaluate', 'researcher')}
                        >
                            <span className="console-nav-icon">🔬</span>
                            Researcher / AI Trainer
                        </button>
                        <button 
                            className={`console-nav-link ${activeSection === 'evaluate' && activeSubSection === 'patient' ? 'active' : ''}`}
                            onClick={() => handleNav('evaluate', 'patient')}
                        >
                            <span className="console-nav-icon">👤</span>
                            Patient / Common User
                        </button>
                        <button 
                            className={`console-nav-link ${activeSection === 'evaluate' && activeSubSection === 'governance' ? 'active' : ''}`}
                            onClick={() => handleNav('evaluate', 'governance')}
                        >
                            <span className="console-nav-icon">🛡️</span>
                            AI Governance System
                        </button>
                    </div>

                    <div className="console-nav-group">
                        <div className="console-nav-label">ANALYTICS</div>
                        <button 
                            className={`console-nav-link ${activeSection === 'dashboard' ? 'active' : ''}`}
                            onClick={() => handleNav('dashboard')}
                        >
                            <span className="console-nav-icon">📊</span>
                            System Dashboard
                        </button>
                    </div>
                </aside>

                <main className="console-main">
                    {activeSection === 'evaluate' && activeSubSection === 'researcher' && (
                        <div className="console-view-wrapper">
                            <Evaluate embedded={true} mode={activeSubSection} />
                        </div>
                    )}

                    {activeSection === 'evaluate' && activeSubSection === 'patient' && (
                        <div className="console-view-wrapper">
                            <div className="console-view-header">
                                <span className="res-mode-pill" style={{ background: 'rgba(0, 200, 150, 0.1)', color: '#00C896' }}>Patient mode</span>
                                <h1 className="console-view-title">Check AI Medical Advice</h1>
                                <p style={{ color: 'var(--text-gray)', marginTop: '8px' }}>Verify health advice against trusted medical literature and your own records</p>
                            </div>
                            <PatientExperience />
                        </div>
                    )}

                    {activeSection === 'evaluate' && activeSubSection === 'governance' && (
                        <div className="console-view-wrapper">
                            <Governance />
                        </div>
                    )}

                    {activeSection === 'dashboard' && (
                        <div className="console-view-wrapper">
                            <Dashboard embedded={true} />
                        </div>
                    )}
                </main>

            </div>
        </div>
    );
};

export default Console;
