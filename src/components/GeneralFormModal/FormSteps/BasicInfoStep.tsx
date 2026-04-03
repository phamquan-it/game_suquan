// components/GeneralFormModal/components/FormSteps/BasicInfoStep.tsx
import React from 'react';
import { Form, Input, Select, Row, Col, Tag } from 'antd';
import { CrownOutlined, FireOutlined } from '@ant-design/icons';
import { ELEMENT_CONFIG, RARITY_CONFIG, TYPE_CONFIG } from '../constants/elements';

const { TextArea } = Input;
const { Option } = Select;

interface BasicInfoStepProps {
    form: any;
}

export const BasicInfoStep: React.FC<BasicInfoStepProps> = ({ form }) => {
    return (
        <div style={{ padding: '24px 0' }}>
            <Row gutter={[16, 16]}>
                <Col xs={24} md={12}>
                    <Form.Item
                        label="General Name"
                        name="name"
                        rules={[{ required: true, message: 'Please enter general name' }]}
                    >
                        <Input
                            size="large"
                            placeholder="Enter general name..."
                            style={{ borderColor: '#CD7F32' }}
                        />
                    </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                    <Form.Item label="Title" name="title">
                        <Input
                            size="large"
                            placeholder="Enter title (optional)..."
                            style={{ borderColor: '#CD7F32' }}
                        />
                    </Form.Item>
                </Col>

                <Col xs={24} md={8}>
                    <Form.Item
                        label="Rarity"
                        name="rarity"
                        rules={[{ required: true, message: 'Please select rarity' }]}
                    >
                        <Select
                            size="large"
                            style={{ borderColor: '#CD7F32' }}
                            suffixIcon={<CrownOutlined style={{ color: '#D4AF37' }} />}
                        >
                            {Object.entries(RARITY_CONFIG).map(([key, config]) => (
                                <Option key={key} value={key}>
                                    <Tag color={config.color}>{config.label}</Tag>
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Col>

                <Col xs={24} md={8}>
                    <Form.Item
                        label="Element"
                        name="element"
                        rules={[{ required: true, message: 'Please select element' }]}
                    >
                        <Select
                            size="large"
                            style={{ borderColor: '#CD7F32' }}
                            suffixIcon={<FireOutlined style={{ color: '#DC143C' }} />}
                        >
                            {Object.entries(ELEMENT_CONFIG).map(([key, config]) => (
                                <Option key={key} value={key}>
                                    <span style={{ color: config.color }}>
                                        {config.icon} {config.label}
                                    </span>
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Col>

                <Col xs={24} md={8}>
                    <Form.Item
                        label="Type"
                        name="type"
                        rules={[{ required: true, message: 'Please select type' }]}
                    >
                        <Select
                            size="large"
                            style={{ borderColor: '#CD7F32' }}
                        >
                            {Object.entries(TYPE_CONFIG).map(([key, config]) => (
                                <Option key={key} value={key}>
                                    {config.icon} {config.label}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Col>

                <Col xs={24}>
                    <Form.Item label="Biography" name="biography">
                        <TextArea
                            rows={3}
                            placeholder="Enter general's background story..."
                            style={{ borderColor: '#CD7F32' }}
                        />
                    </Form.Item>
                </Col>
            </Row>
        </div>
    );
};
