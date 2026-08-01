import { useState } from 'react';
import { Brain, ArrowRight, CheckCircle, AlertTriangle, AlertCircle, TrendingUp, Clock, Target, FileText, RotateCcw, MessageCircle, Sparkles } from 'lucide-react';
import type { PainPointFormData, AIReport } from '../types';
import { submitPainAnalysis } from '../utils/api';

const CHALLENGES = [
  { id:'no-website',          label:'No website / online presence' },
  { id:'low-sales',           label:'Low sales & footfall' },
  { id:'competition',         label:'Losing customers to competitors' },
  { id:'no-social',           label:'No social media presence' },
  { id:'inventory',           label:'Inventory management issues' },
  { id:'customer-retention',  label:'Poor customer retention' },
  { id:'payment',             label:'Limited payment options' },
];

const INIT: PainPointFormData = { businessName:'', businessType:'', city:'', monthlyRevenue:'', currentChallenges:[], onlinePresence:'none', targetAudience:'', budget:'', additionalInfo:'' };

const SEV = {
  high:   { color:'#EF4444', icon:<AlertTriangle size={15}/>, badge:'badge-red' },
  medium: { color:'#F59E0B', icon:<AlertCircle size={15}/>,   badge:'badge-amber' },
  low:    { color:'#10B981', icon:<CheckCircle size={15}/>,   badge:'badge-green' },
} as const;

const STEPS = ['Analysing business profile…','Identifying pain points…','Researching competitors…','Generating recommendations…'];

