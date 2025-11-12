// components/admin/beauty-system/BeautyManagementTable.tsx
'use client';

import React, { useState, useMemo } from 'react';
import {
    Table,
    Tag,
    Button,
    Space,
    Dropdown,
    Input,
    Select,
    Modal,
    Tooltip,
    Progress,
    Badge,
    Avatar,
    Switch,
    Card,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
    FilterOutlined,
    MoreOutlined,
    EyeOutlined,
    EditOutlined,
    RocketOutlined,
    ReadOutlined,
    GiftOutlined,
    StarOutlined,
    TeamOutlined,
    DeleteOutlined,
    ClockCircleOutlined
} from '@ant-design/icons';
import { BeautyCharacter } from '@/types/beauty-system';

const { Search } = Input;
const { Option } = Select;

interface BeautyManagementTableProps {
    data: BeautyCharacter[];
    loading?: boolean;
    onViewDetails: (character: BeautyCharacter) => void;
    onEdit: (character: BeautyCharacter) => void;
    onAssignMission: (character: BeautyCharacter) => void;
    onTrain: (character: BeautyCharacter) => void;
    onToggleStatus: (characterId: string, status: BeautyCharacter['status']) => void;
    onDelete: (characterId: string) => void;
}

const BeautyManagementTable: React.FC<BeautyManagementTableProps> = ({
    data,
    loading = false,
    onViewDetails,
    onEdit,
    onAssignMission,
    onTrain,
    onToggleStatus,
    onDelete
}) => {
    const [searchText, setSearchText] = useState('');
    const [rarityFilter, setRarityFilter] = useState<string>('all');
    const [statusFilter, setStatusFilter] = useState<string>('all');

    // Filter data
    const filteredData = useMemo(() => {
        return data.filter(character => {
            const matchesSearch = character.name.toLowerCase().includes(searchText.toLowerCase()) ||
                character.title.toLowerCase().includes(searchText.toLowerCase());
            const matchesRarity = rarityFilter === 'all' || character.rarity === rarityFilter;
            const matchesStatus = statusFilter === 'all' || character.status === statusFilter;

            return matchesSearch && matchesRarity && matchesStatus;
        });
    }, [data, searchText, rarityFilter, statusFilter]);

    const getRarityColor = (rarity: string) => {
        const colors: { [key: string]: string } = {
            common: '#8C8C8C',
            rare: '#1890FF',
            epic: '#722ED1',
            legendary: '#FAAD14'
        };
        return colors[rarity] || '#8C8C8C';
    };

    const getRarityText = (rarity: string) => {
        const texts: { [key: string]: string } = {
            common: 'Thường',
            rare: 'Hiếm',
            epic: 'Siêu Cấp',
            legendary: 'Huyền Thoại'
        };
        return texts[rarity] || rarity;
    };

    const getStatusColor = (status: string) => {
        const colors: { [key: string]: string } = {
            available: 'green',
            mission: 'blue',
            training: 'orange',
            resting: 'purple'
        };
        return colors[status] || 'default';
    };

    const getStatusText = (status: string) => {
        const texts: { [key: string]: string } = {
            available: 'Sẵn Sàng',
            mission: 'Nhiệm Vụ',
            training: 'Huấn Luyện',
            resting: 'Nghỉ Ngơi'
        };
        return texts[status] || status;
    };

    const handleStatusToggle = (character: BeautyCharacter) => {
        const newStatus = character.status === 'resting' ? 'available' : 'resting';
        onToggleStatus(character.id, newStatus);
    };

    const handleDelete = (character: BeautyCharacter) => {
        Modal.confirm({
            title: 'Xác Nhận Xóa',
            content: `Bạn có chắc muốn xóa ${character.name}? Hành động này không thể hoàn tác.`,
            okText: 'Xóa',
            cancelText: 'Hủy',
            okType: 'danger',
            onOk: () => onDelete(character.id)
        });
    };

    const columns: ColumnsType<BeautyCharacter> = [
        {
            title: 'Hồng Nhan',
            dataIndex: 'name',
            key: 'name',
            fixed: 'left',
            width: 200,
            render: (name: string, record) => (
                <div className="flex items-center space-x-3">
                    <Avatar
                        src={record.avatar}
                        size="large"
                        className="border-2 border-yellow-400"
                    />
                    <div className="flex flex-col">
                        <span className="font-semibold text-gray-900">{name}</span>
                        <span className="text-xs text-gray-500">{record.title}</span>
                        <div className="flex items-center space-x-1 mt-1">
                            <Tag color={getRarityColor(record.rarity)} >
                                {getRarityText(record.rarity)}
                            </Tag>
                            <Tag color={getStatusColor(record.status)} >
                                {getStatusText(record.status)}
                            </Tag>
                        </div>
                    </div>
                </div>
            ),
            sorter: (a, b) => a.name.localeCompare(b.name)
        },
        {
            title: 'Cấp Độ',
            dataIndex: 'level',
            key: 'level',
            width: 120,
            render: (level: number, record) => (
                <div className="text-center">
                    <div className="flex items-center justify-center space-x-2">
                        <span className="font-bold text-lg text-red-600">Lv.{level}</span>
                        <StarOutlined className="text-yellow-500" />
                    </div>
                    <Progress
                        percent={Math.round((record.experience / (record.level * 1000)) * 100)}
                        size="small"
                        showInfo={false}
                        strokeColor="#D4AF37"
                        className="mt-1"
                    />
                    <div className="text-xs text-gray-500 mt-1">
                        EXP: {record.experience.toLocaleString()}
                    </div>
                </div>
            ),
            sorter: (a, b) => a.level - b.level
        },
        {
            title: 'Thuộc Tính Chính',
            key: 'attributes',
            width: 180,
            render: (_, record) => (
                <div className="space-y-1">
                    <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-600">Duyên:</span>
                        <Progress
                            percent={record.charm}
                            size="small"
                            showInfo={false}
                            strokeColor="#FF6B6B"
                            style={{ width: 80 }}
                        />
                        <span className="text-xs font-semibold w-6 text-right">{record.charm}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-600">Trí:</span>
                        <Progress
                            percent={record.intelligence}
                            size="small"
                            showInfo={false}
                            strokeColor="#4D96FF"
                            style={{ width: 80 }}
                        />
                        <span className="text-xs font-semibold w-6 text-right">{record.intelligence}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-600">Giao:</span>
                        <Progress
                            percent={record.diplomacy}
                            size="small"
                            showInfo={false}
                            strokeColor="#6BCF77"
                            style={{ width: 80 }}
                        />
                        <span className="text-xs font-semibold w-6 text-right">{record.diplomacy}</span>
                    </div>
                </div>
            )
        },
        {
            title: 'Kỹ Năng',
            key: 'skills',
            width: 200,
            render: (_, record) => (
                <div className="space-y-1">
                    {record.skills.slice(0, 2).map(skill => (
                        <Tooltip key={skill.id} title={skill.description}>
                            <div className="flex items-center justify-between p-1 bg-gray-50 rounded text-xs">
                                <span className="font-medium truncate flex-1">{skill.name}</span>
                                <Tag color="blue" >Lv.{skill.level}</Tag>
                            </div>
                        </Tooltip>
                    ))}
                    {record.skills.length > 2 && (
                        <div className="text-xs text-gray-500 text-center">
                            +{record.skills.length - 2} kỹ năng khác
                        </div>
                    )}
                </div>
            )
        },
        {
            title: 'Trang Bị',
            key: 'equipment',
            width: 150,
            render: (_, record) => (
                <div className="space-y-1">
                    <div className="flex items-center space-x-1">
                        <Tag color="purple" >
                            Áo: {record.costumes.filter(c => c.equipped).length}
                        </Tag>
                        <Tag color="cyan">
                            Trang sức: {record.jewelry.filter(j => j.equipped).length}
                        </Tag>
                    </div>
                    {record.costumes.filter(c => c.equipped).map(costume => (
                        <div key={costume.id} className="text-xs text-gray-600 truncate">
                            👗 {costume.name}
                        </div>
                    ))}
                </div>
            )
        },
        {
            title: 'Hiệu Suất',
            key: 'performance',
            width: 140,
            render: (_, record) => (
                <div className="text-center">
                    <Progress
                        type="circle"
                        percent={record.missionSuccessRate}
                        size={60}
                        strokeColor={
                            record.missionSuccessRate >= 90 ? '#52C41A' :
                                record.missionSuccessRate >= 80 ? '#FAAD14' : '#FF4D4F'
                        }
                        format={percent => (
                            <div className="text-xs font-semibold">
                                {percent}%
                            </div>
                        )}
                    />
                    <div className="text-xs text-gray-500 mt-1">Thành công</div>
                </div>
            ),
            sorter: (a, b) => a.missionSuccessRate - b.missionSuccessRate
        },
        {
            title: 'Trạng Thái',
            key: 'status',
            width: 150,
            render: (_, record) => (
                <div className="space-y-2">
                    <div className="flex flex-col space-y-1">
                        <Tag
                            color={getStatusColor(record.status)}
                            className="w-full text-center"
                        >
                            {getStatusText(record.status)}
                        </Tag>
                        {record.currentMission && (
                            <Badge
                                count="Đang nhiệm vụ"
                                size="small"
                                style={{ backgroundColor: '#1890FF' }}
                                className="w-full text-center"
                            />
                        )}
                        {record.trainingEndTime && (
                            <div className="flex items-center space-x-1 text-xs text-orange-600">
                                <ClockCircleOutlined />
                                <span>Đang huấn luyện</span>
                            </div>
                        )}
                    </div>

                    <Switch
                        checked={record.status !== 'resting'}
                        onChange={() => handleStatusToggle(record)}
                        size="small"
                        checkedChildren="Hoạt động"
                        unCheckedChildren="Nghỉ"
                    />
                </div>
            )
        },
        {
            title: 'Thao Tác',
            key: 'actions',
            fixed: 'right',
            width: 120,
            render: (_, record) => {
                const menuItems = [
                    {
                        key: 'view',
                        label: 'Xem Chi Tiết',
                        icon: <EyeOutlined />,
                        onClick: () => onViewDetails(record)
                    },
                    {
                        key: 'edit',
                        label: 'Chỉnh Sửa',
                        icon: <EditOutlined />,
                        onClick: () => onEdit(record)
                    },
                    {
                        key: 'mission',
                        label: 'Giao Nhiệm Vụ',
                        icon: <RocketOutlined />,
                        disabled: record.status !== 'available',
                        onClick: () => onAssignMission(record)
                    },
                    {
                        key: 'train',
                        label: 'Huấn Luyện',
                        icon: <ReadOutlined />,
                        disabled: record.status !== 'available',
                        onClick: () => onTrain(record)
                    },
                    {
                        type: 'divider' as const,
                    },
                    {
                        key: 'delete',
                        label: 'Xóa',
                        icon: <DeleteOutlined />,
                        danger: true,
                        onClick: () => handleDelete(record)
                    }
                ].filter(item => !item.disabled);

                return (
                    <Space size="small">
                        <Tooltip title="Giao nhiệm vụ">
                            <Button
                                type="primary"
                                size="small"
                                icon={<RocketOutlined />}
                                disabled={record.status !== 'available'}
                                onClick={() => onAssignMission(record)}
                            />
                        </Tooltip>

                        <Dropdown
                            menu={{ items: menuItems }}
                            placement="bottomRight"
                            trigger={['click']}
                        >
                            <Button
                                size="small"
                                icon={<MoreOutlined />}
                            />
                        </Dropdown>
                    </Space>
                );
            }
        }
    ];

    return (
        <Card
            title={
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900">Quản Lý Hồng Nhan</h3>
                        <div className="text-sm text-gray-500 mt-1">
                            Tổng số: <span className="font-semibold text-red-600">{filteredData.length}</span> Hồng Nhan
                            {searchText && ` - Kết quả tìm kiếm: "${searchText}"`}
                        </div>
                    </div>

                    <Space size="middle" wrap className="w-full lg:w-auto">
                        {/* Search */}
                        <Search
                            placeholder="Tìm kiếm Hồng Nhan..."
                            allowClear
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            style={{ width: 250 }}
                            size="middle"
                        />

                        {/* Filters */}
                        <Select
                            value={rarityFilter}
                            onChange={setRarityFilter}
                            style={{ width: 130 }}
                            placeholder="Độ hiếm"
                            suffixIcon={<FilterOutlined />}
                            size="middle"
                        >
                            <Option value="all">Tất cả độ hiếm</Option>
                            <Option value="common">Thường</Option>
                            <Option value="rare">Hiếm</Option>
                            <Option value="epic">Siêu Cấp</Option>
                            <Option value="legendary">Huyền Thoại</Option>
                        </Select>

                        <Select
                            value={statusFilter}
                            onChange={setStatusFilter}
                            style={{ width: 140 }}
                            placeholder="Trạng thái"
                            suffixIcon={<FilterOutlined />}
                            size="middle"
                        >
                            <Option value="all">Tất cả trạng thái</Option>
                            <Option value="available">Sẵn Sàng</Option>
                            <Option value="mission">Nhiệm Vụ</Option>
                            <Option value="training">Huấn Luyện</Option>
                            <Option value="resting">Nghỉ Ngơi</Option>
                        </Select>
                    </Space>
                </div>
            }
            extra={
                <Space>
                    <Button
                        type="primary"
                        icon={<GiftOutlined />}
                        className="bg-red-600 hover:bg-red-700 border-red-600"
                    >
                        Triệu Hồi Mới
                    </Button>
                    <Button
                        icon={<TeamOutlined />}
                        className="border-yellow-600 text-yellow-600 hover:border-yellow-700"
                    >
                        Xuất Excel
                    </Button>
                </Space>
            }
            className="beauty-management-table shadow-sm"
        >
            <Table
                columns={columns}
                dataSource={filteredData}
                loading={loading}
                rowKey="id"
                scroll={{ x: 1500 }}
                pagination={{
                    total: filteredData.length,
                    pageSize: 10,
                    showSizeChanger: true,
                    showQuickJumper: true,
                    showTotal: (total, range) =>
                        `${range[0]}-${range[1]} của ${total} Hồng Nhan`,
                    pageSizeOptions: ['10', '20', '50', '100'],
                    size: 'default'
                }}
                rowClassName={(record) =>
                    record.status === 'resting' ? 'bg-gray-50 opacity-75' : ''
                }
                size="middle"
            />
        </Card>
    );
};

export default BeautyManagementTable;
