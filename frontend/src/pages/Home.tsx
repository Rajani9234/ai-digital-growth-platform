import { Link } from 'react-router-dom';
import {
  ArrowRight, BarChart2, DollarSign, Users, TrendingUp,
  CheckCircle, Star, Zap, Globe, MessageCircle,
} from 'lucide-react';

const stats = [
  { value: '500+', label: 'Businesses Grown' },
  { value: '₹2Cr+', label: 'Revenue Generated' },
  { value: '98%', label: 'Client Satisfaction' },
  { value: '3x', label: 'Avg ROI Delivered' },
];

const features = [
  {
    icon: <BarChart2 size={24} />,
    title: 'AI Pain-Point Analysis',
    desc: 'Submit your business challenges and get a custom AI-generated growth report in seconds.',
    href: '/pain-analysis',
    color: '#6C3CE1',
  },
  {
    icon: <DollarSign size={24} />,
    title: 'Transparent Pricing',
    desc: 'Clear, no-surprise pricing for websites and digital marketing. WhatsApp us instantly.',
    href: '/pricing',
    color: '#F59E0B',
  },
  {
    icon: <Users size={24} />,
    title: 'Refer & Earn ₹1,000',
    desc: 'No degree needed. Refer businesses to us and earn ₹1,000 per successful sale.',
    href: '/referral',
    color: '#10B981',
  },
  {
    icon: <TrendingUp size={24} />,
    title: 'AI Market Insights',
    desc: 'Real-time competitor analysis and market trend recommendations powered by AI.',
    href: '/insights',
    color: '#3B82F6',
  },
];

const testimonials = [
  {
    name: 'Priya Sharma',
    business: 'Priya Sarees, Surat',
    text: 'JhaTech built our website and within 2 months we started getting orders from Pune and Mumbai. Sales are up 60%!',
    rating: 5,
  },
  {
    name: 'Rajesh Gupta',
    business: 'Gupta Electronics, Mumbai',
    text: 'The digital marketing team is amazing. Our Google ranking went from page 5 to page 1 in 3 months.',
    rating: 5,
  },
  {
    name: 'Sunita Verma',
    business: 'Sunita Boutique, Nagpur',
    text: 'I never thought a small boutique like mine could compete with big brands online. Now I get 20+ daily inquiries!',
    rating: 5,
  },
];

