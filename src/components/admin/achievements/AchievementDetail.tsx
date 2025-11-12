// components/admin/achievements/AchievementDetail.tsx
import React from 'react';
import {
    Modal,
    Row,
    Col,
    Card,
    Tag,
    Progress,
    List,
    Descriptions,
    Space,
    Timeline,
    Statistic
} from 'antd';
import {
    TrophyOutlined,
    StarOutlined,
    ClockCircleOutlined,
    TeamOutlined
} from '@ant-design/icons';
import { Achievement } from '@/lib/types/achievements/achievement';
import { getAchievementTierColor, getAchievementTierLabel, getAchievementTypeColor, getAchievementTypeLabel } from '@/lib/utils/achievement-utils';

interface AchievementDetailProps {
    achievement: Achievement;
    visible: boolean;
    onClose: () => void;
}

export const AchievementDetail: React.FC<AchievementDetailProps> = ({
    achievement,
    visible,
    onClose
}) => {
    return (
        <Modal
            title={
                <Space>
                    <img
                        src={achievement.icon}
                        alt={achievement.name}
                        style={{ width: 32, height: 32 }}
                    />
                    <span>{achievement.name}</span>
                    <Tag color={getAchievementTierColor(achievement.tier)}>
                        {getAchievementTierLabel(achievement.tier)}
                    </Tag>
                </Space>
            }
            open={visible}
            onCancel={onClose}
            footer={null}
            width={1000}
        >
            <Row gutter={[16, 16]}>
                <Col span={16}>
                    {/* Requirements */}
                    <Card title="Yêu cầu hoàn thành" size="small">
                        <List
                            dataSource={achievement.requirements}
                            renderItem={(req, index) => (
                                <List.Item>
                                    <Space direction="vertical" style={{ width: '100%' }}>
                                        <div>
                                            <strong>{index + 1}. {req.description}</strong>
                                        </div>
                                        <Progress
                                            percent={(req.current / req.target) * 100}
                                            format={() => `${req.current}/${req.target}`}
                                        />
                                    </Space>
                                </List.Item>
                            )}
                        />
                    </Card>

                    {/* Rewards */}
                    <Card title="Phần thưởng" size="small" style={{ marginTop: 16 }}>
                        <Row gutter={[8, 8]}>
                            {achievement.rewards.map((reward, index) => (
                                <Col span={8} key={index}>
                                    <Card size="small">
                                        <Space>
                                            <div style={{ fontSize: 24 }}>
                                                {getRewardIcon(reward.type)}
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: 500 }}>
                                                    {getRewardAmount(reward)}
                                                </div>
                                                <Tag >
                                                    {getRewardTypeLabel(reward.type)}
                                                </Tag>
                                            </div>
                                        </Space>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    </Card>
                </Col>

                <Col span={8}>
                    {/* Statistics */}
                    <Card title="Thống kê" size="small">
                        <Space direction="vertical" style={{ width: '100%' }}>
                            <Statistic
                                title="Tỷ lệ hoàn thành"
                                value={achievement.globalStats.completionRate}
                                suffix="%"
                                valueStyle={{ color: '#3f8600' }}
                            />
                            <Statistic
                                title="Số người hoàn thành"
                                value={achievement.globalStats.totalCompletions}
                                prefix={<TeamOutlined />}
                            />
                            <Statistic
                                title="Thời gian trung bình"
                                value={achievement.globalStats.averageTime}
                                suffix="giây"
                                prefix={<ClockCircleOutlined />}
                            />
                            <Statistic
                                title="Điểm thành tích"
                                value={achievement.points}
                                prefix={<TrophyOutlined />}
                                valueStyle={{ color: '#faad14' }}
                            />
                        </Space>
                    </Card>

                    {/* Metadata */}
                    <Card title="Thông tin" size="small" style={{ marginTop: 16 }}>
                        <Descriptions column={1} size="small">
                            <Descriptions.Item label="Loại">
                                <Tag color={getAchievementTypeColor(achievement.type)}>
                                    {getAchievementTypeLabel(achievement.type)}
                                </Tag>
                            </Descriptions.Item>
                            <Descriptions.Item label="Độ khó">
                                <Tag color={getDifficultyColor(achievement.difficulty)}>
                                    {getDifficultyLabel(achievement.difficulty)}
                                </Tag>
                            </Descriptions.Item>
                            <Descriptions.Item label="Lặp lại">
                                {achievement.repeatable ? 'Có' : 'Không'}
                            </Descriptions.Item>
                            <Descriptions.Item label="Ẩn">
                                {achievement.hidden ? 'Có' : 'Không'}
                            </Descriptions.Item>
                            <Descriptions.Item label="Bí mật">
                                {achievement.secret ? 'Có' : 'Không'}
                            </Descriptions.Item>
                        </Descriptions>
                    </Card>
                </Col>
            </Row>
        </Modal>
    );
};

// Helper functions
const getRewardIcon = (type: string): string => {
    const icons: Record<string, string> = {
        currency: '💰',
        item: '🎁',
        experience: '⭐',
        title: '🏷️',
        cosmetic: '👕',
        mount: '🐴',
        pet: '🐾',
        loot_box: '🎁'
    };
    return icons[type] || '🎁';
};

const getRewardTypeLabel = (type: string): string => {
    const labels: Record<string, string> = {
        currency: 'Tiền tệ',
        item: 'Vật phẩm',
        experience: 'Kinh nghiệm',
        title: 'Danh hiệu',
        cosmetic: 'Cosmetic',
        mount: 'Mount',
        pet: 'Pet',
        loot_box: 'Rương quà'
    };
    return labels[type] || type;
};

const getRewardAmount = (reward: any): string => {
    if (reward.type === 'currency') {
        return `${reward.amount} ${reward.currencyType}`;
    }
    return `${reward.amount} ${getRewardTypeLabel(reward.type)}`;
};

const getDifficultyColor = (difficulty: string): string => {
    const colors: Record<string, string> = {
        very_easy: 'green',
        easy: 'lime',
        medium: 'orange',
        hard: 'red',
        very_hard: 'volcano',
        extreme: 'purple',
        impossible: 'black'
    };
    return colors[difficulty] || 'default';
};

const getDifficultyLabel = (difficulty: string): string => {
    const labels: Record<string, string> = {
        very_easy: 'Rất dễ',
        easy: 'Dễ',
        medium: 'Trung bình',
        hard: 'Khó',
        very_hard: 'Rất khó',
        extreme: 'Cực khó',
        impossible: 'Bất khả thi'
    };
    return labels[difficulty] || difficulty;
};
