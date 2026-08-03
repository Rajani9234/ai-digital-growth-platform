import { useState } from 'react';
import {
  Brain, ArrowRight, CheckCircle, AlertTriangle, AlertCircle,
  TrendingUp, Clock, Target, FileText, RotateCcw, MessageCircle, Sparkles,
} from 'lucide-react';
import type { PainPointFormData, AIReport } from '../types';
import { submitPainAnalysis } from '../utils/api';
import AIChat from '../components/ui/AIChat';

const CHALLENGES = [
  { id:'no-website',         label:'No website / online presence' },
  { id:'low-sales',          label:'Low sales & footfall' },
  { id:'competition',        label:'Losing customers to competitors' },
  { id:'no-social',          label:'No social media presence' },
  { id:'inventory',          label:'Inventory management issues' },
  { id:'customer-retention', label:'Poor customer retention' },
  { id:'payment',            label:'Limited payment options' },
];

const INIT: PainPointFormData = {
  businessName:'', businessType:'', city:'', monthlyRevenue:'',
  currentChallenges:[], onlinePresence:'none', targetAudience:'', budget:'', additionalInfo:'',
};

const SEV = {
  high:   { color:'#EF4444', icon:<AlertTriangle size={15}/>, badge:'badge-red' },
  medium: { color:'#F59E0B', icon:<AlertCircle size={15}/>,   badge:'badge-amber' },
  low:    { color:'#10B981', icon:<CheckCircle size={15}/>,   badge:'badge-green' },
} as const;

const ANALYSIS_QUICK = [
  { label:'What is Digital Score?', value:'score' },
  { label:'Explain recommendations', value:'recommend' },
  { label:'How to start Phase 1?', value:'phase' },
  { label:'Contact JhaTech', value:'contact' },
  { label:'How long does it take?', value:'time' },
  { label:'What does SEO mean?', value:'seo' },
];

