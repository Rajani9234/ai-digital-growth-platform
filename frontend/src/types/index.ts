export interface PainPointFormData {
  businessName: string;
  businessType: string;
  city: string;
  monthlyRevenue: string;
  currentChallenges: string[];
  onlinePresence: string;
  targetAudience: string;
  budget: string;
  additionalInfo: string;
}

export interface AIReport {
  businessName: string;
  summary: string;
  challenges: { title: string; description: string; severity: 'high' | 'medium' | 'low' }[];
  recommendations: { title: string; description: string; priority: number; estimatedImpact: string }[];
  digitalScore: number;
  actionPlan: { phase: string; timeline: string; tasks: string[] }[];
}

export interface PricingPlan {
  id: string;
  name: string;
  price: number;
  duration: string;
  description: string;
  features: string[];
  highlighted: boolean;
  category: 'website' | 'marketing' | 'combo';
}

export interface ReferralPartner {
  name: string;
  phone: string;
  email: string;
  city: string;
  referralCode?: string;
  totalReferrals?: number;
  totalEarnings?: number;
}

export interface CompetitorData {
  name: string;
  website: string;
  strengths: string[];
  weaknesses: string[];
  score: number;
}

export interface MarketTrend {
  id: string;
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  category: string;
  recommendation: string;
}

export interface NavItem {
  label: string;
  href: string;
}
