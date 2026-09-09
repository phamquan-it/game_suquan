'use client';

import React from 'react';
import { Result, Typography, Space, Tag, Alert } from 'antd';
import { ClockCircleFilled } from '@ant-design/icons';
import { statusHeaderStyles } from './style';

const { Title, Text } = Typography;

interface PaymentCancelProps {
  orderId: string;
  paymentMethod: string;
}

export default function PaymentCancel({ orderId, paymentMethod }: PaymentCancelProps) {
  const color = '#FF8C00';
  const bgColor = '#FFFAF0';

  return (
    <div style={statusHeaderStyles.container(bgColor)}>
      <Result
        status="warning"
        icon={
          <div style={statusHeaderStyles.iconWrapper}>
            <ClockCircleFilled style={{ color }} />
          </div>
        }
        title={
          <Title level={1} style={statusHeaderStyles.title(color)}>
            Thanh toán bị hủy
          </Title>
        }
        subTitle={
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <Text style={statusHeaderStyles.subTitleText}>Quý khách đã hủy quá trình thanh toán. Đơn hàng vẫn đang được lưu trữ.</Text>
            <Space size="middle" wrap style={{ justifyContent: 'center' }}>
              <Tag color="warning" style={statusHeaderStyles.tag}>
                <strong>Mã đơn hàng:</strong> {orderId}
              </Tag>
              <Tag color="orange" style={statusHeaderStyles.tag}>
                <strong>Trạng thái:</strong> Chưa thanh toán
              </Tag>
              <Tag color="blue" style={statusHeaderStyles.tag}>
                <strong>Phương thức:</strong> {paymentMethod}
              </Tag>
            </Space>
          </Space>
        }
        extra={
          <Alert
            message="Quý khách có thể tiếp tục thanh toán trong vòng 24 giờ tới. Đơn hàng sẽ được giữ nguyên."
            type="warning"
            showIcon
            style={statusHeaderStyles.alert(color)}
          />
        }
      />
    </div>
  );
}
