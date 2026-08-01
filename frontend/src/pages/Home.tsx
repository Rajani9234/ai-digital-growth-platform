import { Link } from 'react-router-dom';
import {
  ArrowRight, BarChart2, DollarSign, Users, TrendingUp,
  CheckCircle, Star, Zap, Globe, MessageCircle, Sparkles, Shield, Clock,
} from 'lucide-react';

const stats = [
  { value: '500+', label: 'Businesses Grown', icon: '🚀' },
  { value: '₹2Cr+', label: 'Revenue Generated', icon: '💰' },
  { value: '98%', label: 'Client Satisfaction', icon: '⭐' },
  { value: '3x', label: 'Avg ROI Delivered', icon: '📈' },
];

const features = [
  {
    icon: <BarChart2 size={22} />,
    title: 'AI Pain-Point Analysis',
    desc: 'Submit your business challenges and get a custom AI-generated growth report in seconds.',
    href: '/pain-analysis',
    color: '#8B5CF6',
    bg: 'rgba(139,92,246,0.12)',
    badge: 'Free Report',
  },
  {
    icon: <DollarSign size={22} />,
    title: 'Transparent Pricing',
    desc: 'Clear, no-surprise pricing for websites and digital marketing. WhatsApp us instantly.',
    href: '/pricing',
    color: '#F59E0B',
    bg: 'rgba(245,158,11,0.12)',
    badge: 'From ₹8,999',
  },
  {
    icon: <Users size={22} />,
    title: 'Refer & Earn ₹1,000',
    desc: 'No degree needed. Refer businesses to us and earn ₹1,000 per successful sale.',
    href: '/referral',
    color: '#10B981',
    bg: 'rgba(16,185,129,0.12)',
    badge: 'Unlimited',
  },
  {
    icon: <TrendingUp size={22} />,
    title: 'AI Market Insights',
    desc: 'Real-time competitor analysis and market trend recommendations powered by AI.',
    href: '/insights',
    color: '#3B82F6',
    bg: 'rgba(59,130,246,0.12)',
    badge: 'Live Data',
  },
];

const testimonials = [
  {
    name: 'Priya Sharma',
    business: 'Priya Sarees, Surat',
    text: 'JhaTech built our website and within 2 months we started getting orders from Pune and Mumbai. Sales are up 60%!',
    rating: 5,
    avatar: 'P',
    color: '#8B5CF6',
  },
  {
    name: 'Rajesh Gupta',
    business: 'Gupta Electronics, Mumbai',
    text: 'The digital marketing team is amazing. Our Google ranking went from page 5 to page 1 in just 3 months.',
    rating: 5,
    avatar: 'R',
    color: '#F59E0B',
  },
  {
    name: 'Sunita Verma',
    business: 'Sunita Boutique, Nagpur',
    text: 'I never thought a small boutique could compete with big brands online. Now I get 20+ daily inquiries!',
    rating: 5,
    avatar: 'S',
    color: '#10B981',
  },
];

const whyUs = [
  'AI-generated business reports in seconds',
  'Dedicated account manager for every client',
  'Monthly performance reports with clear ROI',
  'Works for any business size or category',
  '₹1,000 referral commission — no limits',
];

