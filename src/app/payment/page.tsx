// app/payment/page.tsx
"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button, Form, Input, InputNumber, Radio, Alert, Tag, Spin, Flex } from "antd";
import {
  usePayment,
  useCreatePaymentOrder,
  usePaymentBillingInformation,
  type PaymentMethod,
} from "./hooks/usePayment";
import { styles } from "./styles";
import './styles/payment.css'

type PaymentMethodItem = {
  value: PaymentMethod;
  label: string;
  icon: string;
};

interface FormValues {
  orderId: string;
  amount: number;
  paymentMethod: PaymentMethod;
  description: string;
}

const mapOrderTypeToPaymentMethod = (_orderType: string): PaymentMethod => {
  return "BANK_TRANSFER";
};

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    minimumFractionDigits: 0,
  }).format(value);

function PaymentContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [form] = Form.useForm<FormValues>();

  const email = searchParams.get("email") ?? "";
  const actionType = searchParams.get("actionType") ?? "";

  const { initiatePayment } = usePayment();

  const {
    data: billing,
    isLoading: isLoadingBilling,
    error: billingError,
  } = usePaymentBillingInformation(email, actionType);

  const {
    mutate: createOrder,
    data: orderId,
    error: orderError,
    isPending: isCreatingOrder,
  } = useCreatePaymentOrder();

  const isSubmitting = isCreatingOrder;
  const error = orderError?.message ?? billingError?.message ?? "";

  // amount / description đều lấy từ billing info, không cho user sửa
  useEffect(() => {
    if (!billing) return;

    form.setFieldsValue({
      amount: billing.amount,
      paymentMethod: mapOrderTypeToPaymentMethod(billing.orderType),
      description: billing.description,
    });
  }, [billing, form]);

  // Bước 2: đã có order code → khởi tạo thanh toán
  useEffect(() => {
    if (!orderId || !billing) return;
    initiatePayment({
      orderId,
      amount: billing.amount,
      paymentMethod: mapOrderTypeToPaymentMethod(billing.orderType),
      description: billing.description,
      email: billing.email,
      actionType: billing.actionType,
    });
  }, [orderId, billing, initiatePayment]);

  // Bước 1: bấm xác nhận → tạo đơn lấy order code
  const handleSubmit = () => {
    if (!billing) return;

    createOrder({
      email: billing.email,
      orderType: billing.orderType,
    });
  };

  const handleCancel = () => router.back();

  if (isLoadingBilling) {
    return (
      <div style={styles.container}>
        <Flex justify="center" align="center" vertical gap="large">
          <Spin size="large" />
          <span style={{ color: "#d4af37" }}>Đang tải thông tin đơn hàng...</span>
        </Flex>
      </div>
    );
  }

  if (billingError || !billing) {
    return (
      <div style={styles.container}>
        <div style={styles.wrapper}>
          <Alert
            type="error"
            showIcon
            message="Không tải được thông tin đơn hàng"
            description={
              billingError?.message ??
              "Thiếu thông tin người chơi. Vui lòng kiểm tra lại đường dẫn thanh toán."
            }
          />
          <Button
            type="default"
            onClick={handleCancel}
            className="game-cancel-btn"
            style={{ marginTop: 16 }}
            block
          >
            🏰 Quay lại
          </Button>
        </div>
      </div>
    );
  }

  const paymentMethods: PaymentMethodItem[] = [
    { value: "BANK_TRANSFER", label: "Chuyển khoản", icon: "🏦" },
  ];

  return (
    <div style={styles.container}>
      <div style={styles.wrapper}>
        <div style={styles.decorativeBorder}>
          <div style={styles.card} className="game-card">
            {/* Title */}
            <div style={styles.title}>
              <span style={styles.titleIcon}>⚔️</span>
              <div style={styles.titleMain}>IMPERIAL PAY</div>
              <div style={styles.titleSub}>✦ 12 SỨ QUÂN HOÀNG GIA ✦</div>
            </div>

            {/* User info */}
            <div className="game-user-box">
              <div className="game-user-row">
                <span className="label">👤 Người chơi</span>
                <span className="value">{billing.username}</span>
              </div>
              <div className="game-user-row">
                <span className="label">📧 Email</span>
                <span className="value">{billing.email}</span>
              </div>
              <div className="game-user-row">
                <span className="label">📦 Loại đơn</span>
                <span className="value">
                  <Tag color={billing.activated ? "gold" : "red"}>
                    {billing.description}
                  </Tag>
                </span>
              </div>
            </div>

            <Form<FormValues>
              form={form}
              layout="vertical"
              className="game-form"
              requiredMark={false}
              onFinish={handleSubmit}
            >
              {/* orderId — ẩn, sinh ra sau khi tạo đơn */}
              <Form.Item name="orderId" hidden>
                <Input type="hidden" />
              </Form.Item>

              {/* amount — ẩn, cố định từ billing API */}
              <Form.Item name="amount" hidden>
                <InputNumber />
              </Form.Item>

              {/* Số tiền — chỉ hiển thị */}
              <div style={styles.amountDisplay}>
                <div style={styles.amountText}>💰 Số tiền thanh toán</div>
                <div style={styles.amountValue}>
                  {formatCurrency(billing.amount)}
                </div>
              </div>

              {/* Phương thức */}
              <Form.Item
                name="paymentMethod"
                label={<span className="game-label">🏹 Phương thức thanh toán</span>}
                rules={[{ required: true, message: "Vui lòng chọn phương thức" }]}
                style={{ marginTop: 20 }}
              >
                <Radio.Group style={{ width: "100%" }}>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: 10,
                    }}
                  >
                    {paymentMethods.map((method) => (
                      <Radio.Button
                        key={method.value}
                        value={method.value}
                        className="game-method-btn"
                        style={{ textAlign: "center" }}
                      >
                        <span style={{ fontSize: 24, display: "block" }}>
                          {method.icon}
                        </span>
                        {method.label}
                      </Radio.Button>
                    ))}
                  </div>
                </Radio.Group>
              </Form.Item>

              {/* Mô tả — chỉ hiển thị, lấy từ billing API */}
              <div style={styles.amountDisplay}>
                <div style={styles.amountText}>📝 Mô tả đơn hàng</div>
                <div style={styles.amountValue}>{billing.description}</div>
              </div>
              <Form.Item name="description" hidden>
                <Input type="hidden" />
              </Form.Item>

              {/* Error */}
              {error && (
                <Alert
                  type="error"
                  showIcon
                  message={error}
                  style={{
                    marginBottom: 16,
                    background: "rgba(255, 68, 68, 0.1)",
                    border: "1px solid rgba(255, 68, 68, 0.2)",
                    borderRadius: 8,
                    color: "#FF4444",
                  }}
                />
              )}

              {/* Submit */}
              <Form.Item style={{ marginBottom: 8 }}>
                <Button
                  type="primary"
                  htmlType="submit"
                  disabled={isSubmitting}
                  className="game-submit-btn"
                  block
                >
                  {isSubmitting ? "⏳ Đang xử lý..." : "⚡ THANH TOÁN NGAY"}
                </Button>
              </Form.Item>

              {/* Cancel */}
              <Button
                type="default"
                onClick={handleCancel}
                className="game-cancel-btn"
                block
              >
                🏰 Quay lại
              </Button>

              {/* Support */}
              <div style={styles.support}>
                <div>🛡️ Giao dịch được bảo mật bởi SSL</div>
                <div style={{ marginTop: 4 }}>
                  📧 Hỗ trợ: support@game12suquan.online
                </div>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PaymentPage() {
  return (
    <Suspense
      fallback={
        <div style={styles.container}>
          <Flex justify="center" align="center" vertical gap="large">
            <Spin size="large" />
            <span style={{ color: "#d4af37" }}>Đang tải...</span>
          </Flex>
        </div>
      }
    >
      <PaymentContent />
    </Suspense>
  );
}
