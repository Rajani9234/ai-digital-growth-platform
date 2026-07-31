import { useState } from 'react';
import {
  Brain, ArrowRight, CheckCircle, AlertTriangle, AlertCircle,
  TrendingUp, Clock, Target, FileText, RotateCcw, MessageCircle,
} from 'lucide-react';
import type { PainPointFormData, AIReport } from '../types';
import { submitPainAnalysis } from '../utils/api';

const CHALLENGES = [
  { id: 'no-website',        label: 'No website / online presence' },
  { id: 'low-sales',         label: 'Low sales & footfall' },
  { id: 'competition',       label: 'Losing customers to competitors' },
  { id: 'no-social',         label: 'No social media presence' },
  { id: 'inventory',         label: 'Inventory management issues' },
  { id: 'customer-retention',label: 'Poor customer retention' },
  { id: 'payment',           label: 'Limited payment options' },
];

const INITIAL: PainPointFormData = {
  businessName: '',
  businessType: '',
  city: '',
  monthlyRevenue: '',
  currentChallenges: [],
  onlinePresence: 'none',
  targetAudience: '',
  budget: '',
  additionalInfo: '',
};

const severityColor = { high: 'var(--danger)', medium: 'var(--accent)', low: 'var(--success)' } as const;
const severityIcon = {
  high:   <AlertTriangle size={16} />,
  medium: <AlertCircle size={16} />,
  low:    <CheckCircle size={16} />,
};

