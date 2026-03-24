"use client";

import { Layout, Row, Col, Typography, Space, Button, Divider } from "antd";
import { Crown } from "lucide-react";
import { motion } from "framer-motion";
const { Footer } = Layout
const { Title, Paragraph } = Typography;

export default function GameFooter() {
    return (
        <Footer
            style={{
                background: '#003366',
                color: '#D4AF37',
                padding: '40px 20px',
                borderTop: '3px solid #D4AF37',
            }}
        >
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                style={{ maxWidth: '1200px', margin: '0 auto' }}
            >
                <Row gutter={[32, 32]}>
                    <Col xs={24} md={8}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                            <Crown size={24} color="#D4AF37" />
                            <Title level={4} style={{ color: '#D4AF37', margin: 0 }}>12 SỨ QUÂN</Title>
                        </div>
                        <Paragraph style={{ color: 'rgba(212, 175, 55, 0.8)' }}>
                            Game chiến thuật lịch sử Việt Nam - Nơi hội tụ các anh hùng thời loạn
                        </Paragraph>
                    </Col>

                    <Col xs={24} md={8}>
                        <Title level={5} style={{ color: '#D4AF37' }}>Liên Kết</Title>
                        <Space direction="vertical" style={{ width: '100%' }}>
                            <motion.div whileHover={{ x: 5 }} transition={{ type: 'spring', stiffness: 200 }}>
                                <Button type="link" href="/introduction" style={{ color: '#D4AF37', padding: 0 }}>Giới Thiệu</Button>
                            </motion.div>
                            <motion.div whileHover={{ x: 5 }} transition={{ type: 'spring', stiffness: 200 }}>
                                <Button type="link" href="/gameplay" style={{ color: '#D4AF37', padding: 0 }}>Hướng Dẫn</Button>
                            </motion.div>
                            <motion.div whileHover={{ x: 5 }} transition={{ type: 'spring', stiffness: 200 }}>
                                <Button type="link" href="/news" style={{ color: '#D4AF37', padding: 0 }}>Tin Tức</Button>
                            </motion.div>
                        </Space>
                    </Col>

                    <Col xs={24} md={8}>
                        <Title level={5} style={{ color: '#D4AF37' }}>Hỗ Trợ</Title>
                        <Space direction="vertical" style={{ width: '100%' }}>
                            <motion.div whileHover={{ x: 5 }} transition={{ type: 'spring', stiffness: 200 }}>
                                <Button type="link" style={{ color: '#D4AF37', padding: 0 }}>Trung Tâm Hỗ Trợ</Button>
                            </motion.div>
                            <motion.div whileHover={{ x: 5 }} transition={{ type: 'spring', stiffness: 200 }}>
                                <Button type="link" href="/terms" style={{ color: '#D4AF37', padding: 0 }}>Điều Khoản</Button>
                            </motion.div>
                            <motion.div whileHover={{ x: 5 }} transition={{ type: 'spring', stiffness: 200 }}>
                                <Button type="link" href="/policy" style={{ color: '#D4AF37', padding: 0 }}>Chính Sách</Button>
                            </motion.div>
                        </Space>
                    </Col>
                </Row>

                <Divider style={{ borderColor: '#D4AF37' }} />

                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    style={{ textAlign: 'center', color: 'rgba(212, 175, 55, 0.6)' }}
                >
                    © 2025 12 Sứ Quân. Tất cả quyền được bảo lưu.
                </motion.div>
            </motion.div>
        </Footer>
    );
}

