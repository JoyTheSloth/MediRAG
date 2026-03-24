import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Evaluate.css';

const Evaluate = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [view, setView] = useState(location.state?.defaultView || 'form');
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    // Ensure scroll to top on mount
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [view]);

    // Handle incoming state changes from links
    useEffect(() => {
        if (location.state?.defaultView) {
            setView(location.state.defaultView);
        }
    }, [location.state]);

    const handleEvaluate = () => {
        setIsAnalyzing(true);
        setTimeout(() => {
            setIsAnalyzing(false);
            setView('report');
        }, 1500); // simulate 1.5s computation
    };

    return (
        <div className="eval-page">
            <div className="eval-container">

                {view === 'form' && (
                    <div className="eval-split reveal-up">
                        
                        {/* LEFT FORM */}
                        <div className="eval-form-col">
                            <div className="eval-header">
                                <h1>Run Evaluation</h1>
                                <p>Audit any medical RAG output in seconds</p>
                            </div>

                            <div className="form-group">
                                <label className="form-label">USER QUERY</label>
                                <textarea className="form-textarea short" placeholder="e.g., What are the standard treatment protocols for stage II non-small cell lung cancer?"></textarea>
                            </div>

                            <div className="form-group">
                                <label className="form-label">RETRIEVED CONTEXT CHUNKS</label>
                                <textarea className="form-textarea tall" placeholder="Paste the documents or context retrieved by your RAG pipeline..."></textarea>
                            </div>

                            <div className="form-group">
                                <label className="form-label">GENERATED ANSWER</label>
                                <textarea className="form-textarea med" placeholder="The AI's generated response to be audited..."></textarea>
                            </div>

                            <button className="eval-btn" onClick={handleEvaluate} disabled={isAnalyzing}>
                                {isAnalyzing ? (
                                    'ANALYZING...'
                                ) : (
                                    <>
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                                        EVALUATE OUTPUT
                                    </>
                                )}
                            </button>
                            <div className="eval-btn-sub">Avg. response time: ~18 seconds on CPU</div>
                        </div>

                        {/* RIGHT REALTIME DASH */}
                        <div className={`realtime-panel ${isAnalyzing ? 'is-analyzing' : ''}`}>
                            {isAnalyzing && (
                                <div className="analyzing-overlay">
                                    <div className="telemetry-dot pulse"></div>
                                    <span>SCANNING PIPELINE...</span>
                                </div>
                            )}
                            
                            <div className="rp-label">REAL-TIME ANALYSIS FEED</div>
                            
                            <div className="rp-gauge-wrapper">
                                <div className="rp-gauge-circular">
                                    <svg viewBox="0 0 100 100" style={{transform: 'rotate(-90deg)', width:'100%', height:'100%'}}>
                                        <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="5"></circle>
                                        <circle cx="50" cy="50" r="45" fill="none" stroke={isAnalyzing ? "#00C896" : "#F5A623"} strokeWidth="5" strokeDasharray={isAnalyzing ? "100 283" : "189 283"} strokeLinecap="round"></circle>
                                    </svg>
                                    <div className="rp-gauge-val">
                                        <div className="rp-gauge-num pulse-ani">{isAnalyzing ? '...' : '67'}</div>
                                        <div className="rp-gauge-lbl">HRS SCORE</div>
                                    </div>
                                </div>

                                <div className="rp-title">Hallucination Risk Feed</div>
                                <div className="risk-indicator-row">
                                    <span className={`rp-pill ${isAnalyzing ? 'green-badge' : 'orange-badge'}`}>
                                        {isAnalyzing ? 'INITIALIZING SCAN' : 'HIGH RISK DETECTED'}
                                    </span>
                                </div>
                                <div className="rp-desc" style={{opacity: isAnalyzing ? 0.3 : 1}}>
                                    Global risk assessment calculated via Faithfulness, Entity Consistency, and Source Credibility weights.
                                </div>
                            </div>

                            <div className="rp-metrics-row">
                                {[
                                    { n: 'FAITHFULNESS', v: '0.45', c: '#FF6B6B', tag: 'NLI' },
                                    { n: 'ENTITIES', v: '0.60', c: '#F5A623', tag: 'NER' },
                                    { n: 'SOURCES', v: '0.80', c: '#00C896', tag: 'TIER' },
                                    { n: 'LOGIC', v: '0.28', c: '#00C896', tag: 'NLI' },
                                ].map((m, idx) => (
                                    <div key={idx} className="rp-metric">
                                        <div className="rp-m-head">
                                            <span>{m.n} <small style={{fontSize:'8px', opacity:0.5}}>[{m.tag}]</small></span> 
                                            <span style={{color: m.c}}>{isAnalyzing ? '--' : m.v}</span>
                                        </div>
                                        <div className="rp-m-bar">
                                            <div className="rp-m-fill" style={{width: isAnalyzing ? '10%' : `${parseFloat(m.v)*100}%`, background: m.c, transition: 'width 1s cubic-bezier(0.4, 0, 0.2, 1)'}}></div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="rp-terminal">
                                <div className="rp-t-icon pulse">●</div>
                                <div className="rp-t-content">
                                    <h4 style={{fontSize:'10px', opacity:0.6, letterSpacing:'0.1em'}}>STATUS: {isAnalyzing ? 'ACTIVE_SCAN' : 'REPORT_READY'}</h4>
                                    <div className="rp-t-code">
                                        {isAnalyzing 
                                            ? ">>> [SCAN_SEQ] verifying claim_hashes against source_vector_db..."
                                            : "[TRACE-842] Answer refers to 'Immunotherapy' which is absent in chunks [03, 07]. Safety flag raised."}
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                )}

                {view === 'report' && (
                    <div className="eval-report-view reveal-up">
                        
                        <div className="report-header">
                            <div className="rh-eyebrow">
                                SYSTEM REPORT // RAG-AUDIT-402 
                                <span className="rh-pill">AUDIT FAILED</span>
                                <button onClick={() => navigate(-1)} style={{marginLeft:'auto', background:'transparent', border:'1px solid var(--card-border)', color:'white', padding:'4px 12px', borderRadius:'4px', cursor:'pointer', fontSize:'11px'}}>
                                    &larr; BACK
                                </button>
                            </div>
                            <h1 className="rh-title">Audit Report</h1>
                            <div className="rh-time">TIMESTAMP: 2026-05-14 14:22:01 UTC</div>

                            <div className="report-query-box">
                                <div className="rq-label">ACTIVE QUERY</div>
                                "What are the contraindications for Drug X in elderly patients with pre-existing stage 3 renal failure?"
                            </div>
                        </div>

                        <div className="report-cards-row">
                            <div className="rc-card">
                                <div className="rc-head"><span>FAITHFULNESS</span> <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#00C896" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg></div>
                                <div className="rc-val-group">
                                    <div className="rc-val">0.72</div>
                                    <div className="rc-trend" style={{color:'#FF6B6B'}}>-0.04</div>
                                </div>
                                <div className="rc-bar-bot"><div className="rc-fill-bot" style={{width:'72%', background:'#00C896'}}></div></div>
                            </div>
                            <div className="rc-card">
                                <div className="rc-head"><span>ANSWER RELEVANCY</span> <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#00C896" strokeWidth="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg></div>
                                <div className="rc-val-group">
                                    <div className="rc-val">0.81</div>
                                    <div className="rc-trend" style={{color:'#00C896'}}>+0.12</div>
                                </div>
                                <div className="rc-bar-bot"><div className="rc-fill-bot" style={{width:'81%', background:'#00C896'}}></div></div>
                            </div>
                            <div className="rc-card">
                                <div className="rc-head"><span>CONTEXT PRECISION</span> <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#F5A623" strokeWidth="2"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg></div>
                                <div className="rc-val-group">
                                    <div className="rc-val">0.68</div>
                                    <div className="rc-trend" style={{color:'var(--text-gray)'}}>STABLE</div>
                                </div>
                                <div className="rc-bar-bot"><div className="rc-fill-bot" style={{width:'68%', background:'#F5A623'}}></div></div>
                            </div>
                            <div className="rc-card">
                                <div className="rc-head"><span>CONTEXT RECALL</span> <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#00C896" strokeWidth="2"><path d="M2 12c0-5.52 4.48-10 10-10s10 4.48 10 10-4.48 10-10 10c-1.35 0-2.64-.26-3.83-.74"/><polyline points="2 7 6 3 10 7"/></svg></div>
                                <div className="rc-val-group">
                                    <div className="rc-val">0.75</div>
                                    <div className="rc-trend" style={{color:'#00C896'}}>+0.05</div>
                                </div>
                                <div className="rc-bar-bot"><div className="rc-fill-bot" style={{width:'75%', background:'#00C896'}}></div></div>
                            </div>
                        </div>

                        <div className="report-main-grid">
                            
                            {/* COL 1: TABLES */}
                            <div>
                                <div className="rep-panel">
                                    <div className="rep-panel-header">
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#00C896" strokeWidth="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
                                        CLAUSE ANNOTATIONS TABLE
                                    </div>
                                    <table className="r-table">
                                        <thead>
                                            <tr>
                                                <th>CLAIM</th>
                                                <th>STATUS</th>
                                                <th>EVIDENCE</th>
                                                <th>SEVERITY</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>'Drug X is safe for Stage 3 patients'</td>
                                                <td><span className="r-pill red">CONTRADICTED</span></td>
                                                <td><a href="#" className="r-link">⚯ DrugBank DB00412</a></td>
                                                <td><span className="r-pill red">CRITICAL</span></td>
                                            </tr>
                                            <tr>
                                                <td>'No documented renal interaction'</td>
                                                <td><span className="r-pill red">CONTRADICTED</span></td>
                                                <td><a href="#" className="r-link">⚯ NEJM Vol 382</a></td>
                                                <td><span className="r-pill red">CRITICAL</span></td>
                                            </tr>
                                            <tr>
                                                <td>'Mechanism via CYP3A4 inhibition'</td>
                                                <td><span className="r-pill green">VERIFIED</span></td>
                                                <td><a href="#" className="r-link">⚯ NIH Clinical</a></td>
                                                <td><span className="r-pill gray">LOW</span></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>

                                <div className="rep-panel">
                                    <div className="rep-panel-header">
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F5A623" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                                        FLAGGED ENTITIES
                                    </div>
                                    <table className="r-table">
                                        <thead>
                                            <tr>
                                                <th>ENTITY</th>
                                                <th>TYPE</th>
                                                <th>EXPECTED</th>
                                                <th>FOUND</th>
                                                <th>SEVERITY</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td style={{color:'#fff', fontWeight:600}}>Lisinopril Dosage</td>
                                                <td>QUANTITY</td>
                                                <td style={{color:'var(--green-accent)'}}>5mg QD</td>
                                                <td style={{color:'#FF6B6B'}}>40mg QD</td>
                                                <td><span className="r-pill red">CRITICAL</span></td>
                                            </tr>
                                            <tr>
                                                <td style={{color:'#fff', fontWeight:600}}>Creatinine Clearance</td>
                                                <td>LAB_VAL</td>
                                                <td style={{color:'var(--green-accent)'}}>&lt;30 mL/min</td>
                                                <td>Not Cited</td>
                                                <td><span className="r-pill orange">MODERATE</span></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* COL 2: TRACE & ACTION */}
                            <div>
                                <div className="rep-panel">
                                    <div className="rep-panel-header">
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#00C896" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><rect x="7" y="7" width="3" height="9"/><rect x="14" y="7" width="3" height="5"/></svg>
                                        SOURCE CREDIBILITY
                                    </div>
                                    <div className="cred-card">
                                        <div>
                                            <div className="cred-title">PubMed RCT 2023</div>
                                            <div className="cred-sub">PEER REVIEWED &middot; n=4,500</div>
                                        </div>
                                        <div className="r-pill green">TIER 1</div>
                                    </div>
                                    <div className="cred-card">
                                        <div>
                                            <div className="cred-title">WHO Clinical Guideline</div>
                                            <div className="cred-sub">GLOBAL STANDARD &middot; 2024</div>
                                        </div>
                                        <div className="r-pill green" style={{color: '#00C896', borderColor: 'transparent'}}>TIER 2</div>
                                    </div>
                                    <div className="cred-card">
                                        <div>
                                            <div className="cred-title">Case Report</div>
                                            <div className="cred-sub">ANECDOTAL &middot; SINGULAR</div>
                                        </div>
                                        <div className="r-pill orange">TIER 4</div>
                                    </div>
                                </div>

                                <div className="trace-panel">
                                    <div className="trace-head">
                                        LOGIC FAILURE TRACE
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/><path d="M12 12v9"/><path d="M8 17l4 4 4-4"/></svg>
                                    </div>
                                    <div className="trace-code">
                                        <div className="tc-line"><span className="tc-gray">01</span><span className="tc-white">[LOG] Initializing retrieval sequence...</span></div>
                                        <div className="tc-line"><span className="tc-gray">02</span><span className="tc-white">[DOC] Match found in</span> <span className="tc-green">renal_safety.pdf</span></div>
                                        <div className="tc-line"><span className="tc-gray">03</span><span className="tc-red">[ERR] Hallucination detected in LLM summary</span></div>
                                        <div className="tc-line"><span className="tc-gray">04</span><span className="tc-white">[WARN] Contradiction between Source A and Answer</span></div>
                                        <div className="tc-line"><span className="tc-gray">05</span><span className="tc-white">[LOG] Flagging claim ID_882 for audit...</span></div>
                                    </div>
                                </div>

                                <div style={{marginTop: '24px'}}>
                                    <button className="rep-action-btn">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{marginRight:'8px', verticalAlign:'middle'}}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                                        DOWNLOAD JSON REPORT
                                    </button>
                                    <button className="rep-action-btn">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{marginRight:'8px', verticalAlign:'middle'}}><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                                        COPY API RESPONSE
                                    </button>
                                </div>

                            </div>
                        </div>

                    </div>
                )}

            </div>
        </div>
    );
};

export default Evaluate;
