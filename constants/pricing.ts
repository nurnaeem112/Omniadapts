export const PRICING_PLANS = [
  {
    id: 'free',
    name: 'Free',
    price: '0',
    period: 'month',
    description: 'Perfect for trying out OmniAdapts.',
    limit: 10,
    features: [
      '10 Generations per month',
      'Standard Platforms',
      'Basic AI Strategy',
      'Community Support',
    ],
    cta: 'Get Started',
    popular: false,
  },
  {
    id: 'monthly',
    polarProductId: 'ebdcfdcb-6d68-4bcf-afb4-cc0f222c144c',
    name: '1 Month',
    price: '7.99',
    period: 'month',
    description: 'For serious creators and marketers.',
    limit: 500,
    features: [
      '500 Generations per month',
      'All 12+ Platforms',
      'Custom Website Context',
      'Priority AI Processing',
      'Advanced SEO Strategy',
      'Email Support',
    ],
    cta: 'Start Now',
    popular: true,
  },
  {
    id: 'quarterly',
    polarProductId: 'e07eaedf-c669-4ce9-88bc-2adadb070cde',
    name: '3 Months',
    price: '19.17',
    period: '3 months',
    description: 'Best value for long-term growth.',
    limit: 500,
    features: [
      '500 Generations per month',
      'All 12+ Platforms',
      'Save 30% vs Monthly',
      'Team Collaboration',
      'Priority Support',
      'Advanced Analytics',
    ],
    cta: 'Get 20% Off',
    popular: false,
    badge: 'Save 20%',
  },
];

export const getPlanById = (id: string) => {
  return PRICING_PLANS.find(p => p.id === id) || PRICING_PLANS[0];
};

export const getPlanByName = (name: string) => {
  return PRICING_PLANS.find(p => p.name.toLowerCase() === name.toLowerCase()) || PRICING_PLANS[0];
};
