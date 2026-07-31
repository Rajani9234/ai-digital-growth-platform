import type { PainPointFormData, AIReport, CompetitorData, MarketTrend } from '../types';

// Simulated AI Engine – in production this would call OpenAI / Gemini API

export function generateBusinessReport(data: PainPointFormData): AIReport {
  const digitalScore = calculateDigitalScore(data);

  const challengeMap: Record<string, { title: string; description: string; severity: 'high' | 'medium' | 'low' }> = {
    'no-website': {
      title: 'No Online Presence',
      description: 'Your business is invisible to 80%+ of customers who search online before buying.',
      severity: 'high',
    },
    'low-sales': {
      title: 'Low Sales Volume',
      description: 'Without digital marketing, you are missing thousands of potential daily customers.',
      severity: 'high',
    },
    'competition': {
      title: 'Intense Local Competition',
      description: 'Competitors with strong digital presence capture customers before they reach you.',
      severity: 'high',
    },
    'no-social': {
      title: 'Absent on Social Media',
      description: 'Instagram & Facebook drive enormous footfall for retail businesses like yours.',
      severity: 'medium',
    },
    'inventory': {
      title: 'Inventory Management Issues',
      description: 'Manual tracking leads to overstock or stockouts, hurting revenue and customer trust.',
      severity: 'medium',
    },
    'customer-retention': {
      title: 'Poor Customer Retention',
      description: 'Without CRM tools, repeat business is left entirely to chance.',
      severity: 'medium',
    },
    'payment': {
      title: 'Limited Payment Options',
      description: 'Not accepting UPI, cards or EMI reduces conversion, especially for premium items.',
      severity: 'low',
    },
  };

  const challenges = data.currentChallenges
    .filter((c) => challengeMap[c])
    .map((c) => challengeMap[c]);

  const recommendations = buildRecommendations(data, digitalScore);
  const actionPlan = buildActionPlan(data, digitalScore);

  return {
    businessName: data.businessName,
    summary: generateSummary(data, digitalScore),
    challenges,
    recommendations,
    digitalScore,
    actionPlan,
  };
}

function calculateDigitalScore(data: PainPointFormData): number {
  let score = 20; // base
  if (data.onlinePresence === 'website') score += 30;
  else if (data.onlinePresence === 'social') score += 20;
  else if (data.onlinePresence === 'both') score += 50;
  if (data.currentChallenges.length <= 2) score += 15;
  if (data.budget === '10k-25k' || data.budget === '25k+') score += 10;
  return Math.min(score, 100);
}

function generateSummary(data: PainPointFormData, score: number): string {
  const level = score < 30 ? 'very early' : score < 60 ? 'developing' : 'intermediate';
  return `${data.businessName} is a ${data.businessType} based in ${data.city} at a ${level} stage of digital adoption (score: ${score}/100). Our AI analysis identified ${data.currentChallenges.length} key pain points. With targeted website development and digital marketing, businesses similar to yours have seen 40–120% revenue growth within 6 months.`;
}

function buildRecommendations(
  data: PainPointFormData,
  _score: number,
): AIReport['recommendations'] {
  const recs: AIReport['recommendations'] = [];

  if (data.onlinePresence === 'none' || data.onlinePresence === 'social') {
    recs.push({
      title: 'Professional Business Website',
      description:
        'A mobile-first website with product catalogue, contact form and Google Maps will put you in front of local searchers immediately.',
      priority: 1,
      estimatedImpact: '30–50% more inquiries within 60 days',
    });
  }

  if (data.currentChallenges.includes('no-social') || data.onlinePresence === 'none') {
    recs.push({
      title: 'Social Media Marketing',
      description:
        'Weekly Instagram reels and Facebook posts showcasing new arrivals drive organic reach at near-zero cost.',
      priority: 2,
      estimatedImpact: '2x brand awareness within 90 days',
    });
  }

  if (data.currentChallenges.includes('low-sales')) {
    recs.push({
      title: 'Google My Business Optimisation',
      description:
        'A verified GMB profile with photos and reviews ensures you appear in "near me" searches — free and high-converting.',
      priority: 3,
      estimatedImpact: 'Up to 5x more walk-in customers',
    });
  }

  if (data.currentChallenges.includes('customer-retention')) {
    recs.push({
      title: 'WhatsApp Business CRM',
      description:
        'Broadcast new arrivals and offers to existing customers on WhatsApp. 98% open rate vs 20% for email.',
      priority: 4,
      estimatedImpact: '25% boost in repeat purchases',
    });
  }

  recs.push({
    title: 'Search Engine Optimisation (SEO)',
    description: `Ranking for "${data.businessType} in ${data.city}" means free, compounding traffic that grows month over month.`,
    priority: recs.length + 1,
    estimatedImpact: '3–6 month runway to page 1 rankings',
  });

  return recs;
}

