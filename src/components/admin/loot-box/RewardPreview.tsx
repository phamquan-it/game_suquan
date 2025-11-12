// components/admin/loot-box/RewardPreview.tsx
import React, { useState } from 'react';
import {
    Modal,
    Row,
    Col,
    Card,
    Tag,
    Progress,
    Tabs,
    Space,
    Tooltip,
    Statistic,
    Divider
} from 'antd';
import {
    StarOutlined,
    PercentageOutlined,
    GoldOutlined,
    TrophyOutlined,
    GiftOutlined
} from '@ant-design/icons';
import { LootBox, RewardPool, RewardItem } from '@/lib/types/loot-box';

interface RewardPreviewProps {
    lootBox: LootBox;
    visible: boolean;
    onClose: () => void;
}

export const RewardPreview: React.FC<RewardPreviewProps> = ({
    lootBox,
    visible,
    onClose
}) => {
    const [activeTab, setActiveTab] = useState('all');

    // Tính tổng weight để tính phần trăm
    const calculateDropRate = (item: RewardItem, pool: RewardPool): number => {
        const totalWeight = pool.rewards.reduce((sum, reward) => sum + reward.weight, 0);
        return (item.weight / totalWeight) * 100;
    };

    // Tính tổng weight toàn bộ reward table
    const calculateOverallDropRate = (item: RewardItem): number => {
        let totalGlobalWeight = 0;
        let itemGlobalWeight = 0;

        lootBox.rewardTable.pools.forEach(pool => {
            const poolTotalWeight = pool.rewards.reduce((sum, reward) => sum + reward.weight, 0);
            totalGlobalWeight += poolTotalWeight * pool.weight;

            const itemInPool = pool.rewards.find(reward => reward.id === item.id);
            if (itemInPool) {
                itemGlobalWeight += itemInPool.weight * pool.weight;
            }
        });

        return (itemGlobalWeight / totalGlobalWeight) * 100;
    };

    const renderRewardItem = (item: RewardItem, pool: RewardPool) => {
        const dropRate = calculateDropRate(item, pool);
        const overallDropRate = calculateOverallDropRate(item);

        return (
            <Card
                key={item.id}
                size="small"
                style={{
                    marginBottom: 8,
                    border: `2px solid ${getRarityColor(item.rarity)}`,
                    background: getRarityGradient(item.rarity)
                }}
            >
                <Row gutter={8} align="middle">
                    <Col span={4}>
                        <img
                            src={getItemIcon(item)}
                            alt={getItemName(item)}
                            style={{
                                width: 48,
                                height: 48,
                                borderRadius: 4,
                                border: `1px solid ${getRarityColor(item.rarity)}`
                            }}
                        />
                    </Col>
                    <Col span={12}>
                        <div style={{ fontWeight: 600, color: getRarityColor(item.rarity) }}>
                            {getItemName(item)}
                        </div>
                        <div style={{ fontSize: 12, color: '#666' }}>
                            {getItemDescription(item)}
                        </div>
                        <div>
                            <Tag color={getRarityColor(item.rarity)}>
                                {getRarityLabel(item.rarity)}
                            </Tag>
                            {item.bound !== 'none' && (
                                <Tag color="orange">
                                    {item.bound === 'account' ? 'Liên kết TK' : 'Liên kết NV'}
                                </Tag>
                            )}
                        </div>
                    </Col>
                    <Col span={8}>
                        <Space direction="vertical" size={2} style={{ width: '100%' }}>
                            <Statistic
                                title="Tỷ lệ rơi"
                                value={overallDropRate}
                                precision={2}
                                suffix="%"
                                valueStyle={{ fontSize: 14 }}
                            />
                            <Progress
                                percent={parseFloat(overallDropRate.toFixed(2))}
                                size="small"
                                showInfo={false}
                                strokeColor={getRarityColor(item.rarity)}
                            />
                            <div style={{ fontSize: 12, color: '#666' }}>
                                Trong nhóm: {dropRate.toFixed(2)}%
                            </div>
                        </Space>
                    </Col>
                </Row>
            </Card>
        );
    };

    const renderPoolSection = (pool: RewardPool) => (
        <div key={pool.id} style={{ marginBottom: 24 }}>
            <div style={{
                padding: '8px 16px',
                background: '#f0f2f5',
                borderRadius: 6,
                marginBottom: 12,
                fontWeight: 500
            }}>
                {pool.name}
                <Tag style={{ marginLeft: 8 }}>Tỷ trọng: {pool.weight}</Tag>
                <Tag color="blue">
                    Số vật phẩm: {pool.minDrops}-{pool.maxDrops}
                </Tag>
                {pool.guaranteed && (
                    <Tag color="green">Đảm bảo</Tag>
                )}
            </div>
            <div>
                {pool.rewards.map(item => renderRewardItem(item, pool))}
            </div>
        </div>
    );

    const tabItems = [
        {
            key: 'all',
            label: 'Tất cả vật phẩm',
            children: (
                <div>
                    {lootBox.rewardTable.pools.map(renderPoolSection)}
                </div>
            )
        },
        ...lootBox.rewardTable.pools.map(pool => ({
            key: pool.id,
            label: pool.name,
            children: renderPoolSection(pool)
        })),
        {
            key: 'guaranteed',
            label: 'Phần thưởng đảm bảo',
            children: (
                <div>
                    {lootBox.guaranteedDrops.map((guaranteed, index) => (
                        <Card key={index} style={{ marginBottom: 16 }}>
                            <div style={{ fontWeight: 500, marginBottom: 12 }}>
                                Mở {guaranteed.openCount} lần -
                                {guaranteed.resetAfterClaim ? ' (Reset sau nhận)' : ' (Một lần)'}
                            </div>
                            <Row gutter={[16, 16]}>
                                {guaranteed.rewards.map((reward, rewardIndex) => (
                                    <Col span={8} key={rewardIndex}>
                                        <Card size="small">
                                            <Space>
                                                <img
                                                    src={getItemIcon(reward)}
                                                    alt={getItemName(reward)}
                                                    style={{ width: 32, height: 32 }}
                                                />
                                                <div>
                                                    <div style={{ fontWeight: 500 }}>
                                                        {getItemName(reward)}
                                                    </div>
                                                    <Tag color="red">ĐẢM BẢO</Tag>
                                                </div>
                                            </Space>
                                        </Card>
                                    </Col>
                                ))}
                            </Row>
                        </Card>
                    ))}
                </div>
            )
        },
        {
            key: 'stats',
            label: 'Thống kê',
            children: (
                <Row gutter={[16, 16]}>
                    <Col span={8}>
                        <Statistic
                            title="Tổng vật phẩm"
                            value={lootBox.rewardTable.pools.reduce(
                                (sum, pool) => sum + pool.rewards.length, 0
                            )}
                            prefix={<GiftOutlined />}
                        />
                    </Col>
                    <Col span={8}>
                        <Statistic
                            title="Số nhóm phần thưởng"
                            value={lootBox.rewardTable.pools.length}
                            prefix={<TrophyOutlined />}
                        />
                    </Col>
                    <Col span={8}>
                        <Statistic
                            title="Vật phẩm hiếm nhất"
                            value={getRarestItemRarity(lootBox)}
                            valueStyle={{ color: getRarityColor(getRarestItemRarity(lootBox)) }}
                        />
                    </Col>
                </Row>
            )
        }
    ];

    return (
        <Modal
            title={
                <Space>
                    <img
                        src={lootBox.icon}
                        alt={lootBox.name}
                        style={{ width: 32, height: 32 }}
                    />
                    <span>Vật phẩm có thể nhận - {lootBox.name}</span>
                </Space>
            }
            open={visible}
            onCancel={onClose}
            footer={null}
            width={1200}
            style={{ top: 20 }}
        >
            <Tabs
                activeKey={activeTab}
                onChange={setActiveTab}
                items={tabItems}
            />
        </Modal>
    );
};

