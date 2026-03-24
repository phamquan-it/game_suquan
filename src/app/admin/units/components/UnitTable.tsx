// app/admin/units/components/UnitTable.tsx
'use client';

import React from 'react';
import { Table, Tag, Space, Button, Tooltip, Badge, Image } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
    EditOutlined,
    DeleteOutlined,
    EyeOutlined,
    StarOutlined,
    CrownOutlined,
    ThunderboltOutlined
} from '@ant-design/icons';
import theme from '@/theme/themeConfig';
import { UnitWithSkills } from '../types';

interface UnitTableProps {
    data: UnitWithSkills[];
    loading: boolean;
    onEdit: (unit: UnitWithSkills) => void;
    onView: (unit: UnitWithSkills) => void;
    onDelete: (id: string) => void;
    onManageSkills: (unit: UnitWithSkills) => void;
}

const UnitTable: React.FC<UnitTableProps> = ({
    data,
    loading,
    onEdit,
    onView,
    onDelete,
    onManageSkills,
}) => {
    const getUnitTypeColor = (type: string) => {
        const colors: Record<string, string> = {
            infantry: '#8B4513',
            cavalry: '#D4AF37',
            archer: '#2E8B57',
            siege: '#8B0000',
            mythical: '#800080',
            legendary: '#FF8C00',
        };
        return colors[type] || theme.token?.colorPrimary;
    };

    const getRankBadge = (rank: string) => {
        switch (rank) {
            case 'legendary':
                return <CrownOutlined style={{ color: '#D4AF37' }} />;
            case 'mythic':
                return <ThunderboltOutlined style={{ color: '#800080' }} />;
            case 'champion':
                return <StarOutlined style={{ color: '#FF8C00' }} />;
            default:
                return null;
        }
    };

    const columns: ColumnsType<UnitWithSkills> = [
        {
            title: 'Unit',
            key: 'unit',
            width: 250,
            render: (_, record) => (
                <Space size="middle">
                    {record.imagePath ? (
                        <Image
                            src={record.imagePath}
                            alt={record.name}
                            width={50}
                            height={50}
                            style={{
                                borderRadius: 8,
                                border: `2px solid ${theme.token?.colorBorder}`
                            }}
                            preview={false}
                        />
                    ) : (
                        <div style={{
                            width: 50,
                            height: 50,
                            background: '#F1E8D6',
                            borderRadius: 8,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: `2px solid ${theme.token?.colorBorder}`
                        }}>
                            <EyeOutlined />
                        </div>
                    )}
                    <Space direction="vertical" size={0}>
                        <span style={{ fontWeight: 'bold' }}>{record.name}</span>
                        <Tag color={getUnitTypeColor(record.type)} style={{ margin: 0 }}>
                            {record.type.toUpperCase()}
                        </Tag>
                    </Space>
                </Space>
            ),
        },
        {
            title: 'Stats',
            key: 'stats',
            render: (_, record) => (
                <Space direction="vertical" size={2}>
                    <Space size="middle">
                        <Badge
                            status="success"
                            text={`HP: ${record.currentHp}/${record.maxHp}`}
                        />
                        <Badge
                            status="processing"
                            text={`ATK: ${record.atk}`}
                        />
                    </Space>
                    <Space size="middle">
                        <Badge
                            status="warning"
                            text={`DEF: ${record.def}`}
                        />
                        <Badge
                            status="default"
                            text={`SPD: ${record.speed}`}
                        />
                    </Space>
                </Space>
            ),
        },
        {
            title: 'Level & Rank',
            key: 'levelRank',
            render: (_, record) => (
                <Space>
                    <Tag color="#003366">Lv.{record.level}</Tag>
                    <Tag color={getUnitTypeColor(record.rank)}>
                        {getRankBadge(record.rank)} {record.rank}
                    </Tag>
                    {record.isVip && (
                        <Tag color="#D4AF37" icon={<CrownOutlined />}>VIP</Tag>
                    )}
                    {record.isSpecial && (
                        <Tag color="#8B0000" icon={<StarOutlined />}>SPECIAL</Tag>
                    )}
                </Space>
            ),
        },
        {
            title: 'Skills',
            key: 'skills',
            render: (_, record) => (
                <Space direction="vertical" size={2}>
                    {record.skills?.slice(0, 2).map((skill) => (
                        <Tag key={skill.id} color="processing">
                            {skill.name}
                        </Tag>
                    ))}
                    {record.skills && record.skills.length > 2 && (
                        <Tag>+{record.skills.length - 2} more</Tag>
                    )}
                </Space>
            ),
        },
        {
            title: 'Actions',
            key: 'actions',
            fixed: 'right',
            width: 200,
            render: (_, record) => (
                <Space size="small">
                    <Tooltip title="View Details">
                        <Button
                            icon={<EyeOutlined />}
                            size="small"
                            onClick={() => onView(record)}
                        />
                    </Tooltip>
                    <Tooltip title="Edit Unit">
                        <Button
                            icon={<EditOutlined />}
                            size="small"
                            type="primary"
                            onClick={() => onEdit(record)}
                        />
                    </Tooltip>
                    <Tooltip title="Manage Skills">
                        <Button
                            icon={<ThunderboltOutlined />}
                            size="small"
                            style={{ background: '#2E8B57', color: 'white' }}
                            onClick={() => onManageSkills(record)}
                        />
                    </Tooltip>
                    <Tooltip title="Delete Unit">
                        <Button
                            icon={<DeleteOutlined />}
                            size="small"
                            danger
                            onClick={() => onDelete(record.id)}
                        />
                    </Tooltip>
                </Space>
            ),
        },
    ];

    return (
        <Table
            columns={columns}
            dataSource={data}
            loading={loading}
            rowKey="id"
            scroll={{ x: 1200 }}
            pagination={{
                total: data.length,
                pageSize: 20,
                showSizeChanger: true,
                showTotal: (total) => `Total ${total} units`,
            }}
            style={{
                background: 'white',
                borderRadius: theme.token?.borderRadius,
            }}
        />
    );
};

export default UnitTable;
