import crypto from 'crypto';

export interface SePayConfig {
  merchantId: string;
  secretKey: string;
  isSandbox?: boolean;
}

export interface CheckoutFields {
  order_amount: number;
  currency: string;
  operation: 'PURCHASE' | 'VERIFY';
  order_description: string;
  order_invoice_number: string;
  payment_method?: 'CARD' | 'BANK_TRANSFER' | 'NAPAS_BANK_TRANSFER';
  customer_id?: string;
  success_url?: string;
  error_url?: string;
  cancel_url?: string;
}

const SIGNED_FIELDS_ORDER = [
  'merchant',
  'currency',
  'order_amount',
  'operation',
  'order_description',
  'order_invoice_number',
  'customer_id',
  'payment_method',
  'success_url',
  'error_url',
  'cancel_url',
] as const;

export function generateSePaySignature(fields: Record<string, any>, secretKey: string): string {
  const signData = SIGNED_FIELDS_ORDER
    .filter(key => fields[key] !== undefined && fields[key] !== null && String(fields[key]).trim() !== '')
    .map(key => `${key}=${fields[key]}`)
    .join(',');

  console.log('Sign Data:', signData);

  return crypto
    .createHmac('sha256', secretKey)
    .update(signData)
    .digest('base64');
}

export function getCheckoutUrl(isSandbox: boolean = false): string {
  return isSandbox
    ? 'https://pay-sandbox.sepay.vn/v1/checkout/init'
    : 'https://pgapi.sepay.vn/v1/checkout/init';
}
