import React from 'react';
import { NavLink, Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <nav className="navbar" id="navbar">
            <div className="nav-container">
                <div className="nav-left">
                    <Link to="/" className="logo">
                        <svg className="pulse-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M22 12H18L15 21L9 3L6 12H2" stroke="#00C896" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <div className="logo-text">
                            <span className="logo-white">MediRAG</span><span className="logo-green">-Eval</span>
                        </div>
                    </Link>
                    <div className="tagline">Hallucination Detection for Medical AI</div>
                </div>
                
                <div className="nav-center">
                    <NavLink to="/" end className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>Home</NavLink>
                    <NavLink to="/evaluate" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>Evaluate</NavLink>
                    <NavLink to="/dashboard" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>Dashboard</NavLink>
                    <NavLink to="/api-docs" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>API Docs</NavLink>
                    <NavLink to="/about" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>About</NavLink>
                </div>

                <div className="nav-right">
                    <a href="https://github.com/medirag/medirag-eval" className="github-btn" target="_blank" rel="noopener noreferrer">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="github-icon">
                            <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                        </svg>
                        GitHub
                    </a>
                    <Link to="/evaluate">
                        <button className="primary-btn">Run Evaluation &rarr;</button>
                    </Link>
                </div>

                <button className="mobile-menu-btn" id="mobile-menu-btn">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M3 12h18M3 6h18M3 18h18" strokeLinecap="round"/>
                    </svg>
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
