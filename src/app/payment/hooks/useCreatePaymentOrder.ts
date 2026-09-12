import { supabase } from '@/utils/supabase/client';

export type CreatePaymentOrderParams = {
  email: string;
  orderType: string;
};

export const createPaymentOrder = async ({
  email,
  orderType,
}: CreatePaymentOrderParams): Promise<string> => {
  const { data, error } = await supabase.rpc(
    'payment_create_order_by_email',
    {
      p_email: email,
      p_order_type: orderType,
    },
  );

  if (error) {
    throw new Error(error.message);
  }
  // data is order code
  return data as string;
};


export type PaymentBillingInformation = {
  playerId: string;
  email: string;
  username: string;
  actionType: string;
  orderType: string;
  amount: number;
  formattedAmount: string;
  currency: string;
  description: string;
  activated: boolean;
};

type PaymentBillingParams = {
  email: string;
  actionType: string;
};

export const getPaymentBillingInformation = async ({
  email,
  actionType,
}: PaymentBillingParams): Promise<PaymentBillingInformation> => {
  const { data, error } = await supabase.rpc(
    'payment_get_billing_information',
    {
      p_email: email,
      p_action_type: actionType,
    },
  );

  if (error) {
    throw new Error(error.message);
  }

  return data as PaymentBillingInformation;
};


