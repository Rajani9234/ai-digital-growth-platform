import { useState } from 'react';
import {
  CheckCircle, MessageCircle, Globe, Megaphone, Package,
  Star, ArrowRight, Zap,
} from 'lucide-react';
import type { PricingPlan } from '../types';

const PLANS: PricingPlan[] = [
  {
    id: 'starter',
    name: 'Starter Website',
    price: 8999,
    duration: 'one-time',
    description: 'Perfect for new businesses wanting a professional online presence.',
    highlighted: false,
    category: 'website',
    features: [
      '5-page responsive website',
      'Mobile-first design',
      'Contact form & WhatsApp button',
      'Google Maps integration',
      'Basic SEO setup',
      '1 month free support',
      'Free domain for 1 year',
    ],
  },
  {
    id: 'professional',
    name: 'Professional Website',
    price: 17999,
    duration: 'one-time',
    description: 'Full-featured website with product catalogue for growing businesses.',
    highlighted: true,
    category: 'website',
    features: [
      'Up to 15 pages',
      'Product / service catalogue',
      'WhatsApp chat integration',
      'Gallery & testimonials section',
      'Blog / news section',
      'Advanced on-page SEO',
      'Google Analytics setup',
      '3 months free support',
      'Free hosting for 1 year',
    ],
  },
  {
    id: 'ecommerce',
    name: 'E-Commerce Store',
    price: 34999,
    duration: 'one-time',
    description: 'Complete online store with payment gateway for selling products 24/7.',
    highlighted: false,
    category: 'website',
    features: [
      'Unlimited products',
      'Payment gateway (Razorpay/Paytm)',
      'Order management dashboard',
      'Customer login portal',
      'Inventory tracking',
      'WhatsApp order notifications',
      'Abandoned cart recovery',
      '6 months free support',
    ],
  },
  {
    id: 'social-starter',
    name: 'Social Media Starter',
    price: 4999,
    duration: '/month',
    description: 'Build your brand on Instagram & Facebook consistently.',
    highlighted: false,
    category: 'marketing',
    features: [
      '12 posts per month',
      'Instagram + Facebook',
      'Custom graphics & captions',
      'Hashtag research',
      'Monthly performance report',
    ],
  },
  {
    id: 'digital-growth',
    name: 'Digital Growth',
    price: 9999,
    duration: '/month',
    description: 'Full digital marketing to generate leads and grow revenue.',
    highlighted: true,
    category: 'marketing',
    features: [
      '20 posts/month (all platforms)',
      'Google My Business management',
      'WhatsApp broadcast campaigns',
      'Basic Google / Meta Ads',
      'Monthly analytics report',
      'Competitor tracking',
      'Dedicated account manager',
    ],
  },
  {
    id: 'premium-marketing',
    name: 'Premium Marketing',
    price: 19999,
    duration: '/month',
    description: 'Aggressive growth marketing for established businesses.',
    highlighted: false,
    category: 'marketing',
    features: [
      'Unlimited content creation',
      'Google Ads + Meta Ads management',
      'SEO content writing (4 blogs/month)',
      'YouTube Shorts / Reels production',
      'Influencer collaboration support',
      'Lead generation campaigns',
      'Weekly reports & strategy calls',
    ],
  },
  {
    id: 'combo-starter',
    name: 'Launch Combo',
    price: 12999,
    duration: 'one-time + ₹4,999/mo',
    description: 'Website + 3 months of social media — best value to launch fast.',
    highlighted: false,
    category: 'combo',
    features: [
      'Starter Website (5 pages)',
      '3 months Social Media Starter',
      'Google My Business setup',
      'WhatsApp Business setup',
      'Free consultation call',
    ],
  },
  {
    id: 'combo-pro',
    name: 'Growth Combo',
    price: 24999,
    duration: 'one-time + ₹8,999/mo',
    description: 'Professional website + full digital marketing — our most popular package.',
    highlighted: true,
    category: 'combo',
    features: [
      'Professional Website (15 pages)',
      '3 months Digital Growth Marketing',
      'SEO setup & initial optimization',
      'Google My Business optimisation',
      'WhatsApp CRM setup',
      'Competition analysis report',
      'Priority support',
    ],
  },
  {
    id: 'combo-enterprise',
    name: 'Scale Combo',
    price: 49999,
    duration: 'one-time + ₹15,999/mo',
    description: 'Full e-commerce store + premium marketing for maximum scale.',
    highlighted: false,
    category: 'combo',
    features: [
      'E-Commerce Store',
      '6 months Premium Marketing',
      'Google Ads setup + ₹5k ad budget',
      'Meta Ads setup + ₹5k ad budget',
      'YouTube channel setup',
      'Quarterly strategy review',
      'Dedicated growth manager',
    ],
  },
];

