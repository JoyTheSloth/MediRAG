import React, { useState, useEffect } from 'react';
import './Governance.css';

const Governance = () => {
    const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard', 'audit', 'compliance'
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState(null);
    const [isGeneratingReport, setIsGeneratingReport] = useState(false);
    const [showReportPreview, setShowReportPreview] = useState(false);
    const [reportProgress, setReportProgress] = useState(0);

    // Mock Data
    const KPI_DATA = [
        { label: 'Total Queries Audited', val: '1,482', sub: 'last 30 days', trend: null },
        { label: 'Avg Hallucination Risk', val: '31.4', sub: '↓ improving', trend: 'down', color: 'teal' },
        { label: 'Critical Flags', val: '12', sub: 'require immediate review', trend: null, color: 'red' },
        { label: 'Compliance Rate', val: '94.7%', sub: 'auto-approved without human review', trend: null, color: 'teal' },
    ];

    const RECENT_FLAGS = [
        { id: 'AUD-8832', ts: '2026-03-27 10:44', query: 'Step-by-step protocol for Stage III NSCLC...', hrs: '84.2', band: 'CRITICAL', module: 'Faithfulness', status: 'UNREVIEWED' },
        { id: 'AUD-8829', ts: '2026-03-27 09:12', query: 'Warfarin-Ibuprofen interaction for elderly...', hrs: '72.1', band: 'HIGH', module: 'Contradiction', status: 'UNREVIEWED' },
        { id: 'AUD-8815', ts: '2026-03-26 23:58', query: 'Initial dosing for pediatric paracetamol...', hrs: '91.8', band: 'CRITICAL', module: 'Entities', status: 'REVIEWED' },
        { id: 'AUD-8811', ts: '2026-03-26 20:14', query: 'Maximum metformin dose in renal failure stage 2...', hrs: '68.4', band: 'HIGH', module: 'Faithfulness', status: 'UNREVIEWED' },
        { id: 'AUD-8805', ts: '2026-03-26 15:42', query: 'Alternative treatments for triple-negative breast...', hrs: '87.5', band: 'CRITICAL', module: 'Sources', status: 'UNREVIEWED' },
    ];

    const AUDIT_LOG = [
        { id: 'AUD-8840', ts: '14:22:01', query: 'stage IV pancreatic cancer protocols', hrs: 22, band: 'LOW', flags: 0, failed: 'None', class: 'Class A' },
        { id: 'AUD-8839', ts: '14:15:33', query: 'insulin glargine starting dose', hrs: 48, band: 'MODERATE', flags: 2, failed: 'Sources', class: 'Class B' },
        { id: 'AUD-8838', ts: '14:02:12', query: 'contraindications for drug X in renal failure', hrs: 88, band: 'CRITICAL', flags: 4, failed: 'Faithfulness, Logic', class: 'Class C' },
        { id: 'AUD-8837', ts: '13:44:55', query: 'pediatric hydration for gastroenteritis', hrs: 12, band: 'LOW', flags: 0, failed: 'None', class: 'Class A' },
    ];

    const generateReport = () => {
        setIsGeneratingReport(true);
        setReportProgress(0);
        let progress = 0;
        const interval = setInterval(() => {
            progress += 10;
            setReportProgress(progress);
            if (progress >= 100) {
                clearInterval(interval);
                setIsGeneratingReport(false);
                setShowReportPreview(true);
            }
        }, 150);
    };

    const handleViewRecord = (rec) => {
        setSelectedRecord(rec);
        setIsDrawerOpen(true);
    };

    const renderDashboard = () => (
        <div className="fade-up">
            <div className="kpi-grid">
                {KPI_DATA.map((kpi, i) => (
                    <div className="gov-card" key={i}>
                        <div className="kpi-label">{kpi.label}</div>
                        <div className="kpi-main">
                            <div className="kpi-val" style={{ color: kpi.color === 'red' ? 'var(--gov-red)' : (kpi.color === 'teal' ? 'var(--gov-teal)' : 'white') }}>
                                {kpi.val}
                            </div>
                            {kpi.trend && (
                                <div className={`kpi-trend ${kpi.trend === 'down' ? 'trend-down' : 'trend-up'}`}>
                                    {kpi.trend === 'down' ? '↓' : '↑'}
                                </div>
                            )}
                        </div>
                        <div className="kpi-subtext">{kpi.sub}</div>
                    </div>
                ))}
            </div>

            <div className="charts-grid">
                <div className="gov-card">
                    <div className="chart-header">
                        <div className="chart-title">HRS Trend (Last 30 Days)</div>
                        <div className="chart-time-selector">
                            <button className="time-pill">7D</button>
                            <button className="time-pill active">30D</button>
                            <button className="time-pill">90D</button>
                        </div>
                    </div>
                    <div className="trend-line-chart">
                        <div className="threshold-line" style={{ top: '30%' }}>
                            <span className="threshold-label">HIGH RISK (70)</span>
                        </div>
                        <div className="threshold-line" style={{ top: '60%' }}>
                            <span className="threshold-label">MEDIUM RISK (40)</span>
                        </div>
                        {/* Fake Line Visualization */}
                        <svg className="line-svg" preserveAspectRatio="none" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
                            <path d="M0 250 L50 220 L100 240 L150 180 L200 160 L250 190 L300 110 L350 140 L400 130 L450 160 L500 140 L550 120 L600 130" fill="none" stroke="var(--gov-teal)" strokeWidth="3" vectorEffect="non-scaling-stroke"></path>
                            <path d="M0 250 L50 220 L100 240 L150 180 L200 160 L250 190 L300 110 L350 140 L400 130 L450 160 L500 140 L550 120 L600 130 V300 H0 Z" fill="var(--gov-teal)" opacity="0.1"></path>
                        </svg>
                    </div>
                </div>

                <div className="gov-card">
                    <div className="chart-header">
                        <div className="chart-title">Module Failure Breakdown</div>
                    </div>
                    <div className="bar-failure-list">
                        {[
                            { label: 'Faithfulness', val: 78, color: 'var(--gov-red)' },
                            { label: 'Entities', val: 42, color: 'var(--gov-amber)' },
                            { label: 'Sources', val: 31, color: 'var(--gov-teal)' },
                            { label: 'Contradiction', val: 19, color: 'var(--gov-teal)' },
                        ].map((f, i) => (
                            <div className="failure-bar-row" key={i}>
                                <div className="f-bar-lbl">
                                    <span>{f.label}</span>
                                    <span className="mono">{f.val} cases</span>
                                </div>
                                <div className="f-bar-track">
                                    <div className="f-bar-fill" style={{ width: `${f.val}%`, background: f.color }}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="recent-flags-section">
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                    <h3 className="chart-title">Recent Critical Flags</h3>
                    <a href="#" className="mono" style={{ color: 'var(--gov-teal)' }}>View all →</a>
                </div>
                <div className="gov-table-wrap">
                    <table className="gov-table">
                        <thead>
                            <tr>
                                <th>AUDIT ID</th>
                                <th>TIMESTAMP</th>
                                <th>QUERY</th>
                                <th>HRS</th>
                                <th>RISK BAND</th>
                                <th>FLAGGED MODULE</th>
                                <th>ACTION</th>
                            </tr>
                        </thead>
                        <tbody>
                            {RECENT_FLAGS.map((rec, i) => (
                                <tr key={i}>
                                    <td className="mono">{rec.id}</td>
                                    <td className="mono">{rec.ts}</td>
                                    <td>{rec.query}</td>
                                    <td style={{ fontWeight: 800 }}>{rec.hrs}</td>
                                    <td><span className={`pill ${rec.band === 'CRITICAL' ? 'pill-red' : 'pill-amber'}`}>{rec.band}</span></td>
                                    <td className="mono">{rec.module}</td>
                                    <td style={{ display: 'flex', gap: '12px' }}>
                                        <button className="review-btn" onClick={() => handleViewRecord(rec)}>Review</button>
                                        <button style={{ opacity: 0.5, cursor: 'pointer' }}>📤</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );

    const renderAuditLog = () => (
        <div className="fade-up">
            <div className="filter-bar">
                <input className="filter-input" placeholder="Search by query or audit ID..." />
                <select className="filter-select">
                    <option>Risk Band (All)</option>
                    <option>LOW</option>
                    <option>HIGH</option>
                    <option>CRITICAL</option>
                </select>
                <select className="filter-select">
                    <option>Module (All)</option>
                    <option>Faithfulness</option>
                    <option>Entities</option>
                </select>
                <div className="filter-toggle">
                    <input type="checkbox" /> Flagged only
                </div>
                <div className="filter-date">
                    <span>From</span> <input type="date" className="filter-select" style={{ fontSize: '11px', padding: '6px' }} />
                    <span>To</span> <input type="date" className="filter-select" style={{ fontSize: '11px', padding: '6px' }} />
                </div>
                <button className="csv-btn">Export Results CSV</button>
            </div>

            <div className="gov-table-wrap">
                <table className="gov-table">
                    <thead>
                        <tr>
                            <th>AUDIT ID</th>
                            <th>TIME</th>
                            <th>QUERY</th>
                            <th>HRS</th>
                            <th>RISK BAND</th>
                            <th>FLAGS</th>
                            <th>MODULES FAILED</th>
                            <th>CDSCO CLASS</th>
                            <th>ACTIONS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {AUDIT_LOG.map((rec, i) => (
                            <tr key={i}>
                                <td className="mono">{rec.id}</td>
                                <td className="mono">{rec.ts}</td>
                                <td style={{ maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{rec.query}</td>
                                <td style={{ color: rec.hrs > 60 ? 'var(--gov-red)' : (rec.hrs > 30 ? 'var(--gov-amber)' : 'var(--gov-teal)'), fontWeight: 800 }}>{rec.hrs}</td>
                                <td><span className={`pill ${rec.band === 'CRITICAL' ? 'pill-red' : (rec.band === 'MODERATE' ? 'pill-amber' : 'pill-teal')}`}>{rec.band}</span></td>
                                <td><span className="pill pill-grey">{rec.flags}</span></td>
                                <td className="mono" style={{ fontSize: '11px' }}>{rec.failed}</td>
                                <td><span className={`pill ${rec.class === 'Class C' ? 'pill-red' : (rec.class === 'Class B' ? 'pill-amber' : 'pill-teal')}`}>{rec.class}</span></td>
                                <td><button className="review-btn" onClick={() => handleViewRecord(rec)}>View</button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

    const renderComplianceReport = () => (
        <div className="compliance-grid fade-up">
            <div className="gov-card">
                <h3 className="chart-title" style={{ marginBottom: '24px' }}>Report Config</h3>
                <div className="config-group">
                    <label className="config-lbl">REPORT PERIOD</label>
                    <input type="date" className="filter-input" style={{ width: '100%', marginBottom: '12px' }} />
                    <input type="date" className="filter-input" style={{ width: '100%' }} />
                </div>
                <div className="config-group">
                    <label className="config-lbl">SAMD CLASSIFICATION</label>
                    <select className="filter-input" style={{ width: '100%' }}>
                        <option>Class B (Low-Moderate Risk)</option>
                        <option>Class C (High Risk)</option>
                    </select>
                </div>
                <div className="config-group" style={{ marginTop: '32px' }}>
                    <label className="config-check"><input type="checkbox" defaultChecked /> Include raw records</label>
                    <label className="config-check"><input type="checkbox" defaultChecked /> Include fix suggestions</label>
                    <label className="config-check"><input type="checkbox" defaultChecked /> Include source tiers</label>
                </div>

                <button className="gen-btn" onClick={generateReport} disabled={isGeneratingReport}>
                    {isGeneratingReport ? 'Generating...' : 'Generate CDSCO Report'}
                    {isGeneratingReport && (
                        <div style={{ position: 'absolute', bottom: 0, left: 0, width: `${reportProgress}%`, height: '4px', background: 'rgba(255,255,255,0.5)' }}></div>
                    )}
                </button>
            </div>

            <div className="preview-wrap">
                {!showReportPreview ? (
                    <div style={{ color: 'var(--gov-text-dim)', textAlign: 'center', marginTop: '100px' }}>
                        <div style={{ fontSize: '48px', marginBottom: '20px' }}>📄</div>
                        <p>Configure and generate to preview report</p>
                    </div>
                ) : (
                    <div className="report-doc fade-up">
                        <div className="preview-header">
                            <h1>CDSCO SaMD Compliance Report</h1>
                            <div className="report-id">CDSCO-RPT-2026-Q1-MOD-042</div>
                            <div className="mono" style={{ fontSize: '10px', marginTop: '4px' }}>GENERATED: 2026-03-27 18:14 UTC</div>
                        </div>

                        <div className="preview-stats">
                            <div className="ps-stat"><div className="ps-lbl">TOTAL QUERIES</div><div className="ps-val">1,482</div></div>
                            <div className="ps-stat"><div className="ps-lbl">FLAGGED</div><div className="ps-val" style={{ color: 'var(--gov-red)' }}>154</div></div>
                            <div className="ps-stat"><div className="ps-lbl">CRITICAL</div><div className="ps-val" style={{ color: 'var(--gov-red)' }}>12</div></div>
                            <div className="ps-stat"><div className="ps-lbl">AVG HRS</div><div className="ps-val">31.4</div></div>
                            <div className="ps-stat"><div className="ps-lbl">COMPLIANCE</div><div className="ps-val" style={{ color: 'var(--gov-teal)' }}>94.7%</div></div>
                        </div>

                        <div className="cert-block">
                            I hereby certify that the MediRAG AI system has been audited against the CDSCO Class B SaMD hallucination risk framework. 
                            The system is monitoring for Faithfulness (NLI), Medical Entities (Named Entity Recognition), Source Credibility (Tier-indexed), and Internal Contradiction.
                            Results signify a stability level of HIGH COMPLIANCE for the period 2026-02-27 TO 2026-03-27.
                        </div>

                        <div className="preview-bottom-bar">
                            <button className="dl-btn">Download JSON</button>
                            <button className="dl-btn">Download CSV</button>
                            <button className="dl-btn" style={{ background: '#0F172A', color: 'white' }}>Download Summary (TXT)</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );

    return (
        <div className="gov-page">
            <div className="gov-header-bar gov-container">
                <div className="gov-brand-block">
                    <div className="gov-wordmark">MediRAG <span style={{ color: 'var(--gov-teal)' }}>Eval</span></div>
                    <div className="gov-tagline">AI Governance Console</div>
                </div>

                <div className="gov-tabs-pills">
                    {[
                        { id: 'dashboard', label: 'Dashboard', icon: '📊' },
                        { id: 'audit', label: 'Audit Log', icon: '📋' },
                        { id: 'compliance', label: 'Compliance Report', icon: '📄' },
                    ].map(tab => (
                        <button key={tab.id} className={`gov-tab-pill ${activeTab === tab.id ? 'active' : ''}`} onClick={() => setActiveTab(tab.id)}>
                            <span>{tab.icon}</span> {tab.label}
                        </button>
                    ))}
                </div>

                <div className="gov-header-right">
                    <div className="cdsco-badge">CDSCO SaMD CLASS B</div>
                    <button className="export-btn-top">Export Report</button>
                </div>
            </div>

            <div className="gov-container">
                {activeTab === 'dashboard' && renderDashboard()}
                {activeTab === 'audit' && renderAuditLog()}
                {activeTab === 'compliance' && renderComplianceReport()}
            </div>

            {/* DETAIL DRAWER */}
            {isDrawerOpen && <div className="drawer-backdrop" onClick={() => setIsDrawerOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000 }}></div>}
            <div className={`audit-drawer-overlay ${isDrawerOpen ? 'open' : ''}`}>
                <div className="drawer-header">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <div className="mono" style={{ fontSize: '10px' }}>LOG ID: {selectedRecord?.id || 'AUD-8832'}</div>
                            <h2 style={{ fontSize: '20px', fontWeight: 800, marginTop: '4px' }}>Audit Record Detail</h2>
                        </div>
                        <button onClick={() => setIsDrawerOpen(false)} style={{ fontSize: '24px', color: 'var(--gov-text-dim)', cursor: 'pointer' }}>×</button>
                    </div>
                </div>
                <div className="drawer-body">
                    <div className="drawer-section">
                        <div className="drawer-sec-title">Input & Output</div>
                        <div style={{ background: 'rgba(0,0,0,0.2)', padding: '16px', borderRadius: '8px', marginBottom: '16px' }}>
                            <div className="mono" style={{ color: 'var(--gov-teal)', marginBottom: '8px' }}>QUERY:</div>
                            <div style={{ fontSize: '13px' }}>{selectedRecord?.query}</div>
                        </div>
                        <div style={{ background: 'rgba(0,0,0,0.2)', padding: '16px', borderRadius: '8px' }}>
                            <div className="mono" style={{ color: 'var(--gov-amber)', marginBottom: '8px' }}>GENERATED ANSWER:</div>
                            <div style={{ fontSize: '13px' }}>The standard treatment for stage III NSCLC patients includes cisplatin-based chemotherapy and radiation... [TRUNCATED]</div>
                        </div>
                    </div>

                    <div className="drawer-section">
                        <div className="drawer-sec-title">Module Risk Profile</div>
                        <div className="bar-failure-list">
                            {[
                                { label: 'Faithfulness', val: 82, color: 'var(--gov-red)' },
                                { label: 'Entities', val: 12, color: 'var(--gov-teal)' },
                                { label: 'Sources', val: 45, color: 'var(--gov-amber)' },
                                { label: 'Logic', val: 0, color: 'var(--gov-teal)' },
                            ].map((s, i) => (
                                <div className="failure-bar-row" key={i}>
                                    <div className="f-bar-lbl"><span>{s.label}</span> <span>{s.val}% risk</span></div>
                                    <div className="f-bar-track"><div className="f-bar-fill" style={{ width: `${s.val}%`, background: s.color }}></div></div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="drawer-section">
                        <div className="drawer-sec-title">Flagged Claims (2)</div>
                        <div style={{ background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '12px', borderRadius: '8px', marginBottom: '12px' }}>
                            <div style={{ fontSize: '12px', fontWeight: 700 }}>"Drug X is safe for Stage 3 renal failure"</div>
                            <div style={{ color: 'var(--gov-red)', fontSize: '10px', marginTop: '4px' }}>CONTRADICTED BY DrugBank DB00412</div>
                        </div>
                    </div>

                    <div className="drawer-section">
                        <div className="drawer-sec-title">Raw JSON Audit Trail</div>
                        <div className="mono" style={{ background: 'black', padding: '16px', borderRadius: '8px', fontSize: '10px', height: '100px', overflow: 'hidden', opacity: 0.5 }}>
                            {`{ "audit_id": "${selectedRecord?.id}", "provider": "openai/gpt-4", "hrs": ${selectedRecord?.hrs}, "verdicts": [...] }`}
                        </div>
                    </div>
                </div>
                <div className="drawer-footer">
                    <button className="review-btn" style={{ flex: 1, padding: '12px' }}>Export Record</button>
                    <button className="review-btn" style={{ flex: 1, padding: '12px', background: 'var(--gov-teal)', color: 'var(--gov-bg)' }}>Mark as Reviewed</button>
                </div>
            </div>
        </div>
    );
};

export default Governance;
