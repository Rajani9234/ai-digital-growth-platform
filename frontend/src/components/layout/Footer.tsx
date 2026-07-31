import { Link } from 'react-router-dom';
import { Zap, Mail, Phone, MapPin, Instagram, Facebook, Linkedin, Twitter } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__grid">
          {/* Brand */}
          <div className="footer__brand">
            <Link to="/" className="footer__logo">
              <div className="footer__logo-icon"><Zap size={18} /></div>
              <span className="gradient-text" style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.2rem' }}>
                JhaTech Solutions
              </span>
            </Link>
            <p className="footer__tagline">
              Empowering local businesses with AI-driven digital growth strategies. From saree shops to startups — we make you visible online.
            </p>
            <div className="footer__social">
              {[
                { icon: <Instagram size={16} />, href: '#', label: 'Instagram' },
                { icon: <Facebook size={16} />, href: '#', label: 'Facebook' },
                { icon: <Linkedin size={16} />, href: '#', label: 'LinkedIn' },
                { icon: <Twitter size={16} />, href: '#', label: 'Twitter' },
              ].map((s) => (
                <a key={s.label} href={s.href} className="footer__social-link" aria-label={s.label}>
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="footer__heading">Quick Links</h4>
            <ul className="footer__links">
              {[
                { label: 'Home', href: '/' },
                { label: 'Pain Analysis', href: '/pain-analysis' },
                { label: 'Pricing & Plans', href: '/pricing' },
                { label: 'Refer & Earn ₹1000', href: '/referral' },
                { label: 'AI Market Insights', href: '/insights' },
              ].map((l) => (
                <li key={l.href}>
                  <Link to={l.href} className="footer__link">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="footer__heading">Services</h4>
            <ul className="footer__links">
              {[
                'Website Development',
                'SEO & Content Marketing',
                'Social Media Management',
                'Google Ads & Meta Ads',
                'WhatsApp Marketing',
                'E-commerce Solutions',
              ].map((s) => (
                <li key={s}><span className="footer__link footer__link--plain">{s}</span></li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="footer__heading">Contact Us</h4>
            <ul className="footer__contact">
              <li>
                <Phone size={15} />
                <a href="tel:+919999999999">+91 99999 99999</a>
              </li>
              <li>
                <Mail size={15} />
                <a href="mailto:hello@jhatechsolutions.in">hello@jhatechsolutions.in</a>
              </li>
              <li>
                <MapPin size={15} />
                <span>Mumbai, Maharashtra</span>
              </li>
            </ul>
            <a
              href="https://wa.me/919999999999?text=Hi!+I+want+to+grow+my+business+digitally."
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-whatsapp btn-sm"
              style={{ marginTop: '1.25rem' }}
            >
              💬 Chat on WhatsApp
            </a>
          </div>
        </div>

        <div className="footer__bottom">
          <p>© {new Date().getFullYear()} JhaTech Solutions. All rights reserved.</p>
          <p style={{ color: 'var(--gray-600)', fontSize: '0.82rem' }}>
            Built with React + TypeScript + AI
          </p>
        </div>
      </div>

      <style>{`
        .footer {
          background: #08061A;
          border-top: 1px solid var(--dark-border);
          padding: 4rem 0 1.5rem;
        }
        .footer__grid {
          display: grid;
          grid-template-columns: 1.6fr 1fr 1fr 1.2fr;
          gap: 3rem;
          margin-bottom: 3rem;
        }
        .footer__logo {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          margin-bottom: 1rem;
        }
        .footer__logo-icon {
          width: 32px;
          height: 32px;
          background: linear-gradient(135deg, var(--primary), var(--primary-light));
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          flex-shrink: 0;
        }
        .footer__tagline {
          font-size: 0.875rem;
          color: var(--gray-500);
          line-height: 1.7;
          margin-bottom: 1.25rem;
        }
        .footer__social {
          display: flex;
          gap: 0.6rem;
        }
        .footer__social-link {
          width: 34px;
          height: 34px;
          border-radius: var(--radius-sm);
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.08);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--gray-400);
          transition: var(--transition);
        }
        .footer__social-link:hover {
          background: var(--primary);
          border-color: var(--primary);
          color: white;
          transform: translateY(-2px);
        }
        .footer__heading {
          font-size: 0.85rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--gray-300);
          margin-bottom: 1.25rem;
        }
        .footer__links {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 0.65rem;
        }
        .footer__link {
          font-size: 0.875rem;
          color: var(--gray-500);
          transition: var(--transition);
        }
        .footer__link:hover:not(.footer__link--plain) {
          color: var(--primary-light);
          padding-left: 4px;
        }
        .footer__link--plain { cursor: default; }
        .footer__contact {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
        }
        .footer__contact li {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          font-size: 0.875rem;
          color: var(--gray-400);
        }
        .footer__contact li svg { color: var(--primary-light); flex-shrink: 0; }
        .footer__contact a:hover { color: var(--primary-light); }
        .footer__bottom {
          border-top: 1px solid rgba(255,255,255,0.06);
          padding-top: 1.5rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.85rem;
          color: var(--gray-500);
          flex-wrap: wrap;
          gap: 0.5rem;
        }
        @media (max-width: 900px) {
          .footer__grid { grid-template-columns: 1fr 1fr; gap: 2rem; }
        }
        @media (max-width: 560px) {
          .footer__grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </footer>
  );
}
