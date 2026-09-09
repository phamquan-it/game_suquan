import { Suspense } from "react";
import PaymentStatusDisplay from "../components/PaymentStatusDisplay";
import { Card, Flex, Spin } from "antd";

export default async function OrderPage({
  params,
}: {
  params: Promise<{ p_order_id: string }>;
}) {
  const { p_order_id } = await params;

  console.log("ORDER ID:", p_order_id);

  return (
    <Suspense
      fallback={
        <div
          style={{
            maxWidth: 900,
            margin: "2rem auto",
            padding: "0 1rem",
          }}
        >
          <Card style={{ borderRadius: 16, padding: "2rem" }}>
            <Flex
              justify="center"
              align="center"
              vertical
              gap="large"
              style={{ padding: "3rem 0" }}
            >
              <Spin size="large" />
              <span style={{ color: "#8B4513" }}>
                Đang tải thông tin đơn hàng...
              </span>
            </Flex>
          </Card>
        </div>
      }
    >
      <PaymentStatusDisplay orderId={p_order_id} />
    </Suspense>
  );
}
