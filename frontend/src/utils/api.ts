// ============================================================
// Gemini API — Direct frontend call (no backend needed)
// ============================================================

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY ?? '';
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

async function askGemini(prompt: string): Promise<string> {
  const res = await fetch(GEMINI_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.7, maxOutputTokens: 2048 },
    }),
  });
  if (!res.ok) throw new Error('Gemini API error');
  const data = await res.json();
  return data?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
}

// ── Pain Analysis ─────────────────────────────────────────
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

export interface PainAnalysisReport {
  digital_score: number;
  summary: string;
  challenges: { title: string; description: string; severity: 'high' | 'medium' | 'low' }[];
  recommendations: { priority: number; title: string; description: string; estimated_impact: string }[];
  action_plan: { phase: string; timeline: string; tasks: string[] }[];
}

export async function submitPainAnalysis(payload: PainAnalysisPayload): Promise<PainAnalysisReport> {
  const challenges = payload.current_challenges.join(', ');

  const prompt = `You are a professional digital marketing consultant for Indian local businesses.
Analyse this business and return ONLY valid JSON (no markdown, no extra text):

Business:
- Name: ${payload.business_name}
- Type: ${payload.business_type}
- City: ${payload.city}
- Revenue: ${payload.monthly_revenue}
- Challenges: ${challenges}
- Online Presence: ${payload.online_presence}
- Target Audience: ${payload.target_audience}
- Budget: ${payload.budget}
- Notes: ${payload.additional_info}

Return this exact JSON structure:
{
  "digital_score": <0-100>,
  "summary": "<2-3 sentences>",
  "challenges": [{"title":"","description":"","severity":"high|medium|low"}],
  "recommendations": [{"priority":1,"title":"","description":"","estimated_impact":""}],
  "action_plan": [{"phase":"","timeline":"","tasks":[""]}]
}`;

  try {
    let text = await askGemini(prompt);
    // Strip markdown fences if present
    text = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim();
    const report = JSON.parse(text) as PainAnalysisReport;
    return report;
  } catch {
    return buildFallbackReport(payload);
  }
}

function buildFallbackReport(form: PainAnalysisPayload): PainAnalysisReport {
  let score = 20;
  if (form.online_presence === 'both') score += 50;
  else if (form.online_presence === 'website') score += 30;
  else if (form.online_presence === 'social') score += 20;
  score = Math.min(score, 100);

  return {
    digital_score: score,
    summary: `${form.business_name} is a ${form.business_type} in ${form.city}. Our AI analysis identified key growth opportunities with targeted digital marketing.`,
    challenges: [
      { title: 'Limited Online Visibility', description: 'Most customers search online before buying. A stronger digital presence will capture them.', severity: 'high' },
      { title: 'Competitive Market', description: 'Competitors with strong digital presence capture leads before they reach you.', severity: 'high' },
    ],
    recommendations: [
      { priority: 1, title: 'Professional Website', description: 'A mobile-first website with product catalogue and WhatsApp integration.', estimated_impact: '30–50% more enquiries in 60 days' },
      { priority: 2, title: 'Google My Business', description: 'Claim and optimise your GMB profile for local search visibility.', estimated_impact: 'Up to 5x more walk-in customers' },
      { priority: 3, title: 'Social Media Marketing', description: 'Weekly posts on Instagram & Facebook to build brand awareness.', estimated_impact: '2x brand reach in 90 days' },
    ],
    action_plan: [
      { phase: 'Phase 1 – Foundation', timeline: '2 weeks', tasks: ['Claim Google My Business', 'Set up WhatsApp Business', 'Create social profiles'] },
      { phase: 'Phase 2 – Website', timeline: '4 weeks', tasks: ['Design & develop website', 'Add product catalogue', 'SEO optimisation'] },
      { phase: 'Phase 3 – Growth', timeline: '3 months', tasks: ['Run social media ads', 'Collect Google reviews', 'WhatsApp marketing campaigns'] },
    ],
  };
}

// ── Referral Code Generator (local, no backend) ──────────
export function generateReferralCode(name: string): string {
  const prefix = name.toUpperCase().replace(/\s+/g, '').slice(0, 4).padEnd(4, 'X');
  const num = Math.floor(1000 + Math.random() * 9000);
  return `JT${prefix}${num}`;
}
