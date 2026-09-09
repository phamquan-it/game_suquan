'use client';

import React from 'react';
import { Result, Typography, Space, Tag, Alert } from 'antd';
import { CloseCircleFilled } from '@ant-design/icons';
import { statusHeaderStyles } from './style';

const { Title, Text } = Typography;

interface PaymentErrorProps {
  orderId: string;
  paymentMethod: string;
}

export default function PaymentError({ orderId, paymentMethod }: PaymentErrorProps) {
  const color = '#DC143C';
  const bgColor = '#FFF5F5';

  return (
    <div style={statusHeaderStyles.container(bgColor)}>
      <Result
        status="error"
        icon={
          <div style={statusHeaderStyles.iconWrapper}>
            <CloseCircleFilled style={{ color }} />
          </div>
        }
        title={
          <Title level={1} style={statusHeaderStyles.title(color)}>
            Thanh toán thất bại
          </Title>
        }
        subTitle={
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <Text style={statusHeaderStyles.subTitleText}>Đã xảy ra lỗi trong quá trình xử lý thanh toán. Vui lòng thử lại.</Text>
            <Space size="middle" wrap style={{ justifyContent: 'center' }}>
              <Tag color="error" style={statusHeaderStyles.tag}>
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
            message="Giao dịch chưa được hoàn tất. Quý khách vui lòng kiểm tra lại thông tin thanh toán hoặc liên hệ hỗ trợ."
            type="error"
            showIcon
            style={statusHeaderStyles.alert(color)}
          />
        }
      />
    </div>
  );
}
