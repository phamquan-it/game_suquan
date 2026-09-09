export interface SepayIPNPayload {
  timestamp: number;
  notification_type: string;

  order: SepayOrder;

  transaction: SepayTransaction;

  customer: null | SepayCustomer;
  agreement: null | SepayAgreement;
}

export interface SepayOrder {
  id: string;
  order_id: string;
  order_status: string;
  order_currency: string;
  order_amount: string;
  order_invoice_number: string;
  custom_data: unknown[];
  user_agent: string;
  ip_address: string;
  order_description: string;
}

export interface SepayTransaction {
  id: string;
  payment_method: string;
  transaction_id: string;
  transaction_type: string;
  transaction_date: string;
  transaction_status: string;
  transaction_amount: string;
  transaction_currency: string;
  authentication_status: string;

  card_number: string | null;
  card_holder_name: string | null;
  card_expiry: string | null;
  card_funding_method: string | null;
  card_brand: string | null;
}

export interface SepayCustomer {
  // SePay customer fields nếu sau này có
  [key: string]: unknown;
}

export interface SepayAgreement {
  // SePay agreement fields nếu sau này có
  [key: string]: unknown;
}
