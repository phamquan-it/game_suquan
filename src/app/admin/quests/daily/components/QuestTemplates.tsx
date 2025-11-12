'use client';

import React, { useEffect, useState } from 'react';
import {
    Table,
    Tag,
    Space,
    Button,
    Card,
    Typography,
    Tooltip,
    Modal,
    message,
    Dropdown,
    Row,
    Col
} from 'antd';
import {
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    CopyOutlined,
    EyeOutlined,
    MoreOutlined
} from '@ant-design/icons';
import { QuestTemplate } from '@/lib/types/quest.types';
import type { ColumnsType } from 'antd/es/table';

const { Title, Text } = Typography;

interface QuestTemplatesProps {
    templates: QuestTemplate[];
    onTemplatesChange: (templates: QuestTemplate[]) => void;
}

export default function QuestTemplates({ templates, onTemplatesChange }: QuestTemplatesProps) {

    const [selectedTemplate, setSelectedTemplate] = useState<QuestTemplate | null>(null);
    const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);

    const getQuestTypeColor = (type: string) => {
        const colors: Record<string, string> = {
            login: 'blue',
            pvp_battle: 'red',
            pve_battle: 'orange',
            exploration: 'green',
            boss_hunt: 'purple',
            alliance: 'cyan',
            crafting: 'gold'
        };
        return colors[type] || 'default';
    };

    const getQuestTypeText = (type: string) => {
        const texts: Record<string, string> = {
            login: 'Đăng nhập',
            pvp_battle: 'PvP',
            pve_battle: 'PvE',
            exploration: 'Khám phá',
            boss_hunt: 'Boss',
            alliance: 'Liên minh',
            crafting: 'Chế tạo'
        };
        return texts[type] || type;
    };

    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty) {
            case 'easy': return 'green';
            case 'medium': return 'orange';
            case 'hard': return 'red';
            case 'expert': return 'purple';
            default: return 'default';
        }
    };

    const getDifficultyText = (difficulty: string) => {
        switch (difficulty) {
            case 'easy': return 'Dễ';
            case 'medium': return 'Trung bình';
            case 'hard': return 'Khó';
            case 'expert': return 'Chuyên gia';
            default: return difficulty;
        }
    };

    const handleUseTemplate = (template: QuestTemplate) => {
        Modal.confirm({
            title: 'Sử dụng mẫu nhiệm vụ',
            content: `Bạn có muốn tạo nhiệm vụ mới từ mẫu "${template.name}"?`,
            onOk: () => {
                message.success(`Đã tạo nhiệm vụ từ mẫu "${template.name}"`);
                // Logic to create quest from template would go here
            }
        });
    };

    const handleDeleteTemplate = (templateId: string) => {
        Modal.confirm({
            title: 'Xác nhận xóa mẫu',
            content: 'Bạn có chắc chắn muốn xóa mẫu nhiệm vụ này?',
            onOk: () => {
                const updated = templates.filter(template => template.id !== templateId);
                onTemplatesChange(updated);
                message.success('Đã xóa mẫu nhiệm vụ');
            }
        });
    };

    const handleViewDetails = (template: QuestTemplate) => {
        setSelectedTemplate(template);
        setIsDetailModalVisible(true);
    };

    const columns: ColumnsType<QuestTemplate> = [
        {
            title: 'Tên mẫu',
            dataIndex: 'name',
            key: 'name',
            width: 200,
            render: (name: string, record: QuestTemplate) => (
                <Space>
                    <div>
                        <div style={{ fontWeight: 600 }}>{name}</div>
                        <div style={{ fontSize: 12, color: '#666' }}>
                            ID: {record.id}
                        </div>
                    </div>
                </Space>
            ),
        },
        {
            title: 'Loại',
            dataIndex: 'type',
            key: 'type',
            width: 120,
            render: (type: string) => (
                <Tag color={getQuestTypeColor(type)}>
                    {getQuestTypeText(type)}
                </Tag>
            ),
        },
        {
            title: 'Độ khó',
            dataIndex: 'difficulty',
            key: 'difficulty',
            width: 100,
            render: (difficulty: string) => (
                <Tag color={getDifficultyColor(difficulty)}>
                    {getDifficultyText(difficulty)}
                </Tag>
            ),
        },
        {
            title: 'Yêu cầu',
            key: 'requirements',
            width: 150,
            render: (_, record: QuestTemplate) => (
                <Text>
                    {record.requirements.target} {getQuestTypeText(record.type)}
                </Text>
            ),
        },
        {
            title: 'Phần thưởng cơ bản',
            key: 'rewards',
            width: 200,
            render: (_, record: QuestTemplate) => (
                <Space wrap>
                    {record.base_rewards.gold > 0 && (
                        <Tag color="gold">{record.base_rewards.gold} vàng</Tag>
                    )}
                    {record.base_rewards.experience > 0 && (
                        <Tag color="green">{record.base_rewards.experience} EXP</Tag>
                    )}
                    {record.base_rewards.items.slice(0, 1).map((item: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined, index: React.Key | null | undefined) => (
                        <Tag key={index} color="blue">{item}</Tag>
                    ))}
                    {record.base_rewards.items.length > 1 && (
                        <Tag color="cyan">+{record.base_rewards.items.length - 1}</Tag>
                    )}
                </Space>
            ),
        },
        {
            title: 'Hành động',
            key: 'actions',
            width: 150,
            render: (_, record: QuestTemplate) => {
                const actionItems = [
                    {
                        key: 'view',
                        label: 'Xem chi tiết',
                        icon: <EyeOutlined />,
                    },
                    {
                        key: 'use',
                        label: 'Sử dụng mẫu',
                        icon: <CopyOutlined />,
                    },
                    {
                        key: 'edit',
                        label: 'Chỉnh sửa',
                        icon: <EditOutlined />,
                    },
                    {
                        type: 'divider' as const,
                    },
                    {
                        key: 'delete',
                        label: 'Xóa',
                        icon: <DeleteOutlined />,
                        danger: true,
                    },
                ];

                return (
                    <Space>
                        <Button
                            type="primary"
                            size="small"
                            onClick={() => handleUseTemplate(record)}
                        >
                            Sử dụng
                        </Button>

                        <Dropdown
                            menu={{
                                items: actionItems,
                                onClick: ({ key }) => {
                                    switch (key) {
                                        case 'view':
                                            handleViewDetails(record);
                                            break;
                                        case 'use':
                                            handleUseTemplate(record);
                                            break;
                                        case 'delete':
                                            handleDeleteTemplate(record.id);
                                            break;
                                    }
                                },
                            }}
                            placement="bottomRight"
                        >
                            <Button
                                type="text"
                                icon={<MoreOutlined />}
                                size="small"
                            />
                        </Dropdown>
                    </Space>
                );
            },
        },
    ];

    return (
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
            {/* Action Bar */}
            <Card size="small" variant="borderless">
                <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                    <Text strong>
                        Tổng số mẫu: {templates.length}
                    </Text>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        style={{ background: '#8B0000', borderColor: '#8B0000' }}
                    >
                        Tạo Mẫu Mới
                    </Button>
                </Space>
            </Card>

            {/* Templates Table */}
            <Card variant="borderless">
                <Table
                    columns={columns}
                    dataSource={templates}
                    rowKey="id"
                    pagination={{
                        pageSize: 10,
                        showSizeChanger: true,
                        showQuickJumper: true,
                    }}
                    size="middle"
                />
            </Card>

            {/* Template Detail Modal */}
            <Modal
                title={`Chi Tiết Mẫu - ${selectedTemplate?.name}`}
                open={isDetailModalVisible}
                onCancel={() => setIsDetailModalVisible(false)}
                footer={[
                    <Button key="close" onClick={() => setIsDetailModalVisible(false)}>
                        Đóng
                    </Button>,
                    <Button
                        key="use"
                        type="primary"
                        onClick={() => selectedTemplate && handleUseTemplate(selectedTemplate)}
                    >
                        Sử Dụng Mẫu
                    </Button>
                ]}
                width={600}
            >
                {selectedTemplate && (
                    <Space direction="vertical" style={{ width: '100%' }} size="middle">
                        <Row gutter={16}>
                            <Col span={12}>
                                <Text strong>Tên mẫu:</Text>
                                <br />
                                <Text>{selectedTemplate.name}</Text>
                            </Col>
                            <Col span={12}>
                                <Text strong>ID:</Text>
                                <br />
                                <Text type="secondary">{selectedTemplate.id}</Text>
                            </Col>
                        </Row>

                        <Row gutter={16}>
                            <Col span={12}>
                                <Text strong>Mô tả:</Text>
                                <br />
                                <Text>{selectedTemplate.description}</Text>
                            </Col>
                            <Col span={12}>
                                <Text strong>Loại:</Text>
                                <br />
                                <Tag color={getQuestTypeColor(selectedTemplate.type)}>
                                    {getQuestTypeText(selectedTemplate.type)}
                                </Tag>
                            </Col>
                        </Row>

                        <Row gutter={16}>
                            <Col span={12}>
                                <Text strong>Độ khó:</Text>
                                <br />
                                <Tag color={getDifficultyColor(selectedTemplate.difficulty)}>
                                    {getDifficultyText(selectedTemplate.difficulty)}
                                </Tag>
                            </Col>
                            <Col span={12}>
                                <Text strong>Yêu cầu:</Text>
                                <br />
                                <Text>
                                    {selectedTemplate.requirements.target} {getQuestTypeText(selectedTemplate.type)}
                                </Text>
                            </Col>
                        </Row>

                        <div>
                            <Text strong>Phần thưởng cơ bản:</Text>
                            <br />
                            <Space wrap style={{ marginTop: 8 }}>
                                {selectedTemplate.baseRewards.gold > 0 && (
                                    <Tag color="gold">{selectedTemplate.baseRewards.gold.toLocaleString()} vàng</Tag>
                                )}
                                {selectedTemplate.baseRewards.experience > 0 && (
                                    <Tag color="green">{selectedTemplate.baseRewards.experience.toLocaleString()} EXP</Tag>
                                )}
                                {selectedTemplate.baseRewards.items.map((item: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined, index: React.Key | null | undefined) => (
                                    <Tag key={index} color="blue">{item}</Tag>
                                ))}
                            </Space>
                        </div>
                    </Space>
                )}
            </Modal>
        </Space>
    );
}
