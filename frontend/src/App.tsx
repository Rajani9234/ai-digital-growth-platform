import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ScrollToTop from './components/layout/ScrollToTop';
import Home from './pages/Home';
import PainAnalysis from './pages/PainAnalysis';
import Pricing from './pages/Pricing';
import Referral from './pages/Referral';
import Insights from './pages/Insights';
import './styles/globals.css';

export default function App() {
  const pathname = window.location.pathname;
  const basename = pathname.startsWith('/ai-digital-growth-platform')
    ? '/ai-digital-growth-platform'
    : '/';

  return (
    <BrowserRouter basename={basename}>
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
