import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Immediately jump to top on route change to avoid partial/background scroll
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    // Some layouts render after navigation; ensure final position after paint
    const t = setTimeout(() => window.scrollTo(0, 0), 80);
    return () => clearTimeout(t);
  }, [pathname]);

  return null;
}