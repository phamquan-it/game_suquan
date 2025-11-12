"use client"
import { Space, Card, Row, Col, Statistic, Progress, Typography } from "antd"
import { regions } from "./data";
const { Text } = Typography
const AllianceRegions = () => {
    const regionData = [
        { region: 'Bắc Bộ', count: 458, power: 452000000, avgLevel: 24.5 },
        { region: 'Trung Bộ', count: 325, power: 298000000, avgLevel: 22.8 },
        { region: 'Nam Bộ', count: 287, power: 265000000, avgLevel: 21.3 },
        { region: 'Tây Nguyên', count: 188, power: 172000000, avgLevel: 19.7 }
    ];

    return (
        <Space direction="vertical" style={{ width: '100%' }} size="large">
            {regionData.map((data, index) => (
                <Card key={index} style={{ border: '1px solid #D4AF37' }}>
                    <Row gutter={[16, 16]} align="middle">
                        <Col xs={24} md={6}>
                            <Space>
                                <div style={{
                                    width: '20px',
                                    height: '20px',
                                    background: regions.find(r => r.label === data.region)?.color || '#8B0000',
                                    borderRadius: '4px'
                                }} />
                                <Text strong style={{ color: '#8B0000', fontSize: '16px' }}>
                                    {data.region}
                                </Text>
                            </Space>
                        </Col>
                        <Col xs={6} md={4}>
                            <Statistic
                                title="Số Liên Minh"
                                value={data.count}
                                valueStyle={{ color: '#003366' }}
                            />
                        </Col>
                        <Col xs={6} md={5}>
                            <Statistic
                                title="Tổng Sức Mạnh"
                                value={(data.power / 1000000).toFixed(0)}
                                suffix="M"
                                valueStyle={{ color: '#8B0000' }}
                            />
                        </Col>
                        <Col xs={6} md={4}>
                            <Statistic
                                title="Cấp TB"
                                value={data.avgLevel}
                                valueStyle={{ color: '#D4AF37' }}
                            />
                        </Col>
                        <Col xs={6} md={5}>
                            <Progress
                                percent={Math.round((data.count / 1258) * 100)}
                                strokeColor={{
                                    '0%': '#D4AF37',
                                    '100%': '#8B0000',
                                }}
                                format={percent => `${percent}% Tổng số`}
                            />
                        </Col>
                    </Row>
                </Card>
            ))}
        </Space>
    );
};
export default AllianceRegions
