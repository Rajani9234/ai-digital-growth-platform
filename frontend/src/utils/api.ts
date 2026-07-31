// ============================================================
// API Client — connects React frontend to PHP backend
// ============================================================

// Change this to your backend URL when deploying
export const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost/ai-digital-growth-platform-1/backend/api';

// ── Generic fetch helper ────────────────────────────────────
async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}/${endpoint}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  const data = await res.json();

  if (!res.ok || !data.success) {
    throw new Error(data.error ?? 'Something went wrong. Please try again.');
  }

  return data as T;
}

// ── Pain Analysis ───────────────────────────────────────────
export interface PainAnalysisPayload {
  business_name: string;
  business_type: string;
  city: string;
  monthly_revenue: string;
  current_challenges: string[];
  online_presence: string;
  target_audience: string;
  budget: string;
  additional_info: string;
}

export interface PainAnalysisResponse {
  success: boolean;
  id: number;
  digital_score: number;
  report: {
    digital_score: number;
    summary: string;
    challenges: { title: string; description: string; severity: 'high' | 'medium' | 'low' }[];
    recommendations: { priority: number; title: string; description: string; estimated_impact: string }[];
    action_plan: { phase: string; timeline: string; tasks: string[] }[];
  };
}

export async function submitPainAnalysis(payload: PainAnalysisPayload): Promise<PainAnalysisResponse> {
  return request<PainAnalysisResponse>('pain-analysis.php', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

// ── Referral Partner ────────────────────────────────────────
export interface RegisterPartnerPayload {
  name: string;
  phone: string;
  email: string;
  city: string;
}

export interface RegisterPartnerResponse {
  success: boolean;
  already_exists: boolean;
  message: string;
  partner_id: number;
  referral_code: string;
  referral_link: string;
  partner: {
    name: string;
    phone: string;
    email: string;
    city: string;
    referral_code: string;
    total_referrals: number;
    total_earnings: number;
  };
}

export async function registerPartner(payload: RegisterPartnerPayload): Promise<RegisterPartnerResponse> {
  return request<RegisterPartnerResponse>('register-partner.php', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export interface PartnerDashboardResponse {
  success: boolean;
  partner: {
    id: number;
    name: string;
    phone: string;
    city: string;
    referral_code: string;
    referral_link: string;
    total_referrals: number;
    total_earnings: number;
    status: string;
    joined_on: string;
  };
  conversions: {
    id: number;
    client_name: string;
    package_name: string;
    commission: number;
    status: string;
    created_at: string;
  }[];
}

export async function getPartnerDashboard(code: string): Promise<PartnerDashboardResponse> {
  return request<PartnerDashboardResponse>(`get-referrals.php?code=${encodeURIComponent(code)}`);
}

// ── Contact / Enquiry ───────────────────────────────────────
export interface ContactPayload {
  name: string;
  phone: string;
  email: string;
  business_type: string;
  message: string;
  source: string;
  plan_interest: string;
}

export interface ContactResponse {
  success: boolean;
  message: string;
  enquiry_id: number;
  whatsapp_link: string;
}

export async function submitEnquiry(payload: ContactPayload): Promise<ContactResponse> {
  return request<ContactResponse>('contact.php', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}
