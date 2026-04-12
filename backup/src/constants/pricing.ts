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
    polarProductId: '4a0d412e-1e97-4415-a0ea-744cabe32974',
    name: '1 Month',
    price: '9.99',
    period: 'month',
    description: 'For serious creators and marketers.',
    limit: 200,
    features: [
      '200 Generations per month',
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
    polarProductId: '783765ab-c8c9-4ff2-9e7a-1733c88e1bb8',
    name: '3 Months',
    price: '20.99',
    period: '3 months',
    description: 'Best value for long-term growth.',
    limit: 200,
    features: [
      '200 Generations per month',
      'All 12+ Platforms',
      'Save 30% vs Monthly',
      'Team Collaboration',
      'Priority Support',
      'Advanced Analytics',
    ],
    cta: 'Get 30% Off',
    popular: false,
    badge: 'Save 30%',
  },
];

export const getPlanById = (id: string) => {
  return PRICING_PLANS.find(p => p.id === id) || PRICING_PLANS[0];
};

export const getPlanByName = (name: string) => {
  return PRICING_PLANS.find(p => p.name.toLowerCase() === name.toLowerCase()) || PRICING_PLANS[0];
};
