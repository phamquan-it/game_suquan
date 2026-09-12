// hooks/usePayment.ts
"use client";

import { useState, useCallback } from "react";
import client from "../init";
import { useMutation, useQuery } from "@tanstack/react-query";
import { createPaymentOrder, getPaymentBillingInformation } from "./useCreatePaymentOrder";

export type PaymentMethod = "BANK_TRANSFER" | "NAPAS_BANK_TRANSFER" | "CARD";

export interface PaymentParams {
  orderId: string;
  amount: number;
  paymentMethod: PaymentMethod;
  description: string;
  /** Truyền kèm sang trang /order để tra lại billing info */
  email?: string;
  actionType?: string;
}

export interface UsePaymentReturn {
  isLoading: boolean;
  error: Error | null;
  initiatePayment: (params: PaymentParams) => Promise<void>;
  clearError: () => void;
}

/**
 * Custom hook khởi tạo thanh toán OnePay
 * Đảm bảo đầy đủ các trường bắt buộc khi gọi client.checkout.initOneTimePaymentFields
 */
export function usePayment(): UsePaymentReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const clearError = useCallback(() => setError(null), []);

  const initiatePayment = useCallback(async (params: PaymentParams) => {
    const { orderId, amount, paymentMethod, description, email, actionType } =
      params;

    // Reset state
    setError(null);
    setIsLoading(true);

    const basePath = window.location.origin;
    // Giữ email/actionType trên URL để trang /order tra lại billing info
    const extraParams = new URLSearchParams();
    if (email) extraParams.set("email", email);
    if (actionType) extraParams.set("actionType", actionType);
    const extra = extraParams.toString();
    const orderUrl = `${basePath}/order/${orderId}`;
    const withExtra = (status: string) =>
      extra ? `${orderUrl}?payment=${status}&${extra}` : `${orderUrl}?payment=${status}`;
    const successUrl = withExtra("success");
    const errorUrl = withExtra("error");
    const cancelUrl = withExtra("cancel");

    try {
      // ✅ ĐẦY ĐỦ CÁC TRƯỜNG BẮT BUỘC
      const checkoutFormfields = client.checkout.initOneTimePaymentFields({
        // Bắt buộc
        operation: "PURCHASE",
        payment_method: (paymentMethod ?? "BANK_TRANSFER") as
          | "BANK_TRANSFER"
          | "NAPAS_BANK_TRANSFER",
        order_invoice_number: orderId,
        order_amount: amount,
        currency: "VND",
        order_description: description,

        // URLs điều hướng
        success_url: successUrl,
        error_url: errorUrl,
        cancel_url: cancelUrl,
      });

      const checkoutURL = client.checkout.initCheckoutUrl();

      // Tạo form ẩn và submit
      const form = document.createElement("form");
      form.method = "POST";
      form.action = checkoutURL;

      Object.entries(checkoutFormfields).forEach(([key, value]) => {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = key;
        input.value = String(value);
        form.appendChild(input);
      });

      document.body.appendChild(form);
      form.submit();
      document.body.removeChild(form);
    } catch (err) {
      console.error("Payment error:", err);
      setError(
        err instanceof Error
          ? err
          : new Error("Có lỗi xảy ra khi khởi tạo thanh toán. Vui lòng thử lại."),
      );
      setIsLoading(false);
    }
  }, []);
  return { isLoading, error, initiatePayment, clearError };
}

export const useCreatePaymentOrder = () => {
  return useMutation({
    mutationFn: createPaymentOrder,
  });
};

export const usePaymentBillingInformation = (
  email: string,
  actionType: string,
) => {
  return useQuery({
    queryKey: [
      'payment-billing-information',
      email,
      actionType,
    ],
    queryFn: () =>
      getPaymentBillingInformation({
        email,
        actionType,
      }),
    enabled: Boolean(email && actionType),
  });
};
