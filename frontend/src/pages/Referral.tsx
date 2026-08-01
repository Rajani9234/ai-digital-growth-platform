import { useState, useRef } from 'react';
import {
  Users, IndianRupee, MessageCircle, CheckCircle, ArrowRight,
  Send, Bot, User, Copy, Share2, Zap, Gift,
} from 'lucide-react';
import { generateReferralCode } from '../utils/api';

interface ChatMessage { role: 'bot' | 'user'; text: string; }

interface PartnerForm { name: string; phone: string; email: string; city: string; }
interface Partner extends PartnerForm { referralCode: string; }

const FAQ: Record<string, string> = {
  earn:    'You earn ₹1,000 for every successful sale through your referral. NO limit — refer 10 businesses, earn ₹10,000! 💰',
  join:    'Joining is completely free and takes 2 minutes! No qualification needed. Fill the form and your code is ready instantly.',
  track:   'You get a unique referral code. When a business buys any JhaTech package using your code, you get ₹1,000 credited.',
  payment: 'Earnings are paid via UPI, bank transfer, or Paytm within 7 business days of a confirmed sale.',
  qualify: 'Anyone can join! Students, homemakers, freelancers — no degree, no experience required.',
  promote: 'Easiest way: WhatsApp your link to local shop owners, restaurants, salons, clinics — any business needing a website!',
};

const QUICK_Q = [
  { label: 'How much can I earn?', key: 'earn' },
  { label: 'How to join?',         key: 'join' },
  { label: 'How to track?',        key: 'track' },
  { label: 'When do I get paid?',  key: 'payment' },
  { label: 'Do I need a degree?',  key: 'qualify' },
  { label: 'How to promote?',      key: 'promote' },
];

function getBotReply(input: string): string {
  const l = input.toLowerCase();
  if (l.includes('earn') || l.includes('money') || l.includes('1000')) return FAQ.earn;
  if (l.includes('join') || l.includes('register'))                     return FAQ.join;
  if (l.includes('track') || l.includes('link'))                        return FAQ.track;
  if (l.includes('pay') || l.includes('upi') || l.includes('bank'))     return FAQ.payment;
  if (l.includes('qualif') || l.includes('degree'))                     return FAQ.qualify;
  if (l.includes('promot') || l.includes('share') || l.includes('how')) return FAQ.promote;
  return "Great question! 😊 I'm here to help with the JhaTech Referral Program. Ask me about earnings, joining, payments, or how to promote!";
}

const INIT: PartnerForm = { name: '', phone: '', email: '', city: '' };

