"use client";

import { Card, Typography, Row, Col, Avatar, Tag, Progress } from "antd";
import { Crown } from "lucide-react";
import { motion } from "framer-motion";

const { Title, Text } = Typography;
const charactersData = [
  { name: 'Ngô Xương Xí', power: 88, intelligence: 82, territory: 'Bình Kiều' },
  { name: 'Đỗ Cảnh Thạc', power: 90, intelligence: 85, territory: 'Đỗ Động' },
  { name: 'Kiều Công Hãn', power: 86, intelligence: 88, territory: 'Phong Châu' },
  { name: 'Nguyễn Khoan', power: 85, intelligence: 80, territory: 'Tam Đái' },
  { name: 'Ngô Nhật Khánh', power: 87, intelligence: 78, territory: 'Đường Lâm' }, // Đường Lâm (Sơn Tây)
  { name: 'Lý Khuê', power: 84, intelligence: 86, territory: 'Siêu Loại' },
  { name: 'Phạm Bạch Hổ', power: 89, intelligence: 81, territory: 'Đằng Châu' },
  { name: 'Kiều Thuận', power: 83, intelligence: 84, territory: 'Hồi Hồ' },
  { name: 'Trần Lãm', power: 86, intelligence: 83, territory: 'Bố Hải Khẩu' },
  { name: 'Nguyễn Siêu', power: 82, intelligence: 88, territory: 'Tây Phù Liệt' },
  { name: 'Nguyễn Thủ Tiệp', power: 81, intelligence: 85, territory: 'Tiên Du' },
  { name: 'Đinh Bộ Lĩnh', power: 98, intelligence: 95, territory: 'Hoa Lư' }, // Người dẹp loạn 12 sứ quân
];

export default function CharactersSection() {
    return (
        <section style={{ padding: '80px 20px', background: 'linear-gradient(135deg, #003366, #8B0000)' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <Title
                    level={2}
                    style={{
                        textAlign: 'center',
                        color: '#D4AF37',
                        marginBottom: '60px',
                        fontSize: '3rem'
                    }}
                >
                    12 SỨ QUÂN HÙNG MẠNH
                </Title>

                <Row gutter={[32, 32]}>
                    {charactersData.map((character, index) => (
                        <Col key={index} xs={24} md={12} lg={6}>
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                whileHover={{ scale: 1.05 }}
                            >
                                <Card
                                    hoverable
                                    cover={
                                        <div style={{
                                            height: '200px',
                                            background: `linear-gradient(135deg, #8B0000, #D4AF37)`,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            position: 'relative'
                                        }}>
                                            <Avatar
                                                size={100}
                                                style={{
                                                    background: 'rgba(255,255,255,0.2)',
                                                    border: '3px solid #D4AF37'
                                                }}
                                                icon={<Crown size={40} />}
                                            />
                                        </div>
                                    }
                                    style={{
                                        border: '2px solid #D4AF37',
                                        borderRadius: '15px',
                                        background: 'rgba(255, 255, 255, 0.1)',
                                        backdropFilter: 'blur(10px)'
                                    }}
                                >
                                    <Card.Meta
                                        title={<Text style={{ color: '#D4AF37', fontSize: '18px', fontWeight: 'bold' }}>{character.name}</Text>}
                                        description={
                                            <div>
                                                <div style={{ marginBottom: '10px' }}>
                                                    <Text strong>Lãnh thổ: </Text>
                                                    <Tag color="gold" style={{ color: '#8B0000' }}>{character.territory}</Tag>
                                                </div>
                                                <div style={{ marginBottom: '5px' }}>
                                                    <Text strong>Sức mạnh: </Text>
                                                    <Progress percent={character.power} size="small" strokeColor="#D4AF37" />
                                                </div>
                                                <div>
                                                    <Text strong>Trí tuệ: </Text>
                                                    <Progress percent={character.intelligence} size="small" strokeColor="#52c41a" />
                                                </div>
                                            </div>
                                        }
                                    />
                                </Card>
                            </motion.div>
                        </Col>
                    ))}
                </Row>
            </div>
        </section>
    );
}

