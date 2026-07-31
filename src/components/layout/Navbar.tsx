import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Zap } from 'lucide-react';

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Pain Analysis', href: '/pain-analysis' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Refer & Earn', href: '/referral' },
  { label: 'AI Insights', href: '/insights' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  useEffect(() => setOpen(false), [location]);

  return (
    <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
      <div className="container navbar__inner">
        {/* Logo */}
        <Link to="/" className="navbar__logo">
          <div className="navbar__logo-icon">
            <Zap size={18} />
          </div>
          <span>
            <span className="gradient-text">JhaTech</span>
            <span className="navbar__logo-sub"> Solutions</span>
          </span>
        </Link>

        {/* Desktop links */}
        <ul className="navbar__links">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                to={link.href}
                className={`navbar__link ${location.pathname === link.href ? 'navbar__link--active' : ''}`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <a
          href="https://wa.me/919999999999?text=Hi%2C+I%27m+interested+in+growing+my+business!"
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-primary btn-sm navbar__cta"
        >
          Get Free Consultation
        </a>

        {/* Hamburger */}
        <button className="navbar__hamburger" onClick={() => setOpen(!open)} aria-label="Toggle menu">
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="navbar__mobile">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={`navbar__mobile-link ${location.pathname === link.href ? 'navbar__mobile-link--active' : ''}`}
            >
              {link.label}
            </Link>
          ))}
          <a
            href="https://wa.me/919999999999?text=Hi%2C+I%27m+interested+in+growing+my+business!"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary"
          >
            Get Free Consultation
          </a>
        </div>
      )}

      <style>{`
        .navbar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1000;
          padding: 1.1rem 0;
          transition: all 0.3s ease;
        }
        .navbar--scrolled {
          background: rgba(13, 11, 30, 0.95);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(108, 60, 225, 0.2);
          padding: 0.75rem 0;
        }
        .navbar__inner {
          display: flex;
          align-items: center;
          gap: 2rem;
        }
        .navbar__logo {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          font-size: 1.25rem;
          font-weight: 800;
          font-family: var(--font-heading);
          white-space: nowrap;
        }
        .navbar__logo-icon {
          width: 34px;
          height: 34px;
          background: linear-gradient(135deg, var(--primary), var(--primary-light));
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          flex-shrink: 0;
        }
        .navbar__logo-sub {
          color: var(--gray-300);
          font-weight: 500;
        }
        .navbar__links {
          display: flex;
          list-style: none;
          gap: 0.25rem;
          flex: 1;
          justify-content: center;
        }
        .navbar__link {
          padding: 0.45rem 0.9rem;
          border-radius: var(--radius-full);
          font-size: 0.9rem;
          font-weight: 500;
          color: var(--gray-300);
          transition: var(--transition);
        }
        .navbar__link:hover,
        .navbar__link--active {
          color: var(--white);
          background: rgba(108, 60, 225, 0.15);
        }
        .navbar__link--active {
          color: var(--primary-light);
        }
        .navbar__cta { white-space: nowrap; }
        .navbar__hamburger {
          display: none;
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.1);
          color: var(--white);
          padding: 0.45rem;
          border-radius: var(--radius-sm);
          margin-left: auto;
        }
        .navbar__mobile {
          background: var(--dark-card);
          border-top: 1px solid var(--dark-border);
          padding: 1.25rem 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .navbar__mobile-link {
          display: block;
          padding: 0.75rem 1rem;
          border-radius: var(--radius-md);
          font-size: 0.95rem;
          font-weight: 500;
          color: var(--gray-300);
          transition: var(--transition);
        }
        .navbar__mobile-link:hover,
        .navbar__mobile-link--active {
          background: rgba(108, 60, 225, 0.15);
          color: var(--primary-light);
        }
        @media (max-width: 900px) {
          .navbar__links, .navbar__cta { display: none; }
          .navbar__hamburger { display: flex; }
        }
      `}</style>
    </nav>
  );
}
