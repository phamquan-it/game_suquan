"use client";

import { useQuery } from "@tanstack/react-query";
import {
  getPaymentBillingInformation,
  type PaymentBillingInformation,
} from "@/app/payment/hooks/useCreatePaymentOrder";

export type { PaymentBillingInformation };

/**
 * Lấy thông tin đơn hàng / billing của người chơi từ RPC
 * `payment_get_billing_information` (tra theo email + actionType).
 * Dùng ở trang /order để hiển thị thông tin đơn sau khi thanh toán.
 */
export const usePaymentBilling = (email: string, actionType: string) => {
  return useQuery<PaymentBillingInformation>({
    queryKey: ["payment-billing-information", email, actionType],
    queryFn: () => getPaymentBillingInformation({ email, actionType }),
    enabled: Boolean(email && actionType),
    retry: false,
    staleTime: 0,
  });
};
