import { useState } from 'react';
import {
  CheckCircle, MessageCircle, Globe, Megaphone, Package,
  Star, ArrowRight, Zap, Shield, Clock, HeadphonesIcon, BarChart2,
} from 'lucide-react';
import type { PricingPlan } from '../types';

const PLANS: PricingPlan[] = [
  {
    id: 'starter', name: 'Starter Website', price: 8999, duration: 'one-time',
    description: 'Perfect for new businesses wanting a professional online presence.',
    highlighted: false, category: 'website',
    features: ['5-page responsive website','Mobile-first design','Contact form & WhatsApp button','Google Maps integration','Basic SEO setup','1 month free support','Free domain for 1 year'],
  },
  {
    id: 'professional', name: 'Professional Website', price: 17999, duration: 'one-time',
    description: 'Full-featured website with product catalogue for growing businesses.',
    highlighted: true, category: 'website',
    features: ['Up to 15 pages','Product / service catalogue','WhatsApp chat integration','Gallery & testimonials','Blog / news section','Advanced on-page SEO','Google Analytics setup','3 months free support','Free hosting for 1 year'],
  },
  {
    id: 'ecommerce', name: 'E-Commerce Store', price: 34999, duration: 'one-time',
    description: 'Complete online store with payment gateway for selling 24/7.',
    highlighted: false, category: 'website',
    features: ['Unlimited products','Payment gateway (Razorpay/Paytm)','Order management dashboard','Customer login portal','Inventory tracking','WhatsApp order notifications','Abandoned cart recovery','6 months free support'],
  },
  {
    id: 'social-starter', name: 'Social Media Starter', price: 4999, duration: '/month',
    description: 'Build your brand on Instagram & Facebook consistently.',
    highlighted: false, category: 'marketing',
    features: ['12 posts per month','Instagram + Facebook','Custom graphics & captions','Hashtag research','Monthly performance report'],
  },
  {
    id: 'digital-growth', name: 'Digital Growth', price: 9999, duration: '/month',
    description: 'Full digital marketing to generate leads and grow revenue.',
    highlighted: true, category: 'marketing',
    features: ['20 posts/month (all platforms)','Google My Business management','WhatsApp broadcast campaigns','Basic Google / Meta Ads','Monthly analytics report','Competitor tracking','Dedicated account manager'],
  },
  {
    id: 'premium-marketing', name: 'Premium Marketing', price: 19999, duration: '/month',
    description: 'Aggressive growth marketing for established businesses.',
    highlighted: false, category: 'marketing',
    features: ['Unlimited content creation','Google Ads + Meta Ads','SEO content (4 blogs/month)','YouTube Shorts / Reels','Influencer collaboration','Lead generation campaigns','Weekly reports & strategy calls'],
  },
  {
    id: 'combo-starter', name: 'Launch Combo', price: 12999, duration: 'one-time + ₹4,999/mo',
    description: 'Website + 3 months of social media — best value to launch fast.',
    highlighted: false, category: 'combo',
    features: ['Starter Website (5 pages)','3 months Social Media Starter','Google My Business setup','WhatsApp Business setup','Free consultation call'],
  },
  {
    id: 'combo-pro', name: 'Growth Combo', price: 24999, duration: 'one-time + ₹8,999/mo',
    description: 'Professional website + full digital marketing — most popular.',
    highlighted: true, category: 'combo',
    features: ['Professional Website (15 pages)','3 months Digital Growth Marketing','SEO setup & optimization','Google My Business optimisation','WhatsApp CRM setup','Competition analysis report','Priority support'],
  },
  {
    id: 'combo-enterprise', name: 'Scale Combo', price: 49999, duration: 'one-time + ₹15,999/mo',
    description: 'Full e-commerce store + premium marketing for maximum scale.',
    highlighted: false, category: 'combo',
    features: ['E-Commerce Store','6 months Premium Marketing','Google Ads + ₹5k ad budget','Meta Ads + ₹5k ad budget','YouTube channel setup','Quarterly strategy review','Dedicated growth manager'],
  },
];

const CATEGORIES = [
  { id: 'all',       label: 'All Plans',          icon: <Package size={14} /> },
  { id: 'website',   label: 'Website',            icon: <Globe size={14} /> },
  { id: 'marketing', label: 'Digital Marketing',  icon: <Megaphone size={14} /> },
  { id: 'combo',     label: 'Combo Packages',     icon: <Star size={14} /> },
];

const fmt = (p: number) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(p);

const waLink = (plan: PricingPlan) =>
  `https://wa.me/919999999999?text=Hi!+I'm+interested+in+*${encodeURIComponent(plan.name)}*+(${fmt(plan.price)}+${plan.duration}).+Please+share+details.`;

