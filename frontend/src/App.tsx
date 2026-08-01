import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import PainAnalysis from './pages/PainAnalysis';
import Pricing from './pages/Pricing';
import Referral from './pages/Referral';
import Insights from './pages/Insights';
import './styles/globals.css';

// Scroll to top on every route change
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <BrowserRouter basename="/ai-digital-growth-platform">
      <ScrollToTop />
      <Navbar />
      <Routes>
        <Route path="/"              element={<Home />} />
        <Route path="/pain-analysis" element={<PainAnalysis />} />
        <Route path="/pricing"       element={<Pricing />} />
        <Route path="/referral"      element={<Referral />} />
        <Route path="/insights"      element={<Insights />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}