export default function PainAnalysis() {
  const [step, setStep]     = useState<'form'|'loading'|'report'>('form');
  const [form, setForm]     = useState<PainPointFormData>(INIT);
  const [report, setReport] = useState<AIReport|null>(null);
  const [errors, setErrors] = useState<Partial<Record<keyof PainPointFormData,string>>>({});

  const update = (f: keyof PainPointFormData, v: string) => {
    setForm(p => ({...p,[f]:v}));
    if (errors[f]) setErrors(p => ({...p,[f]:''}));
  };

  const toggle = (id: string) => setForm(p => ({
    ...p, currentChallenges: p.currentChallenges.includes(id)
      ? p.currentChallenges.filter(c => c !== id)
      : [...p.currentChallenges, id],
  }));

  const validate = () => {
    const e: typeof errors = {};
    if (!form.businessName.trim()) e.businessName = 'Required';
    if (!form.businessType.trim()) e.businessType = 'Required';
    if (!form.city.trim())         e.city         = 'Required';
    if (!form.budget)              e.budget       = 'Required';
    if (!form.currentChallenges.length) (e as any).challenges = 'Select at least one';
    setErrors(e);
    return !Object.keys(e).length;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setStep('loading');
    try {
      const res = await submitPainAnalysis({
        business_name: form.businessName, business_type: form.businessType,
        city: form.city, monthly_revenue: form.monthlyRevenue,
        current_challenges: form.currentChallenges, online_presence: form.onlinePresence,
        target_audience: form.targetAudience, budget: form.budget, additional_info: form.additionalInfo,
      });
      setReport({
        businessName: form.businessName,
        summary: res.summary,
        challenges: res.challenges,
        recommendations: res.recommendations.map(r => ({ priority:r.priority, title:r.title, description:r.description, estimatedImpact:r.estimated_impact })),
        digitalScore: res.digital_score,
        actionPlan: res.action_plan.map(p => ({ phase:p.phase, timeline:p.timeline, tasks:p.tasks })),
      });
      setStep('report');
    } catch {
      const { generateBusinessReport } = await import('../utils/aiEngine');
      setReport(generateBusinessReport(form));
      setStep('report');
    }
  };

  const ScoreRing = ({ score }: { score: number }) => {
    const r=52, circ=2*Math.PI*r, dash=(score/100)*circ;
    const color = score>=60?'#10B981':score>=35?'#F59E0B':'#EF4444';
    return (
      <svg width="130" height="130" viewBox="0 0 130 130">
        <circle cx="65" cy="65" r={r} fill="none" stroke="rgba(255,255,255,.06)" strokeWidth="10"/>
        <circle cx="65" cy="65" r={r} fill="none" stroke={color} strokeWidth="10"
          strokeDasharray={`${dash} ${circ}`} strokeLinecap="round" transform="rotate(-90 65 65)"
          style={{transition:'stroke-dasharray 1.2s ease'}}/>
        <text x="65" y="60" textAnchor="middle" fill="white" fontSize="22" fontWeight="800" fontFamily="Poppins">{score}</text>
        <text x="65" y="78" textAnchor="middle" fill="#9CA3AF" fontSize="11">/100</text>
      </svg>
    );
  };

  return (
    <main style={{paddingTop:'5rem',minHeight:'100vh'}}>
      {/* Hero */}
      <section className="pa-hero">
        <div className="pa-hero__glow"/>
        <div className="container" style={{textAlign:'center',position:'relative',zIndex:1}}>
          <div className="badge badge-purple" style={{display:'inline-flex',marginBottom:'1.25rem'}}>
            <Brain size={13}/> AI Business Analyser
          </div>
          <h1 className="section-title">Discover Your Business <span className="gradient-text">Growth Gaps</span></h1>
          <p className="section-subtitle">Fill in your details and our AI generates a personalised growth report — completely free.</p>
        </div>
      </section>

      <div className="container" style={{maxWidth:820,paddingBottom:'6rem'}}>

        {/* FORM */}
        {step==='form' && (
          <form onSubmit={handleSubmit} className="pa-form animate-fade-up">

            <div className="pa-section">
              <h3 className="pa-section-title"><span className="pa-step">1</span> Business Information</h3>
              <div className="grid-2">
                {[{f:'businessName',p:'e.g. Priya Sarees',l:'Business Name *'},{f:'businessType',p:'e.g. Saree Shop',l:'Business Type *'},{f:'city',p:'e.g. Mumbai',l:'City *'}].map(item => (
                  <div className="form-group" key={item.f}>
                    <label className="form-label">{item.l}</label>
                    <input className="form-input" placeholder={item.p}
                      value={(form as any)[item.f]} onChange={e => update(item.f as any, e.target.value)}/>
                    {(errors as any)[item.f] && <span className="pa-error">{(errors as any)[item.f]}</span>}
                  </div>
                ))}
                <div className="form-group">
                  <label className="form-label">Monthly Revenue</label>
                  <select className="form-select" value={form.monthlyRevenue} onChange={e => update('monthlyRevenue',e.target.value)}>
                    <option value="">Select range</option>
                    <option value="below-1L">Below ₹1 Lakh</option>
                    <option value="1L-5L">₹1L – ₹5L</option>
                    <option value="5L-20L">₹5L – ₹20L</option>
                    <option value="20L+">₹20L+</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="pa-section">
              <h3 className="pa-section-title"><span className="pa-step">2</span> Online Presence</h3>
              <div className="pa-presence">
                {[{v:'none',l:'None'},{v:'social',l:'Social Only'},{v:'website',l:'Website Only'},{v:'both',l:'Website + Social'}].map(o => (
                  <button key={o.v} type="button" className={`pa-pres-btn ${form.onlinePresence===o.v?'pa-pres-btn--active':''}`}
                    onClick={() => update('onlinePresence',o.v)}>{o.l}</button>
                ))}
              </div>
            </div>

            <div className="pa-section">
              <h3 className="pa-section-title"><span className="pa-step">3</span> Current Challenges *</h3>
              <div className="pa-chips">
                {CHALLENGES.map(c => (
                  <button key={c.id} type="button" className={`pa-chip ${form.currentChallenges.includes(c.id)?'pa-chip--active':''}`}
                    onClick={() => toggle(c.id)}>
                    {form.currentChallenges.includes(c.id)&&<CheckCircle size={13}/>} {c.label}
                  </button>
                ))}
              </div>
              {(errors as any).challenges && <span className="pa-error">{(errors as any).challenges}</span>}
            </div>

            <div className="pa-section">
              <h3 className="pa-section-title"><span className="pa-step">4</span> Budget & Details</h3>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Target Audience</label>
                  <input className="form-input" placeholder="e.g. Women aged 25–50" value={form.targetAudience} onChange={e => update('targetAudience',e.target.value)}/>
                </div>
                <div className="form-group">
                  <label className="form-label">Monthly Marketing Budget *</label>
                  <select className="form-select" value={form.budget} onChange={e => update('budget',e.target.value)}>
                    <option value="">Select budget</option>
                    <option value="below-5k">Below ₹5,000</option>
                    <option value="5k-10k">₹5,000 – ₹10,000</option>
                    <option value="10k-25k">₹10,000 – ₹25,000</option>
                    <option value="25k+">₹25,000+</option>
                  </select>
                  {errors.budget && <span className="pa-error">{errors.budget}</span>}
                </div>
              </div>
              <div className="form-group" style={{marginTop:'1rem'}}>
                <label className="form-label">Additional Information</label>
                <textarea className="form-textarea" placeholder="Anything else about your business or goals…"
                  value={form.additionalInfo} onChange={e => update('additionalInfo',e.target.value)} rows={3}/>
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-lg" style={{width:'100%',justifyContent:'center'}}>
              <Sparkles size={18}/> Generate My Free AI Report <ArrowRight size={18}/>
            </button>
          </form>
        )}

        {/* LOADING */}
        {step==='loading' && (
          <div className="pa-loading animate-fade">
            <div className="pa-loading__ring"><div className="pa-spinner"/><Brain size={26} color="#8B5CF6"/></div>
            <h3>AI is Analysing Your Business…</h3>
            <p>Scanning market data, competitors and growth opportunities.</p>
            <div className="pa-loading__steps">
              {STEPS.map((s,i) => (
                <div key={s} className="pa-loading__step" style={{animationDelay:`${i*.6}s`}}>
                  <div className="pa-loading__dot"/><span>{s}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* REPORT */}
        {step==='report' && report && (
          <div className="pa-report animate-fade-up">
            <div className="pa-report__header">
              <div style={{flex:1}}>
                <div className="badge badge-green" style={{marginBottom:'.75rem'}}><CheckCircle size={12}/> Report Ready</div>
                <h2 style={{fontSize:'1.8rem',fontWeight:900,marginBottom:'.5rem'}}>{report.businessName}</h2>
                <p style={{color:'var(--gray-400)',lineHeight:1.7,fontSize:'.95rem'}}>{report.summary}</p>
              </div>
              <div style={{textAlign:'center',flexShrink:0}}>
                <ScoreRing score={report.digitalScore}/>
                <p style={{fontSize:'.75rem',color:'var(--gray-400)',marginTop:'.35rem'}}>Digital Readiness</p>
              </div>
            </div>

            <div className="pa-report__section">
              <h3 className="pa-report__sec-title"><AlertTriangle size={17} color="#EF4444"/> Key Challenges</h3>
              {report.challenges.map((c,i) => (
                <div key={i} className="pa-challenge" style={{borderLeftColor:SEV[c.severity].color}}>
                  <div className="pa-challenge__head">
                    <span style={{color:SEV[c.severity].color}}>{SEV[c.severity].icon}</span>
                    <strong>{c.title}</strong>
                    <span className={`badge ${SEV[c.severity].badge}`}>{c.severity}</span>
                  </div>
                  <p>{c.description}</p>
                </div>
              ))}
            </div>

            <div className="pa-report__section">
              <h3 className="pa-report__sec-title"><Target size={17} color="#8B5CF6"/> Recommendations</h3>
              {report.recommendations.map((r,i) => (
                <div key={i} className="pa-rec">
                  <div className="pa-rec__num">{r.priority}</div>
                  <div>
                    <strong>{r.title}</strong>
                    <p>{r.description}</p>
                    <span className="pa-rec__impact"><TrendingUp size={12}/> {r.estimatedImpact}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="pa-report__section">
              <h3 className="pa-report__sec-title"><Clock size={17} color="#F59E0B"/> 90-Day Action Plan</h3>
              {report.actionPlan.map((ph,i) => (
                <div key={i} className="pa-phase">
                  <div className="pa-phase__head">
                    <span className="pa-phase__num">{i+1}</span>
                    <strong>{ph.phase}</strong>
                    <span className="badge badge-purple"><Clock size={10}/> {ph.timeline}</span>
                  </div>
                  <ul className="pa-phase__tasks">
                    {ph.tasks.map((t,j) => <li key={j}><CheckCircle size={13} color="#10B981"/>{t}</li>)}
                  </ul>
                </div>
              ))}
            </div>

            <div className="pa-report__cta">
              <div><h4>Ready to implement this plan?</h4><p>Talk to our experts and start growing today.</p></div>
              <div style={{display:'flex',gap:'.75rem',flexWrap:'wrap'}}>
                <a href={`https://wa.me/919999999999?text=Hi!+I+got+my+AI+report+for+${encodeURIComponent(report.businessName)}.`}
                  target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp">
                  <MessageCircle size={15}/> WhatsApp
                </a>
                <button className="btn btn-secondary" onClick={() => {setForm(INIT);setReport(null);setStep('form')}}>
                  <RotateCcw size={15}/> New Analysis
                </button>
                <button className="btn btn-secondary" onClick={() => window.print()}>
                  <FileText size={15}/> Print
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .pa-hero{padding:5rem 0 3rem;position:relative;overflow:hidden}
        .pa-hero__glow{position:absolute;inset:0;background:radial-gradient(ellipse at 50% 0%,rgba(108,60,225,.2) 0%,transparent 65%);pointer-events:none}
        .pa-form{background:var(--dark-card);border:1px solid var(--dark-border);border-radius:var(--radius-2xl);padding:2.5rem;display:flex;flex-direction:column;gap:2.5rem}
        .pa-section{display:flex;flex-direction:column;gap:1.25rem}
        .pa-section-title{display:flex;align-items:center;gap:.75rem;font-size:1rem;font-weight:700;color:var(--gray-200);padding-bottom:.75rem;border-bottom:1px solid var(--dark-border)}
        .pa-step{display:inline-flex;align-items:center;justify-content:center;width:24px;height:24px;border-radius:50%;background:linear-gradient(135deg,#6C3CE1,#8B5CF6);font-size:.75rem;font-weight:800;flex-shrink:0}
        .pa-error{font-size:.8rem;color:#EF4444;margin-top:2px}
        .pa-presence{display:flex;gap:.65rem;flex-wrap:wrap}
        .pa-pres-btn{padding:.55rem 1.2rem;border-radius:var(--radius-full);background:rgba(255,255,255,.04);border:1.5px solid rgba(255,255,255,.08);color:var(--gray-400);font-size:.875rem;font-weight:500;transition:var(--transition)}
        .pa-pres-btn:hover{border-color:#8B5CF6;color:var(--white)}
        .pa-pres-btn--active{background:rgba(108,60,225,.18);border-color:#8B5CF6;color:#8B5CF6}
        .pa-chips{display:flex;flex-wrap:wrap;gap:.6rem}
        .pa-chip{display:inline-flex;align-items:center;gap:.4rem;padding:.5rem 1rem;border-radius:var(--radius-full);background:rgba(255,255,255,.04);border:1.5px solid rgba(255,255,255,.08);color:var(--gray-400);font-size:.84rem;font-weight:500;transition:var(--transition)}
        .pa-chip:hover{border-color:#8B5CF6;color:var(--white)}
        .pa-chip--active{background:rgba(108,60,225,.18);border-color:#6C3CE1;color:#8B5CF6}
        .pa-loading{text-align:center;padding:5rem 2rem;display:flex;flex-direction:column;align-items:center;gap:1.5rem}
        .pa-loading__ring{width:80px;height:80px;position:relative;display:flex;align-items:center;justify-content:center}
        .pa-spinner{position:absolute;inset:0;border-radius:50%;border:3px solid rgba(108,60,225,.15);border-top-color:#8B5CF6;animation:spin-slow 1s linear infinite}
        .pa-loading h3{font-size:1.4rem}.pa-loading p{color:var(--gray-400)}
        .pa-loading__steps{display:flex;flex-direction:column;gap:.85rem;width:100%;max-width:300px}
        .pa-loading__step{display:flex;align-items:center;gap:.75rem;font-size:.875rem;color:var(--gray-400);animation:fadeInUp .5s ease forwards;opacity:0}
        .pa-loading__dot{width:8px;height:8px;border-radius:50%;background:#8B5CF6;animation:pulse-glow 1.5s ease-in-out infinite;flex-shrink:0}
        .pa-report{display:flex;flex-direction:column;gap:1.5rem}
        .pa-report__header{display:flex;justify-content:space-between;align-items:flex-start;gap:2rem;background:var(--dark-card);border:1px solid var(--dark-border);border-radius:var(--radius-2xl);padding:2.5rem}
        .pa-report__section{background:var(--dark-card);border:1px solid var(--dark-border);border-radius:var(--radius-xl);padding:2rem;display:flex;flex-direction:column;gap:1rem}
        .pa-report__sec-title{display:flex;align-items:center;gap:.6rem;font-size:1.05rem;font-weight:700;margin-bottom:.5rem}
        .pa-challenge{padding:1.1rem 1.25rem;background:rgba(255,255,255,.025);border-radius:var(--radius-md);border-left:3px solid}
        .pa-challenge__head{display:flex;align-items:center;gap:.65rem;margin-bottom:.4rem;flex-wrap:wrap}
        .pa-challenge p{font-size:.875rem;color:var(--gray-400);margin:0}
        .pa-rec{display:flex;gap:1.25rem;align-items:flex-start}
        .pa-rec__num{width:34px;height:34px;border-radius:50%;background:linear-gradient(135deg,#6C3CE1,#8B5CF6);display:flex;align-items:center;justify-content:center;font-weight:800;font-size:.9rem;flex-shrink:0}
        .pa-rec strong{display:block;margin-bottom:.3rem}.pa-rec p{font-size:.875rem;color:var(--gray-400);margin:0 0 .5rem}
        .pa-rec__impact{display:inline-flex;align-items:center;gap:.35rem;font-size:.8rem;color:#10B981;font-weight:600}
        .pa-phase{border:1px solid var(--dark-border);border-radius:var(--radius-md);overflow:hidden}
        .pa-phase__head{display:flex;align-items:center;gap:1rem;padding:1rem 1.25rem;background:rgba(108,60,225,.07);border-bottom:1px solid var(--dark-border);flex-wrap:wrap}
        .pa-phase__num{width:26px;height:26px;border-radius:50%;background:#6C3CE1;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:.82rem;flex-shrink:0}
        .pa-phase__head strong{font-size:.95rem;flex:1}
        .pa-phase__tasks{list-style:none;padding:1rem 1.25rem;display:flex;flex-direction:column;gap:.55rem}
        .pa-phase__tasks li{display:flex;align-items:center;gap:.65rem;font-size:.875rem;color:var(--gray-300)}
        .pa-report__cta{display:flex;justify-content:space-between;align-items:center;gap:1.5rem;flex-wrap:wrap;background:linear-gradient(135deg,rgba(108,60,225,.18),rgba(139,92,246,.08));border:1px solid var(--dark-border);border-radius:var(--radius-xl);padding:2rem}
        .pa-report__cta h4{font-size:1.1rem;margin-bottom:.3rem}.pa-report__cta p{font-size:.875rem;color:var(--gray-400);margin:0}
        @media(max-width:640px){.pa-form{padding:1.5rem}.pa-report__header{flex-direction:column;align-items:center;text-align:center}.pa-report__cta{flex-direction:column;text-align:center}}
      `}</style>
    </main>
  );
}