export default function PainAnalysis() {
  const [step, setStep]     = useState<'form'|'loading'|'report'>('form');
  const [form, setForm]     = useState<PainPointFormData>(INIT);
  const [report, setReport] = useState<AIReport|null>(null);
  const [errors, setErrors] = useState<Partial<Record<keyof PainPointFormData, string>>>({});

  const update = (f: keyof PainPointFormData, v: string) => {
    setForm(p => ({...p,[f]:v}));
    if (errors[f]) setErrors(p => ({...p,[f]:''}));
  };

  const toggle = (id: string) => setForm(p => ({
    ...p,
    currentChallenges: p.currentChallenges.includes(id)
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
  recommendations: res.recommendations.map((r: any) => ({
    priority: r.priority,
    title: r.title,
    description: r.description,
    estimatedImpact: r.estimated_impact,
  })),
  digitalScore: res.digital_score,
  actionPlan: res.action_plan.map((p: any) => ({
    phase: p.phase,
    timeline: p.timeline,
    tasks: p.tasks,
  })),
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
    <main style={{paddingTop:'5rem'}}>
      {/* Hero */}
      <section className="pa-hero">
        <div className="pa-hero__glow"/>
        <div className="container" style={{textAlign:'center', position:'relative', zIndex:1}}>
          <div className="badge badge-purple" style={{display:'inline-flex', marginBottom:'1.25rem'}}>
            <Brain size={13}/> AI Business Analyser
          </div>
          <h1 className="section-title">
            Discover Your Business <span className="gradient-text">Growth Gaps</span>
          </h1>
          <p className="section-subtitle">
            Fill in your details and our AI generates a personalised growth report — completely free.
          </p>
        </div>
      </section>

      {/* Two-column layout: Form + Chat */}
      <div className="container pa-layout">

        {/* LEFT: Form / Loading / Report */}
        <div className="pa-main">
          {step === 'form' && (
            <form onSubmit={handleSubmit} className="pa-form animate-fade-up">
              <div className="pa-section">
                <h3 className="pa-sec-title"><span className="pa-step">1</span> Business Information</h3>
                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Business Name *</label>
                    <input className="form-input" placeholder="e.g. Priya Sarees"
                      value={form.businessName} onChange={e => update('businessName', e.target.value)}/>
                    {errors.businessName && <span className="pa-err">{errors.businessName}</span>}
                  </div>
                  <div className="form-group">
                    <label className="form-label">Business Type *</label>
                    <input className="form-input" placeholder="e.g. Saree Shop"
                      value={form.businessType} onChange={e => update('businessType', e.target.value)}/>
                    {errors.businessType && <span className="pa-err">{errors.businessType}</span>}
                  </div>
                  <div className="form-group">
                    <label className="form-label">City *</label>
                    <input className="form-input" placeholder="e.g. Mumbai"
                      value={form.city} onChange={e => update('city', e.target.value)}/>
                    {errors.city && <span className="pa-err">{errors.city}</span>}
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

              <div className="pa-section">
                <h3 className="pa-sec-title"><span className="pa-step">2</span> Online Presence</h3>
                <div className="pa-presence">
                  {[{v:'none',l:'None'},{v:'social',l:'Social Only'},{v:'website',l:'Website Only'},{v:'both',l:'Website + Social'}].map(o => (
                    <button key={o.v} type="button"
                      className={`pa-pres-btn ${form.onlinePresence===o.v?'pa-pres-btn--on':''}`}
                      onClick={() => update('onlinePresence', o.v)}>{o.l}</button>
                  ))}
                </div>
              </div>

              <div className="pa-section">
                <h3 className="pa-sec-title"><span className="pa-step">3</span> Current Challenges *</h3>
                <div className="pa-chips">
                  {CHALLENGES.map(c => (
                    <button key={c.id} type="button"
                      className={`pa-chip ${form.currentChallenges.includes(c.id)?'pa-chip--on':''}`}
                      onClick={() => toggle(c.id)}>
                      {form.currentChallenges.includes(c.id)&&<CheckCircle size={13}/>} {c.label}
                    </button>
                  ))}
                </div>
                {(errors as any).challenges && <span className="pa-err">{(errors as any).challenges}</span>}
              </div>

              <div className="pa-section">
                <h3 className="pa-sec-title"><span className="pa-step">4</span> Budget & Details</h3>
                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Target Audience</label>
                    <input className="form-input" placeholder="e.g. Women aged 25–50"
                      value={form.targetAudience} onChange={e => update('targetAudience', e.target.value)}/>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Monthly Budget *</label>
                    <select className="form-select" value={form.budget} onChange={e => update('budget', e.target.value)}>
                      <option value="">Select budget</option>
                      <option value="below-5k">Below ₹5,000</option>
                      <option value="5k-10k">₹5,000 – ₹10,000</option>
                      <option value="10k-25k">₹10,000 – ₹25,000</option>
                      <option value="25k+">₹25,000+</option>
                    </select>
                    {errors.budget && <span className="pa-err">{errors.budget}</span>}
                  </div>
                </div>
                <div className="form-group" style={{marginTop:'1rem'}}>
                  <label className="form-label">Additional Information</label>
                  <textarea className="form-textarea" rows={3}
                    placeholder="Anything else about your business or goals…"
                    value={form.additionalInfo} onChange={e => update('additionalInfo', e.target.value)}/>
                </div>
              </div>

              <button type="submit" className="btn btn-primary btn-lg" style={{width:'100%',justifyContent:'center'}}>
                <Sparkles size={18}/> Generate My Free AI Report <ArrowRight size={18}/>
              </button>
            </form>
          )}

          {step === 'loading' && (
            <div className="pa-loading animate-fade">
              <div className="pa-spinner-wrap"><div className="pa-spinner"/><Brain size={26} color="#8B5CF6"/></div>
              <h3>AI is Analysing Your Business…</h3>
              <p>Scanning market data, competitors and growth opportunities.</p>
              <div className="pa-steps">
                {['Analysing business profile…','Identifying pain points…','Researching competitors…','Generating recommendations…'].map((s,i)=>(
                  <div key={s} className="pa-step-item" style={{animationDelay:`${i*.6}s`}}>
                    <div className="pa-step-dot"/><span>{s}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === 'report' && report && (
            <div className="pa-report animate-fade-up">
              <div className="pa-report__header">
                <div style={{flex:1}}>
                  <div className="badge badge-green" style={{marginBottom:'.75rem'}}><CheckCircle size={12}/> Report Ready</div>
                  <h2 style={{fontSize:'1.8rem',fontWeight:900,marginBottom:'.5rem'}}>{report.businessName}</h2>
                  <p style={{color:'var(--gray-400)',lineHeight:1.7,fontSize:'.95rem'}}>{report.summary}</p>
                </div>
                <div style={{textAlign:'center',flexShrink:0}}>
                  <ScoreRing score={report.digitalScore}/>
                  <p style={{fontSize:'.72rem',color:'var(--gray-400)',marginTop:'.3rem'}}>Digital Readiness</p>
                </div>
              </div>

              <div className="pa-report__sec">
                <h3 className="pa-report__sec-h"><AlertTriangle size={17} color="#EF4444"/> Key Challenges</h3>
                {report.challenges.map((c,i)=>(
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

              <div className="pa-report__sec">
                <h3 className="pa-report__sec-h"><Target size={17} color="#8B5CF6"/> Recommendations</h3>
                {report.recommendations.map((r,i)=>(
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

              <div className="pa-report__sec">
                <h3 className="pa-report__sec-h"><Clock size={17} color="#F59E0B"/> 90-Day Action Plan</h3>
                {report.actionPlan.map((ph,i)=>(
                  <div key={i} className="pa-phase">
                    <div className="pa-phase__head">
                      <span className="pa-phase__num">{i+1}</span>
                      <strong>{ph.phase}</strong>
                      <span className="badge badge-purple"><Clock size={10}/> {ph.timeline}</span>
                    </div>
                    <ul className="pa-phase__tasks">
                      {ph.tasks.map((t,j)=><li key={j}><CheckCircle size={13} color="#10B981"/>{t}</li>)}
                    </ul>
                  </div>
                ))}
              </div>

              <div className="pa-report__cta">
                <div><h4>Ready to implement this plan?</h4><p>Talk to our experts and start growing today.</p></div>
                <div style={{display:'flex',gap:'.75rem',flexWrap:'wrap'}}>
                  <a href={`https://wa.me/919999999999?text=Hi!+AI+report+for+${encodeURIComponent(report.businessName)}`}
                    target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp">
                    <MessageCircle size={15}/> WhatsApp
                  </a>
                  <button className="btn btn-secondary" onClick={()=>{setForm(INIT);setReport(null);setStep('form')}}>
                    <RotateCcw size={15}/> New Analysis
                  </button>
                  <button className="btn btn-secondary" onClick={()=>window.print()}>
                    <FileText size={15}/> Print
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT: AI Chat */}
        <div className="pa-chat-col">
          <AIChat
            mode="analysis"
            title="AI Report Assistant"
            subtitle="Ask about your report"
            placeholder="e.g. What does my score mean?"
            welcomeMsg="Hi! 👋 I'm here to help you understand the Pain Analysis form and your AI report. Fill the form on the left to generate your free report!"
            quickQuestions={ANALYSIS_QUICK}
            sticky={false}
            systemPrompt="You are an AI business report assistant for Indian local businesses. Answer only with practical, concise, and helpful business guidance about digital score, recommendations, action plan, website development, SEO, social media, WhatsApp marketing, pricing, and lead generation. If the question is unrelated, still answer politely and naturally with Gemini."
          />
          <div className="pa-chat-tip">
            <Sparkles size={13} color="#8B5CF6"/>
            <span>Tip: After generating your report, ask the AI to explain any recommendation!</span>
          </div>
        </div>
      </div>

      <style>{`
        .pa-hero{padding:5rem 0 3rem;position:relative;overflow:hidden}
        .pa-hero__glow{position:absolute;inset:0;background:radial-gradient(ellipse at 50% 0%,rgba(108,60,225,.2) 0%,transparent 65%);pointer-events:none}

        .pa-layout{display:grid;grid-template-columns:1fr 380px;gap:2rem;align-items:start;padding-bottom:6rem;margin-top:1rem}
        .pa-main{min-width:0}
        .pa-chat-col{display:flex;flex-direction:column;gap:.75rem}
        .pa-chat-tip{display:flex;align-items:center;gap:.5rem;font-size:.78rem;color:var(--gray-500);padding:.6rem .9rem;background:rgba(108,60,225,.06);border:1px solid rgba(108,60,225,.15);border-radius:var(--radius-md)}

        .pa-form{background:var(--dark-card);border:1px solid var(--dark-border);border-radius:var(--radius-2xl);padding:2rem;display:flex;flex-direction:column;gap:2rem}
        .pa-section{display:flex;flex-direction:column;gap:1.1rem}
        .pa-sec-title{display:flex;align-items:center;gap:.65rem;font-size:.95rem;font-weight:700;color:var(--gray-200);padding-bottom:.65rem;border-bottom:1px solid var(--dark-border)}
        .pa-step{display:inline-flex;align-items:center;justify-content:center;width:22px;height:22px;border-radius:50%;background:linear-gradient(135deg,#6C3CE1,#8B5CF6);font-size:.72rem;font-weight:800;flex-shrink:0}
        .pa-err{font-size:.78rem;color:#EF4444;margin-top:2px}

        .pa-presence{display:flex;gap:.6rem;flex-wrap:wrap}
        .pa-pres-btn{padding:.5rem 1.1rem;border-radius:var(--radius-full);background:rgba(255,255,255,.04);border:1.5px solid rgba(255,255,255,.08);color:var(--gray-400);font-size:.84rem;font-weight:500;transition:var(--transition)}
        .pa-pres-btn:hover{border-color:#8B5CF6;color:var(--white)}
        .pa-pres-btn--on{background:rgba(108,60,225,.18);border-color:#8B5CF6;color:#8B5CF6}

        .pa-chips{display:flex;flex-wrap:wrap;gap:.55rem}
        .pa-chip{display:inline-flex;align-items:center;gap:.35rem;padding:.45rem .95rem;border-radius:var(--radius-full);background:rgba(255,255,255,.04);border:1.5px solid rgba(255,255,255,.08);color:var(--gray-400);font-size:.82rem;font-weight:500;transition:var(--transition)}
        .pa-chip:hover{border-color:#8B5CF6;color:var(--white)}
        .pa-chip--on{background:rgba(108,60,225,.18);border-color:#6C3CE1;color:#8B5CF6}

        .pa-loading{text-align:center;padding:4rem 2rem;display:flex;flex-direction:column;align-items:center;gap:1.5rem;background:var(--dark-card);border:1px solid var(--dark-border);border-radius:var(--radius-2xl)}
        .pa-spinner-wrap{width:70px;height:70px;position:relative;display:flex;align-items:center;justify-content:center}
        .pa-spinner{position:absolute;inset:0;border-radius:50%;border:3px solid rgba(108,60,225,.15);border-top-color:#8B5CF6;animation:spin-slow 1s linear infinite}
        .pa-loading h3{font-size:1.3rem}.pa-loading p{color:var(--gray-400);font-size:.9rem}
        .pa-steps{display:flex;flex-direction:column;gap:.75rem;width:100%;max-width:280px}
        .pa-step-item{display:flex;align-items:center;gap:.65rem;font-size:.84rem;color:var(--gray-400);animation:fadeInUp .5s ease forwards;opacity:0}
        .pa-step-dot{width:7px;height:7px;border-radius:50%;background:#8B5CF6;animation:pulse-glow 1.5s ease-in-out infinite;flex-shrink:0}

        .pa-report{display:flex;flex-direction:column;gap:1.25rem}
        .pa-report__header{display:flex;justify-content:space-between;align-items:flex-start;gap:1.5rem;background:var(--dark-card);border:1px solid var(--dark-border);border-radius:var(--radius-2xl);padding:2rem}
        .pa-report__sec{background:var(--dark-card);border:1px solid var(--dark-border);border-radius:var(--radius-xl);padding:1.75rem;display:flex;flex-direction:column;gap:1rem}
        .pa-report__sec-h{display:flex;align-items:center;gap:.6rem;font-size:1rem;font-weight:700;margin-bottom:.25rem}
        .pa-challenge{padding:1rem 1.15rem;background:rgba(255,255,255,.025);border-radius:var(--radius-md);border-left:3px solid}
        .pa-challenge__head{display:flex;align-items:center;gap:.6rem;margin-bottom:.35rem;flex-wrap:wrap}
        .pa-challenge p{font-size:.855rem;color:var(--gray-400);margin:0}
        .pa-rec{display:flex;gap:1.1rem;align-items:flex-start}
        .pa-rec__num{width:32px;height:32px;border-radius:50%;background:linear-gradient(135deg,#6C3CE1,#8B5CF6);display:flex;align-items:center;justify-content:center;font-weight:800;font-size:.88rem;flex-shrink:0}
        .pa-rec strong{display:block;margin-bottom:.25rem;font-size:.9rem}
        .pa-rec p{font-size:.855rem;color:var(--gray-400);margin:0 0 .4rem}
        .pa-rec__impact{display:inline-flex;align-items:center;gap:.3rem;font-size:.78rem;color:#10B981;font-weight:600}
        .pa-phase{border:1px solid var(--dark-border);border-radius:var(--radius-md);overflow:hidden}
        .pa-phase__head{display:flex;align-items:center;gap:.85rem;padding:.9rem 1.15rem;background:rgba(108,60,225,.07);border-bottom:1px solid var(--dark-border);flex-wrap:wrap}
        .pa-phase__num{width:24px;height:24px;border-radius:50%;background:#6C3CE1;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:.8rem;flex-shrink:0}
        .pa-phase__head strong{font-size:.9rem;flex:1}
        .pa-phase__tasks{list-style:none;padding:.9rem 1.15rem;display:flex;flex-direction:column;gap:.5rem}
        .pa-phase__tasks li{display:flex;align-items:center;gap:.6rem;font-size:.855rem;color:var(--gray-300)}
        .pa-report__cta{display:flex;justify-content:space-between;align-items:center;gap:1.25rem;flex-wrap:wrap;background:linear-gradient(135deg,rgba(108,60,225,.18),rgba(139,92,246,.08));border:1px solid var(--dark-border);border-radius:var(--radius-xl);padding:1.75rem}
        .pa-report__cta h4{font-size:1rem;margin-bottom:.25rem}
        .pa-report__cta p{font-size:.855rem;color:var(--gray-400);margin:0}

        @media(max-width:1100px){.pa-layout{grid-template-columns:1fr}}
        @media(max-width:640px){.pa-form{padding:1.25rem}.pa-report__header{flex-direction:column;align-items:center;text-align:center}.pa-report__cta{flex-direction:column;text-align:center}}
      `}</style>
    </main>
  );
}
