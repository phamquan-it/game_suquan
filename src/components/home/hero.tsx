"use client";

import { Badge, Card, Typography, Button, Space, Row, Col, Statistic } from "antd";
import { Play, Download, Users, Sword, Star } from "lucide-react";
import { motion } from "framer-motion";
import CountUp from "react-countup";

const { Title, Paragraph } = Typography;

export default function HeroSection() {
  return (
    <section
      style={{
        background:
          'linear-gradient(135deg, rgba(139, 0, 0, 0.9) 0%, rgba(0, 51, 102, 0.9) 100%), url("/api/placeholder/1920/800")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        className="hero-container"
        style={{
          width: "100%",
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "100px 20px 60px",
          textAlign: "center",
          color: "white",
          position: "relative",
          zIndex: 2,
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <Badge.Ribbon
            text="MỚI RA MẮT"
            color="#D4AF37"
            style={{ color: "#8B0000", fontWeight: "bold" }}
          >
            <Card
              style={{
                background: "rgba(255, 255, 255, 0.1)",
                backdropFilter: "blur(20px)",
                border: "2px solid #D4AF37",
                borderRadius: "20px",
                padding: "40px",
              }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, ease: "easeOut" }}
              >
                <Title
                  level={1}
                  style={{
                    color: "#D4AF37",
                    fontSize: "4rem",
                    marginBottom: "20px",
                    textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
                  }}
                >
                  ʬ SỨ QUÂN
                </Title>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 1 }}
              >
                <Paragraph
                  style={{
                    fontSize: "1.5rem",
                    color: "#FFFFFF",
                    marginBottom: "40px",
                    maxWidth: "800px",
                    margin: "0 auto 40px",
                    textShadow: "1px 1px 2px rgba(0,0,0,0.5)",
                  }}
                >
                  Trở thành một trong 12 vị tướng hùng mạnh, chiến đấu giành quyền thống
                  nhất đất nước Việt trong thời kỳ loạn lạc. Sử dụng mưu kế, chiến thuật và
                  sức mạnh để viết nên lịch sử!
                </Paragraph>
              </motion.div>

              <Space
                className="cta-buttons"
                size="large"
                style={{ marginBottom: "40px", flexWrap: "wrap", justifyContent: "center" }}
              >
                <motion.div
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Button
                    size="large"
                    type="primary"
                    href="#download"
                    style={{
                      background: "linear-gradient(135deg, #D4AF37, #FFD700)",
                      border: "none",
                      height: "60px",
                      padding: "0 40px",
                      fontSize: "18px",
                      fontWeight: "bold",
                      color: "#8B0000",
                    }}
                    icon={<Play size={20} />}
                  >
                    Bắt Đầu Chiến Trận
                  </Button>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Button
                    size="large"
                    href="#download"
                    style={{
                      background: "rgba(212, 175, 55, 0.2)",
                      border: "2px solid #D4AF37",
                      height: "60px",
                      padding: "0 30px",
                      fontSize: "16px",
                      fontWeight: "bold",
                      color: "#D4AF37",
                    }}
                    icon={<Download size={20} />}
                  >
                    Tải Game
                  </Button>
                </motion.div>
              </Space>

              <Row gutter={[32, 32]} style={{ marginTop: "60px" }}>
                <Col xs={24} sm={8}>
                  <Statistic
                    title="Người Chơi"
                    valueRender={() => <CountUp end={125000} duration={2} separator="," />}
                    suffix="+"
                    valueStyle={{ color: "#D4AF37", fontSize: "2.5rem" }}
                    prefix={<Users style={{ color: "#D4AF37" }} />}
                  />
                </Col>

                <Col xs={24} sm={8}>
                  <Statistic
                    title="Chiến Trận"
                    valueRender={() => <CountUp end={85000} duration={2} separator="," />}
                    suffix="+"
                    valueStyle={{ color: "#D4AF37", fontSize: "2.5rem" }}
                    prefix={<Sword style={{ color: "#D4AF37" }} />}
                  />
                </Col>

                <Col xs={24} sm={8}>
                  <Statistic
                    title="Đánh Giá"
                    valueRender={() => <CountUp end={4.9} decimals={1} duration={1.5} />}
                    suffix="/5"
                    valueStyle={{ color: "#D4AF37", fontSize: "2.5rem" }}
                    prefix={<Star style={{ color: "#D4AF37" }} />}
                  />
                </Col>
              </Row>
            </Card>
          </Badge.Ribbon>
        </motion.div>

      </div>

      {/* Responsive Styles */}
      <style jsx>{`
        @media (max-width: 768px) {
          .hero-container {
            padding: 60px 15px 40px !important;
          }
          h1 {
            font-size: 2.5rem !important;
          }
          p {
            font-size: 1rem !important;
          }
          .cta-buttons {
            flex-direction: column !important;
            gap: 15px !important;
          }
          .cta-buttons button {
            width: 100% !important;
            max-width: 250px !important;
          }
        }
      `}</style>
    </section>
  );
}

