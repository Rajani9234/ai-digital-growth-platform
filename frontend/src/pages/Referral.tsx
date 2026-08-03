import { useState } from 'react';
import {
  Users, IndianRupee, MessageCircle, CheckCircle, ArrowRight,
  Copy, Share2, Zap, Gift,
} from 'lucide-react';
import type { ReferralPartner } from '../types';
import { registerPartner } from '../utils/api';
import AIChat from '../components/ui/AIChat';
import { askGemini } from '../services/gemini';

const QUICK_QUESTIONS = [
  { label: 'How much can I earn?', key: 'earn' },
  { label: 'How to join?', key: 'join' },
  { label: 'How do I track referrals?', key: 'track' },
  { label: 'When do I get paid?', key: 'payment' },
  { label: 'Do I need a degree?', key: 'qualify' },
  { label: 'How to promote?', key: 'promote' },
];

// generateCode used as local fallback when backend is unavailable
function generateCode(name: string): string {
  return 'JT' + name.toUpperCase().replace(/\s/g, '').slice(0, 4) + Math.floor(1000 + Math.random() * 9000);
}

const INITIAL_FORM: ReferralPartner = { name: '', phone: '', email: '', city: '' };

export default function Referral() {
  const [form, setForm]         = useState<ReferralPartner>(INITIAL_FORM);
  const [registered, setReg]    = useState(false);
  const [partner, setPartner]   = useState<ReferralPartner | null>(null);
  const [errors, setErrors]     = useState<Partial<ReferralPartner>>({});
  const [copied, setCopied]     = useState(false);

  const validate = () => {
    const e: Partial<ReferralPartner> = {};
    if (!form.name.trim())  e.name  = 'Name is required';
    if (!form.phone.trim() || !/^[6-9]\d{9}$/.test(form.phone)) e.phone = 'Enter a valid 10-digit mobile number';
    if (!form.city.trim())  e.city  = 'City is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      const res = await registerPartner({
        name:  form.name,
        phone: form.phone,
        email: form.email,
        city:  form.city,
      });
      const p = res.partner;
      setPartner({
        name:           p.name,
        phone:          p.phone,
        email:          p.email ?? '',
        city:           p.city,
        referralCode:   p.referral_code,
        totalReferrals: p.total_referrals,
        totalEarnings:  p.total_earnings,
      });
      setReg(true);
    } catch (_err) {
      // Fallback: generate code locally if backend not available
      const code = generateCode(form.name);
      setPartner({ ...form, referralCode: code, totalReferrals: 0, totalEarnings: 0 });
      setReg(true);
    }
  };

  const copyCode = () => {
    if (!partner?.referralCode) return;
    navigator.clipboard.writeText(partner.referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareLink = () => {
  if (!partner?.referralCode) return;

  const referralLink = `https://jhatechsolutions.in/ref/${partner.referralCode}`;

  const message = `🚀 Join JhaTech Solutions Referral Program.\nUse my referral code: ${partner.referralCode}\n${referralLink}`;

  window.open(
    `https://wa.me/?text=${encodeURIComponent(message)}`,
    "_blank"
  );
};

  return (
    <main style={{ paddingTop: '5rem' }}>
      {/* ── Header ── */}
      <section className="ref-hero">
        <div className="ref-hero__glow" />
        <div className="container" style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <div className="badge badge-green" style={{ display: 'inline-flex', marginBottom: '1rem' }}>
            <Gift size={13} /> Referral Partner Program
          </div>
          <h1 className="section-title">
            Refer & Earn <span className="gradient-text">₹1,000</span><br />Per Successful Sale
          </h1>
          <p className="section-subtitle">
            No degree needed. No experience needed. Just refer local businesses to JhaTech
            and earn every time they buy a package.
          </p>
          <div style={{ display: 'flex', gap: '3rem', justifyContent: 'center', flexWrap: 'wrap', marginTop: '2rem' }}>
            {[
              { val: '₹1,000', label: 'Per Sale' },
              { val: 'Unlimited', label: 'Earning Potential' },
              { val: '0', label: 'Qualification Required' },
              { val: '7 Days', label: 'Payout Time' },
            ].map(s => (
              <div key={s.label} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.7rem', fontWeight: 900, fontFamily: 'var(--font-heading)' }} className="gradient-text">{s.val}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--gray-400)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="container" style={{ paddingBottom: '5rem' }}>
        <div className="ref-layout">

          {/* ── LEFT: Registration / Dashboard ── */}
          <div>
            {!registered ? (
              <div className="ref-card animate-fade-up">
                <h3 className="ref-card__title">
                  <Zap size={20} color="var(--accent)" /> Join as a Referral Partner
                </h3>
                <p style={{ color: 'var(--gray-400)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                  Free to join. Start earning in minutes. No qualification required.
                </p>

                <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Full Name *</label>
                    <input
                      className="form-input"
                      placeholder="Rahul Sharma"
                      value={form.name}
                      onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                    />
                    {errors.name && <span style={{ fontSize: '0.8rem', color: 'var(--danger)' }}>{errors.name}</span>}
                  </div>
                  <div className="form-group">
                    <label className="form-label">Mobile Number *</label>
                    <input
                      className="form-input"
                      placeholder="9876543210"
                      maxLength={10}
                      value={form.phone}
                      onChange={e => setForm(p => ({ ...p, phone: e.target.value.replace(/\D/g, '') }))}
                    />
                    {errors.phone && <span style={{ fontSize: '0.8rem', color: 'var(--danger)' }}>{errors.phone}</span>}
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email (Optional)</label>
                    <input
                      className="form-input"
                      type="email"
                      placeholder="rahul@gmail.com"
                      value={form.email}
                      onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">City *</label>
                    <input
                      className="form-input"
                      placeholder="Mumbai"
                      value={form.city}
                      onChange={e => setForm(p => ({ ...p, city: e.target.value }))}
                    />
                    {errors.city && <span style={{ fontSize: '0.8rem', color: 'var(--danger)' }}>{errors.city}</span>}
                  </div>

                  <div className="ref-terms">
                    <CheckCircle size={14} color="var(--success)" />
                    <span>No educational qualification required. Open to everyone!</span>
                  </div>

                  <button type="submit" className="btn btn-primary btn-lg" style={{ justifyContent: 'center' }}>
                    <Users size={18} /> Register as Partner <ArrowRight size={16} />
                  </button>
                </form>
              </div>
            ) : (
              <div className="partner-dashboard animate-fade-up">
                <div className="partner-dashboard__welcome">
                  <div className="partner-dashboard__avatar">{partner?.name?.charAt(0)}</div>
                  <div>
                    <h3>Welcome, {partner?.name}! 🎉</h3>
                    <p>Your referral partner account is active.</p>
                  </div>
                </div>

                <div className="partner-dashboard__stats">
                  <div className="partner-stat">
                    <IndianRupee size={20} color="var(--success)" />
                    <div>
                      <span className="partner-stat__val">₹{partner?.totalEarnings ?? 0}</span>
                      <span className="partner-stat__label">Total Earned</span>
                    </div>
                  </div>
                  <div className="partner-stat">
                    <Users size={20} color="var(--primary-light)" />
                    <div>
                      <span className="partner-stat__val">{partner?.totalReferrals ?? 0}</span>
                      <span className="partner-stat__label">Referrals Made</span>
                    </div>
                  </div>
                </div>

                <div className="ref-code-box">
                  <p className="ref-code-box__label">Your Referral Code</p>
                  <div className="ref-code-box__code">{partner?.referralCode}</div>
                  <p className="ref-code-box__link">jhatechsolutions.in/ref/{partner?.referralCode}</p>
                  <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
                    <button className="btn btn-secondary btn-sm" onClick={copyCode} style={{ flex: 1, justifyContent: 'center' }}>
                      <Copy size={14} /> {copied ? 'Copied!' : 'Copy Code'}
                    </button>
                    <button className="btn btn-primary btn-sm" onClick={shareLink} style={{ flex: 1, justifyContent: 'center' }}>
                      <Share2 size={14} /> Share Link
                    </button>
                  </div>
                </div>

                <a
                  href={`https://wa.me/919999999999?text=Hi!+I+just+registered+as+a+JhaTech+referral+partner.+My+code+is+${partner?.referralCode}.+Please+activate+my+account.`}
                  target="_blank" rel="noopener noreferrer"
                  className="btn btn-whatsapp" style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem' }}
                >
                  <MessageCircle size={16} /> Confirm on WhatsApp
                </a>
              </div>
            )}

            {/* How It Works */}
            <div className="how-it-works" style={{ marginTop: '1.5rem' }}>
              <h4 style={{ marginBottom: '1.25rem', fontSize: '1rem', fontWeight: 700 }}>How It Works</h4>
              {[
                { step: '1', title: 'Register Free', desc: 'Fill the form above and get your unique referral code instantly.' },
                { step: '2', title: 'Share with Businesses', desc: 'Send your link to shops, restaurants, clinics — any local business.' },
                { step: '3', title: 'They Purchase a Plan', desc: 'When they buy any JhaTech package using your code, you earn ₹1,000.' },
                { step: '4', title: 'Get Paid in 7 Days', desc: 'Earnings transferred directly to your UPI / bank account.' },
              ].map(s => (
                <div key={s.step} className="hiw-step">
                  <div className="hiw-step__num">{s.step}</div>
                  <div>
                    <strong>{s.title}</strong>
                    <p>{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── RIGHT: AI Chatbot (Gemini) ── */}
{/* RIGHT: AI Chatbot (Gemini) */}
<div
  style={{
    height: "700px",
    minHeight: 0,
    display: "flex",
  }}
>
  <AIChat
    height="100%"
    mode="referral"
    title="JhaTech AI Assistant"
    subtitle="Referral Program — Ask me anything!"
    placeholder="Ask about earning, joining, payments..."
    quickQuestions={QUICK_QUESTIONS.map(q => ({
      label: q.label,
      value: q.key,
    }))}
    sticky={false}

    systemPrompt="You are a referral program assistant for JhaTech Solutions. Answer clearly and concisely about referral earnings, signup, tracking, payment, sharing links, and promotion ideas."

    onUserMessage={async (m: string) => {
      const prompt = `You are a referral program assistant. The user asks: "${m}". Answer clearly and naturally.`;
      const g = await askGemini(prompt);
      return g?.trim() || "Gemini returned an empty response.";
    }}
  />
</div>
</div>   {/* ref-layout */}
</div>   {/* container */}

<style>{`
  ...
`}</style>

  <style>{`
        .ref-hero {
          padding: 5rem 0 3.5rem;
          position: relative; overflow: hidden;
        }
        .ref-hero__glow {
          position: absolute; inset: 0;
          background: radial-gradient(ellipse at 50% 0%, rgba(16,185,129,0.12) 0%, transparent 65%);
          pointer-events: none;
        }
        .ref-layout {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
          align-items: start;
          margin-top: 1.5rem;
        }

        .ref-layout > div {
  min-height: 0;
}
        .ref-card {
          background: var(--dark-card);
          border: 1px solid var(--dark-border);
          border-radius: var(--radius-xl);
          padding: 2rem;
        }
        .ref-card__title {
          display: flex; align-items: center; gap: 0.6rem;
          font-size: 1.15rem; font-weight: 800; margin-bottom: 0.5rem;
        }
        .ref-terms {
          display: flex; align-items: center; gap: 0.5rem;
          font-size: 0.82rem; color: var(--gray-400);
          background: rgba(16,185,129,0.08);
          border: 1px solid rgba(16,185,129,0.2);
          border-radius: var(--radius-md);
          padding: 0.65rem 0.9rem;
        }
        /* Dashboard */
        .partner-dashboard {
          background: var(--dark-card);
          border: 1px solid var(--dark-border);
          border-radius: var(--radius-xl);
          padding: 2rem;
          display: flex; flex-direction: column; gap: 1.5rem;
        }
        .partner-dashboard__welcome {
          display: flex; align-items: center; gap: 1rem;
        }
        .partner-dashboard__avatar {
          width: 48px; height: 48px; border-radius: 50%;
          background: linear-gradient(135deg, var(--primary), var(--accent));
          display: flex; align-items: center; justify-content: center;
          font-size: 1.3rem; font-weight: 800; flex-shrink: 0;
        }
        .partner-dashboard__welcome h3 { font-size: 1.1rem; margin-bottom: 0.15rem; }
        .partner-dashboard__welcome p { font-size: 0.82rem; color: var(--gray-400); margin: 0; }
        .partner-dashboard__stats { display: flex; gap: 1rem; }
        .partner-stat {
          flex: 1; display: flex; align-items: center; gap: 0.75rem;
          background: rgba(255,255,255,0.04);
          border: 1px solid var(--dark-border);
          border-radius: var(--radius-md); padding: 1rem;
        }
        .partner-stat__val { display: block; font-size: 1.4rem; font-weight: 900; font-family: var(--font-heading); }
        .partner-stat__label { display: block; font-size: 0.75rem; color: var(--gray-400); }
        .ref-code-box {
          background: rgba(108,60,225,0.08);
          border: 1px solid rgba(108,60,225,0.25);
          border-radius: var(--radius-lg);
          padding: 1.5rem; text-align: center;
        }
        .ref-code-box__label { font-size: 0.8rem; color: var(--gray-400); margin-bottom: 0.5rem; }
        .ref-code-box__code {
          font-size: 2rem; font-weight: 900; letter-spacing: 0.12em;
          font-family: var(--font-heading);
          background: linear-gradient(135deg, var(--primary-light), var(--accent));
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
        }
        .ref-code-box__link { font-size: 0.8rem; color: var(--gray-500); margin-top: 0.35rem; }

        /* How it works */
        .how-it-works {
          background: var(--dark-card);
          border: 1px solid var(--dark-border);
          border-radius: var(--radius-xl);
          padding: 1.75rem;
        }
        .hiw-step {
          display: flex; gap: 1rem; align-items: flex-start;
          margin-bottom: 1.25rem;
        }
        .hiw-step:last-child { margin-bottom: 0; }
        .hiw-step__num {
          width: 30px; height: 30px; border-radius: 50%;
          background: linear-gradient(135deg, var(--primary), var(--primary-light));
          display: flex; align-items: center; justify-content: center;
          font-weight: 800; font-size: 0.85rem; flex-shrink: 0;
        }
        .hiw-step strong { display: block; font-size: 0.9rem; margin-bottom: 0.2rem; }
        .hiw-step p { font-size: 0.83rem; color: var(--gray-400); margin: 0; }

        @media (max-width: 860px) { .ref-layout { grid-template-columns: 1fr; } }
      `}</style>
    </main>
  );
}
