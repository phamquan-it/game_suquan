'use client';

import React, { useState } from 'react';
import {
    Table,
    Tag,
    Space,
    Button,
    Card,
    Typography,
    Progress,
    Tooltip,
    Modal,
    message,
    Switch,
    Dropdown,
    Row,
    Col
} from 'antd';
import {
    EditOutlined,
    DeleteOutlined,
    EyeOutlined,
    MoreOutlined,
    CopyOutlined,
} from '@ant-design/icons';
import { DailyQuest } from '@/lib/types/quest.types';
import type { ColumnsType } from 'antd/es/table';

const { Title, Text } = Typography;

interface DailyQuestManagerProps {
    quests: DailyQuest[];
    onQuestsChange: (quests: DailyQuest[]) => void;
    loading: boolean;
}

export default function DailyQuestManager({
    quests,
    onQuestsChange,
    loading
}: DailyQuestManagerProps) {
    const [selectedQuest, setSelectedQuest] = useState<DailyQuest | null>(null);
    const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);

    const getQuestTypeColor = (type: DailyQuest['type']) => {
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

    const getQuestTypeText = (type: DailyQuest['type']) => {
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

    const getDifficultyColor = (difficulty: DailyQuest['difficulty']) => {
        switch (difficulty) {
            case 'easy': return 'green';
            case 'medium': return 'orange';
            case 'hard': return 'red';
            case 'expert': return 'purple';
            default: return 'default';
        }
    };

    const getDifficultyText = (difficulty: DailyQuest['difficulty']) => {
        switch (difficulty) {
            case 'easy': return 'Dễ';
            case 'medium': return 'Trung bình';
            case 'hard': return 'Khó';
            case 'expert': return 'Chuyên gia';
            default: return difficulty;
        }
    };

    const getStatusColor = (status: DailyQuest['status']) => {
        return status === 'active' ? 'green' : 'red';
    };

    const handleStatusToggle = (questId: string, active: boolean) => {
        const updated = quests.map(quest =>
            quest.id === questId ? { ...quest, status: active ? 'active' : 'inactive' } : quest
        );
//        onQuestsChange(updated);
        message.success(
            active ? 'Đã kích hoạt nhiệm vụ' : 'Đã tạm dừng nhiệm vụ'
        );
    };

    const handleDelete = (questId: string) => {
        Modal.confirm({
            title: 'Xác nhận xóa nhiệm vụ',
            content: 'Bạn có chắc chắn muốn xóa nhiệm vụ này? Hành động này không thể hoàn tác.',
            onOk: () => {
                const updated = quests.filter(quest => quest.id !== questId);
                onQuestsChange(updated);
                message.success('Đã xóa nhiệm vụ');
            }
        });
    };

    const handleDuplicate = (quest: DailyQuest) => {
        const newQuest: DailyQuest = {
            ...quest,
            id: `quest-${Date.now()}`,
            name: `${quest.name} (Bản sao)`,
            currentCompletions: 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        onQuestsChange([...quests, newQuest]);
        message.success('Đã sao chép nhiệm vụ');
    };

    const handleViewDetails = (quest: DailyQuest) => {
        setSelectedQuest(quest);
        setIsDetailModalVisible(true);
    };

    const columns: ColumnsType<DailyQuest> = [
        {
            title: 'Tên nhiệm vụ',
            dataIndex: 'name',
            key: 'name',
            width: 200,
            render: (name: string, record: DailyQuest) => (
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
            filters: [
                { text: 'Đăng nhập', value: 'login' },
                { text: 'PvP', value: 'pvp_battle' },
                { text: 'PvE', value: 'pve_battle' },
                { text: 'Khám phá', value: 'exploration' },
            ],
            onFilter: (value, record) => record.type === value,
            render: (type: DailyQuest['type']) => (
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
            sorter: (a, b) => a.difficulty.localeCompare(b.difficulty),
            render: (difficulty: DailyQuest['difficulty']) => (
                <Tag color={getDifficultyColor(difficulty)}>
                    {getDifficultyText(difficulty)}
                </Tag>
            ),
        },
        {
            title: 'Yêu cầu',
            key: 'requirements',
            width: 150,
            render: (_, record: DailyQuest) => (
                <Text>
                    {record.requirements.target} {getQuestTypeText(record.type)}
                </Text>
            ),
        },
        {
            title: 'Tiến độ',
            key: 'progress',
            width: 150,
            render: (_, record: DailyQuest) => (
                <div>
                    <Progress
                        percent={Math.round((record.currentCompletions / record.maxCompletions) * 100)}
                        size="small"
                        showInfo={false}
                    />
                    <Text style={{ fontSize: 12 }}>
                        {record.current_completions.toLocaleString()}/{record.max_completions.toLocaleString()}
                    </Text>
                </div>
            ),
        },
        {
            title: 'Thời gian',
            key: 'schedule',
            width: 120,
            render: (_, record: DailyQuest) => (
                <Text style={{ fontSize: 12 }}>
                    {record.schedule.startTime} - {record.schedule.endTime}
                </Text>
            ),
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            width: 100,
            filters: [
                { text: 'Đang hoạt động', value: 'active' },
                { text: 'Tạm dừng', value: 'inactive' },
            ],
            onFilter: (value, record) => record.status === value,
            render: (status: DailyQuest['status'], record: DailyQuest) => (
                <Space>
                    <Switch
                        size="small"
                        checked={status === 'active'}
                        onChange={(checked) => handleStatusToggle(record.id, checked)}
                    />
                    <Tag color={getStatusColor(status)}>
                        {status === 'active' ? 'Hoạt động' : 'Tạm dừng'}
                    </Tag>
                </Space>
            ),
        },
        {
            title: 'Hành động',
            key: 'actions',
            width: 120,
            render: (_, record: DailyQuest) => {
                const actionItems = [
                    {
                        key: 'view',
                        label: 'Xem chi tiết',
                        icon: <EyeOutlined />,
                    },
                    {
                        key: 'edit',
                        label: 'Chỉnh sửa',
                        icon: <EditOutlined />,
                    },
                    {
                        key: 'duplicate',
                        label: 'Sao chép',
                        icon: <CopyOutlined />,
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
                        <Tooltip title="Xem chi tiết">
                            <Button
                                type="text"
                                icon={<EyeOutlined />}
                                size="small"
                                onClick={() => handleViewDetails(record)}
                            />
                        </Tooltip>

                        <Dropdown
                            menu={{
                                items: actionItems,
                                onClick: ({ key }) => {
                                    switch (key) {
                                        case 'view':
                                            handleViewDetails(record);
                                            break;
                                        case 'duplicate':
                                            handleDuplicate(record);
                                            break;
                                        case 'delete':
                                            handleDelete(record.id);
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

    const activeQuests = quests.filter(q => q.status === 'active');
    const totalCompletions = quests.reduce((sum, q) => sum + q.currentCompletions, 0);

    return (
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
            {/* Summary Stats */}
            <Row gutter={[16, 16]}>
                <Col xs={24} sm={8}>
                    <Card size="small">
                        <div style={{ textAlign: 'center' }}>
                            <Title level={3} style={{ margin: 0, color: '#8B0000' }}>
                                {quests.length}
                            </Title>
                            <Text type="secondary">Tổng nhiệm vụ</Text>
                        </div>
                    </Card>
                </Col>
                <Col xs={24} sm={8}>
                    <Card size="small">
                        <div style={{ textAlign: 'center' }}>
                            <Title level={3} style={{ margin: 0, color: '#2E8B57' }}>
                                {activeQuests.length}
                            </Title>
                            <Text type="secondary">Đang hoạt động</Text>
                        </div>
                    </Card>
                </Col>
                <Col xs={24} sm={8}>
                    <Card size="small">
                        <div style={{ textAlign: 'center' }}>
                            <Title level={3} style={{ margin: 0, color: '#D4AF37' }}>
                                {totalCompletions.toLocaleString()}
                            </Title>
                            <Text type="secondary">Lượt hoàn thành</Text>
                        </div>
                    </Card>
                </Col>
            </Row>

            {/* Quests Table */}
            <Card variant="borderless">
                <Table
                    columns={columns}
                    dataSource={quests}
                    rowKey="id"
                    loading={loading}
                    scroll={{ x: 1000 }}
                    pagination={{
                        pageSize: 10,
                        showSizeChanger: true,
                        showQuickJumper: true,
                        showTotal: (total, range) =>
                            `${range[0]}-${range[1]} của ${total} nhiệm vụ`,
                    }}
                    size="middle"
                />
            </Card>

            {/* Quest Detail Modal */}
            <Modal
                title={`Chi Tiết Nhiệm Vụ - ${selectedQuest?.name}`}
                open={isDetailModalVisible}
                onCancel={() => setIsDetailModalVisible(false)}
                footer={[
                    <Button key="close" onClick={() => setIsDetailModalVisible(false)}>
                        Đóng
                    </Button>
                ]}
                width={700}
            >
                {selectedQuest && (
                    <Space direction="vertical" style={{ width: '100%' }} size="middle">
                        <Row gutter={16}>
                            <Col span={12}>
                                <Text strong>Tên nhiệm vụ:</Text>
                                <br />
                                <Text>{selectedQuest.name}</Text>
                            </Col>
                            <Col span={12}>
                                <Text strong>ID:</Text>
                                <br />
                                <Text type="secondary">{selectedQuest.id}</Text>
                            </Col>
                        </Row>

                        <Row gutter={16}>
                            <Col span={12}>
                                <Text strong>Mô tả:</Text>
                                <br />
                                <Text>{selectedQuest.description}</Text>
                            </Col>
                            <Col span={12}>
                                <Text strong>Loại:</Text>
                                <br />
                                <Tag color={getQuestTypeColor(selectedQuest.type)}>
                                    {getQuestTypeText(selectedQuest.type)}
                                </Tag>
                            </Col>
                        </Row>

                        <Row gutter={16}>
                            <Col span={12}>
                                <Text strong>Độ khó:</Text>
                                <br />
                                <Tag color={getDifficultyColor(selectedQuest.difficulty)}>
                                    {getDifficultyText(selectedQuest.difficulty)}
                                </Tag>
                            </Col>
                            <Col span={12}>
                                <Text strong>Trạng thái:</Text>
                                <br />
                                <Tag color={getStatusColor(selectedQuest.status)}>
                                    {selectedQuest.status === 'active' ? 'Hoạt động' : 'Tạm dừng'}
                                </Tag>
                            </Col>
                        </Row>

                        <Row gutter={16}>
                            <Col span={12}>
                                <Text strong>Yêu cầu:</Text>
                                <br />
                                <Text>
                                    {selectedQuest.requirements.target} {getQuestTypeText(selectedQuest.type)}
                                    {selectedQuest.requirements.bossLevel && (
                                        <Text type="secondary"> (Boss cấp {selectedQuest.requirements.bossLevel}+)</Text>
                                    )}
                                </Text>
                            </Col>
                            <Col span={12}>
                                <Text strong>Giới hạn hoàn thành:</Text>
                                <br />
                                <Text>{selectedQuest.completionLimit} lần/ngày</Text>
                            </Col>
                        </Row>

                        <Row gutter={16}>
                            <Col span={12}>
                                <Text strong>Thời gian hoạt động:</Text>
                                <br />
                                <Text>{selectedQuest.schedule.startTime} - {selectedQuest.schedule.endTime}</Text>
                            </Col>
                            <Col span={12}>
                                <Text strong>Reset hàng ngày:</Text>
                                <br />
                                <Text>{selectedQuest.schedule.resetDaily ? 'Có' : 'Không'}</Text>
                            </Col>
                        </Row>

                        <div>
                            <Text strong>Tiến độ hoàn thành:</Text>
                            <br />
                            <Progress
                                percent={Math.round((selectedQuest.currentCompletions / selectedQuest.maxCompletions) * 100)}
                                style={{ margin: '8px 0' }}
                            />
                            <Text>
                                {selectedQuest.currentCompletions.toLocaleString()} / {selectedQuest.maxCompletions.toLocaleString()} lượt
                            </Text>
                        </div>

                        <div>
                            <Text strong>Phần thưởng:</Text>
                            <br />
                            <Space wrap style={{ marginTop: 8 }}>
                                {selectedQuest.rewards.gold > 0 && (
                                    <Tag color="gold">{selectedQuest.rewards.gold.toLocaleString()} vàng</Tag>
                                )}
                                {selectedQuest.rewards.experience > 0 && (
                                    <Tag color="green">{selectedQuest.rewards.experience.toLocaleString()} EXP</Tag>
                                )}
                                {(selectedQuest.rewards.diamonds ??0) > 0 && (
                                    <Tag color="cyan">{selectedQuest.rewards.diamonds} kim cương</Tag>
                                )}
                                {selectedQuest.rewards.items.map((item, index) => (
                                    <Tag key={index} color="blue">{item}</Tag>
                                ))}
                            </Space>
                        </div>

                        <Row gutter={16}>
                            <Col span={12}>
                                <Text strong>Ngày tạo:</Text>
                                <br />
                                <Text>{new Date(selectedQuest.createdAt).toLocaleString('vi-VN')}</Text>
                            </Col>
                            <Col span={12}>
                                <Text strong>Cập nhật cuối:</Text>
                                <br />
                                <Text>{new Date(selectedQuest.updatedAt).toLocaleString('vi-VN')}</Text>
                            </Col>
                        </Row>
                    </Space>
                )}
            </Modal>
        </Space>
    );
}
