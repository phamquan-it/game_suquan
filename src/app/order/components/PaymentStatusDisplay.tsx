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
  CrownOutlined,
  HomeOutlined,
  ReloadOutlined,
  ArrowLeftOutlined,
  FileTextOutlined,
  DollarCircleFilled,
  CalendarOutlined,
  EnvironmentOutlined,
  UserOutlined,
  PhoneOutlined,
  MailOutlined,
  ShoppingCartOutlined,
  StarOutlined,
  SafetyOutlined,
  GiftOutlined,
  TrophyOutlined,
  ThunderboltOutlined,
} from '@ant-design/icons';
import { Shield } from 'lucide-react';
import PayLoading from './PayLoading';
import { ErrorDisplay } from './Errors';
import PaymentSuccess from './PaymentSuccess';
import PaymentError from './PaymentError';
import PaymentCancel from './PaymentCancel';
import { styles, globalStyles } from './style';
import { OrderData } from '../types';
import { fetchOrderData } from '../data/mock_data';

const { Title, Text, Paragraph } = Typography;
const { Content } = Layout;

// Types

const getPaymentStatus = (status: string | null): 'success' | 'error' | 'cancel' | null => {
  if (status === 'successs' || status === 'success') return 'success';
  if (status === 'error') return 'error';
  if (status === 'cancel') return 'cancel';
  return null;
};

const rarityLabels = {
  common: 'Thường',
  rare: 'Hiếm',
  epic: 'Sử Thi',
  legendary: 'Huyền Thoại'
};

