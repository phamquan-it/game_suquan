// app/order/[orderId]/PaymentStatusDisplay.tsx
'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { 
  Card, 
  Button,
  Space, 
  Typography, 
  Row, 
  Col,
  Divider,
  Tag,
  Flex,
  theme,
  Layout
} from 'antd';
import {
  ClockCircleFilled,
  HomeOutlined,
  ReloadOutlined,
  ArrowLeftOutlined,
  FileTextOutlined,
  DollarCircleFilled,
  CalendarOutlined,
  UserOutlined,
  MailOutlined,
  ShoppingCartOutlined,
  SafetyOutlined,
  GiftOutlined,
} from '@ant-design/icons';
import { Shield } from 'lucide-react';
import PayLoading from './PayLoading';
import { ErrorDisplay } from './Errors';
import PaymentSuccess from './PaymentSuccess';
import PaymentError from './PaymentError';
import PaymentCancel from './PaymentCancel';
import { styles, globalStyles } from './style';
import { usePaymentBilling } from '@/lib/hooks/usePaymentBilling';

const { Title, Text, Paragraph } = Typography;
const { Content } = Layout;

// Types

const getPaymentStatus = (status: string | null): 'success' | 'error' | 'cancel' | null => {
  if (status === 'successs' || status === 'success') return 'success';
  if (status === 'error') return 'error';
  if (status === 'cancel') return 'cancel';
  return null;
};

