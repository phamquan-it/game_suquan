import { NextRequest, NextResponse } from 'next/server';
import { generateSePaySignature, getCheckoutUrl } from '@/lib/sepay';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { order_amount, order_invoice_number, order_description, payment_method } = body;

    // Use environment variables for sensitive data
    const merchantId = process.env.SEPAY_MERCHANT_ID || 'SP-TEST-S392693';
    const secretKey = process.env.SEPAY_SECRET_KEY || 'spsk_test_CCQSuMVMABuvFQpmA5v93EcusLBWmkrF';
    const isSandbox = process.env.SEPAY_ENV !== 'production';

    const orderData: any = {
      merchant: merchantId,
      currency: 'VND',
      order_amount: Math.round(Number(order_amount)),
      operation: 'PURCHASE',
      order_description: String(order_description).trim(),
      order_invoice_number: String(order_invoice_number).trim(),
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/order/${order_invoice_number}?payment=success`,
      error_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/order/${order_invoice_number}?payment=error`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/order/${order_invoice_number}?payment=cancel`,
    };

    if (payment_method) {
      orderData.payment_method = payment_method;
    }

    const signature = generateSePaySignature(orderData, secretKey);

    // Construct the checkout URL with all parameters for a GET redirect
    const baseUrl = getCheckoutUrl(isSandbox);
    const params = new URLSearchParams();

    // Add fields in the same order as SIGNED_FIELDS_ORDER for consistency
    const fieldOrder = [
      'merchant', 'currency', 'order_amount', 'operation',
      'order_description', 'order_invoice_number', 'customer_id',
      'payment_method', 'success_url', 'error_url', 'cancel_url'
    ];

    fieldOrder.forEach(key => {
      if (orderData[key] !== undefined && orderData[key] !== null) {
        params.append(key, String(orderData[key]));
      }
    });

    params.append('signature', signature);

    return NextResponse.json({
      checkoutUrl: `${baseUrl}?${params.toString()}`,
    });
  } catch (error) {
    console.error('SePay API error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
