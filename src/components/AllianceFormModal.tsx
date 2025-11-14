// components/AllianceFormModal.tsx
import React, { useState } from 'react';
import {
    Modal,
    Form,
    Input,
    InputNumber,
    Switch,
    Button,
    Row,
    Col,
    Card,
    Space,
    Typography,
    Divider,
    Alert,
    Statistic,
    Tag,
} from 'antd';
import {
    PlusOutlined,
    TeamOutlined,
    CrownOutlined,
    TrophyOutlined,
    SafetyCertificateOutlined,
    UserOutlined,
} from '@ant-design/icons';
import type { CreateAllianceData, AllianceRequirements } from '@/types/alliance';
import { useAllianceMutation } from '@/lib/hooks/admin/useAllianceMutation';

const { Title, Text } = Typography;
const { TextArea } = Input;

interface AllianceFormModalProps {
    open?: boolean;
    onClose?: () => void;
    onSuccess?: () => void;
    trigger?: React.ReactNode;
}

export const AllianceFormModal: React.FC<AllianceFormModalProps> = ({
    open: externalOpen,
    onClose: externalOnClose,
    onSuccess,
    trigger,
}) => {
    const [internalOpen, setInternalOpen] = useState(false);
    const [form] = Form.useForm();
    const [requirements, setRequirements] = useState<AllianceRequirements>({
        minLevel: 1,
        minPower: 0,
        approvalRequired: false,
    });

    // Use external control if provided, otherwise use internal state
    const isControlled = externalOpen !== undefined;
    const open = isControlled ? externalOpen : internalOpen;

    const { createAlliance } = useAllianceMutation(() => {
        handleClose();
        onSuccess?.();
    });

    const handleOpen = () => {
        if (!isControlled) {
            setInternalOpen(true);
        }
    };

    const handleClose = () => {
        if (!isControlled) {
            setInternalOpen(false);
        }
        form.resetFields();
        setRequirements({
            minLevel: 1,
            minPower: 0,
            approvalRequired: false,
        });
        externalOnClose?.();
    };

    const onFinish = (values: any) => {
        const createData: CreateAllianceData = {
            name: values.name,
            tag: values.tag,
            description: values.description,
            max_members: values.max_members,
            requirements: requirements,
            leader: 'admin'
        };

        createAlliance.mutate(createData);
    };

    const calculateTotalCapacity = (maxMembers: number) => {
        if (maxMembers <= 30) return { label: 'Small', color: 'green' };
        if (maxMembers <= 60) return { label: 'Medium', color: 'blue' };
        if (maxMembers <= 100) return { label: 'Large', color: 'orange' };
        return { label: 'Elite', color: 'red' };
    };

    const capacityInfo = calculateTotalCapacity(form.getFieldValue('max_members') || 50);

    // Default trigger button if none provided
    const defaultTrigger = (
        <Button
            type="primary"
            icon={<PlusOutlined />}
            size="large"
            onClick={handleOpen}
            style={{
                backgroundColor: '#8B0000',
                borderColor: '#8B0000',
                fontWeight: 600,
            }}
        >
            Create Alliance
        </Button>
    );

    return (
        <>
            {/* Trigger Button */}
            <Button type="primary" onClick={handleOpen}>Create</Button>

            <Modal
                title={
                    <Space>
                        <TeamOutlined style={{ color: '#8B0000' }} />
                        <span>Create New Alliance</span>
                    </Space>
                }
                open={open}
                onCancel={handleClose}
                footer={null}
                width={800}
                style={{ top: 20 }}
                styles={{
                    body: {
                        padding: '0 24px',
                        background: 'linear-gradient(135deg, #F5F5DC 0%, #FFFFFF 100%)',
                    },
                    header: {
                        borderBottom: `2px solid #D4AF37`,
                        background: 'linear-gradient(135deg, #8B0000 0%, #A52A2A 100%)',
                    },
                    content: {
                        border: `2px solid #D4AF37`,
                        borderRadius: '12px',
                        overflow: 'hidden',
                    },
                }}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    initialValues={{
                        max_members: 50,
                    }}
                >
                    <Alert
                        message="Alliance Creation"
                        description="Form a new alliance to conquer territories and battle together with other players"
                        type="info"
                        showIcon
                        style={{
                            marginBottom: 24,
                            borderColor: '#D4AF37',
                            background: 'linear-gradient(135deg, #F1E8D6 0%, #FFFFFF 100%)',
                        }}
                    />

                    <Row gutter={[24, 16]}>
                        {/* Basic Information */}
                        <Col xs={24} lg={12}>
                            <Card
                                title={
                                    <Space>
                                        <CrownOutlined style={{ color: '#D4AF37' }} />
                                        <span>Basic Information</span>
                                    </Space>
                                }
                                size="small"
                                style={{
                                    border: '1px solid #D4AF37',
                                    background: 'linear-gradient(135deg, #FFFFFF 0%, #F8F4E9 100%)',
                                    height: '100%',
                                }}
                            >
                                <Form.Item
                                    label="Alliance Name"
                                    name="name"
                                    rules={[
                                        { required: true, message: 'Please enter alliance name' },
                                        { min: 3, message: 'Name must be at least 3 characters' },
                                        { max: 100, message: 'Name must be less than 100 characters' },
                                    ]}
                                >
                                    <Input
                                        size="large"
                                        placeholder="Enter alliance name..."
                                        style={{ borderColor: '#CD7F32' }}
                                        prefix={<TeamOutlined style={{ color: '#8B4513' }} />}
                                    />
                                </Form.Item>

                                <Form.Item
                                    label="Alliance Tag"
                                    name="tag"
                                    rules={[
                                        { required: true, message: 'Please enter alliance tag' },
                                        { min: 2, message: 'Tag must be at least 2 characters' },
                                        { max: 10, message: 'Tag must be less than 10 characters' },
                                        {
                                            pattern: /^[A-Z0-9]+$/,
                                            message: 'Tag can only contain uppercase letters and numbers',
                                        },
                                    ]}
                                    tooltip="Short identifier for your alliance (uppercase letters and numbers only)"
                                >
                                    <Input
                                        size="large"
                                        placeholder="e.g., LEGEND"
                                        style={{ borderColor: '#CD7F32', textTransform: 'uppercase' }}
                                        maxLength={10}
                                    />
                                </Form.Item>

                                <Form.Item
                                    label="Description"
                                    name="description"
                                    rules={[
                                        { max: 500, message: 'Description must be less than 500 characters' },
                                    ]}
                                >
                                    <TextArea
                                        rows={3}
                                        placeholder="Describe your alliance's goals and culture..."
                                        style={{ borderColor: '#CD7F32' }}
                                        showCount
                                        maxLength={500}
                                    />
                                </Form.Item>
                            </Card>
                        </Col>

                        {/* Capacity & Requirements */}
                        <Col xs={24} lg={12}>
                            <Card
                                title={
                                    <Space>
                                        <UserOutlined style={{ color: '#D4AF37' }} />
                                        <span>Capacity & Requirements</span>
                                    </Space>
                                }
                                size="small"
                                style={{
                                    border: '1px solid #D4AF37',
                                    background: 'linear-gradient(135deg, #FFFFFF 0%, #F8F4E9 100%)',
                                    height: '100%',
                                }}
                            >
                                <Form.Item
                                    label="Maximum Members"
                                    name="max_members"
                                    rules={[{ required: true, message: 'Please set maximum members' }]}
                                    tooltip="Maximum number of players allowed in the alliance"
                                >
                                    <InputNumber
                                        min={10}
                                        max={100}
                                        style={{ width: '100%', borderColor: '#CD7F32' }}
                                        size="large"
                                    />
                                </Form.Item>

                                <div style={{ marginBottom: 16 }}>
                                    <Text strong style={{ color: '#8B4513' }}>
                                        Alliance Size:{' '}
                                        <Tag color={capacityInfo.color}>
                                            {capacityInfo.label}
                                        </Tag>
                                    </Text>
                                </div>

                                <Divider style={{ borderColor: '#CD7F32', margin: '16px 0' }} />

                                <Title level={5} style={{ color: '#8B4513', marginBottom: 16 }}>
                                    <SafetyCertificateOutlined /> Membership Requirements
                                </Title>

                                <Form.Item
                                    label="Minimum Level"
                                    name="minLevel"
                                    rules={[{ required: true, message: 'Please set minimum level' }]}
                                >
                                    <InputNumber
                                        min={1}
                                        max={60}
                                        value={requirements.minLevel}
                                        style={{ width: '100%', borderColor: '#CD7F32' }}
                                        size="large"
                                        onChange={(value) => setRequirements(prev => ({ ...prev, minLevel: value || 1 }))}
                                    />
                                </Form.Item>

                                <Form.Item
                                    label="Minimum Power"
                                    name="minPower"
                                    rules={[{ required: true, message: 'Please set minimum power' }]}
                                >
                                    <InputNumber
                                        min={0}
                                        max={100000}
                                        value={requirements.minPower}
                                        style={{ width: '100%', borderColor: '#CD7F32' }}
                                        size="large"
                                        formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                        parser={(value) => value?.replace(/\$\s?|(,*)/g, '') as any}
                                        onChange={(value) => setRequirements(prev => ({ ...prev, minPower: value || 0 }))}
                                    />
                                </Form.Item>

                                <Form.Item
                                    label="Approval Required"
                                    name="approvalRequired"
                                    valuePropName="checked"
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                        <Switch
                                            checked={requirements.approvalRequired}
                                            checkedChildren="Yes"
                                            unCheckedChildren="No"
                                            style={{
                                                backgroundColor: '#8B0000',
                                            }}
                                            onChange={(checked) => setRequirements(prev => ({ ...prev, approvalRequired: checked }))}
                                        />
                                        <Text type="secondary">
                                            Require approval for new members
                                        </Text>
                                    </div>
                                </Form.Item>
                            </Card>
                        </Col>
                    </Row>

                    {/* Summary Stats */}
                    <Card
                        style={{
                            marginTop: 16,
                            border: '1px solid #D4AF37',
                            background: 'linear-gradient(135deg, #F1E8D6 0%, #FFFFFF 100%)',
                        }}
                    >
                        <Row gutter={16}>
                            <Col xs={12} sm={6}>
                                <Statistic
                                    title="Starting Level"
                                    value={1}
                                    prefix={<TrophyOutlined style={{ color: '#D4AF37' }} />}
                                    valueStyle={{ color: '#8B0000' }}
                                />
                            </Col>
                            <Col xs={12} sm={6}>
                                <Statistic
                                    title="Initial Members"
                                    value={1}
                                    prefix={<UserOutlined style={{ color: '#8B0000' }} />}
                                    valueStyle={{ color: '#8B0000' }}
                                />
                            </Col>
                            <Col xs={12} sm={6}>
                                <Statistic
                                    title="Starting Territory"
                                    value={0}
                                    suffix="zones"
                                    valueStyle={{ color: '#8B0000' }}
                                />
                            </Col>
                            <Col xs={12} sm={6}>
                                <Statistic
                                    title="Victory Points"
                                    value={0}
                                    prefix={<TrophyOutlined style={{ color: '#D4AF37' }} />}
                                    valueStyle={{ color: '#8B0000' }}
                                />
                            </Col>
                        </Row>
                    </Card>

                    <Divider />

                    <Row justify="end">
                        <Space>
                            <Button
                                size="large"
                                onClick={handleClose}
                                style={{
                                    borderColor: '#CD7F32',
                                    color: '#8B4513',
                                }}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="primary"
                                size="large"
                                htmlType="submit"
                                loading={createAlliance.isPending}
                                icon={<PlusOutlined />}
                                style={{
                                    backgroundColor: '#2E8B57',
                                    borderColor: '#2E8B57',
                                    fontWeight: 600,
                                }}
                            >
                                Create Alliance
                            </Button>
                        </Space>
                    </Row>
                </Form>
            </Modal>
        </>
    );
};

export default AllianceFormModal;
