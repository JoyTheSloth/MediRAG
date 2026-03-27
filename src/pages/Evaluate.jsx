import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Evaluate.css';

const Evaluate = ({ embedded = false, mode = 'researcher' }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const [view, setView] = useState(location.state?.defaultView || 'form');
    const [evalTab, setEvalTab] = useState('single'); // 'single', 'batch', 'config'
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    // Form states
    const [query, setQuery] = useState('');
    const [context, setContext] = useState('');
    const [answer, setAnswer] = useState('');

    const SAMPLES = {
        nsclc: {
            q: "What are the standard treatment protocols for stage II non-small cell lung cancer?",
            c: "NCCAP Guidelines 2023 (Chunk [01]): Stage II NSCLC — surgical resection (lobectomy preferred). Adjuvant cisplatin-based chemotherapy post-resection. PORT (post-operative radiotherapy) for margin-positive cases only.",
            a: "Stage II non-small cell lung cancer is typically treated with surgery followed by adjuvant chemotherapy. Immunotherapy such as pembrolizumab may also be used in combination with chemotherapy. Radiation can be given if surgery is not possible."
        },
        metformin: {
            q: "What is the recommended starting dose for Metformin in adults with type 2 diabetes?",
            c: "ADA Standards 2024: Metformin is the preferred initial pharmacologic agent for the treatment of type 2 diabetes. Start with 500 mg once or twice daily with meals to reduce GI side effects.",
            a: "The standard starting dose is 500 mg once or twice daily with meals."
        }
    };

    const loadSample = (key) => {
        const s = SAMPLES[key];
        if (s) {
            setQuery(s.q);
            setContext(s.c);
            setAnswer(s.a);
        }
    };

    // Metadata based on mode
    const modeConfig = {
        researcher: { title: 'Expert Model Auditing', sub: 'Hallucination Detection for Medical AI', time: '~18s on CPU' },
        patient: { title: 'Check AI Medical Advice', sub: 'Verify health advice against trusted medical literature', time: '~5s on Fast-Node' },
        governance: { title: 'System-wide Hallucination Audit', sub: 'Compliance-grade verification for clinical safe deployment', time: 'Scaling based on batch size' },
    };

    const currentMode = modeConfig[mode] || modeConfig.researcher;

    useEffect(() => {
        if (!embedded) window.scrollTo(0, 0);
    }, [view, embedded, evalTab]);

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
        }, 1500); 
    };

    const renderResearcherHeader = () => {
        if (mode !== 'researcher') return null;
        return (
            <div className="res-top-bar">
                <div className="res-brand-block">
                    <span className="res-brand-name">MediRAG-Eval</span>
                    <span className="res-mode-pill">Researcher mode</span>
                </div>
                <div className="res-tabs">
                    <button className={`res-tab-btn ${evalTab === 'single' ? 'active' : ''}`} onClick={() => setEvalTab('single')}>Single eval</button>
                    <button className={`res-tab-btn ${evalTab === 'batch' ? 'active' : ''}`} onClick={() => setEvalTab('batch')}>Batch eval</button>
                    <button className={`res-tab-btn ${evalTab === 'config' ? 'active' : ''}`} onClick={() => setEvalTab('config')}>Config</button>
                </div>
            </div>
        );
    };

    const evalContent = (
        <div className={`eval-container ${embedded ? 'embedded' : ''}`}>
            {renderResearcherHeader()}

            {view === 'form' && (
                <>
                    {evalTab === 'single' && (
                        <div className="eval-split">
                            {/* LEFT FORM */}
                            <div className="eval-form-col">
                                {mode === 'researcher' && (
                                    <div className="sample-row">
                                        <span className="sample-lbl">Load sample:</span>
                                        <button className={`sample-btn ${query.includes('NSCLC') ? 'active' : ''}`} onClick={() => loadSample('nsclc')}>NSCLC protocol</button>
                                        <button className={`sample-btn ${query.includes('Metformin') ? 'active' : ''}`} onClick={() => loadSample('metformin')}>Metformin dose</button>
                                        <button className="sample-btn">Drug interaction</button>
                                        <button className="sample-btn">Pediatric dosing</button>
                                    </div>
                                )}
                                
                                {mode !== 'researcher' && (
                                    <div className="eval-header-simple">
                                        <h1>{currentMode.title}</h1>
                                        <p>{currentMode.sub}</p>
                                    </div>
                                )}

                                <div className="form-group">
                                    <label className="form-label">USER QUERY</label>
                                    <textarea 
                                        className="form-textarea short" 
                                        placeholder="e.g., What are the standard treatment protocols for stage II non-small cell lung cancer?"
                                        value={query}
                                        onChange={(e) => setQuery(e.target.value)}
                                    ></textarea>
                                </div>

                                <div className="form-group">
                                    <div style={{display:'flex', justifyContent:'space-between', alignItems:'baseline'}}>
                                        <label className="form-label">RETRIEVED CONTEXT CHUNKS</label>
                                        <span className="chunk-count">3 CHUNKS</span>
                                    </div>
                                    <textarea 
                                        className="form-textarea tall" 
                                        placeholder="Paste the documents or context retrieved by your RAG pipeline..."
                                        value={context}
                                        onChange={(e) => setContext(e.target.value)}
                                    ></textarea>
                                    <span className="form-hint">Separate multiple chunks with a blank line — each chunk is scored independently</span>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">GENERATED ANSWER TO AUDIT</label>
                                    <textarea 
                                        className="form-textarea med" 
                                        placeholder="The AI's generated response to be audited..."
                                        value={answer}
                                        onChange={(e) => setAnswer(e.target.value)}
                                    ></textarea>
                                </div>

                                <div className="form-actions-row">
                                    <div className="btn-group-row">
                                        <button className="eval-btn-primary" onClick={handleEvaluate} disabled={isAnalyzing}>
                                            {isAnalyzing ? 'ANALYZING...' : 'Run evaluation'}
                                        </button>
                                        <button className="eval-btn-secondary" onClick={() => { setQuery(''); setContext(''); setAnswer(''); }}>Clear</button>
                                    </div>
                                    <span className="resp-time">{currentMode.time}</span>
                                </div>
                            </div>

                            {/* RIGHT ILLUSTRATION OR REALTIME */}
                            <div className={`realtime-panel-res ${isAnalyzing ? 'is-analyzing' : ''}`}>
                                {!isAnalyzing ? (
                                    <div className="empty-state-res">
                                        <div className="empty-icon-link">⚯</div>
                                        <p>Run an evaluation to see results</p>
                                    </div>
                                ) : (
                                    <div className="evaluating-state-res">
                                        <div className="telemetry-dot-res pulse"></div>
                                        <span>SCANNING PIPELINE...</span>
                                        {/* Simplified metrics for preview during scan */}
                                        <div style={{marginTop:'40px', width:'100%', opacity:0.5}}>
                                            <div className="res-mini-bar"></div>
                                            <div className="res-mini-bar" style={{width:'60%'}}></div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {evalTab === 'batch' && (
                        <div className="batch-view">
                            <div className="batch-header-box">
                                <p className="batch-desc">Evaluate multiple query-context-answer triples at once. Each row is an independent evaluation job.</p>
                                <button className="run-all-btn">Run all jobs</button>
                            </div>
                            <div className="batch-queue-box">
                                <div className="bq-label">Batch queue — 4 preloaded evaluation jobs</div>
                                {[
                                    'Stage II NSCLC treatment?',
                                    'Metformin starting dose?',
                                    'Warfarin + ibuprofen?',
                                    'Pediatric paracetamol dose?'
                                ].map((job, idx) => (
                                    <div key={idx} className="bq-row">
                                        <span className="bq-id">JOB-0{idx+1}</span>
                                        <span className="bq-title">{job}</span>
                                        <span className="bq-status">queued</span>
                                    </div>
                                ))}
                            </div>
                            <div className="results-placeholder">
                                <h3 className="section-title-small">Results</h3>
                            </div>
                        </div>
                    )}

                    {evalTab === 'config' && (
                        <div className="config-view">
                            <div className="config-grid">
                                <div className="config-col">
                                    <h3 className="config-title">Metric weights</h3>
                                    <p className="config-desc">Adjust how much each sub-metric contributes to the final HRS. Weights are normalised automatically.</p>
                                    
                                    <div className="weight-slider-group">
                                        {[
                                            { label: 'Faithfulness [NLI]', val: '40%' },
                                            { label: 'Entities [NER]', val: '20%' },
                                            { label: 'Sources [TIER]', val: '25%' },
                                            { label: 'Logic [NLI]', val: '15%' }
                                        ].map((w, idx) => (
                                            <div key={idx} className="weight-line">
                                                <span className="w-lbl">{w.label}</span>
                                                <div className="w-track">
                                                    <div className="w-thumb" style={{left: w.val}}></div>
                                                </div>
                                                <span className="w-val-num">{w.val}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <h3 className="config-title" style={{marginTop:'40px'}}>Risk thresholds</h3>
                                    <div className="threshold-inputs">
                                        <div className="t-box">
                                            <label className="t-lbl">HIGH RISK ABOVE</label>
                                            <input type="text" className="t-input-res" defaultValue="70" />
                                        </div>
                                        <div className="t-box">
                                            <label className="t-lbl">MEDIUM RISK ABOVE</label>
                                            <input type="text" className="t-input-res" defaultValue="40" />
                                        </div>
                                    </div>

                                    <h3 className="config-title" style={{marginTop:'40px'}}>Pipeline mode</h3>
                                    <div className="pipeline-checks-res">
                                        <label className="p-check-res"><input type="checkbox" defaultChecked /> Enable SciSpaCy NER entity check</label>
                                        <label className="p-check-res"><input type="checkbox" defaultChecked /> Enable source evidence tier scoring</label>
                                        <label className="p-check-res"><input type="checkbox" defaultChecked /> Enable logical contradiction detection</label>
                                        <label className="p-check-res"><input type="checkbox" /> Sentence-level claim decomposition (slower)</label>
                                    </div>
                                </div>

                                <div className="config-col">
                                    <h3 className="config-title">API integration</h3>
                                    <div className="api-panel-res">
                                        <div className="api-endpoint">POST /v1/evaluate</div>
                                        <div className="api-content-type">Content-Type: application/json</div>
                                        <pre className="code-pre-res">
{`{
  "query": "...",
  "context_chunks": ["..."],
  "generated_answer": "...",
  "weights": {
    "faithfulness": 0.4,
    "entities": 0.2,
    "sources": 0.25,
    "logic": 0.15
  }
}`}
                                        </pre>
                                        <div className="api-response-schema">
                                            <div className="schema-head">Response schema includes:</div>
                                            <ul className="schema-list">
                                                <li><span className="sc-dot"></span> <span className="sc-key">hrs_score</span> — 0-100 composite risk score</li>
                                                <li><span className="sc-dot"></span> <span className="sc-key">sub_scores</span> — faithfulness, entities, sources, logic</li>
                                                <li><span className="sc-dot"></span> <span className="sc-key">claim_annotations</span> — per-sentence verdict + source</li>
                                                <li><span className="sc-dot"></span> <span className="sc-key">trace_log</span> — clause-level audit trail</li>
                                                <li><span className="sc-dot"></span> <span className="sc-key">fix_suggestions</span> — array of rewrite recommendations</li>
                                            </ul>
                                        </div>
                                        <button className="guide-btn-res">Integration guide ↗</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </>
            )}

            {view === 'report' && (
                <div className="eval-report-view">
                    <div className="report-header">
                        <div className="rh-eyebrow">
                            SYSTEM REPORT // RAG-AUDIT-402 
                            <span className="rh-pill">AUDIT FAILED</span>
                            <button onClick={() => setView('form')} style={{marginLeft:'auto', background:'transparent', border:'1px solid var(--card-border)', color:'white', padding:'4px 12px', borderRadius:'4px', cursor:'pointer', fontSize:'11px'}}>
                                &larr; BACK
                            </button>
                        </div>
                        <h1 className="rh-title">Audit Report</h1>
                        <div className="rh-time">TIMESTAMP: 2026-05-14 14:22:01 UTC</div>

                        <div className="report-query-box">
                            <div className="rq-label">ACTIVE QUERY</div>
                            "{query || "What are the standard treatment protocols for stage II non-small cell lung cancer?"}"
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
                        {/* ... more cards ... */}
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
                        <div className="rep-panel">
                            <div className="rep-panel-header">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#00C896" strokeWidth="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
                                CLAUSE ANNOTATIONS TABLE
                            </div>
                            <table className="r-table">
                                <thead><tr><th>CLAIM</th><th>STATUS</th><th>EVIDENCE</th><th>SEVERITY</th></tr></thead>
                                <tbody>
                                    <tr><td>'Drug X is safe for Stage 3 patients'</td><td><span className="r-pill red">CONTRADICTED</span></td><td><a href="#" className="r-link">⚯ DrugBank DB00412</a></td><td><span className="r-pill red">CRITICAL</span></td></tr>
                                    <tr><td>'No documented renal interaction'</td><td><span className="r-pill red">CONTRADICTED</span></td><td><a href="#" className="r-link">⚯ NEJM Vol 382</a></td><td><span className="r-pill red">CRITICAL</span></td></tr>
                                    <tr><td>'Mechanism via CYP3A4 inhibition'</td><td><span className="r-pill green">VERIFIED</span></td><td><a href="#" className="r-link">⚯ NIH Clinical</a></td><td><span className="r-pill gray">LOW</span></td></tr>
                                </tbody>
                            </table>
                        </div>
                        <div className="rep-panel">
                            <div className="rep-panel-header">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#00C896" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><rect x="7" y="7" width="3" height="9"/><rect x="14" y="7" width="3" height="5"/></svg>
                                SOURCE CREDIBILITY
                            </div>
                            <div className="cred-card">
                                <div><div className="cred-title">PubMed RCT 2023</div><div className="cred-sub">PEER REVIEWED &middot; n=4,500</div></div>
                                <div className="r-pill green">TIER 1</div>
                            </div>
                            <div className="cred-card">
                                <div><div className="cred-title">WHO Clinical Guideline</div><div className="cred-sub">GLOBAL STANDARD &middot; 2024</div></div>
                                <div className="r-pill green">TIER 2</div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );

    if (embedded) return evalContent;

    return (
        <div className="eval-page">
            {evalContent}
        </div>
    );
};

export default Evaluate;