function buildActionPlan(data: PainPointFormData, _score: number): AIReport['actionPlan'] {
  return [
    {
      phase: 'Phase 1 — Foundation (Week 1–2)',
      timeline: '2 weeks',
      tasks: [
        'Register/claim Google My Business profile',
        'Set up WhatsApp Business account',
        `Launch Instagram & Facebook page for ${data.businessName}`,
        'Capture high-quality product photos',
      ],
    },
    {
      phase: 'Phase 2 — Website Launch (Week 3–6)',
      timeline: '4 weeks',
      tasks: [
        'Design & develop mobile-first website with product catalogue',
        'Integrate contact forms and WhatsApp chat widget',
        'On-page SEO for local keywords',
        'Connect Google Analytics & Search Console',
      ],
    },
    {
      phase: 'Phase 3 — Growth (Month 2–4)',
      timeline: '3 months',
      tasks: [
        'Run targeted Facebook/Instagram ads for local reach',
        'Start monthly SEO content (blog + Google Posts)',
        'Build review funnel to collect Google ratings',
        'Launch WhatsApp broadcast campaigns for repeat customers',
      ],
    },
    {
      phase: 'Phase 4 — Scale (Month 4+)',
      timeline: 'Ongoing',
      tasks: [
        'Analyse traffic and conversion data monthly',
        'Expand to Google Ads for high-intent searches',
        'Explore e-commerce / online ordering features',
        'Quarterly competitor analysis refresh',
      ],
    },
  ];
}

export function generateCompetitorData(businessType: string, city: string): CompetitorData[] {
  const types: Record<string, CompetitorData[]> = {
    default: [
      {
        name: `TopLocal ${businessType} Store`,
        website: 'Has a website with GMB',
        strengths: ['Active Instagram (10k followers)', 'Google rating 4.5★', 'Online ordering enabled'],
        weaknesses: ['Slow website load time', 'No WhatsApp support', 'Limited product photos'],
        score: 72,
      },
      {
        name: `${city} Premium Traders`,
        website: 'Basic website only',
        strengths: ['Strong word-of-mouth', 'Wide product range'],
        weaknesses: ['No social media presence', 'No online catalogue', 'Poor mobile UX'],
        score: 45,
      },
      {
        name: 'National E-commerce Players',
        website: 'Myntra / Meesho / Amazon',
        strengths: ['Massive reach', 'Fast delivery', 'Easy returns'],
        weaknesses: ['Impersonal service', 'High competition for sellers', 'No local feel'],
        score: 88,
      },
    ],
  };
  return types.default;
}

export function getMarketTrends(): MarketTrend[] {
  return [
    {
      id: '1',
      title: 'Short-Form Video Commerce',
      description: 'Instagram Reels and YouTube Shorts are driving 3x more product discovery than static posts.',
      impact: 'high',
      category: 'Social Media',
      recommendation: 'Add a Reels section to your website and post 3 product videos per week.',
    },
    {
      id: '2',
      title: 'Voice Search & Vernacular SEO',
      description: 'Over 40% of Indian shoppers use voice search in Hindi or regional languages.',
      impact: 'high',
      category: 'SEO',
      recommendation: 'Optimise website content for conversational Hindi keywords and local dialect terms.',
    },
    {
      id: '3',
      title: 'WhatsApp Commerce',
      description: 'WhatsApp Business API allows full catalogues, carts and payment links inside the chat.',
      impact: 'high',
      category: 'Sales',
      recommendation: 'Set up a WhatsApp catalogue and enable direct purchases via chat.',
    },
    {
      id: '4',
      title: 'AI-Powered Chatbots',
      description: 'Businesses using AI chatbots respond to leads 10x faster, improving conversion by 35%.',
      impact: 'medium',
      category: 'Automation',
      recommendation: 'Add a 24/7 AI chatbot to your website to capture leads outside business hours.',
    },
    {
      id: '5',
      title: 'Hyperlocal Influencer Marketing',
      description: 'Micro-influencers (1k–50k followers) in your city deliver 6x higher engagement than celebrities.',
      impact: 'medium',
      category: 'Marketing',
      recommendation: 'Partner with 2–3 local lifestyle influencers for product showcase collaborations.',
    },
    {
      id: '6',
      title: 'Google Shopping & Performance Max',
      description: 'Google Performance Max campaigns now show products across Search, YouTube, Maps and Gmail.',
      impact: 'medium',
      category: 'Advertising',
      recommendation: 'Set up a Google Merchant Centre account and run Performance Max with a ₹5,000/month budget.',
    },
  ];
}