export default function PaymentStatusDisplay({ orderId }: { orderId: string }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { token } = theme.useToken();
  
  const paymentParam = searchParams.get('payment');
  const paymentStatus = getPaymentStatus(paymentParam);
  
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log("orderId "+ orderId)
    const loadOrder = async () => {
      if (!orderId) {
        setLoading(false);
        setError('Không tìm thấy mã đơn hàng');
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const data = await fetchOrderData(orderId);
        setOrderData(data);
      } catch (err) {
        setError('Không thể tải thông tin đơn hàng. Vui lòng thử lại.');
        console.error('Error fetching order:', err);
      } finally {
        setLoading(false);
      }
    };

    loadOrder();
  }, [orderId]);

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

  const getRarityTag = (rarity: string = 'common') => {
    const colors = {
      common: { color: '#8B8B8B', bg: '#F5F5F5' },
      rare: { color: '#1E90FF', bg: '#E6F3FF' },
      epic: { color: '#9B59B6', bg: '#F3E8F7' },
      legendary: { color: '#FF6B00', bg: '#FFF0E6' }
    };
    return colors[rarity as keyof typeof colors] || colors.common;
  };

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
                  orderId={orderData.id}
                  paymentMethod={orderData.paymentMethod}
                />
              )}
              {paymentStatus === 'cancel' && (
                <PaymentCancel
                  orderId={orderData.id}
                  paymentMethod={orderData.paymentMethod}
                />
              )}
              {(paymentStatus === 'error' || !paymentStatus) && (
                <PaymentError
                  orderId={orderData.id}
                  paymentMethod={orderData.paymentMethod}
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
                          {formatCurrency(orderData.total)}
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
                        <Text style={{ color: '#8B4513', fontSize: 14, fontWeight: 500 }}>Ngày đặt hàng</Text>
                        <div style={{ fontSize: 20, fontWeight: 'bold', color: '#003366' }}>
                          {orderData.date}
                        </div>
                      </div>
                    </div>
                  </Col>
                </Row>
              </div>

              <Divider style={styles.fullDivider} />

              {/* Order Items */}
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
                  <Text style={{ fontSize: 16, color: '#8B4513' }}>
                    {orderData.items.length} sản phẩm
                  </Text>
                </Flex>

                <div style={styles.fullOrderItems}>
                  {orderData.items.map((item, index) => {
                    const rarity = getRarityTag(item.rarity || 'common');
                    return (
                      <div 
                        key={item.id}
                        style={{
                          ...styles.fullOrderItem,
                          borderBottom: index < orderData.items.length - 1 
                            ? '2px solid #F1E8D6' 
                            : 'none',
                          backgroundColor: index % 2 === 0 ? 'rgba(245, 245, 220, 0.3)' : 'transparent'
                        }}
                      >
                        <div style={styles.fullOrderItemLeft}>
                          <div style={{
                            ...styles.fullItemIcon,
                            backgroundColor: rarity.bg,
                            color: rarity.color
                          }}>
                            <Text style={{ color: rarity.color, fontWeight: 'bold', fontSize: 20 }}>
                              {item.quantity}
                            </Text>
                          </div>
                          <div>
                            <Text strong style={{ fontSize: 16, color: '#1a1a2e' }}>{item.name}</Text>
                            <div style={{ marginTop: 4 }}>
                              <Tag color={item.rarity || 'default'} style={{ 
                                fontSize: 12, 
                                borderRadius: 12,
                                padding: '2px 12px'
                              }}>
                                {rarityLabels[item.rarity as keyof typeof rarityLabels] || 'Thường'}
                              </Tag>
                              <Text type="secondary" style={{ fontSize: 13, marginLeft: 12 }}>
                                Số lượng: {item.quantity}
                              </Text>
                            </div>
                          </div>
                        </div>
                        <Text strong style={{ 
                          fontSize: 18, 
                          color: '#8B0000',
                          fontFamily: '"Cinzel", serif'
                        }}>
                          {formatCurrency(item.price * item.quantity)}
                        </Text>
                      </div>
                    );
                  })}
                </div>

                {/* Order Totals */}
                <div style={styles.fullTotals}>
                  <Row gutter={[16, 16]}>
                    <Col xs={24} sm={12}>
                      <Flex justify="space-between" style={{ padding: '8px 0' }}>
                        <Text style={{ fontSize: 15, color: '#8B4513' }}>Tạm tính</Text>
                        <Text style={{ fontSize: 15 }}>{formatCurrency(orderData.total)}</Text>
                      </Flex>
                      <Flex justify="space-between" style={{ padding: '8px 0' }}>
                        <Text style={{ fontSize: 15, color: '#8B4513' }}>Phí vận chuyển</Text>
                        <Text style={{ fontSize: 15 }}>{formatCurrency(orderData.shipping?.fee || 0)}</Text>
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
                          {formatCurrency(orderData.total + (orderData.shipping?.fee || 0))}
                        </Text>
                      </div>
                    </Col>
                  </Row>
                </div>
              </div>

              {/* Shipping Information */}
              {orderData.shipping && orderData.customer && (
                <>
                  <Divider style={styles.fullDivider} />
                  <div style={styles.fullSection}>
                    <Title level={4} style={{ 
                      color: '#8B4513', 
                      marginBottom: '1.5rem',
                      fontFamily: '"Cinzel", serif'
                    }}>
                      <FileTextOutlined style={{ marginRight: 12 }} />
                      Thông tin giao hàng
                    </Title>
                    <Row gutter={[24, 24]}>
                      <Col xs={24} sm={12}>
                        <div style={styles.infoItem}>
                          <UserOutlined style={{ color: '#D4AF37', fontSize: 18 }} />
                          <div>
                            <Text type="secondary" style={{ fontSize: 13 }}>Người nhận</Text>
                            <div><Text strong style={{ fontSize: 16 }}>{orderData.customer.name}</Text></div>
                          </div>
                        </div>
                      </Col>
                      <Col xs={24} sm={12}>
                        <div style={styles.infoItem}>
                          <PhoneOutlined style={{ color: '#D4AF37', fontSize: 18 }} />
                          <div>
                            <Text type="secondary" style={{ fontSize: 13 }}>Số điện thoại</Text>
                            <div><Text strong style={{ fontSize: 16 }}>{orderData.customer.phone}</Text></div>
                          </div>
                        </div>
                      </Col>
                      <Col xs={24}>
                        <div style={styles.infoItem}>
                          <MailOutlined style={{ color: '#D4AF37', fontSize: 18 }} />
                          <div>
                            <Text type="secondary" style={{ fontSize: 13 }}>Email</Text>
                            <div><Text strong style={{ fontSize: 16 }}>{orderData.customer.email}</Text></div>
                          </div>
                        </div>
                      </Col>
                      <Col xs={24}>
                        <div style={styles.infoItem}>
                          <EnvironmentOutlined style={{ color: '#D4AF37', fontSize: 18 }} />
                          <div>
                            <Text type="secondary" style={{ fontSize: 13 }}>Địa chỉ giao hàng</Text>
                            <div><Text strong style={{ fontSize: 16 }}>{orderData.shipping.address}</Text></div>
                          </div>
                        </div>
                      </Col>
                    </Row>
                  </div>
                </>
              )}

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
