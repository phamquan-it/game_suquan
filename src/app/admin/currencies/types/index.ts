
export type CurrencyCategory = 'basic' | 'premium' | 'pvp' | 'social' | 'event' | 'special' | 'material';

export interface Currency {
  currency_type: string;
  name: string;
  description: string | null;
  icon: string | null;
  color: string | null;
  exchange_rate: number | null;
  max_stack: number | null;
  tradable: boolean | null;
  destroyable: boolean | null;
  category: CurrencyCategory;
}

export interface CurrencyExchangeRate {
  id: string;
  from_currency: string;
  to_currency: string;
  rate: number;
  fee: number | null;
  min_amount: number | null;
  max_amount: number | null;
}

export interface CurrencyExchangeRateWithRelations extends CurrencyExchangeRate {
  from_currency_details?: Currency;
  to_currency_details?: Currency;
}

export type CreateCurrencyInput = Omit<Currency, 'currency_type'> & {
  currency_type: string;
};

export type UpdateCurrencyInput = Partial<Omit<Currency, 'currency_type'>> & {
  currency_type: string;
};

export type CreateExchangeRateInput = Omit<CurrencyExchangeRate, 'id'> & {
  id?: string;
};

export interface CurrencyStats {
  totalCurrencies: number;
  totalExchangeRates: number;
  categoriesCount: Record<CurrencyCategory, number>;
  mostTradedCurrency: string | null;
}

export const CURRENCY_CATEGORIES: CurrencyCategory[] = [
  'basic', 'premium', 'pvp', 'social', 'event', 'special', 'material'
];

export const CATEGORY_COLORS: Record<CurrencyCategory, string> = {
  basic: '#2E8B57', // green
  premium: '#8B0000', // imperial red
  pvp: '#DC143C', // crimson
  social: '#1E90FF', // dodger blue
  event: '#FF8C00', // dark orange
  special: '#8B4513', // noble brown
  material: '#CD7F32' // bronze
};
