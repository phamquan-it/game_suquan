// components/admin/achievements/CreateAchievementForm.tsx
import React, { useState } from 'react';
import {
    Modal,
    Form,
    Input,
    Select,
    InputNumber,
    Switch,
    Card,
    Row,
    Col,
    Button,
    Space,
    Divider,
    Tag,
    Upload,
    message,
    Steps,
    Tabs,
    List,
    Typography
} from 'antd';
import {
    PlusOutlined,
    DeleteOutlined,
    SaveOutlined,
    UploadOutlined
} from '@ant-design/icons';
import {
    Achievement,
    AchievementRequirement,
    AchievementReward,
    RequirementType,
    RewardType
} from '@/lib/types/achievements/achievement';
import {
    getAchievementTierColor,
    getAchievementTierLabel,
    getAchievementTierIcon,
    getAchievementTypeColor,
    getAchievementTypeLabel,
    getAchievementTypeIcon,
    getDifficultyColor,
    getDifficultyLabel,
    getRequirementTypeLabel,
    getRewardTypeLabel,
    getRewardIcon
} from '@/lib/utils/achievement-utils';

const { Step } = Steps;
const { TabPane } = Tabs;
const { TextArea } = Input;
const { Title } = Typography;

interface CreateAchievementFormProps {
    visible: boolean;
    onClose: () => void;
    onSave: (achievement: Partial<Achievement>) => void;
    loading?: boolean;
}