export default function Home() {
  return (
    <main className="home">
      {/* ── Hero ── */}
      <section className="hero">
        <div className="hero__bg-glow" />
        <div className="container hero__content">
          <div className="badge badge-purple animate-fade-up" style={{ marginBottom: '1.5rem' }}>
            <Zap size={12} /> AI-Powered Digital Growth Platform
          </div>
          <h1 className="hero__title animate-fade-up">
            Grow Your Local Business<br />
            <span className="gradient-text">10x with AI & Digital Marketing</span>
          </h1>
          <p className="hero__subtitle animate-fade-up">
            From saree shops to electronics stores — we help Indian businesses build a powerful online presence,
            attract more customers, and scale revenue with data-driven strategies.
          </p>
          <div className="hero__ctas animate-fade-up">
            <Link to="/pain-analysis" className="btn btn-primary btn-lg">
              Analyse My Business Free <ArrowRight size={18} />
            </Link>
            <Link to="/pricing" className="btn btn-secondary btn-lg">
              View Pricing
            </Link>
          </div>

          {/* Stats */}
          <div className="hero__stats animate-fade-up">
            {stats.map((s) => (
              <div key={s.label} className="hero__stat">
                <span className="hero__stat-value gradient-text">{s.value}</span>
                <span className="hero__stat-label">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="section" style={{ paddingTop: '5rem' }}>
        <div className="container">
          <div className="badge badge-purple" style={{ display: 'flex', width: 'fit-content', margin: '0 auto 1rem' }}>
            What We Offer
          </div>
          <h2 className="section-title">
            Everything Your Business Needs to<br />
            <span className="gradient-text">Win Online</span>
          </h2>
          <p className="section-subtitle">
            Four powerful modules designed to take you from invisible to unstoppable.
          </p>

          <div className="grid-2" style={{ gap: '1.5rem' }}>
            {features.map((f) => (
              <Link key={f.title} to={f.href} className="feature-card card">
                <div className="feature-card__icon" style={{ background: `${f.color}20`, color: f.color }}>
                  {f.icon}
                </div>
                <h3 className="feature-card__title">{f.title}</h3>
                <p className="feature-card__desc">{f.desc}</p>
                <span className="feature-card__cta">
                  Explore <ArrowRight size={15} />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why Us ── */}
      <section className="section why-us">
        <div className="container">
          <div className="why-us__grid">
            <div>
              <div className="badge badge-amber" style={{ marginBottom: '1rem' }}>Why JhaTech?</div>
              <h2 style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.4rem)', fontWeight: 800, lineHeight: 1.25, marginBottom: '1.25rem' }}>
                We Don't Just Build Websites.<br />
                <span className="gradient-text">We Build Businesses.</span>
              </h2>
              <p style={{ color: 'var(--gray-400)', marginBottom: '2rem', lineHeight: 1.8 }}>
                Most agencies focus on deliverables. We focus on results. Every strategy we implement is backed by
                AI analysis, competitor research, and proven frameworks tailored for Indian markets.
              </p>
              <ul className="why-us__list">
                {[
                  'AI-generated business reports in seconds',
                  'Dedicated account manager for every client',
                  'Monthly performance reports with clear ROI',
                  'Works for any business size or category',
                  '₹1,000 referral commission — no limits',
                ].map((item) => (
                  <li key={item}>
                    <CheckCircle size={17} color="var(--success)" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem', flexWrap: 'wrap' }}>
                <Link to="/pain-analysis" className="btn btn-primary">
                  Get My Free Report <ArrowRight size={16} />
                </Link>
                <a
                  href="https://wa.me/919999999999"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-whatsapp"
                >
                  <MessageCircle size={16} /> Talk to Us
                </a>
              </div>
            </div>
            <div className="why-us__visual">
              <div className="why-us__card why-us__card--1">
                <Globe size={28} color="var(--primary-light)" />
                <div>
                  <strong>Website Live in 7 Days</strong>
                  <p>Fast delivery, zero compromise on quality</p>
                </div>
              </div>
              <div className="why-us__card why-us__card--2">
                <BarChart2 size={28} color="var(--accent)" />
                <div>
                  <strong>Real-time Analytics</strong>
                  <p>Know exactly how your website is performing</p>
                </div>
              </div>
              <div className="why-us__card why-us__card--3">
                <TrendingUp size={28} color="var(--success)" />
                <div>
                  <strong>Avg 3x ROI in 90 Days</strong>
                  <p>Proven results across 500+ businesses</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="section">
        <div className="container">
          <div className="badge badge-green" style={{ display: 'flex', width: 'fit-content', margin: '0 auto 1rem' }}>
            Client Stories
          </div>
          <h2 className="section-title">Real Businesses. Real Results.</h2>
          <p className="section-subtitle">Don't take our word for it — hear from our clients.</p>

          <div className="grid-3">
            {testimonials.map((t) => (
              <div key={t.name} className="card testimonial-card">
                <div className="testimonial-card__stars">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} size={14} fill="var(--accent)" color="var(--accent)" />
                  ))}
                </div>
                <p className="testimonial-card__text">"{t.text}"</p>
                <div className="testimonial-card__author">
                  <div className="testimonial-card__avatar">
                    {t.name.charAt(0)}
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

      {/* ── CTA Banner ── */}
      <section className="cta-banner">
        <div className="container cta-banner__inner">
          <div>
            <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', fontWeight: 800, marginBottom: '0.5rem' }}>
              Ready to Transform Your Business?
            </h2>
            <p style={{ color: 'var(--gray-300)' }}>Free consultation. No commitment. Real results.</p>
          </div>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <Link to="/pain-analysis" className="btn btn-accent btn-lg">
              Start Free Analysis <ArrowRight size={18} />
            </Link>
            <a
              href="https://wa.me/919999999999"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-whatsapp btn-lg"
            >
              <MessageCircle size={18} /> WhatsApp Now
            </a>
          </div>
        </div>
      </section>

      <style>{`
        /* Hero */
        .hero {
          min-height: 100vh;
          display: flex;
          align-items: center;
          padding: 8rem 0 5rem;
          position: relative;
          overflow: hidden;
        }
        .hero__bg-glow {
          position: absolute;
          width: 700px;
          height: 700px;
          background: radial-gradient(circle, rgba(108,60,225,0.2) 0%, transparent 70%);
          top: -150px;
          left: 50%;
          transform: translateX(-50%);
          pointer-events: none;
        }
        .hero__content {
          text-align: center;
          position: relative;
          z-index: 1;
        }
        .hero__title {
          font-size: clamp(2.2rem, 5.5vw, 4rem);
          font-weight: 900;
          line-height: 1.1;
          margin-bottom: 1.5rem;
        }
        .hero__subtitle {
          font-size: clamp(1rem, 2vw, 1.2rem);
          color: var(--gray-400);
          max-width: 640px;
          margin: 0 auto 2.5rem;
          line-height: 1.75;
        }
        .hero__ctas {
          display: flex;
          gap: 1rem;
          justify-content: center;
          flex-wrap: wrap;
          margin-bottom: 3.5rem;
        }
        .hero__stats {
          display: flex;
          justify-content: center;
          gap: 3rem;
          flex-wrap: wrap;
          padding: 2rem;
          background: rgba(255,255,255,0.03);
          border: 1px solid var(--dark-border);
          border-radius: var(--radius-lg);
          max-width: 700px;
          margin: 0 auto;
        }
        .hero__stat { text-align: center; }
        .hero__stat-value { display: block; font-size: 2rem; font-weight: 900; font-family: var(--font-heading); }
        .hero__stat-label { font-size: 0.82rem; color: var(--gray-400); text-transform: uppercase; letter-spacing: 0.06em; }

        /* Feature Cards */
        .feature-card {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          text-decoration: none;
        }
        .feature-card__icon {
          width: 52px;
          height: 52px;
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .feature-card__title { font-size: 1.15rem; font-weight: 700; }
        .feature-card__desc { font-size: 0.9rem; color: var(--gray-400); line-height: 1.65; flex: 1; }
        .feature-card__cta {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--primary-light);
          transition: var(--transition);
        }
        .feature-card:hover .feature-card__cta { gap: 0.7rem; }

        /* Why Us */
        .why-us { background: rgba(255,255,255,0.015); }
        .why-us__grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4rem;
          align-items: center;
        }
        .why-us__list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
        }
        .why-us__list li {
          display: flex;
          align-items: center;
          gap: 0.65rem;
          font-size: 0.95rem;
          color: var(--gray-300);
        }
        .why-us__visual {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }
        .why-us__card {
          display: flex;
          align-items: center;
          gap: 1.25rem;
          padding: 1.5rem;
          background: var(--dark-card);
          border: 1px solid var(--dark-border);
          border-radius: var(--radius-lg);
          transition: var(--transition);
        }
        .why-us__card:hover { transform: translateX(6px); border-color: var(--primary); }
        .why-us__card strong { display: block; font-size: 1rem; margin-bottom: 0.2rem; }
        .why-us__card p { font-size: 0.83rem; color: var(--gray-400); margin: 0; }
        .why-us__card--1 { margin-left: 0; }
        .why-us__card--2 { margin-left: 2rem; }
        .why-us__card--3 { margin-left: 0; }

        /* Testimonials */
        .testimonial-card { display: flex; flex-direction: column; gap: 1rem; }
        .testimonial-card__stars { display: flex; gap: 3px; }
        .testimonial-card__text { font-size: 0.9rem; color: var(--gray-300); line-height: 1.7; flex: 1; font-style: italic; }
        .testimonial-card__author { display: flex; align-items: center; gap: 0.75rem; }
        .testimonial-card__avatar {
          width: 40px; height: 40px;
          background: linear-gradient(135deg, var(--primary), var(--primary-light));
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-weight: 700; font-size: 1rem;
          flex-shrink: 0;
        }
        .testimonial-card__author strong { font-size: 0.9rem; display: block; }
        .testimonial-card__author p { font-size: 0.8rem; color: var(--gray-400); margin: 0; }

        /* CTA Banner */
        .cta-banner {
          background: linear-gradient(135deg, rgba(108,60,225,0.25), rgba(139,92,246,0.1));
          border-top: 1px solid var(--dark-border);
          border-bottom: 1px solid var(--dark-border);
          padding: 3.5rem 0;
        }
        .cta-banner__inner {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 2rem;
          flex-wrap: wrap;
        }

        @media (max-width: 768px) {
          .why-us__grid { grid-template-columns: 1fr; gap: 2.5rem; }
          .why-us__card--2 { margin-left: 0; }
          .cta-banner__inner { flex-direction: column; text-align: center; justify-content: center; }
        }
      `}</style>
    </main>
  );
}
