import { ApiResource } from "@/app/payment/api-resource";

export interface OrderQueryParams {
  per_page?: number;
  q?: string;
  order_status?: string;
  created_at?: string;
  from_created_at?: string;
  to_created_at?: string;
  customer_id?: string | null;
  sort?: {
    created_at?: string;
  };
}

export class Order extends ApiResource {
  all(queryParams: OrderQueryParams = {}) {
    return this.makeHttpRequest('GET', 'order', { params: queryParams })
  }

  retrieve(order_invoice_number: string)
  {
    return this.makeHttpRequest('GET', `order/detail/${order_invoice_number}`)
  }

  voidTransaction(order_invoice_number: string)
  {
    return this.makeHttpRequest('POST', `order/voidTransaction`, {
      data: {
        order_invoice_number: order_invoice_number
      }
    })
  }

  cancel(order_invoice_number: string)
  {
    return this.makeHttpRequest('POST', `order/cancel`, {
      data: {
        order_invoice_number: order_invoice_number
      }
    })
  }
}
