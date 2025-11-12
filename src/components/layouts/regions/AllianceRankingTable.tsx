import { Space, Progress, Typography, Table, Tag, Avatar, Button } from "antd"
import { Crown, Eye } from "lucide-react";
import { getRegionInfo, getStatusColor, getStatusText } from "./data";
const { Text } = Typography
interface AllianceRankingTableProps {
    filteredAlliances: any,
    handleJoinRequest: any,
    openAllianceDetail: any

}
export const AllianceRankingTable: React.FC<AllianceRankingTableProps> = ({ filteredAlliances, handleJoinRequest, openAllianceDetail }) => {
    const columns = [
        {
            title: 'Hạng',
            dataIndex: 'rank',
            key: 'rank',
            width: 80,
            render: (rank: number) => (
                <Space>
                    {rank <= 3 ? (
                        <Crown style={{
                            color: rank === 1 ? '#FFD700' :
                                rank === 2 ? '#C0C0C0' : '#CD7F32'
                        }} />
                    ) : null}
                    <Text strong>#{rank}</Text>
                </Space>
            )
        },
        {
            title: 'Liên Minh',
            dataIndex: 'name',
            key: 'name',
            render: (name: string, record: Alliance) => (
                <Space>
                    <Avatar
                        size={40}
                        style={{
                            background: 'linear-gradient(135deg, #8B0000, #D4AF37)',
                            border: '2px solid #D4AF37',
                            fontWeight: 'bold',
                            color: 'white'
                        }}
                    >
                        {record.tag}
                    </Avatar>
                    <Space direction="vertical" size={0}>
                        <Text strong style={{ color: '#8B0000' }}>{name}</Text>
                        <Text type="secondary" style={{ fontSize: '12px' }}>
                            [{record.tag}] • {record.leader}
                        </Text>
                        <Space size={4}>
                            <Tag color={getStatusColor(record.status)} style={{ margin: 0, fontSize: '10px' }}>
                                {getStatusText(record.status)}
                            </Tag>
                            <Tag color={getRegionInfo(record.region).color} style={{ margin: 0, fontSize: '10px' }}>
                                {getRegionInfo(record.region).label}
                            </Tag>
                        </Space>
                    </Space>
                </Space>
            )
        },
        {
            title: 'Cấp Độ',
            dataIndex: 'level',
            key: 'level',
            width: 100,
            render: (level: number) => (
                <Tag color="#003366" style={{ margin: 0, fontWeight: 'bold' }}>
                    Lv.{level}
                </Tag>
            )
        },
        {
            title: 'Sức Mạnh',
            dataIndex: 'totalPower',
            key: 'totalPower',
            width: 120,
            render: (power: number) => (
                <Text strong style={{ color: '#8B0000' }}>
                    {(power / 1000000).toFixed(1)}M
                </Text>
            )
        },
        {
            title: 'Thành Viên',
            dataIndex: 'memberCount',
            key: 'memberCount',
            width: 120,
            render: (count: number, record: Alliance) => (
                <Progress
                    percent={(count / record.maxMembers) * 100}
                    size="small"
                    format={() => `${count}/${record.maxMembers}`}
                    strokeColor={{
                        '0%': '#D4AF37',
                        '100%': '#8B0000',
                    }}
                />
            )
        },
        {
            title: 'Lãnh Thổ',
            dataIndex: 'territory',
            key: 'territory',
            width: 100,
            render: (territory: number) => (
                <Text strong style={{ color: '#D4AF37' }}>
                    {territory}
                </Text>
            )
        },
        {
            title: 'TL Thắng',
            dataIndex: 'winRate',
            key: 'winRate',
            width: 100,
            render: (rate: number) => (
                <Progress
                    percent={rate}
                    size="small"
                    format={() => `${rate}%`}
                    strokeColor={{
                        '0%': '#ff4d4f',
                        '50%': '#faad14',
                        '100%': '#52c41a',
                    }}
                />
            )
        },
        {
            title: '',
            key: 'action',
            width: 100,
            render: (record: Alliance) => (
                <Space>
                    <Button
                        type="link"
                        icon={<Eye size={16} />}
                        onClick={() => openAllianceDetail(record)}
                        style={{ color: '#8B0000' }}
                    />
                    {record.status === 'recruiting' && (
                        <Button
                            type="primary"
                            size="small"
                            onClick={() => handleJoinRequest(record)}
                            style={{
                                background: 'linear-gradient(135deg, #D4AF37, #FFD700)',
                                border: 'none',
                                color: '#8B0000',
                                fontWeight: 'bold'
                            }}
                        >
                            Gia Nhập
                        </Button>
                    )}
                </Space>
            )
        }
    ];

    return (
        <Table
            columns={columns}
            dataSource={filteredAlliances}
            pagination={{
                pageSize: 20,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) =>
                    `${range[0]}-${range[1]} của ${total} liên minh`
            }}
            rowKey="id"
            scroll={{ x: 1000 }}
        />
    );
};