export default function Home() {
  return (
    <main className="home">

      {/* ── HERO ── */}
      <section className="hero">
        <div className="hero__bg" />
        <div className="hero__orb hero__orb--1" />
        <div className="hero__orb hero__orb--2" />
        <div className="container hero__content">
          <div className="badge badge-purple animate-fade-up" style={{ marginBottom: '1.5rem' }}>
            <Sparkles size={12} /> AI-Powered Digital Growth Platform
          </div>
          <h1 className="hero__title animate-fade-up">
            Grow Your Local Business<br />
            <span className="gradient-text">10x with AI & Digital Marketing</span>
          </h1>
          <p className="hero__subtitle animate-fade-up">
            From saree shops to electronics stores — we help Indian businesses build a powerful
            online presence, attract more customers, and scale revenue with data-driven strategies.
          </p>
          <div className="hero__ctas animate-fade-up">
            <Link to="/pain-analysis" className="btn btn-primary btn-lg">
              <Zap size={17} /> Analyse My Business Free <ArrowRight size={17} />
            </Link>
            <Link to="/pricing" className="btn btn-secondary btn-lg">
              View Pricing
            </Link>
          </div>

          {/* Stats bar */}
          <div className="hero__stats animate-fade-up">
            {stats.map((s) => (
              <div key={s.label} className="hero__stat">
                <span className="hero__stat__emoji">{s.icon}</span>
                <span className="hero__stat__value gradient-text">{s.value}</span>
                <span className="hero__stat__label">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="section features-section">
        <div className="container">
          <div className="badge badge-purple" style={{ display: 'flex', width: 'fit-content', margin: '0 auto 1rem' }}>
            <Zap size={12} /> What We Offer
          </div>
          <h2 className="section-title">
            Everything Your Business Needs to<br />
            <span className="gradient-text">Win Online</span>
          </h2>
          <p className="section-subtitle">
            Four powerful modules designed to take you from invisible to unstoppable.
          </p>
          <div className="features-grid">
            {features.map((f) => (
              <Link key={f.title} to={f.href} className="feature-card">
                <div className="feature-card__top">
                  <div className="feature-card__icon" style={{ background: f.bg, color: f.color }}>
                    {f.icon}
                  </div>
                  <span className="feature-card__badge" style={{ color: f.color, background: f.bg, border: `1px solid ${f.color}40` }}>
                    {f.badge}
                  </span>
                </div>
                <h3 className="feature-card__title">{f.title}</h3>
                <p className="feature-card__desc">{f.desc}</p>
                <div className="feature-card__cta" style={{ color: f.color }}>
                  Explore <ArrowRight size={14} />
                </div>
                <div className="feature-card__hover-bg" style={{ background: `radial-gradient(circle at 0% 100%, ${f.bg} 0%, transparent 60%)` }} />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY US ── */}
      <section className="section why-section">
        <div className="container">
          <div className="why-grid">
            <div className="why-left">
              <div className="badge badge-amber" style={{ marginBottom: '1.25rem' }}>Why JhaTech?</div>
              <h2 className="why-title">
                We Don't Just Build Websites.<br />
                <span className="gradient-text">We Build Businesses.</span>
              </h2>
              <p className="why-desc">
                Most agencies focus on deliverables. We focus on results. Every strategy is backed by
                AI analysis, competitor research, and proven frameworks tailored for Indian markets.
              </p>
              <ul className="why-list">
                {whyUs.map((item) => (
                  <li key={item}>
                    <CheckCircle size={16} color="var(--success)" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <div className="why-btns">
                <Link to="/pain-analysis" className="btn btn-primary">
                  Get My Free Report <ArrowRight size={15} />
                </Link>
                <a href="https://wa.me/919999999999" target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp">
                  <MessageCircle size={15} /> Talk to Us
                </a>
              </div>
            </div>
            <div className="why-right">
              {[
                { icon: <Globe size={24} color="#8B5CF6" />, title: 'Website Live in 7 Days', desc: 'Fast delivery, zero compromise on quality', offset: false },
                { icon: <BarChart2 size={24} color="#F59E0B" />, title: 'Real-time Analytics', desc: 'Know exactly how your website performs', offset: true },
                { icon: <TrendingUp size={24} color="#10B981" />, title: 'Avg 3x ROI in 90 Days', desc: 'Proven results across 500+ businesses', offset: false },
                { icon: <Shield size={24} color="#3B82F6" />, title: '100% Ownership', desc: 'You own domain, website, all assets', offset: true },
              ].map((card) => (
                <div key={card.title} className={`why-card ${card.offset ? 'why-card--offset' : ''}`}>
                  <div className="why-card__icon">{card.icon}</div>
                  <div>
                    <strong>{card.title}</strong>
                    <p>{card.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="section">
        <div className="container">
          <div className="badge badge-green" style={{ display: 'flex', width: 'fit-content', margin: '0 auto 1rem' }}>
            <Star size={12} fill="currentColor" /> Client Stories
          </div>
          <h2 className="section-title">Real Businesses. Real Results.</h2>
          <p className="section-subtitle">Don't take our word for it — hear from our clients.</p>
          <div className="grid-3">
            {testimonials.map((t) => (
              <div key={t.name} className="card testi-card">
                <div className="testi-stars">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} size={13} fill="var(--accent)" color="var(--accent)" />
                  ))}
                </div>
                <p className="testi-text">"{t.text}"</p>
                <div className="testi-author">
                  <div className="testi-avatar" style={{ background: `linear-gradient(135deg, ${t.color}, ${t.color}88)` }}>
                    {t.avatar}
                  </div>
                  <div>
                    <strong>{t.name}</strong>
                    <p>{t.business}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TRUST BAR ── */}
      <section className="trust-bar">
        <div className="container trust-bar__inner">
          {[
            { icon: <Clock size={18} color="var(--accent)" />, text: 'Website live in 7 days' },
            { icon: <Shield size={18} color="var(--success)" />, text: '100% money-back guarantee' },
            { icon: <Star size={18} color="var(--primary-light)" />, text: '4.9/5 average client rating' },
            { icon: <Users size={18} color="#3B82F6" />, text: '500+ businesses served' },
          ].map(t => (
            <div key={t.text} className="trust-item">
              {t.icon}<span>{t.text}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="cta-section">
        <div className="cta-section__glow" />
        <div className="container cta-section__inner">
          <div>
            <h2 className="cta-section__title">Ready to Transform Your Business?</h2>
            <p className="cta-section__sub">Free consultation. No commitment. Real results.</p>
          </div>
          <div className="cta-section__btns">
            <Link to="/pain-analysis" className="btn btn-accent btn-lg">
              <Sparkles size={17} /> Start Free Analysis
            </Link>
            <a href="https://wa.me/919999999999" target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp btn-lg">
              <MessageCircle size={17} /> WhatsApp Now
            </a>
          </div>
        </div>
      </section>

      <style>{`
        /* ── Hero ── */
        .hero { min-height: 100vh; display: flex; align-items: center; padding: 9rem 0 6rem; position: relative; overflow: hidden; }
        .hero__bg { position: absolute; inset: 0; background: radial-gradient(ellipse 80% 60% at 50% -10%, rgba(108,60,225,0.22) 0%, transparent 60%); pointer-events: none; }
        .hero__orb { position: absolute; border-radius: 50%; pointer-events: none; filter: blur(80px); }
        .hero__orb--1 { width: 500px; height: 500px; background: rgba(108,60,225,0.12); top: -100px; left: -100px; animation: float 8s ease-in-out infinite; }
        .hero__orb--2 { width: 400px; height: 400px; background: rgba(245,158,11,0.08); bottom: -50px; right: -80px; animation: float 10s ease-in-out infinite reverse; }
        .hero__content { text-align: center; position: relative; z-index: 1; }
        .hero__title { font-size: clamp(2.4rem, 5.5vw, 4.2rem); font-weight: 900; line-height: 1.08; margin-bottom: 1.5rem; letter-spacing: -0.02em; }
        .hero__subtitle { font-size: clamp(1rem, 2vw, 1.2rem); color: var(--gray-400); max-width: 620px; margin: 0 auto 2.75rem; line-height: 1.8; }
        .hero__ctas { display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; margin-bottom: 4rem; }
        .hero__stats { display: flex; justify-content: center; gap: 0; flex-wrap: wrap; max-width: 720px; margin: 0 auto; background: rgba(255,255,255,0.03); border: 1px solid var(--dark-border); border-radius: var(--radius-xl); overflow: hidden; backdrop-filter: blur(20px); }
        .hero__stat { flex: 1; min-width: 140px; text-align: center; padding: 1.75rem 1rem; border-right: 1px solid var(--dark-border); position: relative; }
        .hero__stat:last-child { border-right: none; }
        .hero__stat__emoji { display: block; font-size: 1.4rem; margin-bottom: 0.4rem; }
        .hero__stat__value { display: block; font-size: 1.9rem; font-weight: 900; font-family: var(--font-heading); line-height: 1; margin-bottom: 0.35rem; }
        .hero__stat__label { font-size: 0.76rem; color: var(--gray-500); text-transform: uppercase; letter-spacing: 0.06em; }

        /* ── Features ── */
        .features-section { background: rgba(255,255,255,0.012); }
        .features-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1.5rem; }
        .feature-card { position: relative; display: flex; flex-direction: column; gap: 1rem; padding: 2rem; background: var(--dark-card); border: 1px solid var(--dark-border); border-radius: var(--radius-xl); text-decoration: none; overflow: hidden; transition: var(--transition); }
        .feature-card:hover { border-color: var(--dark-border-hover); transform: translateY(-5px); box-shadow: var(--shadow-purple); }
        .feature-card__hover-bg { position: absolute; inset: 0; opacity: 0; transition: opacity 0.3s ease; pointer-events: none; }
        .feature-card:hover .feature-card__hover-bg { opacity: 1; }
        .feature-card__top { display: flex; align-items: center; justify-content: space-between; }
        .feature-card__icon { width: 48px; height: 48px; border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .feature-card__badge { font-size: 0.72rem; font-weight: 700; padding: 0.25rem 0.65rem; border-radius: var(--radius-full); letter-spacing: 0.04em; }
        .feature-card__title { font-size: 1.15rem; font-weight: 800; position: relative; z-index: 1; }
        .feature-card__desc { font-size: 0.875rem; color: var(--gray-400); line-height: 1.7; flex: 1; position: relative; z-index: 1; }
        .feature-card__cta { display: flex; align-items: center; gap: 0.4rem; font-size: 0.85rem; font-weight: 700; transition: var(--transition); position: relative; z-index: 1; }
        .feature-card:hover .feature-card__cta { gap: 0.75rem; }

        /* ── Why Us ── */
        .why-section { background: rgba(255,255,255,0.018); }
        .why-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 5rem; align-items: center; }
        .why-title { font-size: clamp(1.7rem, 3.5vw, 2.5rem); font-weight: 900; line-height: 1.2; margin-bottom: 1.25rem; letter-spacing: -0.02em; }
        .why-desc { color: var(--gray-400); margin-bottom: 2rem; line-height: 1.8; font-size: 0.975rem; }
        .why-list { list-style: none; display: flex; flex-direction: column; gap: 0.85rem; margin-bottom: 2rem; }
        .why-list li { display: flex; align-items: center; gap: 0.75rem; font-size: 0.9rem; color: var(--gray-300); }
        .why-btns { display: flex; gap: 1rem; flex-wrap: wrap; }
        .why-right { display: flex; flex-direction: column; gap: 1.1rem; }
        .why-card { display: flex; align-items: center; gap: 1.25rem; padding: 1.4rem 1.6rem; background: var(--dark-card); border: 1px solid var(--dark-border); border-radius: var(--radius-lg); transition: var(--transition); }
        .why-card:hover { transform: translateX(8px); border-color: var(--dark-border-hover); box-shadow: var(--shadow-purple); }
        .why-card--offset { margin-left: 2.5rem; }
        .why-card__icon { width: 46px; height: 46px; border-radius: var(--radius-md); background: rgba(255,255,255,0.05); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .why-card strong { display: block; font-size: 0.95rem; margin-bottom: 0.2rem; }
        .why-card p { font-size: 0.82rem; color: var(--gray-400); margin: 0; }

        /* ── Testimonials ── */
        .testi-card { display: flex; flex-direction: column; gap: 1rem; }
        .testi-stars { display: flex; gap: 3px; }
        .testi-text { font-size: 0.9rem; color: var(--gray-300); line-height: 1.75; flex: 1; font-style: italic; }
        .testi-author { display: flex; align-items: center; gap: 0.75rem; }
        .testi-avatar { width: 42px; height: 42px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 1rem; flex-shrink: 0; color: white; }
        .testi-author strong { font-size: 0.9rem; display: block; }
        .testi-author p { font-size: 0.8rem; color: var(--gray-400); margin: 0; }

        /* ── Trust Bar ── */
        .trust-bar { padding: 1.5rem 0; border-top: 1px solid var(--dark-border); border-bottom: 1px solid var(--dark-border); background: rgba(255,255,255,0.02); }
        .trust-bar__inner { display: flex; justify-content: center; align-items: center; gap: 3rem; flex-wrap: wrap; }
        .trust-item { display: flex; align-items: center; gap: 0.6rem; font-size: 0.875rem; color: var(--gray-400); font-weight: 500; }

        /* ── CTA Banner ── */
        .cta-section { position: relative; padding: 5rem 0; overflow: hidden; }
        .cta-section__glow { position: absolute; inset: 0; background: radial-gradient(ellipse at 50% 50%, rgba(108,60,225,0.2) 0%, transparent 65%); pointer-events: none; }
        .cta-section__inner { position: relative; z-index: 1; display: flex; justify-content: space-between; align-items: center; gap: 2rem; flex-wrap: wrap; padding: 3rem; background: rgba(255,255,255,0.03); border: 1px solid var(--dark-border); border-radius: var(--radius-2xl); backdrop-filter: blur(20px); }
        .cta-section__title { font-size: clamp(1.5rem, 3vw, 2.2rem); font-weight: 900; margin-bottom: 0.5rem; letter-spacing: -0.02em; }
        .cta-section__sub { color: var(--gray-400); font-size: 0.975rem; }
        .cta-section__btns { display: flex; gap: 1rem; flex-wrap: wrap; }

        @media (max-width: 900px) {
          .why-grid { grid-template-columns: 1fr; gap: 3rem; }
          .why-card--offset { margin-left: 0; }
          .cta-section__inner { flex-direction: column; text-align: center; justify-content: center; }
          .cta-section__btns { justify-content: center; }
        }
        @media (max-width: 640px) {
          .features-grid { grid-template-columns: 1fr; }
          .hero__stats { border-radius: var(--radius-lg); }
          .hero__stat { min-width: 120px; padding: 1.25rem 0.75rem; }
          .trust-bar__inner { gap: 1.5rem; }
        }
      `}</style>
    </main>
  );
}
