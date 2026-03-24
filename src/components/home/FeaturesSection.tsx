"use client";

import { Card, Typography, Row, Col } from "antd";
import { Castle, Sword, Users, Trophy } from "lucide-react";
import { motion } from "framer-motion";

const { Title, Paragraph } = Typography;

const features = [
    {
        icon: Castle,
        title: "Thành Trì Chiến Lược",
        description: "Xây dựng và phòng thủ thành trì với hệ thống công sự kiên cố",
        gradient: "linear-gradient(135deg, #8B0000, #D4AF37)",
    },
    {
        icon: Sword,
        title: "Chiến Thuật Đa Dạng",
        description: "Hơn 50 loại quân với chiến thuật tấn công và phòng thủ đa dạng",
        gradient: "linear-gradient(135deg, #003366, #D4AF37)",
    },
    {
        icon: Users,
        title: "Liên Minh Chiến Lược",
        description: "Kết hợp với các sứ quân khác để tạo thành liên minh hùng mạnh",
        gradient: "linear-gradient(135deg, #8B4513, #D4AF37)",
    },
    {
        icon: Trophy,
        title: "Thành Tích Vinh Quang",
        description: "Hệ thống thành tích và huy hiệu danh giá cho các chiến tướng",
        gradient: "linear-gradient(135deg, #2E8B57, #D4AF37)",
    },
];

export default function FeaturesSection() {
    return (
        <section style={{ padding: "80px 20px", background: "#F5F5DC" }}>
            <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
                <Title
                    level={2}
                    style={{
                        textAlign: "center",
                        color: "#8B0000",
                        marginBottom: "60px",
                        fontSize: "3rem",
                    }}
                >
                    ĐẶC ĐIỂM NỔI BẬT
                </Title>

                <Row gutter={[32, 32]}>
                    {features.map((feature, index) => {
                        const Icon = feature.icon;
                        return (
                            <Col key={index} xs={24} md={12} lg={6}>
                                <motion.div
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6, delay: index * 0.2 }}
                                    whileHover={{ scale: 1.05 }}
                                >
                                    <Card
                                        hoverable
                                        style={{
                                            background: feature.gradient,
                                            border: "none",
                                            borderRadius: "15px",
                                            textAlign: "center",
                                            padding: "30px 20px",
                                            color: "white",
                                        }}
                                    >
                                        <div
                                            style={{
                                                width: "80px",
                                                height: "80px",
                                                background: "rgba(255, 255, 255, 0.2)",
                                                borderRadius: "50%",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                margin: "0 auto 20px",
                                            }}
                                        >
                                            <Icon size={40} color="#FFFFFF" />
                                        </div>
                                        <Title level={4} style={{ color: "white" }}>
                                            {feature.title}
                                        </Title>
                                        <Paragraph style={{ color: "rgba(255,255,255,0.8)" }}>
                                            {feature.description}
                                        </Paragraph>
                                    </Card>
                                </motion.div>
                            </Col>
                        );
                    })}
                </Row>
            </div>
        </section>
    );
}

