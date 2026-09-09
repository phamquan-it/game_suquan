import { SePayPgClient } from "./client";
import { OnetimePaymentCheckoutFields, SepayConfig } from "./types";
import crypto from 'crypto';

export class Checkout {
  constructor(private config: SepayConfig) {
    if (!config) {
      throw new Error('SepayConfig is required');
    }
  }
    
  initCheckoutUrl() {
    return `${SePayPgClient.baseCheckoutUrl}/init`;
  }

  initOneTimePaymentFields(fields: OnetimePaymentCheckoutFields) {
    fields.merchant = this.config.merchant_id;
    
    if (!fields.operation) {
      fields.operation = 'PURCHASE';
    }
    
    const signature = this.signFields(fields);

    return {
      ...fields,
      signature,
    }
  }

  signFields(fields: Record<string, any>): string {
    const signed: string[] = [];
    const signedFields = Object.keys(fields).filter(field => 
      [
        'merchant',
        'env',
        'operation',
        'payment_method',
        'order_amount',
        'currency',
        'order_invoice_number',
        'order_description',
        'customer_id',
        'agreement_id',
        'agreement_name',
        'agreement_type',
        'agreement_payment_frequency',
        'agreement_amount_per_payment',
        'success_url',
        'error_url',
        'cancel_url',
        'order_id'
      ].includes(field)
    );
    
    for (const field of signedFields) {
      if (fields[field] === undefined) continue;
      signed.push(`${field}=${fields[field] ?? ''}`);
    }
    
    const hmac = crypto.createHmac('sha256', this.config.secret_key);
    hmac.update(signed.join(','));
    return hmac.digest('base64');
  }
}
