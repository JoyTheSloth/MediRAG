import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Dashboard.css';

// --- DATA PER TIME RANGE ---
const DATA = {
    '24h': {
        totalEvals: 48,   totalTrend: '+12%',
        avgHrs:     42.3, hrsBand: 'MODERATE RISK',
        critAlerts: 3,
        avgFaith:   0.74,
        barHeights: [
            { h: '35%', type: 'low' }, { h: '30%', type: 'low' },
            { h: '45%', type: 'low' }, { h: '55%', type: 'mod' },
            { h: '75%', type: 'crit' }, { h: '50%', type: 'mod' },
            { h: '30%', type: 'low' }, { h: '25%', type: 'low' },
            { h: '40%', type: 'low' }, { h: '48%', type: 'low' },
            { h: '35%', type: 'low' }, { h: '33%', type: 'low' },
        ],
        xLabels: ['00:00','04:00','08:00','12:00','16:00','20:00','23:59'],
        donut: { low: 206, mod: 30, high: 10, crit: 5, label: '48' },
        modules: [ 0.92, 0.88, 0.71, 0.42, 0.95 ],
        recentEvals: [
            { query: 'Diabetic retinopathy treatm...', id: 'E-9921', hrs: '12.4', band: 'safe', ts: '2026-03-14\n14:22' },
            { query: 'Pediatric dosage for amoxi...', id: 'E-9918', hrs: '58.9', band: 'mod', ts: '2026-03-14\n13:58' },
            { query: 'Oncology trial contraindicat...', id: 'E-9844', hrs: '89.2', band: 'crit', ts: '2026-03-14\n13:02' },
            { query: 'Cardiovascular health diet ...', id: 'E-9811', hrs: '04.1', band: 'safe', ts: '2026-03-14\n12:44' },
        ]
    },
    '7d': {
        totalEvals: 312,  totalTrend: '+8%',
        avgHrs:     38.1, hrsBand: 'MODERATE RISK',
        critAlerts: 11,
        avgFaith:   0.77,
        barHeights: [
            { h: '20%', type: 'low' }, { h: '40%', type: 'low' },
            { h: '60%', type: 'mod' }, { h: '35%', type: 'low' },
            { h: '55%', type: 'mod' }, { h: '80%', type: 'crit' },
            { h: '42%', type: 'low' },
        ],
        xLabels: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
        donut: { low: 190, mod: 40, high: 15, crit: 6, label: '312' },
        modules: [ 0.90, 0.86, 0.75, 0.38, 0.92 ],
        recentEvals: [
            { query: 'Hypertension drug interaction', id: 'E-9845', hrs: '22.1', band: 'safe', ts: '2026-03-18\n10:14' },
            { query: 'Antibiotic resistance UTI', id: 'E-9831', hrs: '67.4', band: 'mod', ts: '2026-03-17\n15:30' },
            { query: 'Insulin basal bolus dosing', id: 'E-9820', hrs: '91.0', band: 'crit', ts: '2026-03-16\n09:55' },
            { query: 'Post-surgery pain management', id: 'E-9805', hrs: '08.3', band: 'safe', ts: '2026-03-15\n11:20' },
        ]
    },
    '30d': {
        totalEvals: 1247, totalTrend: '+21%',
        avgHrs:     44.7, hrsBand: 'MODERATE RISK',
        critAlerts: 18,
        avgFaith:   0.71,
        barHeights: [
            { h: '25%', type: 'low' }, { h: '38%', type: 'low' },
            { h: '55%', type: 'mod' }, { h: '72%', type: 'crit' },
            { h: '60%', type: 'mod' }, { h: '42%', type: 'low' },
            { h: '30%', type: 'low' }, { h: '50%', type: 'mod' },
            { h: '65%', type: 'crit' }, { h: '48%', type: 'low' },
            { h: '35%', type: 'low' }, { h: '45%', type: 'low' },
        ],
        xLabels: ['Wk 1','Wk 2','Wk 3','Wk 4'],
        donut: { low: 206, mod: 30, high: 10, crit: 5, label: '1.2K' },
        modules: [ 0.88, 0.84, 0.68, 0.47, 0.91 ],
        recentEvals: [
            { query: 'Diabetic retinopathy treatm...', id: 'E-9921', hrs: '12.4', band: 'safe', ts: '2026-03-14\n14:22' },
            { query: 'Pediatric dosage for amoxi...', id: 'E-9918', hrs: '58.9', band: 'mod', ts: '2026-03-14\n13:58' },
            { query: 'Oncology trial contraindicat...', id: 'E-9844', hrs: '89.2', band: 'crit', ts: '2026-03-14\n13:02' },
            { query: 'Cardiovascular health diet ...', id: 'E-9811', hrs: '04.1', band: 'safe', ts: '2026-03-14\n12:44' },
        ]
    }
};

const MODULE_LABELS = [
    'MEDICAL KNOWLEDGE BASE',
    'CITATION RELIABILITY',
    'REASONING CONSISTENCY',
    'BIAS & TOXICITY',
    'SAFETY COMPLIANCE',
];