export default function Referral() {
  const [form, setForm]       = useState<PartnerForm>(INIT);
  const [partner, setPartner] = useState<Partner | null>(null);
  const [errors, setErrors]   = useState<Partial<PartnerForm>>({});
  const [copied, setCopied]   = useState(false);

  const [msgs, setMsgs]         = useState<ChatMessage[]>([
    { role: 'bot', text: "Hi there! 👋 I'm your JhaTech Referral Assistant. Ask me anything about the Refer & Earn program!" },
  ]);
  const [chatInput, setChatInput] = useState('');
  const [botTyping, setBotTyping] = useState(false);
  const isFirstRender = useRef(true);
  const chatEndRef    = useRef<HTMLDivElement>(null);

  const scrollChat = () => {
    if (isFirstRender.current) { isFirstRender.current = false; return; }
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const validate = () => {
    const e: Partial<PartnerForm> = {};
    if (!form.name.trim())  e.name  = 'Name is required';
    if (!/^[6-9]\d{9}$/.test(form.phone)) e.phone = 'Enter valid 10-digit number';
    if (!form.city.trim())  e.city  = 'City is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    const code = generateReferralCode(form.name);
    setPartner({ ...form, referralCode: code });
  };

  const sendMsg = (text?: string) => {
    const msg = text ?? chatInput.trim();
    if (!msg) return;
    setMsgs(prev => [...prev, { role: 'user', text: msg }]);
    setChatInput('');
    setBotTyping(true);
    setTimeout(() => {
      setBotTyping(false);
      setMsgs(prev => [...prev, { role: 'bot', text: getBotReply(msg) }]);
      scrollChat();
    }, 800 + Math.random() * 500);
  };

  const copyCode = () => {
    if (!partner) return;
    navigator.clipboard.writeText(partner.referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareLink = () => {
    const text = `🚀 Grow your business with JhaTech Solutions!\nWebsite + Digital Marketing from ₹8,999\nUse my code: ${partner?.referralCode}\nhttps://jhatechsolutions.in/ref/${partner?.referralCode}`;
    if (navigator.share) navigator.share({ title: 'JhaTech', text });
    else navigator.clipboard.writeText(text);
  };

  return (
    <main style={{ paddingTop: '5rem', minHeight: '100vh' }}>
      {/* Hero */}
      <section className="ref-hero">
        <div className="ref-hero__glow" />
        <div className="container" style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <div className="badge badge-green" style={{ display: 'inline-flex', marginBottom: '1.25rem' }}>
            <Gift size={13} /> Referral Partner Program
          </div>
          <h1 className="section-title">
            Refer & Earn <span className="gradient-text">₹1,000</span><br />Per Successful Sale
          </h1>
          <p className="section-subtitle">
            No degree needed. No experience needed. Refer local businesses and earn every time they buy a package.
          </p>
          <div className="ref-hero__stats">
            {[{v:'₹1,000',l:'Per Sale'},{v:'Unlimited',l:'Earning Potential'},{v:'Free',l:'To Join'},{v:'7 Days',l:'Payout'}].map(s => (
              <div key={s.l} className="ref-hero__stat">
                <span className="gradient-text">{s.v}</span>
                <span>{s.l}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="container" style={{ paddingBottom: '6rem' }}>
        <div className="ref-layout">

          {/* LEFT */}
          <div>
            {!partner ? (
              <div className="ref-card animate-fade-up">
                <div className="ref-card__head">
                  <div className="ref-card__icon"><Zap size={18} /></div>
                  <div>
                    <h3>Join as Referral Partner</h3>
                    <p>Free to join. Start earning in minutes.</p>
                  </div>
                </div>
                <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Full Name *</label>
                    <input className="form-input" placeholder="Rahul Sharma" value={form.name}
                      onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
                    {errors.name && <span className="ref-error">{errors.name}</span>}
                  </div>
                  <div className="form-group">
                    <label className="form-label">Mobile Number *</label>
                    <input className="form-input" placeholder="9876543210" maxLength={10} value={form.phone}
                      onChange={e => setForm(p => ({ ...p, phone: e.target.value.replace(/\D/g, '') }))} />
                    {errors.phone && <span className="ref-error">{errors.phone}</span>}
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email (Optional)</label>
                    <input className="form-input" type="email" placeholder="rahul@gmail.com" value={form.email}
                      onChange={e => setForm(p => ({ ...p, email: e.target.value }))} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">City *</label>
                    <input className="form-input" placeholder="Mumbai" value={form.city}
                      onChange={e => setForm(p => ({ ...p, city: e.target.value }))} />
                    {errors.city && <span className="ref-error">{errors.city}</span>}
                  </div>
                  <div className="ref-terms">
                    <CheckCircle size={14} color="var(--success)" />
                    <span>No qualification required. Open to everyone!</span>
                  </div>
                  <button type="submit" className="btn btn-primary btn-lg" style={{ justifyContent: 'center' }}>
                    <Users size={17} /> Register as Partner <ArrowRight size={16} />
                  </button>
                </form>
              </div>
            ) : (
              <div className="ref-dashboard animate-fade-up">
                <div className="ref-dashboard__welcome">
                  <div className="ref-dashboard__avatar">{partner.name.charAt(0)}</div>
                  <div>
                    <h3>Welcome, {partner.name}! 🎉</h3>
                    <p>Your referral partner account is active.</p>
                  </div>
                </div>
                <div className="ref-dashboard__stats">
                  <div className="ref-stat"><IndianRupee size={18} color="var(--success)" /><div><span>₹0</span><span>Total Earned</span></div></div>
                  <div className="ref-stat"><Users size={18} color="var(--primary-light)" /><div><span>0</span><span>Referrals</span></div></div>
                </div>
                <div className="ref-code-box">
                  <p>Your Referral Code</p>
                  <div className="ref-code-box__code">{partner.referralCode}</div>
                  <div className="ref-code-box__link">jhatechsolutions.in/ref/{partner.referralCode}</div>
                  <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
                    <button className="btn btn-secondary btn-sm" onClick={copyCode} style={{ flex: 1, justifyContent: 'center' }}>
                      <Copy size={14} /> {copied ? 'Copied!' : 'Copy'}
                    </button>
                    <button className="btn btn-primary btn-sm" onClick={shareLink} style={{ flex: 1, justifyContent: 'center' }}>
                      <Share2 size={14} /> Share
                    </button>
                  </div>
                </div>
                <a href={`https://wa.me/919999999999?text=Hi!+I+just+registered+as+partner.+My+code:+${partner.referralCode}`}
                  target="_blank" rel="noopener noreferrer"
                  className="btn btn-whatsapp" style={{ width: '100%', justifyContent: 'center' }}>
                  <MessageCircle size={15} /> Confirm on WhatsApp
                </a>
              </div>
            )}

            {/* How It Works */}
            <div className="ref-hiw">
              <h4>How It Works</h4>
              {[
                { n:'1', t:'Register Free',          d:'Fill the form and get your unique referral code instantly.' },
                { n:'2', t:'Share with Businesses',  d:'Send your link to shops, restaurants, clinics — any local business.' },
                { n:'3', t:'They Buy a Package',     d:'When they purchase any JhaTech plan using your code, you earn ₹1,000.' },
                { n:'4', t:'Get Paid in 7 Days',     d:'Earnings transferred to your UPI or bank account.' },
              ].map(s => (
                <div key={s.n} className="ref-hiw__step">
                  <div className="ref-hiw__num">{s.n}</div>
                  <div><strong>{s.t}</strong><p>{s.d}</p></div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT — Chatbot */}
          <div>
            <div className="ref-chatbot">
              <div className="ref-chatbot__head">
                <div className="ref-chatbot__avatar"><Bot size={16} /></div>
                <div>
                  <strong>JhaTech AI Assistant</strong>
                  <div className="ref-chatbot__status"><span className="ref-chatbot__dot" /> Online</div>
                </div>
              </div>

              <div className="ref-chatbot__msgs">
                {msgs.map((m, i) => (
                  <div key={i} className={`ref-msg ref-msg--${m.role}`}>
                    {m.role === 'bot' && <div className="ref-msg__av"><Bot size={13} /></div>}
                    <div className="ref-msg__bubble">{m.text}</div>
                    {m.role === 'user' && <div className="ref-msg__av ref-msg__av--user"><User size={13} /></div>}
                  </div>
                ))}
                {botTyping && (
                  <div className="ref-msg ref-msg--bot">
                    <div className="ref-msg__av"><Bot size={13} /></div>
                    <div className="ref-msg__bubble ref-msg__bubble--typing"><span /><span /><span /></div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              <div className="ref-chatbot__quick">
                {QUICK_Q.map(q => (
                  <button key={q.key} className="ref-quick-btn" onClick={() => sendMsg(q.label)}>{q.label}</button>
                ))}
              </div>

              <div className="ref-chatbot__input">
                <input className="form-input" placeholder="Ask about earning, payments…"
                  value={chatInput} onChange={e => setChatInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && sendMsg()} />
                <button className="btn btn-primary" onClick={() => sendMsg()} disabled={!chatInput.trim()}
                  style={{ padding: '0.7rem 1rem', borderRadius: 'var(--radius-md)', flexShrink: 0 }}>
                  <Send size={15} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .ref-hero { padding: 5rem 0 3.5rem; position: relative; overflow: hidden; }
        .ref-hero__glow { position: absolute; inset: 0; background: radial-gradient(ellipse at 50% 0%, rgba(16,185,129,0.15) 0%, transparent 65%); pointer-events: none; }
        .ref-hero__stats { display: flex; justify-content: center; gap: 3rem; flex-wrap: wrap; margin-top: 2.5rem; padding: 1.75rem 2rem; background: rgba(255,255,255,0.03); border: 1px solid var(--dark-border); border-radius: var(--radius-xl); max-width: 600px; margin-left: auto; margin-right: auto; }
        .ref-hero__stat { text-align: center; }
        .ref-hero__stat span:first-child { display: block; font-size: 1.6rem; font-weight: 900; font-family: var(--font-heading); }
        .ref-hero__stat span:last-child { display: block; font-size: 0.75rem; color: var(--gray-400); text-transform: uppercase; letter-spacing: 0.06em; margin-top: 0.2rem; }

        .ref-layout { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; align-items: start; margin-top: 2rem; }

        .ref-card { background: var(--dark-card); border: 1px solid var(--dark-border); border-radius: var(--radius-2xl); padding: 2rem; }
        .ref-card__head { display: flex; align-items: center; gap: 1rem; margin-bottom: 1.5rem; }
        .ref-card__icon { width: 44px; height: 44px; border-radius: var(--radius-md); background: linear-gradient(135deg, var(--primary), var(--primary-light)); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .ref-card__head h3 { font-size: 1.1rem; font-weight: 800; margin: 0; }
        .ref-card__head p { font-size: 0.82rem; color: var(--gray-400); margin: 0; }
        .ref-error { font-size: 0.8rem; color: var(--danger); }
        .ref-terms { display: flex; align-items: center; gap: 0.5rem; font-size: 0.82rem; color: var(--gray-400); background: rgba(16,185,129,0.07); border: 1px solid rgba(16,185,129,0.18); border-radius: var(--radius-md); padding: 0.65rem 0.9rem; }

        .ref-dashboard { background: var(--dark-card); border: 1px solid var(--dark-border); border-radius: var(--radius-2xl); padding: 2rem; display: flex; flex-direction: column; gap: 1.5rem; }
        .ref-dashboard__welcome { display: flex; align-items: center; gap: 1rem; }
        .ref-dashboard__avatar { width: 48px; height: 48px; border-radius: 50%; background: linear-gradient(135deg, var(--primary), var(--accent)); display: flex; align-items: center; justify-content: center; font-size: 1.3rem; font-weight: 800; flex-shrink: 0; }
        .ref-dashboard__welcome h3 { font-size: 1.1rem; margin: 0 0 0.15rem; }
        .ref-dashboard__welcome p { font-size: 0.82rem; color: var(--gray-400); margin: 0; }
        .ref-dashboard__stats { display: flex; gap: 1rem; }
        .ref-stat { flex: 1; display: flex; align-items: center; gap: 0.75rem; padding: 1rem; background: rgba(255,255,255,0.04); border: 1px solid var(--dark-border); border-radius: var(--radius-md); }
        .ref-stat span:first-child { display: block; font-size: 1.4rem; font-weight: 900; font-family: var(--font-heading); }
        .ref-stat span:last-child { display: block; font-size: 0.75rem; color: var(--gray-400); }

        .ref-code-box { background: rgba(108,60,225,0.08); border: 1px solid rgba(108,60,225,0.25); border-radius: var(--radius-lg); padding: 1.5rem; text-align: center; }
        .ref-code-box p { font-size: 0.8rem; color: var(--gray-400); margin: 0 0 0.5rem; }
        .ref-code-box__code { font-size: 2rem; font-weight: 900; letter-spacing: 0.12em; font-family: var(--font-heading); background: linear-gradient(135deg, var(--primary-light), var(--accent)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
        .ref-code-box__link { font-size: 0.78rem; color: var(--gray-500); margin-top: 0.3rem; }

        .ref-hiw { background: var(--dark-card); border: 1px solid var(--dark-border); border-radius: var(--radius-2xl); padding: 1.75rem; margin-top: 1.5rem; }
        .ref-hiw h4 { font-size: 1rem; font-weight: 700; margin-bottom: 1.25rem; }
        .ref-hiw__step { display: flex; gap: 1rem; align-items: flex-start; margin-bottom: 1.1rem; }
        .ref-hiw__step:last-child { margin-bottom: 0; }
        .ref-hiw__num { width: 28px; height: 28px; border-radius: 50%; background: linear-gradient(135deg, var(--primary), var(--primary-light)); display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 0.82rem; flex-shrink: 0; }
        .ref-hiw__step strong { display: block; font-size: 0.9rem; margin-bottom: 0.2rem; }
        .ref-hiw__step p { font-size: 0.82rem; color: var(--gray-400); margin: 0; }

        .ref-chatbot { background: var(--dark-card); border: 1px solid var(--dark-border); border-radius: var(--radius-2xl); overflow: hidden; display: flex; flex-direction: column; height: 680px; position: sticky; top: 6rem; }
        .ref-chatbot__head { display: flex; align-items: center; gap: 0.9rem; padding: 1.25rem 1.5rem; background: linear-gradient(135deg, rgba(108,60,225,0.2), rgba(108,60,225,0.05)); border-bottom: 1px solid var(--dark-border); }
        .ref-chatbot__avatar { width: 38px; height: 38px; border-radius: 50%; background: linear-gradient(135deg, var(--primary), var(--primary-light)); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .ref-chatbot__head strong { display: block; font-size: 0.95rem; }
        .ref-chatbot__status { display: flex; align-items: center; gap: 0.4rem; font-size: 0.78rem; color: var(--gray-400); }
        .ref-chatbot__dot { width: 7px; height: 7px; border-radius: 50%; background: var(--success); animation: pulse-glow 2s ease-in-out infinite; }
        .ref-chatbot__msgs { flex: 1; overflow-y: auto; padding: 1.25rem; display: flex; flex-direction: column; gap: 1rem; }
        .ref-msg { display: flex; gap: 0.6rem; align-items: flex-end; }
        .ref-msg--user { flex-direction: row-reverse; }
        .ref-msg__av { width: 28px; height: 28px; border-radius: 50%; background: rgba(108,60,225,0.25); display: flex; align-items: center; justify-content: center; flex-shrink: 0; color: var(--primary-light); }
        .ref-msg__av--user { background: rgba(245,158,11,0.2); color: var(--accent); }
        .ref-msg__bubble { max-width: 80%; padding: 0.75rem 1rem; border-radius: 14px; font-size: 0.875rem; line-height: 1.55; }
        .ref-msg--bot .ref-msg__bubble { background: rgba(255,255,255,0.06); border-bottom-left-radius: 4px; color: var(--gray-200); }
        .ref-msg--user .ref-msg__bubble { background: linear-gradient(135deg, var(--primary), var(--primary-light)); border-bottom-right-radius: 4px; color: white; }
        .ref-msg__bubble--typing { display: flex; align-items: center; gap: 4px; padding: 0.65rem 0.9rem; }
        .ref-msg__bubble--typing span { width: 7px; height: 7px; border-radius: 50%; background: var(--gray-400); animation: typing-dot 1.4s ease-in-out infinite; }
        .ref-msg__bubble--typing span:nth-child(2) { animation-delay: 0.2s; }
        .ref-msg__bubble--typing span:nth-child(3) { animation-delay: 0.4s; }
        @keyframes typing-dot { 0%,80%,100%{transform:scale(0.7);opacity:0.4} 40%{transform:scale(1);opacity:1} }
        .ref-chatbot__quick { display: flex; flex-wrap: wrap; gap: 0.4rem; padding: 0.75rem 1rem; border-top: 1px solid var(--dark-border); }
        .ref-quick-btn { padding: 0.3rem 0.75rem; border-radius: var(--radius-full); background: rgba(108,60,225,0.1); border: 1px solid rgba(108,60,225,0.22); color: var(--primary-light); font-size: 0.76rem; font-weight: 500; transition: var(--transition); }
        .ref-quick-btn:hover { background: rgba(108,60,225,0.22); }
        .ref-chatbot__input { display: flex; gap: 0.6rem; padding: 1rem 1.25rem; border-top: 1px solid var(--dark-border); }

        @media (max-width: 860px) {
          .ref-layout { grid-template-columns: 1fr; }
          .ref-chatbot { height: 500px; position: static; }
        }
        @media (max-width: 480px) {
          .ref-hero__stats { gap: 1.5rem; }
        }
      `}</style>
    </main>
  );
}
