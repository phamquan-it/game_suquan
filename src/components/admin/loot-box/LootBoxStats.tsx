// components/admin/loot-box/LootBoxStats.tsx
import React from 'react';
import { Row, Col, Card, Statistic, Progress } from 'antd';
import {
    GiftOutlined,
    StarOutlined,
    PercentageOutlined,
    GoldOutlined
} from '@ant-design/icons';
import { LootBox } from '@/lib/types/loot-box';

interface LootBoxStatsProps {
    lootBoxes: LootBox[];
}

export const LootBoxStats: React.FC<LootBoxStatsProps> = ({ lootBoxes }) => {
    const totalItems = lootBoxes.reduce((sum, box) =>
        sum + box.rewardTable.pools.reduce((poolSum, pool) =>
            poolSum + pool.rewards.length, 0
        ), 0
    );

    const activeBoxes = lootBoxes.filter(box => box.status === 'active').length;

    const averageDropRate = lootBoxes.length > 0 ?
        lootBoxes.reduce((sum, box) => {
            const boxRates = box.rewardTable.pools.flatMap(pool =>
                pool.rewards.map(item => {
                    const poolTotalWeight = pool.rewards.reduce((wSum, reward) => wSum + reward.weight, 0);
                    return (item.weight / poolTotalWeight) * 100;
                })
            );
            return sum + (boxRates.reduce((a, b) => a + b, 0) / boxRates.length);
        }, 0) / lootBoxes.length : 0;

    const premiumBoxes = lootBoxes.filter(box =>
        box.boxType === 'premium' || box.boxType === 'vip'
    ).length;

    return (
        <Row gutter={[16, 16]}>
            <Col span={6}>
                <Card>
                    <Statistic
                        title="Tổng số rương"
                        value={lootBoxes.length}
                        prefix={<GiftOutlined />}
                        valueStyle={{ color: '#8B0000' }}
                    />
                </Card>
            </Col>
            <Col span={6}>
                <Card>
                    <Statistic
                        title="Rương hoạt động"
                        value={activeBoxes}
                        suffix={`/ ${lootBoxes.length}`}
                        prefix={<StarOutlined />}
                        valueStyle={{ color: '#2E8B57' }}
                    />
                </Card>
            </Col>
            <Col span={6}>
                <Card>
                    <Statistic
                        title="Tổng vật phẩm"
                        value={totalItems}
                        prefix={<GoldOutlined />}
                        valueStyle={{ color: '#D4AF37' }}
                    />
                </Card>
            </Col>
            <Col span={6}>
                <Card>
                    <Statistic
                        title="Tỷ lệ rơi trung bình"
                        value={averageDropRate}
                        precision={2}
                        suffix="%"
                        prefix={<PercentageOutlined />}
                        valueStyle={{ color: '#1E90FF' }}
                    />
                </Card>
            </Col>
        </Row>
    );
};
