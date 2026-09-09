'use client';

import React from 'react';
import { Result, Typography, Space, Tag, Alert } from 'antd';
import { CheckCircleFilled } from '@ant-design/icons';
import { statusHeaderStyles } from './style';

const { Title, Text } = Typography;

interface PaymentSuccessProps {
  orderId: string;
  paymentMethod: string;
}

export default function PaymentSuccess({ orderId, paymentMethod }: PaymentSuccessProps) {
  const color = '#2E8B57';
  const bgColor = '#F0FFF4';

  return (
    <div style={statusHeaderStyles.container(bgColor)}>
      <Result
        status="success"
        icon={
          <div style={statusHeaderStyles.iconWrapper}>
            <CheckCircleFilled style={{ color }} />
          </div>
        }
        title={
          <Title level={1} style={statusHeaderStyles.title(color)}>
            Thanh toán thành công
          </Title>
        }
        subTitle={
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <Text style={statusHeaderStyles.subTitleText}>Đơn hàng của quý khách đã được xác nhận và đang được xử lý.</Text>
            <Space size="middle" wrap style={{ justifyContent: 'center' }}>
              <Tag color="success" style={statusHeaderStyles.tag}>
                <strong>Mã đơn hàng:</strong> {orderId}
              </Tag>
              <Tag color="green" style={statusHeaderStyles.tag}>
                <strong>Trạng thái:</strong> Đã thanh toán
              </Tag>
              <Tag color="blue" style={statusHeaderStyles.tag}>
                <strong>Phương thức:</strong> {paymentMethod}
              </Tag>
            </Space>
          </Space>
        }
        extra={
          <Alert
            message="Cảm ơn quý khách đã mua sắm tại Imperial Store. Đơn hàng sẽ được giao trong thời gian sớm nhất."
            type="success"
            showIcon
            style={statusHeaderStyles.alert(color)}
          />
        }
      />
    </div>
  );
}
