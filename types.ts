export interface Subscription {
  id: string;
  name: string;
  price: number;
  dayOfMonth: number;
  category: Category;
  color?: string;
}

export enum Category {
  ENTERTAINMENT = 'Entertainment',
  UTILITIES = 'Utilities',
  SOFTWARE = 'Software',
  FITNESS = 'Fitness',
  OTHER = 'Other'
}

export interface Insight {
  title: string;
  description: string;
  type: 'saving' | 'warning' | 'positive';
}

export interface AIAnalysisResponse {
  insights: Insight[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  monthlyBudget?: number;
  currency: string;
}

export interface OnboardingData {
  name: string;
  budget: number;
}