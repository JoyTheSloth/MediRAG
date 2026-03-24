import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import EcgCanvasBg from './components/EcgCanvasBg';
import Home from './pages/Home';
import About from './pages/About';
import Dashboard from './pages/Dashboard';
import Evaluate from './pages/Evaluate';
import ApiDocs from './pages/ApiDocs';
import TargetCursor from './components/TargetCursor';

function App() {
  const { pathname, hash } = useLocation();

  // Handle scroll reveals uniformly across route changes
  useEffect(() => {
    // Basic Intersection Observer for .reveal-up, .reveal-left, .reveal-right
    const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right, .reveal-stagger');
    
    if (revealElements.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal-active');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    });

    revealElements.forEach(el => {
        observer.observe(el);
    });

    return () => {
        revealElements.forEach(el => observer.unobserve(el));
        observer.disconnect();
    };
  }, [pathname]);

  // Handle Hash Scrolling since React Router sometimes misses it with custom elements
  useEffect(() => {
    if (hash) {
      setTimeout(() => {
        const id = hash.replace('#', '');
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      window.scrollTo(0, 0); // scroll to top on bare path
    }
  }, [pathname, hash]);

  return (
    <>
      <TargetCursor 
        spinDuration={2}
        hideDefaultCursor
        parallaxOn
        hoverDuration={0.2}
      />
      <EcgCanvasBg />
      <div className="glow-radial"></div>
      
      <Navbar />

      <main>
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/evaluate" element={<Evaluate />} />
            <Route path="/api-docs" element={<ApiDocs />} />
            <Route path="/about" element={<About />} />
            <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </main>

      <Footer />
    </>
  );
}

export default App;
