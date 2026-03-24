"use client";

import { Typography, Button, Space } from "antd";
import { Play, Share2 } from "lucide-react";
import { motion } from "framer-motion";

const { Title, Paragraph } = Typography;

export default function CTASection() {
    return (
        <section
            style={{
                padding: '100px 20px',
                background: 'linear-gradient(135deg, #8B0000 0%, #003366 100%)',
                textAlign: 'center'
            }}
        >
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1 }}
            >
                <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                    <Title
                        level={2}
                        style={{ color: '#D4AF37', fontSize: '3rem', marginBottom: '20px' }}
                    >
                        SẴN SÀNG TRỞ THÀNH HÙNG TƯỚNG?
                    </Title>

                    <Paragraph style={{ color: 'white', fontSize: '1.2rem', marginBottom: '40px' }}>
                        Tham gia ngay để viết nên lịch sử của riêng bạn. Chiến đấu, chiến thắng và
                        trở thành người hùng thống nhất đất nước!
                    </Paragraph>

                    <Space size="large">
                        <motion.div
                            whileHover={{ scale: 1.08 }}
                            whileTap={{ scale: 0.95 }}
                            transition={{ type: 'spring', stiffness: 300 }}
                        >
                            <Button
                                size="large"
                                type="primary"
                                style={{
                                    background: 'linear-gradient(135deg, #D4AF37, #FFD700)',
                                    border: 'none',
                                    height: '60px',
                                    padding: '0 40px',
                                    fontSize: '18px',
                                    fontWeight: 'bold',
                                    color: '#8B0000'
                                }}
                                icon={<Play size={20} />}
                            >
                                Chơi Miễn Phí
                            </Button>
                        </motion.div>

                        <motion.div
                            whileHover={{ scale: 1.08 }}
                            whileTap={{ scale: 0.95 }}
                            transition={{ type: 'spring', stiffness: 300 }}
                        >
                            <Button
                                size="large"
                                style={{
                                    background: 'transparent',
                                    border: '2px solid #D4AF37',
                                    height: '60px',
                                    padding: '0 30px',
                                    fontSize: '16px',
                                    fontWeight: 'bold',
                                    color: '#D4AF37'
                                }}
                                icon={<Share2 size={20} />}
                            >
                                Chia Sẻ
                            </Button>
                        </motion.div>
                    </Space>
                </div>
            </motion.div>
        </section>
    );
}

