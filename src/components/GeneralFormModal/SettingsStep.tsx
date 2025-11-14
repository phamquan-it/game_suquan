// components/GeneralFormModal/components/FormSteps/SettingsStep.tsx
import React from 'react';
import { Form, Input, Select, Switch, Row, Col, Alert } from 'antd';

const { Option } = Select;

interface SettingsStepProps {
    form: any;
}

export const SettingsStep: React.FC<SettingsStepProps> = ({ form }) => {
    return (
        <div style={{ padding: '24px 0' }}>
            <Alert
                message="Additional Settings"
                description="Configure the general's status and additional information"
                type="info"
                showIcon
                style={{
                    marginBottom: 24,
                    borderColor: '#D4AF37',
                    background: 'linear-gradient(135deg, #F1E8D6 0%, #FFFFFF 100%)',
                }}
            />

            <Row gutter={[16, 16]}>
                <Col xs={24} md={12}>
                    <Form.Item
                        label="Status"
                        name="status"
                        rules={[{ required: true, message: 'Please select status' }]}
                        tooltip="Current operational status of the general"
                    >
                        <Select
                            size="large"
                            style={{ borderColor: '#CD7F32' }}
                            placeholder="Select status"
                        >
                            <Option value="active">
                                <span style={{ color: '#2E8B57' }}>🟢 Active</span> - Ready for battle
                            </Option>
                            <Option value="inactive">
                                <span style={{ color: '#666666' }}>⚫ Inactive</span> - Not available
                            </Option>
                            <Option value="training">
                                <span style={{ color: '#FF8C00' }}>🟡 Training</span> - Improving skills
                            </Option>
                            <Option value="deployed">
                                <span style={{ color: '#DC143C' }}>🔴 Deployed</span> - On mission
                            </Option>
                        </Select>
                    </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                    <Form.Item
                        label="Voice Actor"
                        name="voice_actor"
                        tooltip="Name of the voice actor for this general"
                    >
                        <Input
                            size="large"
                            placeholder="Enter voice actor name..."
                            style={{ borderColor: '#CD7F32' }}
                            allowClear
                        />
                    </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                    <Form.Item
                        label="Location"
                        name="location"
                        tooltip="Current deployment location or home base"
                    >
                        <Input
                            size="large"
                            placeholder="Enter current location..."
                            style={{ borderColor: '#CD7F32' }}
                            allowClear
                        />
                    </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                    <Form.Item
                        label="Favorite General"
                        name="favorite"
                        valuePropName="checked"
                        tooltip="Mark this general as favorite for quick access"
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <Switch
                                checkedChildren="Yes"
                                unCheckedChildren="No"
                                style={{
                                    backgroundColor: '#8B0000',
                                    minWidth: '80px',
                                }}
                            />
                            <span style={{ color: '#8B4513', fontSize: '14px' }}>
                                Mark as favorite
                            </span>
                        </div>
                    </Form.Item>
                </Col>

                <Col xs={24}>
                    <Form.Item
                        label="General Image URL"
                        name="image"
                        tooltip="High-quality image URL for the general's profile"
                        rules={[
                            {
                                type: 'url',
                                message: 'Please enter a valid URL',
                            },
                            {
                                max: 500,
                                message: 'URL must be less than 500 characters',
                            },
                        ]}
                    >
                        <Input
                            size="large"
                            placeholder="https://example.com/general-image.jpg"
                            style={{ borderColor: '#CD7F32' }}
                            allowClear
                        />
                    </Form.Item>
                </Col>

                <Col xs={24}>
                    <Form.Item
                        label="Thumbnail URL"
                        name="thumbnail"
                        tooltip="Smaller image URL for cards and lists"
                        rules={[
                            {
                                type: 'url',
                                message: 'Please enter a valid URL',
                            },
                            {
                                max: 500,
                                message: 'URL must be less than 500 characters',
                            },
                        ]}
                    >
                        <Input
                            size="large"
                            placeholder="https://example.com/thumbnail.jpg"
                            style={{ borderColor: '#CD7F32' }}
                            allowClear
                        />
                    </Form.Item>
                </Col>
            </Row>

            {/* Preview Section */}
            <Alert
                message="Media Preview"
                description="URLs will be used to display the general's images throughout the application"
                type="info"
                showIcon
                style={{
                    marginTop: 24,
                    borderColor: '#CD7F32',
                    background: 'linear-gradient(135deg, #FFFFFF 0%, #F1E8D6 100%)',
                }}
            />
        </div>
    );
};