const CATEGORIES = [
  { id: 'all',       label: 'All Plans',      icon: <Package size={15} /> },
  { id: 'website',   label: 'Website',        icon: <Globe size={15} /> },
  { id: 'marketing', label: 'Digital Marketing', icon: <Megaphone size={15} /> },
  { id: 'combo',     label: 'Combo Packages', icon: <Star size={15} /> },
];

const formatPrice = (p: number) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(p);

const whatsappText = (plan: PricingPlan) =>
  `https://wa.me/919999999999?text=Hi!+I%27m+interested+in+the+*${encodeURIComponent(plan.name)}*+plan+(${formatPrice(plan.price)}${plan.duration}).+Can+you+share+more+details%3F`;

export default function Pricing() {
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const filtered = PLANS.filter(p => activeCategory === 'all' || p.category === activeCategory);

  return (
    <main style={{ paddingTop: '5rem' }}>
      {/* ── Header ── */}
      <section className="pricing-hero">
        <div className="pricing-hero__glow" />
        <div className="container" style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <div className="badge badge-amber" style={{ display: 'inline-flex', marginBottom: '1rem' }}>
            <Zap size={13} /> Transparent Pricing
          </div>
          <h1 className="section-title">
            Clear Pricing, <span className="gradient-text">Zero Surprises</span>
          </h1>
          <p className="section-subtitle">
            Every rupee you invest is accounted for. Choose from websites, digital marketing,
            or our value-packed combo plans.
          </p>

          {/* Category Filter */}
          <div className="category-filter">
            {CATEGORIES.map(c => (
              <button
                key={c.id}
                className={`category-btn ${activeCategory === c.id ? 'category-btn--active' : ''}`}
                onClick={() => setActiveCategory(c.id)}
              >
                {c.icon} {c.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Plans Grid ── */}
      <section className="section" style={{ paddingTop: '2rem' }}>
        <div className="container">
          <div className="plans-grid">
            {filtered.map(plan => (
              <div key={plan.id} className={`plan-card ${plan.highlighted ? 'plan-card--highlighted' : ''}`}>
                {plan.highlighted && (
                  <div className="plan-card__popular">
                    <Star size={12} fill="currentColor" /> Most Popular
                  </div>
                )}
                <div className="plan-card__header">
                  <h3 className="plan-card__name">{plan.name}</h3>
                  <p className="plan-card__desc">{plan.description}</p>
                  <div className="plan-card__price">
                    <span className="plan-card__amount">{formatPrice(plan.price)}</span>
                    <span className="plan-card__duration">{plan.duration}</span>
                  </div>
                </div>

                <ul className="plan-card__features">
                  {plan.features.map(f => (
                    <li key={f}>
                      <CheckCircle size={15} color="var(--success)" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>

                <div className="plan-card__actions">
                  <a
                    href={whatsappText(plan)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`btn ${plan.highlighted ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ width: '100%', justifyContent: 'center' }}
                  >
                    <MessageCircle size={16} /> Enquire on WhatsApp
                  </a>
                  <a
                    href={`https://wa.me/919999999999?text=I+want+to+get+started+with+${encodeURIComponent(plan.name)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-accent btn-sm"
                    style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem' }}
                  >
                    Get Started <ArrowRight size={14} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Value Props ── */}
      <section className="section value-props">
        <div className="container">
          <h2 className="section-title">What's <span className="gradient-text">Always Included</span></h2>
          <p className="section-subtitle">Every plan comes with these non-negotiables.</p>
          <div className="grid-4">
            {[
              { title: 'Free Consultation', desc: 'Strategy call before we begin — no obligations.', icon: '📞' },
              { title: 'Dedicated Support', desc: 'Real humans, not bots. WhatsApp & email support.', icon: '🛡️' },
              { title: 'Monthly Reports', desc: 'Transparent performance data every month.', icon: '📊' },
              { title: '100% Ownership', desc: 'You own your website, domain, and all assets.', icon: '🔑' },
            ].map(v => (
              <div key={v.title} className="card value-card">
                <span style={{ fontSize: '2rem' }}>{v.icon}</span>
                <strong>{v.title}</strong>
                <p style={{ fontSize: '0.875rem', color: 'var(--gray-400)', margin: 0 }}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Custom Quote CTA ── */}
      <section className="custom-quote">
        <div className="container custom-quote__inner">
          <div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '0.5rem' }}>
              Need a Custom Quote?
            </h2>
            <p style={{ color: 'var(--gray-400)' }}>
              Tell us your requirements and budget. We'll build a plan that fits perfectly.
            </p>
          </div>
          <a
            href="https://wa.me/919999999999?text=Hi!+I+need+a+custom+digital+marketing+package.+Can+you+help%3F"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-whatsapp btn-lg"
          >
            <MessageCircle size={18} /> Chat with Us on WhatsApp
          </a>
        </div>
      </section>

      <style>{`
        .pricing-hero {
          padding: 5rem 0 2.5rem;
          position: relative;
          overflow: hidden;
        }
        .pricing-hero__glow {
          position: absolute; inset: 0;
          background: radial-gradient(ellipse at 50% 0%, rgba(245,158,11,0.12) 0%, transparent 65%);
          pointer-events: none;
        }
        .category-filter {
          display: flex; gap: 0.65rem; justify-content: center;
          flex-wrap: wrap; margin-top: 2rem;
        }
        .category-btn {
          display: inline-flex; align-items: center; gap: 0.45rem;
          padding: 0.55rem 1.25rem;
          border-radius: var(--radius-full);
          background: rgba(255,255,255,0.05);
          border: 1.5px solid rgba(255,255,255,0.1);
          color: var(--gray-300);
          font-size: 0.875rem; font-weight: 500;
          transition: var(--transition);
        }
        .category-btn:hover { border-color: var(--primary-light); color: var(--white); }
        .category-btn--active {
          background: rgba(108,60,225,0.2);
          border-color: var(--primary-light);
          color: var(--primary-light);
        }
        .plans-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
          align-items: start;
        }
        .plan-card {
          background: var(--dark-card);
          border: 1px solid var(--dark-border);
          border-radius: var(--radius-xl);
          padding: 2rem;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          position: relative;
          transition: var(--transition);
        }
        .plan-card:hover { transform: translateY(-4px); border-color: var(--primary); box-shadow: var(--shadow-purple); }
        .plan-card--highlighted {
          border-color: var(--primary);
          background: linear-gradient(135deg, rgba(108,60,225,0.12), var(--dark-card));
          box-shadow: var(--shadow-purple);
        }
        .plan-card__popular {
          position: absolute; top: -12px; left: 50%; transform: translateX(-50%);
          background: linear-gradient(135deg, var(--primary), var(--primary-light));
          color: white; font-size: 0.75rem; font-weight: 700;
          padding: 0.3rem 1rem; border-radius: var(--radius-full);
          display: flex; align-items: center; gap: 0.35rem;
          white-space: nowrap;
        }
        .plan-card__header { display: flex; flex-direction: column; gap: 0.5rem; }
        .plan-card__name { font-size: 1.15rem; font-weight: 800; }
        .plan-card__desc { font-size: 0.85rem; color: var(--gray-400); line-height: 1.5; }
        .plan-card__price { display: flex; align-items: baseline; gap: 0.4rem; margin-top: 0.5rem; }
        .plan-card__amount {
          font-size: 2rem; font-weight: 900;
          font-family: var(--font-heading);
          background: linear-gradient(135deg, var(--primary-light), var(--accent));
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
        }
        .plan-card__duration { font-size: 0.85rem; color: var(--gray-400); }
        .plan-card__features {
          list-style: none; display: flex; flex-direction: column; gap: 0.65rem; flex: 1;
        }
        .plan-card__features li {
          display: flex; align-items: flex-start; gap: 0.55rem;
          font-size: 0.875rem; color: var(--gray-300); line-height: 1.4;
        }
        .plan-card__features li svg { flex-shrink: 0; margin-top: 2px; }
        .plan-card__actions { margin-top: auto; }

        .value-card { display: flex; flex-direction: column; gap: 0.65rem; text-align: center; align-items: center; }
        .value-card strong { font-size: 1rem; }

        .custom-quote {
          padding: 3.5rem 0;
          background: rgba(255,255,255,0.02);
          border-top: 1px solid var(--dark-border);
        }
        .custom-quote__inner {
          display: flex; justify-content: space-between; align-items: center; gap: 2rem; flex-wrap: wrap;
        }
        .value-props { background: rgba(255,255,255,0.015); }

        @media (max-width: 1024px) {
          .plans-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 640px) {
          .plans-grid { grid-template-columns: 1fr; }
          .custom-quote__inner { flex-direction: column; text-align: center; }
        }
      `}</style>
    </main>
  );
}
