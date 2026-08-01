import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Zap } from 'lucide-react';

const navLinks = [
  { label: 'Home',         href: '/' },
  { label: 'Pain Analysis', href: '/pain-analysis' },
  { label: 'Pricing',      href: '/pricing' },
  { label: 'Refer & Earn', href: '/referral' },
  { label: 'AI Insights',  href: '/insights' },
];

export default function Navbar() {
  const [open, setOpen]       = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => setOpen(false), [location]);

  return (
    <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
      <div className="container navbar__inner">

        {/* Logo */}
        <Link to="/" className="navbar__logo">
          <div className="navbar__logo-icon">
            <Zap size={16} strokeWidth={2.5} />
          </div>
          <span className="navbar__logo-text">
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
                {location.pathname === link.href && <span className="navbar__link-dot" />}
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
        <button
          className="navbar__hamburger"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      <div className={`navbar__mobile ${open ? 'navbar__mobile--open' : ''}`}>
        <div className="navbar__mobile-inner">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={`navbar__mobile-link ${location.pathname === link.href ? 'navbar__mobile-link--active' : ''}`}
            >
              {link.label}
              {location.pathname === link.href && (
                <span className="navbar__mobile-active-dot" />
              )}
            </Link>
          ))}
          <a
            href="https://wa.me/919999999999?text=Hi%2C+I%27m+interested+in+growing+my+business!"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary"
            style={{ justifyContent: 'center', marginTop: '0.5rem' }}
          >
            Get Free Consultation
          </a>
        </div>
      </div>

      <style>{`
        .navbar {
          position: fixed;
          top: 0; left: 0; right: 0;
          z-index: 1000;
          padding: 1rem 0;
          transition: all 0.35s cubic-bezier(0.4,0,0.2,1);
        }

        .navbar--scrolled {
          background: rgba(8, 6, 23, 0.82);
          backdrop-filter: blur(24px) saturate(180%);
          -webkit-backdrop-filter: blur(24px) saturate(180%);
          border-bottom: 1px solid rgba(108,60,225,0.18);
          padding: 0.6rem 0;
          box-shadow: 0 4px 30px rgba(0,0,0,0.35);
        }

        .navbar__inner {
          display: flex;
          align-items: center;
          gap: 2rem;
        }

        /* Logo */
        .navbar__logo {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          flex-shrink: 0;
        }
        .navbar__logo-icon {
          width: 34px; height: 34px;
          background: linear-gradient(135deg, #6C3CE1, #8B5CF6);
          border-radius: 9px;
          display: flex; align-items: center; justify-content: center;
          color: white;
          box-shadow: 0 4px 14px rgba(108,60,225,0.45);
          transition: var(--transition);
        }
        .navbar__logo:hover .navbar__logo-icon {
          transform: rotate(-8deg) scale(1.08);
          box-shadow: 0 6px 20px rgba(108,60,225,0.6);
        }
        .navbar__logo-text {
          font-size: 1.2rem;
          font-weight: 800;
          font-family: var(--font-heading);
          white-space: nowrap;
        }
        .navbar__logo-sub {
          color: var(--gray-400);
          font-weight: 500;
          font-size: 1.1rem;
        }

        /* Desktop links */
        .navbar__links {
          display: flex;
          list-style: none;
          gap: 0.15rem;
          flex: 1;
          justify-content: center;
        }

        .navbar__link {
          position: relative;
          display: flex; align-items: center; flex-direction: column;
          padding: 0.5rem 0.95rem;
          border-radius: var(--radius-full);
          font-size: 0.88rem;
          font-weight: 500;
          color: var(--gray-400);
          transition: var(--transition);
          gap: 3px;
        }
        .navbar__link:hover {
          color: var(--white);
          background: rgba(255,255,255,0.06);
        }
        .navbar__link--active {
          color: var(--white);
          background: rgba(108,60,225,0.18);
          font-weight: 600;
        }
        .navbar__link-dot {
          width: 4px; height: 4px;
          border-radius: 50%;
          background: var(--primary-light);
          display: block;
        }

        /* CTA */
        .navbar__cta { white-space: nowrap; flex-shrink: 0; }

        /* Hamburger */
        .navbar__hamburger {
          display: none;
          background: rgba(255,255,255,0.07);
          border: 1px solid rgba(255,255,255,0.1);
          color: var(--white);
          padding: 0.5rem;
          border-radius: var(--radius-sm);
          margin-left: auto;
          transition: var(--transition);
        }
        .navbar__hamburger:hover {
          background: rgba(108,60,225,0.25);
          border-color: var(--primary-light);
        }

        /* Mobile menu */
        .navbar__mobile {
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.35s cubic-bezier(0.4,0,0.2,1);
        }
        .navbar__mobile--open {
          max-height: 500px;
        }
        .navbar__mobile-inner {
          background: rgba(13,11,30,0.97);
          backdrop-filter: blur(24px);
          border-top: 1px solid rgba(108,60,225,0.15);
          padding: 1.25rem 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }
        .navbar__mobile-link {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.8rem 1rem;
          border-radius: var(--radius-md);
          font-size: 0.95rem;
          font-weight: 500;
          color: var(--gray-300);
          transition: var(--transition);
        }
        .navbar__mobile-link:hover {
          background: rgba(108,60,225,0.12);
          color: var(--white);
        }
        .navbar__mobile-link--active {
          background: rgba(108,60,225,0.18);
          color: var(--primary-light);
          font-weight: 600;
        }
        .navbar__mobile-active-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: var(--primary-light);
        }

        @media (max-width: 900px) {
          .navbar__links, .navbar__cta { display: none; }
          .navbar__hamburger { display: flex; }
        }
      `}</style>
    </nav>
  );
}