const MODULE_COLORS = ['var(--green-accent)', 'var(--green-accent)', 'var(--amber-accent)', '#FF6B6B', 'var(--green-accent)'];

const bandColor = (band) => {
    if (band === 'safe') return 'var(--green-accent)';
    if (band === 'mod') return 'var(--amber-accent)';
    return '#FF6B6B';
};

const bandLabel = (band) => {
    if (band === 'safe') return 'SAFE';
    if (band === 'mod') return 'MODERATE';
    return 'CRITICAL';
};

const Dashboard = ({ embedded = false }) => {
    const [range, setRange] = useState('30d');
    const d = DATA[range];

    useEffect(() => {
        const els = document.querySelectorAll('.reveal-up, .reveal-stagger');
        const obs = new IntersectionObserver((entries) => {
            entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('reveal-active'); });
        }, { threshold: 0.1 });
        els.forEach(el => obs.observe(el));
        return () => obs.disconnect();
    }, [range]);

    const dashContent = (
        <div className={`dashboard-container ${embedded ? 'embedded' : ''}`}>

            {/* HEADER */}
            {!embedded && (
                <div className="dash-header">
                    <div className="dash-title-block">
                        <h1>Evaluation Dashboard</h1>
                        <div className="dash-subtitle-block">
                            System Health &amp; RAG Safety Monitoring | Live Stream
                        </div>
                    </div>
                    <div className="dash-time-toggle">
                        <button className={`dt-btn${range === '24h' ? ' active' : ''}`} onClick={() => setRange('24h')}>24 Hours</button>
                        <button className={`dt-btn${range === '7d' ? ' active' : ''}`} onClick={() => setRange('7d')}>7 Days</button>
                        <button className={`dt-btn${range === '30d' ? ' active' : ''}`} onClick={() => setRange('30d')}>30 Days</button>
                    </div>
                </div>
            )}

            {embedded && (
                <div className="dash-time-toggle" style={{ marginBottom: '24px', maxWidth:'fit-content' }}>
                    <button className={`dt-btn${range === '24h' ? ' active' : ''}`} onClick={() => setRange('24h')}>24H</button>
                    <button className={`dt-btn${range === '7d' ? ' active' : ''}`} onClick={() => setRange('7d')}>7D</button>
                    <button className={`dt-btn${range === '30d' ? ' active' : ''}`} onClick={() => setRange('30d')}>30D</button>
                </div>
            )}

            {/* KPI CARDS */}
            <div className="kpi-row-new">

                {/* TOTAL EVALUATIONS */}
                <div className="kpi-card-new c-green">
                    <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'12px'}}>
                        <div className="k-lbl">TOTAL EVALUATIONS</div>
                        <div style={{background:'rgba(0,200,150,0.1)', padding:'6px', borderRadius:'6px', color:'var(--green-accent)', display:'flex'}}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
                        </div>
                    </div>
                    <div className="k-val-group">
                        <div className="k-val">{d.totalEvals.toLocaleString()}</div>
                        <div className="k-sub s-green">{d.totalTrend}</div>
                    </div>
                </div>

                {/* AVG HRS */}
                <div className="kpi-card-new c-amber">
                    <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'12px'}}>
                        <div className="k-lbl">AVG HRS</div>
                        <div style={{background:'rgba(245,166,35,0.1)', padding:'6px', borderRadius:'6px', color:'var(--amber-accent)', display:'flex'}}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>
                        </div>
                    </div>
                    <div className="k-val-group">
                        <div className="k-val">{d.avgHrs}</div>
                        <div className="k-sub s-amber" style={{textTransform:'uppercase', fontSize:'9px'}}>{d.hrsBand}</div>
                    </div>
                </div>

                {/* CRITICAL ALERTS */}
                <div className="kpi-card-new c-red">
                    <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'12px'}}>
                        <div className="k-lbl">CRITICAL ALERTS</div>
                        <div style={{background:'rgba(255,107,107,0.1)', padding:'6px', borderRadius:'6px', color:'#FF6B6B', display:'flex'}}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                        </div>
                    </div>
                    <div className="k-val-group">
                        <div className="k-val">{d.critAlerts}</div>
                        <div className="k-sub s-red">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style={{marginRight:'4px'}}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                            Active Now
                        </div>
                    </div>
                </div>

                {/* AVG FAITHFULNESS */}
                <div className="kpi-card-new c-green">
                    <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'12px'}}>
                        <div className="k-lbl">AVG FAITHFULNESS</div>
                        <div style={{background:'rgba(0,200,150,0.1)', padding:'6px', borderRadius:'6px', color:'var(--green-accent)', display:'flex'}}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                        </div>
                    </div>
                    <div className="k-val-group" style={{alignItems:'center'}}>
                        <div className="k-val">{d.avgFaith}</div>
                        <div className="k-bar-mini"><div className="k-bar-mini-fill" style={{width:`${d.avgFaith*100}%`}}></div></div>
                    </div>
                </div>

            </div>

            {/* MIDDLE GRID */}
            <div className="mid-grid">
                <div className="dash-panel-new">
                    <div className="dp-title">
                        HRS TREND OVER TIME
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="svg-icon"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
                    </div>
                    <div className="trend-chart-container">
                        <div className="bar-area">
                            {d.barHeights.map((b, i) => (
                                <div key={i} className={`bar-col ${b.type}`} style={{height: b.h}}></div>
                            ))}
                        </div>
                        <div className="x-axis">
                            {d.xLabels.map((lbl, i) => <span key={i}>{lbl}</span>)}
                        </div>
                    </div>
                </div>

                <div className="dash-panel-new">
                    <div className="dp-title">RISK BAND DISTRIBUTION</div>
                    <div className="donut-box">
                        <div className="donut-wrapper">
                            <svg className="d-svg" viewBox="0 0 100 100">
                                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#00C896" strokeWidth="12" strokeDasharray={`${d.donut.low} 251`} strokeDashoffset="0"></circle>
                                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#F5A623" strokeWidth="12" strokeDasharray={`${d.donut.mod} 251`} strokeDashoffset={`-${d.donut.low}`}></circle>
                                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#F97316" strokeWidth="12" strokeDasharray={`${d.donut.high} 251`} strokeDashoffset={`-${d.donut.low + d.donut.mod}`}></circle>
                                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#EF4444" strokeWidth="12" strokeDasharray={`${d.donut.crit} 251`} strokeDashoffset={`-${d.donut.low + d.donut.mod + d.donut.high}`}></circle>
                            </svg>
                            <div className="d-center">
                                <div className="d-val">{d.donut.label}</div>
                                <div className="d-lbl">TOTAL</div>
                            </div>
                        </div>

                        <div className="donut-legend-new">
                            <div className="d-leg-item"><div className="d-leg-dot" style={{background:'#00C896'}}></div> Low</div>
                            <div className="d-leg-item"><div className="d-leg-dot" style={{background:'#F5A623'}}></div> Mod</div>
                            <div className="d-leg-item"><div className="d-leg-dot" style={{background:'#F97316'}}></div> High</div>
                            <div className="d-leg-item"><div className="d-leg-dot" style={{background:'#EF4444'}}></div> Crit</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* BOTTOM GRID */}
            <div className="bot-grid">
                <div className="dash-panel-new" style={{gap: '12px'}}>
                    <div className="dp-title" style={{marginBottom:'16px'}}>MODULE SCORE COMPARISON</div>

                    {MODULE_LABELS.map((lbl, i) => (
                        <div className="mod-score-row" key={i} style={{marginBottom: i === MODULE_LABELS.length-1 ? 0 : undefined}}>
                            <div className="ms-head">
                                <span>{lbl}</span>
                                <span style={{color: MODULE_COLORS[i]}}>{d.modules[i].toFixed(2)}</span>
                            </div>
                            <div className="ms-track">
                                <div className="ms-fill" style={{width:`${d.modules[i]*100}%`, background: MODULE_COLORS[i]}}></div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="dash-panel-new">
                    <div className="dp-title" style={{marginBottom:'24px'}}>
                        RECENT EVALUATIONS
                        <a href="#" style={{color:'var(--green-accent)', textDecoration:'none', letterSpacing:'0.05em', fontSize:'10px'}}>VIEW ALL LOGS &rarr;</a>
                    </div>

                    <table className="rt-table">
                        <thead>
                            <tr>
                                <th>QUERY / SUBJECT</th>
                                <th>HRS</th>
                                <th>RISK BAND</th>
                                <th>TIMESTAMP</th>
                                <th style={{textAlign:'right'}}>ACTION</th>
                            </tr>
                        </thead>
                        <tbody>
                            {d.recentEvals.map((ev, i) => (
                                <tr key={i}>
                                    <td>
                                        <div className="td-query">{ev.query}</div>
                                        <div className="td-query-id">ID: {ev.id}</div>
                                    </td>
                                    <td className="td-hrs" style={{color: bandColor(ev.band)}}>{ev.hrs}</td>
                                    <td><span className={`td-pill ${ev.band}`}>{bandLabel(ev.band)}</span></td>
                                    <td className="td-time">{ev.ts.split('\n').map((l, j) => <span key={j}>{l}<br/></span>)}</td>
                                    <td className="td-action" style={{textAlign:'right'}}>
                                        <button className="text-btn" onClick={() => {}} style={{background:'transparent', border:'none', color:'var(--green-accent)', cursor:'pointer', fontSize:'12px', fontWeight:500}}>View<br/>Report</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="floating-badge">
                <div className="pulse-dot"></div>
                SYSTEM ONLINE: ALL NODES NOMINAL
            </div>

        </div>
    );

    if (embedded) return dashContent;

    return (
        <div className="dashboard-page">
            {dashContent}
        </div>
    );
};

export default Dashboard;