const VALUE_PROPS = [
  { icon: <Clock size={20} color="var(--accent)" />,         title: 'Free Consultation',  desc: 'Strategy call before we begin.' },
  { icon: <HeadphonesIcon size={20} color="var(--success)" />, title: 'Dedicated Support', desc: 'Real humans on WhatsApp & email.' },
  { icon: <BarChart2 size={20} color="var(--primary-light)" />, title: 'Monthly Reports',  desc: 'Transparent performance data.' },
  { icon: <Shield size={20} color="#3B82F6" />,              title: '100% Ownership',     desc: 'Your website, domain, all assets.' },
];

export default function Pricing() {
  const [active, setActive] = useState('all');
  const filtered = PLANS.filter(p => active === 'all' || p.category === active);

  return (
    <main style={{ paddingTop: '5rem', minHeight: '100vh' }}>

      {/* Hero */}
      <section className="pr-hero">
        <div className="pr-hero__glow" />
        <div className="container" style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <div className="badge badge-amber" style={{ display: 'inline-flex', marginBottom: '1.25rem' }}>
            <Zap size={13} /> Transparent Pricing
          </div>
          <h1 className="section-title">
            Clear Pricing, <span className="gradient-text">Zero Surprises</span>
          </h1>
          <p className="section-subtitle">
            Every rupee accounted for. Choose from websites, digital marketing, or our combo plans.
          </p>

          {/* Filter tabs */}
          <div className="pr-tabs">
            {CATEGORIES.map(c => (
              <button
                key={c.id}
                className={`pr-tab ${active === c.id ? 'pr-tab--active' : ''}`}
                onClick={() => setActive(c.id)}
              >
                {c.icon} {c.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Plans Grid */}
      <section className="section" style={{ paddingTop: '2rem' }}>
        <div className="container">
          <div className="pr-grid">
            {filtered.map(plan => (
              <div key={plan.id} className={`pr-card ${plan.highlighted ? 'pr-card--hot' : ''}`}>
                {plan.highlighted && (
                  <div className="pr-card__badge">
                    <Star size={11} fill="currentColor" /> Most Popular
                  </div>
                )}

                {/* Card header */}
                <div className="pr-card__head">
                  <h3 className="pr-card__name">{plan.name}</h3>
                  <p className="pr-card__desc">{plan.description}</p>
                  <div className="pr-card__price">
                    <span className="pr-card__amount">{fmt(plan.price)}</span>
                    <span className="pr-card__dur">{plan.duration}</span>
                  </div>
                </div>

                {/* Features */}
                <ul className="pr-card__features">
                  {plan.features.map(f => (
                    <li key={f}>
                      <CheckCircle size={14} color="var(--success)" strokeWidth={2.5} />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>

                {/* Actions */}
                <div className="pr-card__actions">
                  <a href={waLink(plan)} target="_blank" rel="noopener noreferrer"
                    className={`btn ${plan.highlighted ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ width: '100%', justifyContent: 'center' }}>
                    <MessageCircle size={15} /> Enquire on WhatsApp
                  </a>
                  <a href={`https://wa.me/919999999999?text=I+want+to+get+started+with+${encodeURIComponent(plan.name)}`}
                    target="_blank" rel="noopener noreferrer"
                    className="btn btn-accent btn-sm"
                    style={{ width: '100%', justifyContent: 'center', marginTop: '0.6rem' }}>
                    Get Started <ArrowRight size={14} />
                  </a>
                </div>

                {/* Glow effect on highlighted */}
                {plan.highlighted && <div className="pr-card__glow" />}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Value Props */}
      <section className="section pr-value">
        <div className="container">
          <h2 className="section-title">What's <span className="gradient-text">Always Included</span></h2>
          <p className="section-subtitle">Every plan comes with these non-negotiables.</p>
          <div className="grid-4">
            {VALUE_PROPS.map(v => (
              <div key={v.title} className="card pr-val-card">
                <div className="pr-val-card__icon">{v.icon}</div>
                <strong>{v.title}</strong>
                <p>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Custom Quote */}
      <section className="pr-quote">
        <div className="pr-quote__glow" />
        <div className="container pr-quote__inner">
          <div style={{ position: 'relative', zIndex: 1 }}>
            <h2 style={{ fontSize: '1.9rem', fontWeight: 900, marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>
              Need a Custom Quote?
            </h2>
            <p style={{ color: 'var(--gray-400)' }}>Tell us your requirements. We'll build a plan that fits perfectly.</p>
          </div>
          <a href="https://wa.me/919999999999?text=Hi!+I+need+a+custom+package.+Can+you+help?"
            target="_blank" rel="noopener noreferrer"
            className="btn btn-whatsapp btn-lg" style={{ position: 'relative', zIndex: 1 }}>
            <MessageCircle size={17} /> Chat on WhatsApp
          </a>
        </div>
      </section>

      <style>{`
        .pr-hero { padding: 5rem 0 2.5rem; position: relative; overflow: hidden; }
        .pr-hero__glow { position: absolute; inset: 0; background: radial-gradient(ellipse at 50% 0%, rgba(245,158,11,0.13) 0%, transparent 60%); pointer-events: none; }

        .pr-tabs { display: flex; gap: 0.6rem; justify-content: center; flex-wrap: wrap; margin-top: 2.25rem; }
        .pr-tab { display: inline-flex; align-items: center; gap: 0.45rem; padding: 0.6rem 1.35rem; border-radius: var(--radius-full); background: rgba(255,255,255,0.04); border: 1.5px solid rgba(255,255,255,0.08); color: var(--gray-400); font-size: 0.875rem; font-weight: 500; transition: var(--transition); }
        .pr-tab:hover { border-color: var(--primary-light); color: var(--white); background: rgba(108,60,225,0.1); }
        .pr-tab--active { background: rgba(108,60,225,0.18); border-color: var(--primary-light); color: var(--primary-light); font-weight: 600; }

        .pr-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; align-items: start; }

        .pr-card { position: relative; background: var(--dark-card); border: 1px solid var(--dark-border); border-radius: var(--radius-xl); padding: 2rem; display: flex; flex-direction: column; gap: 1.5rem; transition: var(--transition); overflow: hidden; }
        .pr-card:hover { transform: translateY(-5px); border-color: rgba(108,60,225,0.45); box-shadow: 0 20px 50px rgba(0,0,0,0.3), 0 0 0 1px rgba(108,60,225,0.15); }
        .pr-card--hot { border-color: var(--primary); background: linear-gradient(160deg, rgba(108,60,225,0.1) 0%, var(--dark-card) 50%); box-shadow: 0 8px 40px rgba(108,60,225,0.2); }
        .pr-card--hot:hover { box-shadow: 0 20px 60px rgba(108,60,225,0.4); }

        .pr-card__badge { position: absolute; top: -1px; left: 50%; transform: translateX(-50%); background: linear-gradient(135deg, var(--primary), var(--primary-light)); color: white; font-size: 0.72rem; font-weight: 700; padding: 0.28rem 1rem; border-radius: 0 0 var(--radius-md) var(--radius-md); display: flex; align-items: center; gap: 0.3rem; white-space: nowrap; letter-spacing: 0.04em; }

        .pr-card__glow { position: absolute; width: 200px; height: 200px; background: radial-gradient(circle, rgba(108,60,225,0.15) 0%, transparent 70%); bottom: -60px; right: -60px; pointer-events: none; border-radius: 50%; }

        .pr-card__head { display: flex; flex-direction: column; gap: 0.5rem; }
        .pr-card__name { font-size: 1.15rem; font-weight: 800; margin-top: 0.75rem; }
        .pr-card__desc { font-size: 0.84rem; color: var(--gray-400); line-height: 1.55; }
        .pr-card__price { display: flex; align-items: baseline; gap: 0.4rem; margin-top: 0.75rem; padding-top: 0.75rem; border-top: 1px solid var(--dark-border); }
        .pr-card__amount { font-size: 2.1rem; font-weight: 900; font-family: var(--font-heading); background: linear-gradient(135deg, #a78bfa, #f59e0b); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; line-height: 1; }
        .pr-card__dur { font-size: 0.82rem; color: var(--gray-500); }

        .pr-card__features { list-style: none; display: flex; flex-direction: column; gap: 0.6rem; flex: 1; }
        .pr-card__features li { display: flex; align-items: flex-start; gap: 0.55rem; font-size: 0.855rem; color: var(--gray-300); line-height: 1.45; }
        .pr-card__features li svg { flex-shrink: 0; margin-top: 2px; }

        .pr-card__actions { margin-top: auto; }

        .pr-value { background: rgba(255,255,255,0.015); }
        .pr-val-card { display: flex; flex-direction: column; align-items: center; text-align: center; gap: 0.75rem; }
        .pr-val-card__icon { width: 50px; height: 50px; border-radius: var(--radius-md); background: rgba(255,255,255,0.05); border: 1px solid var(--dark-border); display: flex; align-items: center; justify-content: center; }
        .pr-val-card strong { font-size: 0.975rem; }
        .pr-val-card p { font-size: 0.85rem; color: var(--gray-400); margin: 0; }

        .pr-quote { position: relative; padding: 4rem 0; overflow: hidden; border-top: 1px solid var(--dark-border); }
        .pr-quote__glow { position: absolute; inset: 0; background: radial-gradient(ellipse at 50% 50%, rgba(37,211,102,0.08) 0%, transparent 65%); pointer-events: none; }
        .pr-quote__inner { display: flex; justify-content: space-between; align-items: center; gap: 2rem; flex-wrap: wrap; }

        @media (max-width: 1024px) { .pr-grid { grid-template-columns: repeat(2,1fr); } }
        @media (max-width: 640px) {
          .pr-grid { grid-template-columns: 1fr; }
          .pr-quote__inner { flex-direction: column; text-align: center; }
        }
      `}</style>
    </main>
  );
}
