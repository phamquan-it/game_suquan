// components/GeneralFormModal/components/FormSteps/StatisticsStep.tsx
import React from 'react';
import { Form, InputNumber, Row, Col, Divider, Card, Statistic } from 'antd';
import { BarChartOutlined } from '@ant-design/icons';
import { STATS_CONFIG } from '../constants/elements';

interface StatisticsStepProps {
    form: any;
    totalStats: number;
}

export const StatisticsStep: React.FC<StatisticsStepProps> = ({
    form,
    totalStats
}) => {
    return (
        <div style={{ padding: '24px 0' }}>
            <Row gutter={[16, 16]}>
                {STATS_CONFIG.map((stat) => (
                    <Col xs={24} sm={8} key={stat.name}>
                        <Form.Item
                            label={stat.label}
                            name={stat.name}
                            rules={[{ required: true, message: `Please enter ${stat.label.toLowerCase()} value` }]}
                        >
                            <InputNumber
                                min={stat.min}
                                max={stat.max}
                                style={{ width: '100%', borderColor: '#CD7F32' }}
                                size="large"
                                placeholder={String(stat.defaultValue)}
                            />
                        </Form.Item>
                    </Col>
                ))}
            </Row>

            <Divider />

            <Row gutter={16}>
                <Col xs={24} sm={12}>
                    <Card
                        size="small"
                        style={{
                            background: 'linear-gradient(135deg, #F1E8D6 0%, #FFFFFF 100%)',
                            border: '1px solid #D4AF37',
                        }}
                    >
                        <Statistic
                            title="Total Base Stats"
                            value={totalStats}
                            valueStyle={{ color: '#8B0000', fontSize: '24px' }}
                            prefix={<BarChartOutlined />}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={6}>
                    <Form.Item
                        label="Level"
                        name="level"
                        rules={[{ required: true, message: 'Please enter level' }]}
                    >
                        <InputNumber
                            min={1}
                            max={60}
                            style={{ width: '100%', borderColor: '#CD7F32' }}
                            size="large"
                        />
                    </Form.Item>
                </Col>
                <Col xs={24} sm={6}>
                    <Form.Item
                        label="Max Level"
                        name="max_level"
                        rules={[{ required: true, message: 'Please enter max level' }]}
                    >
                        <InputNumber
                            min={1}
                            max={100}
                            style={{ width: '100%', borderColor: '#CD7F32' }}
                            size="large"
                        />
                    </Form.Item>
                </Col>
            </Row>
        </div>
    );
};
