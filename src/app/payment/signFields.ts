import crypto from 'crypto';

export class SignatureGenerator {
  private readonly allowedFields = [
    'order_amount', 'merchant', 'currency', 'operation',
    'order_description', 'order_invoice_number', 'customer_id',
    'payment_method', 'success_url', 'error_url', 'cancel_url',
  ] as const;

  signFields(
    fields: Partial<Record<typeof this.allowedFields[number], string | number>>, 
    secretKey: string
  ): string {
    const signed: string[] = [];

    for (const field of this.allowedFields) {
      if (!(field in fields)) continue;
      signed.push(`${field}=${fields[field]}`);
    }

    const hmac = crypto.createHmac('sha256', secretKey);
    hmac.update(signed.join(','));
    
    return hmac.digest('base64');
  }
}