export default function PainAnalysis() {
  const [step, setStep]     = useState<'form' | 'loading' | 'report'>('form');
  const [form, setForm]     = useState<PainPointFormData>(INITIAL);
  const [report, setReport] = useState<AIReport | null>(null);
  const [errors, setErrors] = useState<Partial<Record<keyof PainPointFormData, string>>>({});

  /* ── helpers ── */
  const update = (field: keyof PainPointFormData, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const toggleChallenge = (id: string) =>
    setForm(prev => ({
      ...prev,
      currentChallenges: prev.currentChallenges.includes(id)
        ? prev.currentChallenges.filter(c => c !== id)
        : [...prev.currentChallenges, id],
    }));

  const validate = () => {
    const e: typeof errors = {};
    if (!form.businessName.trim()) e.businessName = 'Business name is required';
    if (!form.businessType.trim()) e.businessType = 'Business type is required';
    if (!form.city.trim())         e.city         = 'City is required';
    if (!form.budget)              e.budget       = 'Please select a budget range';
    if (form.currentChallenges.length === 0)
      e.currentChallenges = 'Select at least one challenge' as any;
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setStep('loading');
    try {
      const res = await submitPainAnalysis({
        business_name:      form.businessName,
        business_type:      form.businessType,
        city:               form.city,
        monthly_revenue:    form.monthlyRevenue,
        current_challenges: form.currentChallenges,
        online_presence:    form.onlinePresence,
        target_audience:    form.targetAudience,
        budget:             form.budget,
        additional_info:    form.additionalInfo,
      });

      // Map PHP API response to AIReport shape used by the UI
      const r = res.report;
      setReport({
        businessName:    form.businessName,
        summary:         r.summary,
        challenges:      r.challenges,
        recommendations: r.recommendations.map(rec => ({
          priority:        rec.priority,
          title:           rec.title,
          description:     rec.description,
          estimatedImpact: rec.estimated_impact,
        })),
        digitalScore:    r.digital_score,
        actionPlan:      r.action_plan.map(p => ({
          phase:    p.phase,
          timeline: p.timeline,
          tasks:    p.tasks,
        })),
      });
      setStep('report');
    } catch (err) {
      // If backend unreachable fall back to local engine
      const { generateBusinessReport } = await import('../utils/aiEngine');
      setReport(generateBusinessReport(form));
      setStep('report');
    }
  };

  const reset = () => { setForm(INITIAL); setReport(null); setStep('form'); };

  /* ── Score ring ── */
  const ScoreRing = ({ score }: { score: number }) => {
    const r = 52, circ = 2 * Math.PI * r;
    const dash = (score / 100) * circ;
    const color = score >= 60 ? 'var(--success)' : score >= 35 ? 'var(--accent)' : 'var(--danger)';
    return (
      <svg width="130" height="130" viewBox="0 0 130 130">
        <circle cx="65" cy="65" r={r} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="10" />
        <circle
          cx="65" cy="65" r={r} fill="none"
          stroke={color} strokeWidth="10"
          strokeDasharray={`${dash} ${circ}`}
          strokeLinecap="round"
          transform="rotate(-90 65 65)"
          style={{ transition: 'stroke-dasharray 1.2s ease' }}
        />
        <text x="65" y="60" textAnchor="middle" fill="white" fontSize="22" fontWeight="800" fontFamily="Poppins">{score}</text>
        <text x="65" y="78" textAnchor="middle" fill="var(--gray-400)" fontSize="11">/100</text>
      </svg>
    );
  };

  return (
    <main style={{ paddingTop: '5rem' }}>
      {/* ── Header ── */}
      <section className="pain-hero">
        <div className="container" style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <div className="badge badge-purple" style={{ display: 'inline-flex', marginBottom: '1rem' }}>
            <Brain size={13} /> AI Business Analyser
          </div>
          <h1 className="section-title">
            Discover Your Business <span className="gradient-text">Growth Gaps</span>
          </h1>
          <p className="section-subtitle">
            Fill in your business details and our AI will generate a personalised report with actionable
            recommendations — completely free.
          </p>
        </div>
        <div className="pain-hero__glow" />
      </section>

      <div className="container" style={{ maxWidth: 800, paddingBottom: '5rem' }}>

        {/* ── FORM ── */}
        {step === 'form' && (
          <form onSubmit={handleSubmit} className="pain-form animate-fade-up">
            <div className="pain-form__section">
              <h3 className="pain-form__section-title">Business Information</h3>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Business Name *</label>
                  <input
                    className="form-input"
                    placeholder="e.g. Priya Sarees"
                    value={form.businessName}
                    onChange={e => update('businessName', e.target.value)}
                  />
                  {errors.businessName && <span className="form-error">{errors.businessName}</span>}
                </div>
                <div className="form-group">
                  <label className="form-label">Business Type *</label>
                  <input
                    className="form-input"
                    placeholder="e.g. Saree Shop, Electronics"
                    value={form.businessType}
                    onChange={e => update('businessType', e.target.value)}
                  />
                  {errors.businessType && <span className="form-error">{errors.businessType}</span>}
                </div>
                <div className="form-group">
                  <label className="form-label">City *</label>
                  <input
                    className="form-input"
                    placeholder="e.g. Mumbai, Surat"
                    value={form.city}
                    onChange={e => update('city', e.target.value)}
                  />
                  {errors.city && <span className="form-error">{errors.city}</span>}
                </div>
                <div className="form-group">
                  <label className="form-label">Monthly Revenue</label>
                  <select className="form-select" value={form.monthlyRevenue} onChange={e => update('monthlyRevenue', e.target.value)}>
                    <option value="">Select range</option>
                    <option value="below-1L">Below ₹1 Lakh</option>
                    <option value="1L-5L">₹1L – ₹5L</option>
                    <option value="5L-20L">₹5L – ₹20L</option>
                    <option value="20L+">₹20L+</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="pain-form__section">
              <h3 className="pain-form__section-title">Online Presence</h3>
              <div className="form-group">
                <label className="form-label">Current Online Presence</label>
                <div className="presence-options">
                  {[
                    { value: 'none',    label: 'None' },
                    { value: 'social',  label: 'Social Media Only' },
                    { value: 'website', label: 'Website Only' },
                    { value: 'both',    label: 'Website + Social' },
                  ].map(opt => (
                    <button
                      key={opt.value}
                      type="button"
                      className={`presence-btn ${form.onlinePresence === opt.value ? 'presence-btn--active' : ''}`}
                      onClick={() => update('onlinePresence', opt.value)}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pain-form__section">
              <h3 className="pain-form__section-title">Current Challenges *</h3>
              <div className="challenges-grid">
                {CHALLENGES.map(c => (
                  <button
                    key={c.id}
                    type="button"
                    className={`challenge-chip ${form.currentChallenges.includes(c.id) ? 'challenge-chip--active' : ''}`}
                    onClick={() => toggleChallenge(c.id)}
                  >
                    {form.currentChallenges.includes(c.id) && <CheckCircle size={14} />}
                    {c.label}
                  </button>
                ))}
              </div>
              {errors.currentChallenges && (
                <span className="form-error">{errors.currentChallenges as string}</span>
              )}
            </div>

            <div className="pain-form__section">
              <h3 className="pain-form__section-title">More Details</h3>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Target Audience</label>
                  <input
                    className="form-input"
                    placeholder="e.g. Women aged 25–50"
                    value={form.targetAudience}
                    onChange={e => update('targetAudience', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Monthly Marketing Budget *</label>
                  <select className="form-select" value={form.budget} onChange={e => update('budget', e.target.value)}>
                    <option value="">Select budget</option>
                    <option value="below-5k">Below ₹5,000</option>
                    <option value="5k-10k">₹5,000 – ₹10,000</option>
                    <option value="10k-25k">₹10,000 – ₹25,000</option>
                    <option value="25k+">₹25,000+</option>
                  </select>
                  {errors.budget && <span className="form-error">{errors.budget}</span>}
                </div>
              </div>
              <div className="form-group" style={{ marginTop: '1rem' }}>
                <label className="form-label">Additional Information</label>
                <textarea
                  className="form-textarea"
                  placeholder="Anything else you'd like us to know about your business or goals..."
                  value={form.additionalInfo}
                  onChange={e => update('additionalInfo', e.target.value)}
                  rows={4}
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', justifyContent: 'center' }}>
              <Brain size={20} /> Generate My AI Report <ArrowRight size={18} />
            </button>
          </form>
        )}

        {/* ── LOADING ── */}
        {step === 'loading' && (
          <div className="loading-state animate-fade">
            <div className="loading-state__spinner">
              <div className="spinner-ring" />
              <Brain size={28} color="var(--primary-light)" />
            </div>
            <h3>AI is Analysing Your Business...</h3>
            <p>Scanning market data, competitor insights, and growth opportunities.</p>
            <div className="loading-state__steps">
              {['Analysing business profile', 'Identifying key pain points', 'Researching local competitors', 'Generating recommendations'].map((s, i) => (
                <div key={s} className="loading-step" style={{ animationDelay: `${i * 0.6}s` }}>
                  <div className="loading-step__dot" />
                  <span>{s}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── REPORT ── */}
        {step === 'report' && report && (
          <div className="report animate-fade-up">
            <div className="report__header">
              <div>
                <div className="badge badge-green" style={{ marginBottom: '0.75rem' }}>
                  <CheckCircle size={13} /> AI Report Generated
                </div>
                <h2>{report.businessName}</h2>
                <p style={{ color: 'var(--gray-400)', marginTop: '0.5rem' }}>{report.summary}</p>
              </div>
              <div className="report__score-wrap">
                <ScoreRing score={report.digitalScore} />
                <p className="report__score-label">Digital Readiness Score</p>
              </div>
            </div>

            {/* Challenges */}
            <div className="report__section">
              <h3 className="report__section-title">
                <AlertTriangle size={18} color="var(--danger)" /> Key Challenges Identified
              </h3>
              <div className="challenges-list">
                {report.challenges.map((c, i) => (
                  <div key={i} className="challenge-item" style={{ borderLeft: `3px solid ${severityColor[c.severity]}` }}>
                    <div className="challenge-item__header">
                      <span style={{ color: severityColor[c.severity] }}>{severityIcon[c.severity]}</span>
                      <strong>{c.title}</strong>
                      <span className={`badge badge-${c.severity === 'high' ? 'red' : c.severity === 'medium' ? 'amber' : 'green'}`}>
                        {c.severity} priority
                      </span>
                    </div>
                    <p>{c.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommendations */}
            <div className="report__section">
              <h3 className="report__section-title">
                <Target size={18} color="var(--primary-light)" /> Personalised Recommendations
              </h3>
              <div className="recs-list">
                {report.recommendations.map((r, i) => (
                  <div key={i} className="rec-item">
                    <div className="rec-item__num">{r.priority}</div>
                    <div>
                      <strong>{r.title}</strong>
                      <p>{r.description}</p>
                      <span className="rec-item__impact">
                        <TrendingUp size={13} /> {r.estimatedImpact}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Plan */}
            <div className="report__section">
              <h3 className="report__section-title">
                <Clock size={18} color="var(--accent)" /> 90-Day Action Plan
              </h3>
              <div className="action-plan">
                {report.actionPlan.map((phase, i) => (
                  <div key={i} className="phase-card">
                    <div className="phase-card__header">
                      <span className="phase-card__num">{i + 1}</span>
                      <div>
                        <strong>{phase.phase}</strong>
                        <span className="badge badge-purple" style={{ marginLeft: '0.75rem' }}>
                          <Clock size={11} /> {phase.timeline}
                        </span>
                      </div>
                    </div>
                    <ul className="phase-card__tasks">
                      {phase.tasks.map((t, j) => (
                        <li key={j}><CheckCircle size={14} color="var(--success)" /> {t}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="report__cta">
              <div>
                <h4>Ready to Implement This Plan?</h4>
                <p>Talk to our experts and start growing your business today.</p>
              </div>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <a
                  href={`https://wa.me/919999999999?text=Hi!+I+just+got+my+AI+report+for+${encodeURIComponent(report.businessName)}+and+want+to+discuss+the+recommendations.`}
                  target="_blank" rel="noopener noreferrer"
                  className="btn btn-whatsapp"
                >
                  <MessageCircle size={16} /> Discuss on WhatsApp
                </a>
                <button className="btn btn-secondary" onClick={reset}>
                  <RotateCcw size={16} /> New Analysis
                </button>
                <button className="btn btn-secondary" onClick={() => window.print()}>
                  <FileText size={16} /> Download Report
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .pain-hero {
          padding: 5rem 0 3rem;
          position: relative;
          overflow: hidden;
        }
        .pain-hero__glow {
          position: absolute; inset: 0;
          background: radial-gradient(ellipse at 50% 0%, rgba(108,60,225,0.18) 0%, transparent 65%);
          pointer-events: none;
        }
        .pain-form {
          background: var(--dark-card);
          border: 1px solid var(--dark-border);
          border-radius: var(--radius-xl);
          padding: 2.5rem;
          display: flex;
          flex-direction: column;
          gap: 2.25rem;
        }
        .pain-form__section { display: flex; flex-direction: column; gap: 1.25rem; }
        .pain-form__section-title {
          font-size: 1rem; font-weight: 700;
          color: var(--gray-200);
          padding-bottom: 0.75rem;
          border-bottom: 1px solid var(--dark-border);
        }
        .form-error { font-size: 0.8rem; color: var(--danger); }

        .presence-options { display: flex; gap: 0.75rem; flex-wrap: wrap; }
        .presence-btn {
          padding: 0.55rem 1.2rem;
          border-radius: var(--radius-full);
          background: rgba(255,255,255,0.05);
          border: 1.5px solid rgba(255,255,255,0.1);
          color: var(--gray-300);
          font-size: 0.875rem; font-weight: 500;
          transition: var(--transition);
        }
        .presence-btn:hover { border-color: var(--primary-light); color: var(--white); }
        .presence-btn--active {
          background: rgba(108,60,225,0.2);
          border-color: var(--primary-light);
          color: var(--primary-light);
        }
        .challenges-grid { display: flex; flex-wrap: wrap; gap: 0.65rem; }
        .challenge-chip {
          display: inline-flex; align-items: center; gap: 0.4rem;
          padding: 0.55rem 1.1rem;
          border-radius: var(--radius-full);
          background: rgba(255,255,255,0.05);
          border: 1.5px solid rgba(255,255,255,0.1);
          color: var(--gray-300);
          font-size: 0.85rem; font-weight: 500;
          transition: var(--transition);
        }
        .challenge-chip:hover { border-color: var(--primary-light); }
        .challenge-chip--active {
          background: rgba(108,60,225,0.2);
          border-color: var(--primary);
          color: var(--primary-light);
        }

        /* Loading */
        .loading-state {
          text-align: center;
          padding: 5rem 2rem;
          display: flex; flex-direction: column; align-items: center; gap: 1.5rem;
        }
        .loading-state__spinner {
          width: 80px; height: 80px;
          position: relative;
          display: flex; align-items: center; justify-content: center;
        }
        .spinner-ring {
          position: absolute; inset: 0;
          border-radius: 50%;
          border: 3px solid rgba(108,60,225,0.2);
          border-top-color: var(--primary-light);
          animation: spin-slow 1s linear infinite;
        }
        .loading-state h3 { font-size: 1.4rem; }
        .loading-state p { color: var(--gray-400); }
        .loading-state__steps { display: flex; flex-direction: column; gap: 0.85rem; width: 100%; max-width: 320px; }
        .loading-step {
          display: flex; align-items: center; gap: 0.75rem;
          font-size: 0.875rem; color: var(--gray-400);
          animation: fadeInUp 0.5s ease forwards;
          opacity: 0;
        }
        .loading-step__dot {
          width: 8px; height: 8px; border-radius: 50%;
          background: var(--primary-light);
          animation: pulse-glow 1.5s ease-in-out infinite;
          flex-shrink: 0;
        }

        /* Report */
        .report { display: flex; flex-direction: column; gap: 2rem; }
        .report__header {
          display: flex; justify-content: space-between; align-items: flex-start; gap: 2rem;
          background: var(--dark-card); border: 1px solid var(--dark-border);
          border-radius: var(--radius-xl); padding: 2.5rem;
        }
        .report__header h2 { font-size: 1.7rem; font-weight: 800; }
        .report__score-wrap { text-align: center; flex-shrink: 0; }
        .report__score-label { font-size: 0.75rem; color: var(--gray-400); margin-top: 0.4rem; }
        .report__section {
          background: var(--dark-card); border: 1px solid var(--dark-border);
          border-radius: var(--radius-lg); padding: 2rem;
        }
        .report__section-title {
          display: flex; align-items: center; gap: 0.6rem;
          font-size: 1.05rem; font-weight: 700; margin-bottom: 1.5rem;
        }
        .challenges-list { display: flex; flex-direction: column; gap: 1rem; }
        .challenge-item {
          padding: 1.1rem 1.25rem;
          background: rgba(255,255,255,0.03);
          border-radius: var(--radius-md);
          border-left-width: 3px;
        }
        .challenge-item__header {
          display: flex; align-items: center; gap: 0.65rem; margin-bottom: 0.4rem; flex-wrap: wrap;
        }
        .challenge-item p { font-size: 0.875rem; color: var(--gray-400); margin: 0; }

        .recs-list { display: flex; flex-direction: column; gap: 1.25rem; }
        .rec-item { display: flex; gap: 1.25rem; align-items: flex-start; }
        .rec-item__num {
          width: 34px; height: 34px; border-radius: 50%;
          background: linear-gradient(135deg, var(--primary), var(--primary-light));
          display: flex; align-items: center; justify-content: center;
          font-weight: 800; font-size: 0.9rem; flex-shrink: 0;
        }
        .rec-item strong { display: block; margin-bottom: 0.3rem; }
        .rec-item p { font-size: 0.875rem; color: var(--gray-400); margin: 0 0 0.5rem; }
        .rec-item__impact {
          display: inline-flex; align-items: center; gap: 0.35rem;
          font-size: 0.8rem; color: var(--success); font-weight: 600;
        }

        .action-plan { display: flex; flex-direction: column; gap: 1rem; }
        .phase-card {
          border: 1px solid var(--dark-border);
          border-radius: var(--radius-md);
          overflow: hidden;
        }
        .phase-card__header {
          display: flex; align-items: center; gap: 1rem;
          padding: 1rem 1.25rem;
          background: rgba(108,60,225,0.08);
          border-bottom: 1px solid var(--dark-border);
        }
        .phase-card__num {
          width: 28px; height: 28px; border-radius: 50%;
          background: var(--primary); display: flex; align-items: center; justify-content: center;
          font-weight: 700; font-size: 0.85rem; flex-shrink: 0;
        }
        .phase-card__header strong { font-size: 0.95rem; }
        .phase-card__tasks {
          list-style: none; padding: 1.1rem 1.25rem;
          display: flex; flex-direction: column; gap: 0.6rem;
        }
        .phase-card__tasks li {
          display: flex; align-items: center; gap: 0.65rem;
          font-size: 0.875rem; color: var(--gray-300);
        }

        .report__cta {
          display: flex; justify-content: space-between; align-items: center;
          gap: 1.5rem; flex-wrap: wrap;
          background: linear-gradient(135deg, rgba(108,60,225,0.2), rgba(139,92,246,0.1));
          border: 1px solid var(--dark-border);
          border-radius: var(--radius-lg); padding: 2rem;
        }
        .report__cta h4 { font-size: 1.1rem; margin-bottom: 0.3rem; }
        .report__cta p { font-size: 0.875rem; color: var(--gray-400); margin: 0; }

        @media (max-width: 640px) {
          .pain-form { padding: 1.5rem; }
          .report__header { flex-direction: column; align-items: center; text-align: center; }
          .report__cta { flex-direction: column; text-align: center; }
        }
      `}</style>
    </main>
  );
}