// Helper functions
const getRarityColor = (rarity: string): string => {
    const colors: Record<string, string> = {
        common: '#8C8C8C',
        uncommon: '#1E8E3E',
        rare: '#1890FF',
        epic: '#722ED1',
        legendary: '#FA8C16',
        mythic: '#FA541C',
        ancient: '#CF1322'
    };
    return colors[rarity] || '#8C8C8C';
};

const getRarityGradient = (rarity: string): string => {
    const gradients: Record<string, string> = {
        common: 'linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 100%)',
        uncommon: 'linear-gradient(135deg, #f6ffed 0%, #d9f7be 100%)',
        rare: 'linear-gradient(135deg, #e6f7ff 0%, #bae7ff 100%)',
        epic: 'linear-gradient(135deg, #f9f0ff 0%, #efdbff 100%)',
        legendary: 'linear-gradient(135deg, #fff7e6 0%, #ffd591 100%)',
        mythic: 'linear-gradient(135deg, #fff2e8 0%, #ffbb96 100%)',
        ancient: 'linear-gradient(135deg, #fff1f0 0%, #ffa39e 100%)'
    };
    return gradients[rarity] || '#f5f5f5';
};

const getRarityLabel = (rarity: string): string => {
    const labels: Record<string, string> = {
        common: 'Phổ thông',
        uncommon: 'Tinh luyện',
        rare: 'Hiếm',
        epic: 'Cực hiếm',
        legendary: 'Huyền thoại',
        mythic: 'Thần thoại',
        ancient: 'Cổ xưa'
    };
    return labels[rarity] || rarity;
};

const getItemIcon = (item: RewardItem): string => {
    // Trong thực tế, bạn sẽ lấy từ database
    return '/images/items/default.png';
};

const getItemName = (item: RewardItem): string => {
    if (item.type === 'currency') {
        return `${item.amount} ${getCurrencyLabel(item.currencyType!)}`;
    }
    return `Vật phẩm ${item.id}`; // Trong thực tế lấy từ item database
};

const getItemDescription = (item: RewardItem): string => {
    return `Mô tả vật phẩm ${item.id}`;
};

const getCurrencyLabel = (currency: string): string => {
    const labels: Record<string, string> = {
        gold: 'Vàng',
        diamond: 'Kim cương',
        silver: 'Bạc',
        honor: 'Danh vọng'
    };
    return labels[currency] || currency;
};

const getRarestItemRarity = (lootBox: LootBox): string => {
    const rarities = ['common', 'uncommon', 'rare', 'epic', 'legendary', 'mythic', 'ancient'];
    let rarest = 'common';

    lootBox.rewardTable.pools.forEach(pool => {
        pool.rewards.forEach(item => {
            const currentIndex = rarities.indexOf(item.rarity);
            const rarestIndex = rarities.indexOf(rarest);
            if (currentIndex > rarestIndex) {
                rarest = item.rarity;
            }
        });
    });

    return rarest;
};