export const CreateAchievementForm: React.FC<CreateAchievementFormProps> = ({
    visible,
    onClose,
    onSave,
    loading = false
}) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [form] = Form.useForm();
    const [requirements, setRequirements] = useState<AchievementRequirement[]>([]);
    const [rewards, setRewards] = useState<AchievementReward[]>([]);

    // Basic Information Step
    const BasicInformationStep = () => (
        <Card title="📝 Thông tin cơ bản" bordered={false}>
            <Row gutter={[16, 16]}>
                <Col span={12}>
                    <Form.Item
                        name="name"
                        label="Tên thành tích"
                        rules={[{ required: true, message: 'Vui lòng nhập tên thành tích' }]}
                    >
                        <Input placeholder="Ví dụ: Chiến Binh Mới, Sát Long Giả..." />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item
                        name="description"
                        label="Mô tả"
                        rules={[{ required: true, message: 'Vui lòng nhập mô tả' }]}
                    >
                        <TextArea
                            placeholder="Mô tả ngắn về thành tích..."
                            rows={3}
                        />
                    </Form.Item>
                </Col>
            </Row>

            <Row gutter={[16, 16]}>
                <Col span={8}>
                    <Form.Item
                        name="type"
                        label="Loại thành tích"
                        rules={[{ required: true, message: 'Vui lòng chọn loại thành tích' }]}
                    >
                        <Select placeholder="Chọn loại thành tích">
                            {Object.entries({
                                progression: 'Tiến triển',
                                combat: 'Chiến đấu',
                                exploration: 'Khám phá',
                                collection: 'Sưu tập',
                                crafting: 'Chế tạo',
                                social: 'Xã hội',
                                economy: 'Kinh tế',
                                alliance: 'Bang hội',
                                seasonal: 'Mùa',
                                milestone: 'Cột mốc',
                                secret: 'Bí mật'
                            }).map(([value, label]) => (
                                <Select.Option key={value} value={value}>
                                    <Space>
                                        <span style={{ color: getAchievementTypeColor(value) }}>
                                            {getAchievementTypeIcon(value)}
                                        </span>
                                        {label}
                                    </Space>
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item
                        name="tier"
                        label="Hạng thành tích"
                        rules={[{ required: true, message: 'Vui lòng chọn hạng thành tích' }]}
                    >
                        <Select placeholder="Chọn hạng thành tích">
                            {Object.entries({
                                bronze: 'Đồng',
                                silver: 'Bạc',
                                gold: 'Vàng',
                                platinum: 'Bạch kim',
                                diamond: 'Kim cương',
                                master: 'Bậc thầy',
                                grandmaster: 'Đại sư'
                            }).map(([value, label]) => (
                                <Select.Option key={value} value={value}>
                                    <Space>
                                        <span style={{ color: getAchievementTierColor(value) }}>
                                            {getAchievementTierIcon(value)}
                                        </span>
                                        {label}
                                    </Space>
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item
                        name="difficulty"
                        label="Độ khó"
                        rules={[{ required: true, message: 'Vui lòng chọn độ khó' }]}
                        initialValue="medium"
                    >
                        <Select placeholder="Chọn độ khó">
                            {Object.entries({
                                very_easy: 'Rất dễ',
                                easy: 'Dễ',
                                medium: 'Trung bình',
                                hard: 'Khó',
                                very_hard: 'Rất khó',
                                extreme: 'Cực khó',
                                impossible: 'Bất khả thi'
                            }).map(([value, label]) => (
                                <Select.Option key={value} value={value}>
                                    <Tag color={getDifficultyColor(value)}>
                                        {label}
                                    </Tag>
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Col>
            </Row>

            <Row gutter={[16, 16]}>
                <Col span={6}>
                    <Form.Item
                        name="points"
                        label="Điểm thành tích"
                        rules={[{ required: true, message: 'Vui lòng nhập điểm' }]}
                        initialValue={10}
                    >
                        <InputNumber
                            min={1}
                            max={10000}
                            style={{ width: '100%' }}
                            placeholder="10"
                        />
                    </Form.Item>
                </Col>
                <Col span={6}>
                    <Form.Item
                        name="repeatable"
                        label="Có thể lặp lại"
                        valuePropName="checked"
                        initialValue={false}
                    >
                        <Switch />
                    </Form.Item>
                </Col>
                <Col span={6}>
                    <Form.Item
                        name="hidden"
                        label="Ẩn thành tích"
                        valuePropName="checked"
                        initialValue={false}
                    >
                        <Switch />
                    </Form.Item>
                </Col>
                <Col span={6}>
                    <Form.Item
                        name="secret"
                        label="Bí mật"
                        valuePropName="checked"
                        initialValue={false}
                    >
                        <Switch />
                    </Form.Item>
                </Col>
            </Row>

            {form.getFieldValue('repeatable') && (
                <Form.Item
                    name="maxCompletions"
                    label="Số lần hoàn thành tối đa"
                >
                    <InputNumber
                        min={1}
                        style={{ width: '100%' }}
                        placeholder="Không giới hạn nếu để trống"
                    />
                </Form.Item>
            )}

            <Form.Item
                name="tags"
                label="Tags"
            >
                <Select mode="tags" placeholder="Thêm tags...">
                    <Select.Option value="beginner">Beginner</Select.Option>
                    <Select.Option value="advanced">Advanced</Select.Option>
                    <Select.Option value="seasonal">Seasonal</Select.Option>
                    <Select.Option value="limited">Limited</Select.Option>
                    <Select.Option value="pvp">PvP</Select.Option>
                    <Select.Option value="pve">PvE</Select.Option>
                </Select>
            </Form.Item>
        </Card>
    );

    // Requirements Step
    const RequirementsStep = () => (
        <Card title="🎯 Yêu cầu hoàn thành" bordered={false}>
            <div style={{ marginBottom: 16 }}>
                <Button
                    type="dashed"
                    icon={<PlusOutlined />}
                    onClick={() => setRequirements([...requirements, createNewRequirement()])}
                >
                    Thêm yêu cầu
                </Button>
            </div>

            <List
                dataSource={requirements}
                renderItem={(requirement, index) => (
                    <RequirementItem
                        requirement={requirement}
                        index={index}
                        onUpdate={(updatedReq) => {
                            const newReqs = [...requirements];
                            newReqs[index] = updatedReq;
                            setRequirements(newReqs);
                        }}
                        onDelete={() => {
                            const newReqs = requirements.filter((_, i) => i !== index);
                            setRequirements(newReqs);
                        }}
                    />
                )}
                locale={{ emptyText: 'Chưa có yêu cầu nào. Hãy thêm yêu cầu đầu tiên!' }}
            />

            {requirements.length > 0 && (
                <Form.Item
                    name="logic"
                    label="Logic hoàn thành"
                    initialValue="AND"
                    style={{ marginTop: 16 }}
                >
                    <Select>
                        <Select.Option value="AND">TẤT CẢ yêu cầu phải hoàn thành</Select.Option>
                        <Select.Option value="OR">CHỈ CẦN MỘT yêu cầu hoàn thành</Select.Option>
                    </Select>
                </Form.Item>
            )}
        </Card>
    );

    // Rewards Step
    const RewardsStep = () => (
        <Card title="🎁 Phần thưởng" bordered={false}>
            <div style={{ marginBottom: 16 }}>
                <Button
                    type="dashed"
                    icon={<PlusOutlined />}
                    onClick={() => setRewards([...rewards, createNewReward()])}
                >
                    Thêm phần thưởng
                </Button>
            </div>

            <Row gutter={[16, 16]}>
                {rewards.map((reward, index) => (
                    <Col span={8} key={reward.id}>
                        <RewardItem
                            reward={reward}
                            index={index}
                            onUpdate={(updatedReward) => {
                                const newRewards = [...rewards];
                                newRewards[index] = updatedReward;
                                setRewards(newRewards);
                            }}
                            onDelete={() => {
                                const newRewards = rewards.filter((_, i) => i !== index);
                                setRewards(newRewards);
                            }}
                        />
                    </Col>
                ))}
            </Row>

            {rewards.length === 0 && (
                <div style={{
                    textAlign: 'center',
                    padding: '40px',
                    border: '2px dashed #d9d9d9',
                    borderRadius: 8
                }}>
                    <p style={{ color: '#999', marginBottom: 16 }}>
                        Chưa có phần thưởng nào
                    </p>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => setRewards([createNewReward()])}
                    >
                        Thêm phần thưởng đầu tiên
                    </Button>
                </div>
            )}
        </Card>
    );

    // Advanced Settings Step
    const AdvancedSettingsStep = () => (
        <Card title="⚙️ Cài đặt nâng cao" bordered={false}>
            <Row gutter={[16, 16]}>
                <Col span={12}>
                    <Form.Item
                        name="shareable"
                        label="Cho phép chia sẻ"
                        valuePropName="checked"
                        initialValue={true}
                    >
                        <Switch />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item
                        name="timeLimit"
                        label="Giới hạn thời gian (giây)"
                    >
                        <InputNumber
                            min={0}
                            style={{ width: '100%' }}
                            placeholder="Không giới hạn"
                        />
                    </Form.Item>
                </Col>
            </Row>

            <Form.Item
                name="triggers"
                label="Sự kiện kích hoạt"
            >
                <Select mode="tags" placeholder="Thêm sự kiện...">
                    <Select.Option value="player_level_up">Lên cấp</Select.Option>
                    <Select.Option value="quest_completed">Hoàn thành nhiệm vụ</Select.Option>
                    <Select.Option value="boss_defeat">Đánh bại boss</Select.Option>
                    <Select.Option value="item_collected">Thu thập vật phẩm</Select.Option>
                    <Select.Option value="alliance_joined">Tham gia bang hội</Select.Option>
                </Select>
            </Form.Item>

            <Card title="Upload hình ảnh" size="small">
                <Row gutter={[16, 16]}>
                    <Col span={12}>
                        <Form.Item
                            name="icon"
                            label="Icon thành tích"
                        >
                            <Upload
                                listType="picture"
                                beforeUpload={() => false}
                                maxCount={1}
                            >
                                <Button icon={<UploadOutlined />}>Chọn icon</Button>
                            </Upload>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="image"
                            label="Ảnh lớn thành tích"
                        >
                            <Upload
                                listType="picture"
                                beforeUpload={() => false}
                                maxCount={1}
                            >
                                <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
                            </Upload>
                        </Form.Item>
                    </Col>
                </Row>
            </Card>
        </Card>
    );

    const steps = [
        {
            title: 'Thông tin cơ bản',
            content: <BasicInformationStep />,
        },
        {
            title: 'Yêu cầu',
            content: <RequirementsStep />,
        },
        {
            title: 'Phần thưởng',
            content: <RewardsStep />,
        },
        {
            title: 'Cài đặt nâng cao',
            content: <AdvancedSettingsStep />,
        },
    ];

    const handleNext = () => {
        form.validateFields().then(() => {
            setCurrentStep(currentStep + 1);
        });
    };

    const handlePrev = () => {
        setCurrentStep(currentStep - 1);
    };

    const handleSave = () => {
        form.validateFields().then(values => {
            const achievementData: Partial<Achievement> = {
                ...values,
                requirements,
                rewards,
                progress: {
                    current: 0,
                    target: 1,
                    percentage: 0
                },
                globalStats: {
                    completionRate: 0,
                    averageTime: 0,
                    totalCompletions: 0
                },
                id: `ach_${Date.now()}`,
                createdBy: 'admin_001',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                status: 'active',
                version: '1.0',
                rarity: 'common' // Will be calculated based on tier
            };

            onSave(achievementData);
        });
    };

    const createNewRequirement = (): AchievementRequirement => ({
        id: `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        type: 'level',
        description: '',
        current: 0,
        target: 1,
        hidden: false,
        order: requirements.length + 1
    });

    const createNewReward = (): AchievementReward => ({
        id: `rew_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        type: 'currency',
        currencyType: 'gold',
        amount: 100,
        rarity: 'common',
        bound: 'none',
        claimable: true
    });

    return (
        <Modal
            title="Tạo thành tích mới"
            open={visible}
            onCancel={onClose}
            footer={null}
            width={1200}
            style={{ top: 20 }}
        >
            <Steps current={currentStep} style={{ marginBottom: 24 }}>
                {steps.map(item => (
                    <Step key={item.title} title={item.title} />
                ))}
            </Steps>

            <Form
                form={form}
                layout="vertical"
                initialValues={{
                    repeatable: false,
                    hidden: false,
                    secret: false,
                    shareable: true,
                    logic: 'AND'
                }}
            >
                {steps[currentStep].content}
            </Form>

            <div style={{
                marginTop: 24,
                textAlign: 'right'
            }}>
                <Space>
                    {currentStep > 0 && (
                        <Button onClick={handlePrev}>
                            Quay lại
                        </Button>
                    )}
                    {currentStep < steps.length - 1 && (
                        <Button type="primary" onClick={handleNext}>
                            Tiếp theo
                        </Button>
                    )}
                    {currentStep === steps.length - 1 && (
                        <Button
                            type="primary"
                            icon={<SaveOutlined />}
                            onClick={handleSave}
                            loading={loading}
                        >
                            Tạo thành tích
                        </Button>
                    )}
                </Space>
            </div>
        </Modal>
    );
};

// Sub-components
const RequirementItem: React.FC<{
    requirement: AchievementRequirement;
    index: number;
    onUpdate: (requirement: AchievementRequirement) => void;
    onDelete: () => void;
}> = ({ requirement, index, onUpdate, onDelete }) => {
    return (
        <Card
            size="small"
            style={{ marginBottom: 8 }}
            title={
                <Space>
                    <span>Yêu cầu #{index + 1}</span>
                    <Button
                        danger
                        size="small"
                        icon={<DeleteOutlined />}
                        onClick={onDelete}
                    />
                </Space>
            }
        >
            <Row gutter={[8, 8]}>
                <Col span={8}>
                    <Select
                        value={requirement.type}
                        onChange={(value) => onUpdate({ ...requirement, type: value })}
                        style={{ width: '100%' }}
                        placeholder="Loại yêu cầu"
                    >
                        {Object.entries({
                            level: 'Đạt cấp độ',
                            quest_completion: 'Hoàn thành nhiệm vụ',
                            item_collection: 'Thu thập vật phẩm',
                            kill_count: 'Tiêu diệt kẻ địch',
                            boss_defeat: 'Đánh bại Boss',
                            alliance_join: 'Tham gia bang hội',
                            crafting_count: 'Chế tạo vật phẩm',
                            exploration: 'Khám phá địa điểm'
                        }).map(([value, label]) => (
                            <Select.Option key={value} value={value}>
                                {label}
                            </Select.Option>
                        ))}
                    </Select>
                </Col>
                <Col span={8}>
                    <InputNumber
                        value={requirement.target}
                        onChange={(value) => onUpdate({ ...requirement, target: value || 1 })}
                        style={{ width: '100%' }}
                        placeholder="Mục tiêu"
                        min={1}
                    />
                </Col>
                <Col span={8}>
                    <Input
                        value={requirement.description}
                        onChange={(e) => onUpdate({ ...requirement, description: e.target.value })}
                        placeholder="Mô tả yêu cầu"
                    />
                </Col>
            </Row>
            <div style={{ marginTop: 8 }}>
                <Switch
                    checked={requirement.hidden}
                    onChange={(checked) => onUpdate({ ...requirement, hidden: checked })}
                    size="small"
                />
                <span style={{ marginLeft: 8, fontSize: 12 }}>Ẩn yêu cầu</span>
            </div>
        </Card>
    );
};

const RewardItem: React.FC<{
    reward: AchievementReward;
    index: number;
    onUpdate: (reward: AchievementReward) => void;
    onDelete: () => void;
}> = ({ reward, index, onUpdate, onDelete }) => {
    return (
        <Card
            size="small"
            title={
                <Space>
                    <span style={{ fontSize: 16 }}>
                        {getRewardIcon(reward.type)}
                    </span>
                    <span>Phần thưởng #{index + 1}</span>
                    <Button
                        danger
                        size="small"
                        icon={<DeleteOutlined />}
                        onClick={onDelete}
                    />
                </Space>
            }
        >
            <Space direction="vertical" style={{ width: '100%' }}>
                <Select
                    value={reward.type}
                    onChange={(value) => onUpdate({ ...reward, type: value })}
                    style={{ width: '100%' }}
                    placeholder="Loại phần thưởng"
                >
                    {Object.entries({
                        currency: 'Tiền tệ',
                        item: 'Vật phẩm',
                        experience: 'Kinh nghiệm',
                        title: 'Danh hiệu',
                        cosmetic: 'Cosmetic',
                        mount: 'Mount',
                        pet: 'Pet',
                        loot_box: 'Rương quà'
                    }).map(([value, label]) => (
                        <Select.Option key={value} value={value}>
                            <Space>
                                <span>{getRewardIcon(value)}</span>
                                {label}
                            </Space>
                        </Select.Option>
                    ))}
                </Select>

                {reward.type === 'currency' && (
                    <Select
                        value={reward.currencyType}
                        onChange={(value) => onUpdate({ ...reward, currencyType: value })}
                        style={{ width: '100%' }}
                        placeholder="Loại tiền tệ"
                    >
                        <Select.Option value="gold">Vàng</Select.Option>
                        <Select.Option value="diamond">Kim cương</Select.Option>
                        <Select.Option value="honor">Danh vọng</Select.Option>
                    </Select>
                )}

                <InputNumber
                    value={reward.amount}
                    onChange={(value) => onUpdate({ ...reward, amount: value || 1 })}
                    style={{ width: '100%' }}
                    placeholder="Số lượng"
                    min={1}
                />

                <Select
                    value={reward.rarity}
                    onChange={(value) => onUpdate({ ...reward, rarity: value })}
                    style={{ width: '100%' }}
                    placeholder="Độ hiếm"
                >
                    <Select.Option value="common">Phổ thông</Select.Option>
                    <Select.Option value="uncommon">Tinh luyện</Select.Option>
                    <Select.Option value="rare">Hiếm</Select.Option>
                    <Select.Option value="epic">Cực hiếm</Select.Option>
                    <Select.Option value="legendary">Huyền thoại</Select.Option>
                </Select>

                <div>
                    <Switch
                        checked={reward.claimable}
                        onChange={(checked) => onUpdate({ ...reward, claimable: checked })}
                        size="small"
                    />
                    <span style={{ marginLeft: 8, fontSize: 12 }}>Có thể nhận</span>
                </div>
            </Space>
        </Card>
    );
};

export default CreateAchievementForm;
