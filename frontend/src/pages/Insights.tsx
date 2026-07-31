import { useState } from 'react';
import {
  TrendingUp, BarChart2, RefreshCw, Target, Globe,
  Zap, ArrowUpRight, CheckCircle, AlertTriangle,
} from 'lucide-react';
import { generateCompetitorData, getMarketTrends } from '../utils/aiEngine';
import type { CompetitorData, MarketTrend } from '../types';

const INDUSTRIES = [
  'Saree Shop', 'Electronics Store', 'Restaurant', 'Salon & Beauty',
  'Medical / Clinic', 'Coaching Institute', 'Jewellery Shop', 'General Store',
];

export default function Insights() {
  const [industry, setIndustry]         = useState('');
  const [city, setCity]                 = useState('');
  const [competitors, setCompetitors]   = useState<CompetitorData[]>([]);
  const [trends]                        = useState<MarketTrend[]>(getMarketTrends());
  const [loading, setLoading]           = useState(false);
  const [analysed, setAnalysed]         = useState(false);
  const [activeTab, setActiveTab]       = useState<'competitors' | 'trends'>('competitors');
  const [filter, setFilter]             = useState<'all' | 'high' | 'medium' | 'low'>('all');

  const runAnalysis = () => {
    if (!industry || !city.trim()) return;
    setLoading(true);
    setTimeout(() => {
      setCompetitors(generateCompetitorData(industry, city));
      setAnalysed(true);
      setLoading(false);
    }, 2200);
  };

  const filteredTrends = trends.filter(t => filter === 'all' || t.impact === filter);

  const impactColor = { high: 'var(--danger)', medium: 'var(--accent)', low: 'var(--success)' } as const;
  const impactBadge = { high: 'badge-red', medium: 'badge-amber', low: 'badge-green' } as const;

  return (
    <main style={{ paddingTop: '5rem' }}>
      {/* ── Header ── */}
      <section className="insights-hero">
        <div className="insights-hero__glow" />
        <div className="container" style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <div className="badge badge-purple" style={{ display: 'inline-flex', marginBottom: '1rem' }}>
            <Zap size={13} /> AI Market Intelligence
          </div>
          <h1 className="section-title">
            Stay Ahead of Your <span className="gradient-text">Competition</span>
          </h1>
          <p className="section-subtitle">
            AI-powered competitor analysis and real-time market trends to keep your business growing continuously.
          </p>
        </div>
      </section>

      <div className="container" style={{ paddingBottom: '5rem' }}>

        {/* ── Analysis Input ── */}
        <div className="analysis-panel animate-fade-up">
          <h3 className="analysis-panel__title">
            <BarChart2 size={20} color="var(--primary-light)" />
            Run Competitor Analysis
          </h3>
          <div className="analysis-panel__inputs">
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">Industry / Business Type</label>
              <select
                className="form-select"
                value={industry}
                onChange={e => setIndustry(e.target.value)}
              >
                <option value="">Select industry...</option>
                {INDUSTRIES.map(i => <option key={i} value={i}>{i}</option>)}
              </select>
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">Your City</label>
              <input
                className="form-input"
                placeholder="e.g. Mumbai"
                value={city}
                onChange={e => setCity(e.target.value)}
              />
            </div>
            <button
              className="btn btn-primary"
              onClick={runAnalysis}
              disabled={loading || !industry || !city.trim()}
              style={{ alignSelf: 'flex-end', minWidth: 160, justifyContent: 'center' }}
            >
              {loading
                ? <><RefreshCw size={16} className="spin-icon" /> Analysing...</>
                : <><Target size={16} /> Analyse</>}
            </button>
          </div>
        </div>

        {/* ── Tabs ── */}
        <div className="insights-tabs">
          <button
            className={`insights-tab ${activeTab === 'competitors' ? 'insights-tab--active' : ''}`}
            onClick={() => setActiveTab('competitors')}
          >
            <BarChart2 size={16} /> Competitor Analysis
          </button>
          <button
            className={`insights-tab ${activeTab === 'trends' ? 'insights-tab--active' : ''}`}
            onClick={() => setActiveTab('trends')}
          >
            <TrendingUp size={16} /> Market Trends
          </button>
        </div>

        {/* ── Competitors Tab ── */}
        {activeTab === 'competitors' && (
          <div>
            {!analysed && !loading && (
              <div className="empty-state">
                <BarChart2 size={48} color="var(--gray-600)" />
                <h4>No Analysis Yet</h4>
                <p>Select your industry and city above, then click "Analyse" to see who you're competing against.</p>
              </div>
            )}

            {loading && (
              <div className="loading-state animate-fade">
                <div className="loading-state__spinner">
                  <div className="spinner-ring" />
                  <BarChart2 size={24} color="var(--primary-light)" />
                </div>
                <h3>Scanning Competitors in {city}...</h3>
                <p>Analysing online presence, reviews, and digital strategies.</p>
              </div>
            )}

            {analysed && !loading && (
              <div className="competitors-grid animate-fade-up">
                {competitors.map((comp, i) => (
                  <div key={i} className="competitor-card">
                    <div className="competitor-card__header">
                      <div className="competitor-card__icon">
                        <Globe size={18} />
                      </div>
                      <div>
                        <h4>{comp.name}</h4>
                        <p>{comp.website}</p>
                      </div>
                      <div className="competitor-card__score">
                        <div
                          className="score-circle"
                          style={{
                            background: `conic-gradient(
                              ${comp.score >= 70 ? 'var(--danger)' : comp.score >= 50 ? 'var(--accent)' : 'var(--success)'}
                              ${comp.score * 3.6}deg, rgba(255,255,255,0.08) 0deg)`,
                          }}
                        >
                          <span>{comp.score}</span>
                        </div>
                        <p>Threat Score</p>
                      </div>
                    </div>

                    <div className="competitor-card__body">
                      <div>
                        <h5 className="comp-label comp-label--strength">
                          <CheckCircle size={13} /> Strengths
                        </h5>
                        <ul className="comp-list">
                          {comp.strengths.map((s, j) => <li key={j}>{s}</li>)}
                        </ul>
                      </div>
                      <div>
                        <h5 className="comp-label comp-label--weak">
                          <AlertTriangle size={13} /> Weaknesses (Your Opportunity)
                        </h5>
                        <ul className="comp-list comp-list--weak">
                          {comp.weaknesses.map((w, j) => <li key={j}>{w}</li>)}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}

                <div className="insights-callout">
                  <Zap size={20} color="var(--accent)" />
                  <div>
                    <strong>AI Recommendation</strong>
                    <p>
                      Based on competitor weaknesses, focus on <em>fast mobile website performance</em>,
                      <em> WhatsApp customer support</em>, and <em>high-quality product photos</em> — these are
                      gaps your competitors aren't filling.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── Trends Tab ── */}
        {activeTab === 'trends' && (
          <div>
            <div className="trends-filter">
              <span style={{ fontSize: '0.85rem', color: 'var(--gray-400)', marginRight: '0.5rem' }}>Filter by impact:</span>
              {(['all', 'high', 'medium', 'low'] as const).map(f => (
                <button
                  key={f}
                  className={`filter-btn ${filter === f ? 'filter-btn--active' : ''}`}
                  onClick={() => setFilter(f)}
                >
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>

            <div className="trends-grid animate-fade-up">
              {filteredTrends.map(trend => (
                <div key={trend.id} className="trend-card">
                  <div className="trend-card__top">
                    <span className="badge badge-purple" style={{ fontSize: '0.72rem' }}>{trend.category}</span>
                    <span className={`badge ${impactBadge[trend.impact]}`} style={{ fontSize: '0.72rem' }}>
                      {trend.impact} impact
                    </span>
                  </div>
                  <h4 className="trend-card__title">{trend.title}</h4>
                  <p className="trend-card__desc">{trend.description}</p>
                  <div className="trend-card__rec">
                    <ArrowUpRight size={14} color="var(--success)" style={{ flexShrink: 0, marginTop: 2 }} />
                    <span>{trend.recommendation}</span>
                  </div>
                  <div
                    className="trend-card__bar"
                    style={{ '--fill': trend.impact === 'high' ? '85%' : trend.impact === 'medium' ? '60%' : '35%' } as React.CSSProperties}
                  >
                    <div className="progress-bar" style={{ marginTop: '0.75rem' }}>
                      <div
                        className="progress-fill"
                        style={{
                          width: trend.impact === 'high' ? '85%' : trend.impact === 'medium' ? '60%' : '35%',
                          background: `linear-gradient(90deg, ${impactColor[trend.impact]}, ${impactColor[trend.impact]}88)`,
                        }}
                      />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--gray-500)', marginTop: '0.25rem' }}>
                      <span>Relevance</span>
                      <span style={{ color: impactColor[trend.impact] }}>
                        {trend.impact === 'high' ? 'Very High' : trend.impact === 'medium' ? 'Moderate' : 'Low'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Continuous Improvement Banner ── */}
        <div className="improvement-banner">
          <div className="improvement-banner__icon animate-float">
            <RefreshCw size={32} color="var(--primary-light)" />
          </div>
          <div>
            <h3>Continuous Improvement Engine</h3>
            <p>
              Our AI monitors market trends, competitor moves, and Google algorithm updates weekly.
              JhaTech clients receive monthly reports with new feature recommendations for their websites
              and marketing strategies — ensuring you're always one step ahead.
            </p>
          </div>
          <a
            href="https://wa.me/919999999999?text=I+want+to+learn+more+about+continuous+improvement+and+AI+insights."
            target="_blank" rel="noopener noreferrer"
            className="btn btn-primary"
            style={{ whiteSpace: 'nowrap', flexShrink: 0 }}
          >
            Learn More <ArrowUpRight size={16} />
          </a>
        </div>
      </div>

      <style>{`
        .insights-hero {
          padding: 5rem 0 3rem;
          position: relative; overflow: hidden;
        }
        .insights-hero__glow {
          position: absolute; inset: 0;
          background: radial-gradient(ellipse at 50% 0%, rgba(59,130,246,0.12) 0%, transparent 65%);
          pointer-events: none;
        }
        .analysis-panel {
          background: var(--dark-card);
          border: 1px solid var(--dark-border);
          border-radius: var(--radius-xl);
          padding: 2rem;
          margin-bottom: 2rem;
        }
        .analysis-panel__title {
          display: flex; align-items: center; gap: 0.6rem;
          font-size: 1.05rem; font-weight: 700; margin-bottom: 1.5rem;
        }
        .analysis-panel__inputs {
          display: flex; gap: 1rem; align-items: flex-end; flex-wrap: wrap;
        }
        .analysis-panel__inputs .form-group { min-width: 200px; }
        .spin-icon { animation: spin-slow 1s linear infinite; }

        .insights-tabs {
          display: flex; gap: 0.5rem; margin-bottom: 2rem;
          border-bottom: 1px solid var(--dark-border);
          padding-bottom: 0;
        }
        .insights-tab {
          display: flex; align-items: center; gap: 0.5rem;
          padding: 0.75rem 1.25rem;
          font-size: 0.9rem; font-weight: 600;
          color: var(--gray-400);
          border-bottom: 2px solid transparent;
          transition: var(--transition);
          margin-bottom: -1px;
        }
        .insights-tab:hover { color: var(--white); }
        .insights-tab--active {
          color: var(--primary-light);
          border-bottom-color: var(--primary-light);
        }

        .empty-state {
          text-align: center; padding: 5rem 2rem;
          display: flex; flex-direction: column; align-items: center; gap: 1rem;
          color: var(--gray-400);
        }
        .empty-state h4 { font-size: 1.2rem; color: var(--gray-300); }
        .empty-state p { font-size: 0.875rem; max-width: 400px; }

        .loading-state {
          text-align: center; padding: 5rem 2rem;
          display: flex; flex-direction: column; align-items: center; gap: 1.5rem;
        }
        .loading-state__spinner {
          width: 70px; height: 70px;
          position: relative; display: flex; align-items: center; justify-content: center;
        }
        .spinner-ring {
          position: absolute; inset: 0; border-radius: 50%;
          border: 3px solid rgba(108,60,225,0.2);
          border-top-color: var(--primary-light);
          animation: spin-slow 1s linear infinite;
        }
        .loading-state h3 { font-size: 1.3rem; }
        .loading-state p { color: var(--gray-400); }

        .competitors-grid { display: flex; flex-direction: column; gap: 1.5rem; }
        .competitor-card {
          background: var(--dark-card);
          border: 1px solid var(--dark-border);
          border-radius: var(--radius-xl);
          padding: 2rem;
          transition: var(--transition);
        }
        .competitor-card:hover { border-color: var(--primary); transform: translateY(-2px); }
        .competitor-card__header {
          display: flex; align-items: flex-start; gap: 1rem;
          margin-bottom: 1.5rem; flex-wrap: wrap;
        }
        .competitor-card__icon {
          width: 42px; height: 42px; border-radius: var(--radius-md);
          background: rgba(108,60,225,0.15); display: flex; align-items: center; justify-content: center;
          color: var(--primary-light); flex-shrink: 0;
        }
        .competitor-card__header h4 { font-size: 1rem; font-weight: 700; }
        .competitor-card__header p { font-size: 0.82rem; color: var(--gray-400); margin: 0; }
        .competitor-card__score { margin-left: auto; text-align: center; }
        .score-circle {
          width: 54px; height: 54px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 0.3rem;
        }
        .score-circle span {
          font-size: 0.95rem; font-weight: 800;
          background: var(--dark-card);
          width: 42px; height: 42px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
        }
        .competitor-card__score p { font-size: 0.7rem; color: var(--gray-400); }
        .competitor-card__body {
          display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem;
        }
        .comp-label {
          display: flex; align-items: center; gap: 0.35rem;
          font-size: 0.8rem; font-weight: 700; text-transform: uppercase;
          letter-spacing: 0.05em; margin-bottom: 0.65rem;
        }
        .comp-label--strength { color: var(--success); }
        .comp-label--weak { color: var(--accent); }
        .comp-list { list-style: none; display: flex; flex-direction: column; gap: 0.4rem; }
        .comp-list li { font-size: 0.875rem; color: var(--gray-300); padding-left: 1rem; position: relative; }
        .comp-list li::before { content: '•'; position: absolute; left: 0; color: var(--success); }
        .comp-list--weak li::before { color: var(--accent); }

        .insights-callout {
          display: flex; align-items: flex-start; gap: 1rem;
          background: rgba(245,158,11,0.07);
          border: 1px solid rgba(245,158,11,0.2);
          border-radius: var(--radius-lg); padding: 1.5rem;
        }
        .insights-callout strong { display: block; margin-bottom: 0.35rem; }
        .insights-callout p { font-size: 0.875rem; color: var(--gray-300); margin: 0; line-height: 1.6; }
        .insights-callout em { color: var(--accent); font-style: normal; font-weight: 600; }

        /* Trends */
        .trends-filter {
          display: flex; align-items: center; gap: 0.5rem;
          margin-bottom: 1.5rem; flex-wrap: wrap;
        }
        .filter-btn {
          padding: 0.35rem 0.9rem;
          border-radius: var(--radius-full);
          background: rgba(255,255,255,0.05);
          border: 1.5px solid rgba(255,255,255,0.1);
          color: var(--gray-300);
          font-size: 0.82rem; font-weight: 500;
          transition: var(--transition);
        }
        .filter-btn:hover { border-color: var(--primary-light); }
        .filter-btn--active { background: rgba(108,60,225,0.2); border-color: var(--primary-light); color: var(--primary-light); }

        .trends-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.25rem; }
        .trend-card {
          background: var(--dark-card);
          border: 1px solid var(--dark-border);
          border-radius: var(--radius-lg);
          padding: 1.5rem;
          display: flex; flex-direction: column; gap: 0.85rem;
          transition: var(--transition);
        }
        .trend-card:hover { transform: translateY(-3px); border-color: var(--primary); }
        .trend-card__top { display: flex; gap: 0.5rem; flex-wrap: wrap; }
        .trend-card__title { font-size: 1rem; font-weight: 700; line-height: 1.3; }
        .trend-card__desc { font-size: 0.85rem; color: var(--gray-400); line-height: 1.6; flex: 1; }
        .trend-card__rec {
          display: flex; align-items: flex-start; gap: 0.4rem;
          font-size: 0.82rem; color: var(--gray-200);
          background: rgba(16,185,129,0.07);
          border: 1px solid rgba(16,185,129,0.15);
          border-radius: var(--radius-md); padding: 0.65rem 0.8rem;
          line-height: 1.5;
        }

        /* Improvement Banner */
        .improvement-banner {
          display: flex; align-items: center; gap: 1.5rem;
          background: linear-gradient(135deg, rgba(108,60,225,0.15), rgba(139,92,246,0.05));
          border: 1px solid var(--dark-border);
          border-radius: var(--radius-xl);
          padding: 2rem 2.5rem;
          margin-top: 3rem;
          flex-wrap: wrap;
        }
        .improvement-banner__icon { flex-shrink: 0; }
        .improvement-banner h3 { font-size: 1.2rem; font-weight: 800; margin-bottom: 0.4rem; }
        .improvement-banner p { font-size: 0.875rem; color: var(--gray-400); margin: 0; line-height: 1.7; flex: 1; }

        @media (max-width: 900px) {
          .trends-grid { grid-template-columns: repeat(2, 1fr); }
          .competitor-card__body { grid-template-columns: 1fr; }
        }
        @media (max-width: 560px) {
          .trends-grid { grid-template-columns: 1fr; }
          .analysis-panel__inputs { flex-direction: column; }
          .analysis-panel__inputs .form-group { min-width: unset; width: 100%; }
          .improvement-banner { flex-direction: column; text-align: center; }
        }
      `}</style>
    </main>
  );
}
