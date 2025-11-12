import React from 'react';
import { Typography, Table, Tag, Steps, Alert, Collapse } from 'antd';
import { CheckCircleOutlined, SyncOutlined, CloseCircleOutlined } from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;
const { Panel } = Collapse;

const LootBoxSystem: React.FC = () => {
    const lootBoxTypes = [
        {
            id: 'common_box',
            name: 'Rương Thường',
            type: 'common',
            tier: 'basic',
            cost: '1,000 Gold',
            dailyLimit: '10',
            features: ['Common items', 'Basic rewards', 'No requirements']
        },
        {
            id: 'premium_box',
            name: 'Rương Cao Cấp',
            type: 'premium',
            tier: 'advanced',
            cost: '100 Diamonds',
            dailyLimit: '5',
            features: ['Epic items chance', 'Pity system', 'VIP requirements']
        },
        {
            id: 'event_box',
            name: 'Rương Sự Kiện',
            type: 'event',
            tier: 'elite',
            cost: 'Event Coins',
            dailyLimit: '3',
            features: ['Limited time', 'Exclusive items', 'Event requirements']
        },
        {
            id: 'vip_box',
            name: 'Rương VIP',
            type: 'vip',
            tier: 'master',
            cost: 'VIP Points',
            dailyLimit: '1',
            features: ['Legendary chance', 'Streak bonus', 'VIP only']
        }
    ];



    return (
        <>
            <div className="docs-content">
                <div className="section">
                    <Title level={1}>🎁 Hệ Thống Loot Box</Title>
                    <Paragraph>
                        Hệ thống loot box thông minh với cơ chế phần thưởng phức tạp và kiểm soát chặt chẽ.
                    </Paragraph>

                    <Title level={2}>📦 Loại Loot Box</Title>
                    <Paragraph>
                        Mỗi loại loot box có đặc điểm và cơ chế phần thưởng riêng biệt:
                    </Paragraph>

                    <Table
                        dataSource={lootBoxTypes}
                        pagination={false}
                        style={{ marginBottom: 24 }}
                        columns={[
                            {
                                title: 'Tên',
                                dataIndex: 'name',
                                key: 'name',
                                render: (name) => <Text strong>{name}</Text>
                            },
                            {
                                title: 'Loại',
                                dataIndex: 'type',
                                key: 'type',
                                render: (type) => <Tag color="blue">{type}</Tag>
                            },
                            {
                                title: 'Tier',
                                dataIndex: 'tier',
                                key: 'tier',
                                render: (tier) => <Tag color="green">{tier}</Tag>
                            },
                            {
                                title: 'Chi Phí',
                                dataIndex: 'cost',
                                key: 'cost'
                            },
                            {
                                title: 'Giới Hạn/ngày',
                                dataIndex: 'dailyLimit',
                                key: 'dailyLimit'
                            },
                            {
                                title: 'Tính Năng',
                                dataIndex: 'features',
                                key: 'features',
                                render: (features: string[]) => (
                                    <div>
                                        {features.map((feature, index) => (
                                            <Tag key={index} color="purple" style={{ marginBottom: 4 }}>
                                                {feature}
                                            </Tag>
                                        ))}
                                    </div>
                                )
                            }
                        ]}
                    />

                    <Title level={2}>🔧 Quy Trình Mở Rương</Title>
                    <Paragraph>
                        Mỗi lần mở rương trải qua quy trình kiểm tra nghiêm ngặt:
                    </Paragraph>

                    <Steps
                        current={5}
                        items={[
                            {
                                title: 'Kiểm Tra Điều Kiện',
                                description: 'Verify level, VIP, time restrictions, and limits',
                                status: 'process',
                                icon: <SyncOutlined />
                            },
                            {
                                title: 'Xác Nhận Thanh Toán',
                                description: 'Check currency balance and process payment',
                                status: 'process',
                                icon: <SyncOutlined />
                            },
                            {
                                title: 'Tính Toán Bonus',
                                description: 'Apply streak, pity, and first-time bonuses',
                                status: 'process',
                                icon: <SyncOutlined />
                            },
                            {
                                title: 'Generate Rewards',
                                description: 'Calculate rewards based on distribution rules',
                                status: 'process',
                                icon: <SyncOutlined />
                            },
                            {
                                title: 'Cập Nhật Pity Counter',
                                description: 'Update pity counters and streak records',
                                status: 'process',
                                icon: <SyncOutlined />
                            },
                            {
                                title: 'Hoàn Thành',
                                description: 'Save results and send rewards to player',
                                status: 'finish',
                                icon: <CheckCircleOutlined />
                            }
                        ]}
                        style={{ marginBottom: 24, padding: '20px 0' }}
                    />

                    <Alert
                        message="Transaction Safety"
                        description="Toàn bộ quá trình được thực hiện trong transaction để đảm bảo data consistency."
                        type="info"
                        showIcon
                        style={{ marginBottom: 24 }}
                    />

                    <Title level={2}>🎯 Requirement System</Title>

                    <Collapse ghost style={{ marginBottom: 24 }}>
                        <Panel header="📊 Level Requirements" key="level">
                            <Paragraph>
                                Kiểm soát truy cập dựa trên level của người chơi:
                            </Paragraph>
                            <div className="code-block">
                                {`-- Ví dụ: Rương chỉ cho player level 10-50
INSERT INTO loot_box_requirements 
  (loot_box_id, min_level, max_level) 
VALUES 
  ('premium_box', 10, 50);`}
                            </div>
                        </Panel>

                        <Panel header="⏰ Time Restrictions" key="time">
                            <Paragraph>
                                Giới hạn thời gian mở rương trong ngày/tuần:
                            </Paragraph>
                            <div className="code-block">
                                {`-- Ví dụ: Chỉ mở được từ 18:00-22:00 các ngày trong tuần
INSERT INTO loot_box_requirements 
  (loot_box_id, start_time, end_time, days_of_week) 
VALUES 
  ('event_box', '18:00', '22:00', '{1,2,3,4,5}');`}
                            </div>
                        </Panel>

                        <Panel header="🎖️ VIP Requirements" key="vip">
                            <Paragraph>
                                Yêu cầu VIP level cụ thể để mở rương:
                            </Paragraph>
                            <div className="code-block">
                                {`-- Ví dụ: Yêu cầu VIP level 3
INSERT INTO loot_box_requirements 
  (loot_box_id, vip_level) 
VALUES 
  ('vip_box', 3);`}
                            </div>
                        </Panel>

                        <Panel header="📜 Quest Prerequisites" key="quest">
                            <Paragraph>
                                Yêu cầu hoàn thành quest hoặc achievement:
                            </Paragraph>
                            <div className="code-block">
                                {`-- Ví dụ: Yêu cầu hoàn thành quest "Dragon Slayer"
INSERT INTO loot_box_requirement_prerequisites
  (requirement_id, prerequisite_type, prerequisite_id)
VALUES 
  (1, 'quest', 'dragon_slayer_quest');`}
                            </div>
                        </Panel>
                    </Collapse>

                    <Title level={2}>⚡ Limit System</Title>
                    <Paragraph>
                        Ngăn chặn exploitation và kiểm soát economy với hệ thống giới hạn đa tầng:
                    </Paragraph>

                    <div className="feature-grid">
                        <div className="feature-card">
                            <Title level={4}>🕐 Time-based Limits</Title>
                            <ul>
                                <li><Text strong>Daily:</Text> Reset mỗi ngày</li>
                                <li><Text strong>Weekly:</Text> Reset mỗi tuần</li>
                                <li><Text strong>Monthly:</Text> Reset mỗi tháng</li>
                            </ul>
                        </div>
                        <div className="feature-card">
                            <Title level={4}>👤 Player Limits</Title>
                            <ul>
                                <li><Text strong>Per Account:</Text> Giới hạn toàn bộ tài khoản</li>
                                <li><Text strong>Per Character:</Text> Giới hạn theo nhân vật</li>
                                <li><Text strong>Total Lifetime:</Text> Giới hạn vĩnh viễn</li>
                            </ul>
                        </div>
                        <div className="feature-card">
                            <Title level={4}>🔄 Cooldown System</Title>
                            <ul>
                                <li><Text strong>Global Cooldown:</Text> Cho tất cả player</li>
                                <li><Text strong>Personal Cooldown:</Text> Theo từng player</li>
                                <li><Text strong>Tiered Cooldown:</Text> Khác nhau theo VIP level</li>
                            </ul>
                        </div>
                    </div>

                    <Title level={2}>🎪 Special Features</Title>

                    <Collapse ghost>
                        <Panel header="🎭 Opening Animations" key="animations">
                            <Paragraph>
                                Tùy chỉnh hiệu ứng mở rương để tăng trải nghiệm người chơi:
                            </Paragraph>
                            <div className="code-block">
                                {`-- Ví dụ: Rương với hiệu ứng epic
UPDATE loot_boxes SET 
  opening_animation_type = 'epic',
  animation_duration = 5000,
  sound_effect = 'epic_box_open.wav',
  particle_effect = 'sparkle_trail',
  glow_color = '#FF69B4'
WHERE id = 'premium_box';`}
                            </div>
                        </Panel>

                        <Panel header="🏷️ Tagging System" key="tags">
                            <Paragraph>
                                Hệ thống tag để filter và categorization:
                            </Paragraph>
                            <div className="code-block">
                                {`-- Ví dụ: Tag rương theo season và event
UPDATE loot_boxes SET 
  tags = '{"winter", "event", "limited"}',
  season = 'winter_2024',
  event = 'christmas_event'
WHERE id = 'event_box';`}
                            </div>
                        </Panel>

                        <Panel header="⏳ Time-limited Availability" key="availability">
                            <Paragraph>
                                Kiểm soát thời gian có sẵn của loot box:
                            </Paragraph>
                            <div className="code-block">
                                {`-- Ví dụ: Rương chỉ có từ 1/12/2024 đến 31/12/2024
UPDATE loot_boxes SET 
  time_limited = true,
  available_from = '2024-12-01 00:00:00',
  available_until = '2024-12-31 23:59:59'
WHERE id = 'event_box';`}
                            </div>
                        </Panel>
                    </Collapse>

                    <Alert
                        message="Performance Optimization"
                        description="Sử dụng composite indexes và partial indexes để tối ưu performance cho các query kiểm tra điều kiện."
                        type="warning"
                        showIcon
                    />
                </div >
            </div >


        </>
    )
};

export default LootBoxSystem;