export default function PaymentStatusDisplay({ orderId }: { orderId: string }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { token } = theme.useToken();
  
  const paymentParam = searchParams.get('payment');
  const paymentStatus = getPaymentStatus(paymentParam);

  // email + actionType được trang /payment truyền sang qua success_url/error_url/cancel_url
  const email = searchParams.get('email') ?? '';
  const actionType = searchParams.get('actionType') ?? '';

  const {
    data: billing,
    isLoading: loading,
    error: billingError,
  } = usePaymentBilling(email, actionType);

  const orderData = billing ?? null;
  const error = billingError
    ? 'Không thể tải thông tin đơn hàng. Vui lòng thử lại.'
    : !loading && !email
      ? 'Không tìm thấy thông tin đơn hàng'
      : null;

  const handleRetryPayment = useCallback(() => {
    router.push('/checkout');
  }, [router, orderId]);

  const handleBackToHome = useCallback(() => {
    router.push('/');
  }, [router]);

  const handleViewOrders = useCallback(() => {
    router.push('/orders');
  }, [router]);

  const handleGoBack = useCallback(() => {
    router.back();
  }, [router]);

  const formatCurrency = useCallback((value: number): string => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
    }).format(value);
  }, []);

  const paymentMethodLabel =
    orderData?.actionType === 'NAPAS_BANK_TRANSFER'
      ? 'Chuyển khoản NAPAS'
      : 'Chuyển khoản ngân hàng';

  const createdAt = useMemo(() => {
    if (!orderData) return '—';
    return new Intl.DateTimeFormat('vi-VN', {
      dateStyle: 'long',
      timeStyle: 'short',
    }).format(new Date());
  }, [orderData]);

  if (loading) {
    return (
      <PayLoading/>
    );
  }

  if (error || !orderData) {
    return (
      <ErrorDisplay/>  
    );
  }

  return (
          <Layout style={styles.fullLayout}>

        <Content style={styles.fullContent}>
          <div style={styles.wrapper}>
            {/* Main Card - No margin, full width */}
            <Card 
              style={styles.fullCard}
              bordered={false}
              bodyStyle={{ padding: 0 }}
            >
                         {/* Status Header */}
              {paymentStatus === 'success' && (
                <PaymentSuccess
                  orderId={orderId}
                  paymentMethod={paymentMethodLabel}
                />
              )}
              {paymentStatus === 'cancel' && (
                <PaymentCancel
                  orderId={orderId}
                  paymentMethod={paymentMethodLabel}
                />
              )}
              {(paymentStatus === 'error' || !paymentStatus) && (
                <PaymentError
                  orderId={orderId}
                  paymentMethod={paymentMethodLabel}
                />
              )}

              {/* Order Summary */}
              <div style={styles.fullSection}>
                <Row gutter={[32, 32]}>
                  <Col xs={24} md={12}>
                    <div style={styles.summaryCard}>
                      <div style={styles.summaryIcon}>
                        <DollarCircleFilled style={{ color: '#8B0000', fontSize: 32 }} />
                      </div>
                      <div>
                        <Text style={{ color: '#8B4513', fontSize: 14, fontWeight: 500 }}>Tổng tiền</Text>
                        <div style={{ fontSize: 32, fontWeight: 'bold', color: '#8B0000', fontFamily: '"Cinzel", serif' }}>
                          {formatCurrency(orderData.amount)}
                        </div>
                      </div>
                    </div>
                  </Col>
                  <Col xs={24} md={12}>
                    <div style={styles.summaryCard}>
                      <div style={styles.summaryIcon}>
                        <CalendarOutlined style={{ color: '#003366', fontSize: 32 }} />
                      </div>
                      <div>
                        <Text style={{ color: '#8B4513', fontSize: 14, fontWeight: 500 }}>Thời điểm tra cứu</Text>
                        <div style={{ fontSize: 20, fontWeight: 'bold', color: '#003366' }}>
                          {createdAt}
                        </div>
                      </div>
                    </div>
                  </Col>
                </Row>
              </div>

              <Divider style={styles.fullDivider} />

              {/* Chi tiết đơn hàng */}
              <div style={styles.fullSection}>
                <Flex justify="space-between" align="center" style={{ marginBottom: '2rem' }}>
                  <Title level={3} style={{
                    margin: 0,
                    color: '#8B4513',
                    fontFamily: '"Cinzel", serif'
                  }}>
                    <ShoppingCartOutlined style={{ marginRight: 12 }} />
                    Chi tiết đơn hàng
                  </Title>
                  <Tag color={orderData.activated ? 'success' : 'warning'} style={{
                    fontSize: 13,
                    borderRadius: 12,
                    padding: '2px 12px'
                  }}>
                    {orderData.activated ? 'Đã kích hoạt' : 'Chưa kích hoạt'}
                  </Tag>
                </Flex>

                <div style={styles.fullOrderItems}>
                  <div style={styles.fullOrderItem}>
                    <div style={styles.fullOrderItemLeft}>
                      <div style={{
                        ...styles.fullItemIcon,
                        backgroundColor: '#FFF0E6',
                        color: '#FF6B00'
                      }}>
                        <Text style={{ color: '#FF6B00', fontWeight: 'bold', fontSize: 20 }}>
                          1
                        </Text>
                      </div>
                      <div>
                        <Text strong style={{ fontSize: 16, color: '#1a1a2e' }}>
                          {orderData.description}
                        </Text>
                        <div style={{ marginTop: 4 }}>
                          <Tag color="gold" style={{
                            fontSize: 12,
                            borderRadius: 12,
                            padding: '2px 12px'
                          }}>
                            {orderData.orderType}
                          </Tag>
                        </div>
                      </div>
                    </div>
                    <Text strong style={{
                      fontSize: 18,
                      color: '#8B0000',
                      fontFamily: '"Cinzel", serif'
                    }}>
                      {orderData.formattedAmount ?? formatCurrency(orderData.amount)}
                    </Text>
                  </div>
                </div>

                {/* Order Totals */}
                <div style={styles.fullTotals}>
                  <Row gutter={[16, 16]}>
                    <Col xs={24} sm={12}>
                      <Flex justify="space-between" style={{ padding: '8px 0' }}>
                        <Text style={{ fontSize: 15, color: '#8B4513' }}>Đơn giá</Text>
                        <Text style={{ fontSize: 15 }}>{(orderData.formattedAmount ?? formatCurrency(orderData.amount))} {orderData.currency}</Text>
                      </Flex>
                      <Flex justify="space-between" style={{ padding: '8px 0' }}>
                        <Text style={{ fontSize: 15, color: '#8B4513' }}>Số lượng</Text>
                        <Text style={{ fontSize: 15 }}>1</Text>
                      </Flex>
                    </Col>
                    <Col xs={24} sm={12}>
                      <div style={styles.totalAmount}>
                        <Text strong style={{ fontSize: 18, color: '#8B4513' }}>Tổng cộng</Text>
                        <Text strong style={{
                          fontSize: 28,
                          color: '#8B0000',
                          fontFamily: '"Cinzel", serif'
                        }}>
                          {formatCurrency(orderData.amount)}
                        </Text>
                      </div>
                    </Col>
                  </Row>
                </div>
              </div>

              {/* Thông tin người chơi */}
              <Divider style={styles.fullDivider} />
              <div style={styles.fullSection}>
                <Title level={4} style={{
                  color: '#8B4513',
                  marginBottom: '1.5rem',
                  fontFamily: '"Cinzel", serif'
                }}>
                  <FileTextOutlined style={{ marginRight: 12 }} />
                  Thông tin người chơi
                </Title>
                <Row gutter={[24, 24]}>
                  <Col xs={24} sm={12}>
                    <div style={styles.infoItem}>
                      <UserOutlined style={{ color: '#D4AF37', fontSize: 18 }} />
                      <div>
                        <Text type="secondary" style={{ fontSize: 13 }}>Tên người chơi</Text>
                        <div><Text strong style={{ fontSize: 16 }}>{orderData.username}</Text></div>
                      </div>
                    </div>
                  </Col>
                  <Col xs={24} sm={12}>
                    <div style={styles.infoItem}>
                      <MailOutlined style={{ color: '#D4AF37', fontSize: 18 }} />
                      <div>
                        <Text type="secondary" style={{ fontSize: 13 }}>Email</Text>
                        <div><Text strong style={{ fontSize: 16 }}>{orderData.email}</Text></div>
                      </div>
                    </div>
                  </Col>
                  <Col xs={24} sm={12}>
                    <div style={styles.infoItem}>
                      <SafetyOutlined style={{ color: '#D4AF37', fontSize: 18 }} />
                      <div>
                        <Text type="secondary" style={{ fontSize: 13 }}>Phương thức thanh toán</Text>
                        <div><Text strong style={{ fontSize: 16 }}>{paymentMethodLabel}</Text></div>
                      </div>
                    </div>
                  </Col>
                  <Col xs={24} sm={12}>
                    <div style={styles.infoItem}>
                      <FileTextOutlined style={{ color: '#D4AF37', fontSize: 18 }} />
                      <div>
                        <Text type="secondary" style={{ fontSize: 13 }}>Loại đơn</Text>
                        <div><Text strong style={{ fontSize: 16 }}>{orderData.orderType}</Text></div>
                      </div>
                    </div>
                  </Col>
                </Row>
              </div>

              <Divider style={styles.fullDivider} />

              {/* Action Buttons */}
              <div style={styles.fullActions}>
                <Flex wrap="wrap" gap="middle" justify="center">
                  {(paymentStatus === 'error' || paymentStatus === 'cancel') && (
                    <Button 
                      type="primary" 
                      size="large"
                      icon={<ReloadOutlined />}
                      onClick={handleRetryPayment}
                      style={{ 
                        backgroundColor: '#8B0000', 
                        borderColor: '#D4AF37',
                        minWidth: 220,
                        height: 56,
                        fontSize: 16,
                        fontFamily: '"Cinzel", serif',
                        boxShadow: '0 4px 20px rgba(139, 0, 0, 0.3)'
                      }}
                    >
                      {paymentStatus === 'error' ? 'Thử lại thanh toán' : 'Tiếp tục thanh toán'}
                    </Button>
                  )}

                  {paymentStatus === 'success' && (
                    <Button 
                      type="primary"
                      size="large"
                      icon={<FileTextOutlined />}
                      onClick={handleViewOrders}
                      style={{ 
                        backgroundColor: '#8B0000', 
                        borderColor: '#D4AF37',
                        minWidth: 220,
                        height: 56,
                        fontSize: 16,
                        fontFamily: '"Cinzel", serif',
                        boxShadow: '0 4px 20px rgba(139, 0, 0, 0.3)'
                      }}
                    >
                      Xem đơn hàng
                    </Button>
                  )}

                  <Button 
                    size="large"
                    icon={<HomeOutlined />}
                    onClick={handleBackToHome}
                    style={{ 
                      border: '2px solid #D4AF37',
                      color: '#8B4513',
                      minWidth: 220,
                      height: 56,
                      fontSize: 16,
                      fontFamily: '"Cinzel", serif',
                      background: 'rgba(255,255,255,0.95)'
                    }}
                  >
                    Về trang chủ
                  </Button>
                </Flex>
              </div>

              {/* Support Information */}
              {paymentStatus !== 'success' && (
                <div style={styles.fullSupport}>
                  <div style={styles.supportContent}>
                    <GiftOutlined style={{ color: '#D4AF37', fontSize: 20, marginRight: 12 }} />
                    <Text style={{ color: '#8B4513', fontSize: 15 }}>
                      Cần hỗ trợ? Vui lòng liên hệ hotline:{' '}
                      <strong style={{ color: '#8B0000', fontSize: 16 }}>1900 1234</strong> 
                      {' '}hoặc email:{' '}
                      <strong style={{ color: '#8B0000', fontSize: 16 }}>support@imperialstore.com</strong>
                    </Text>
                  </div>
                </div>
              )}
            </Card>
          </div>
        </Content>
      </Layout>
  );
}

// Add global styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = globalStyles;
  document.head.appendChild(styleSheet);
}
