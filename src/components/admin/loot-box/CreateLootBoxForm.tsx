// components/admin/loot-box/CreateLootBoxForm.tsx
import React, { useState } from 'react';
import {
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
    Tabs,
    Modal,
    Steps
} from 'antd';
import {
    PlusOutlined,
    DeleteOutlined,
    EyeOutlined,
    SaveOutlined,
    ArrowLeftOutlined
} from '@ant-design/icons';
import { LootBox, RewardPool, RewardItem } from '@/lib/types/loot-box';
import { getBoxTypeColor, getBoxTypeIcon, getBoxTypeLabel, getRarityColor, getRarityLabel, getTierColor, getTierLabel } from './helpers';

const { Step } = Steps;
const { TabPane } = Tabs;
const { TextArea } = Input;

interface CreateLootBoxFormProps {
    onSave: (lootBox: Partial<LootBox>) => void;
    onCancel: () => void;
    loading?: boolean;
}

export const CreateLootBoxForm: React.FC<CreateLootBoxFormProps> = ({
    onSave,
    onCancel,
    loading = false
}) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [form] = Form.useForm();
    const [rewardPools, setRewardPools] = useState<RewardPool[]>([]);
    const [previewVisible, setPreviewVisible] = useState(false);

    // Basic Information Step
    const BasicInformationStep = () => (
        <Card title="📝 Thông tin cơ bản" variant="borderless" >
            <Row gutter={[16, 16]}>
                <Col span={12}>
                    <Form.Item
                        name="name"
                        label="Tên rương quà"
                        rules={[{ required: true, message: 'Vui lòng nhập tên rương' }]}
                    >
                        <Input placeholder="Ví dụ: Rương Bạch Ngọc, Rương Long Vương..." />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item
                        name="description"
                        label="Mô tả"
                        rules={[{ required: true, message: 'Vui lòng nhập mô tả' }]}
                    >
                        <TextArea 
                            placeholder="Mô tả ngắn về rương quà..."
                            rows={3}
                        />
                    </Form.Item>
                </Col>
            </Row>

            <Row gutter={[16, 16]}>
                <Col span={8}>
                    <Form.Item
                        name="boxType"
                        label="Loại rương"
                        rules={[{ required: true, message: 'Vui lòng chọn loại rương' }]}
                    >
                        <Select placeholder="Chọn loại rương">
                            <Select.Option value="common">
                                <Space>
                                    <span style={{ color: getBoxTypeColor('common') }}>
                                        {getBoxTypeIcon('common')}
                                    </span>
                                    {getBoxTypeLabel('common')}
                                </Space>
                            </Select.Option>
                            <Select.Option value="vip">
                                <Space>
                                    <span style={{ color: getBoxTypeColor('vip') }}>
                                        {getBoxTypeIcon('vip')}
                                    </span>
                                    {getBoxTypeLabel('vip')}
                                </Space>
                            </Select.Option>
                            <Select.Option value="premium">
                                <Space>
                                    <span style={{ color: getBoxTypeColor('premium') }}>
                                        {getBoxTypeIcon('premium')}
                                    </span>
                                    {getBoxTypeLabel('premium')}
                                </Space>
                            </Select.Option>
                            <Select.Option value="event">
                                <Space>
                                    <span style={{ color: getBoxTypeColor('event') }}>
                                        {getBoxTypeIcon('event')}
                                    </span>
                                    {getBoxTypeLabel('event')}
                                </Space>
                            </Select.Option>
                            <Select.Option value="boss">
                                <Space>
                                    <span style={{ color: getBoxTypeColor('boss') }}>
                                        {getBoxTypeIcon('boss')}
                                    </span>
                                    {getBoxTypeLabel('boss')}
                                </Space>
                            </Select.Option>
                        </Select>
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item
                        name="tier"
                        label="Cấp độ"
                        rules={[{ required: true, message: 'Vui lòng chọn cấp độ' }]}
                    >
                        <Select placeholder="Chọn cấp độ">
                            <Select.Option value="basic">
                                <Tag color={getTierColor('basic')}>
                                    {getTierLabel('basic')}
                                </Tag>
                            </Select.Option>
                            <Select.Option value="advanced">
                                <Tag color={getTierColor('advanced')}>
                                    {getTierLabel('advanced')}
                                </Tag>
                            </Select.Option>
                            <Select.Option value="elite">
                                <Tag color={getTierColor('elite')}>
                                    {getTierLabel('elite')}
                                </Tag>
                            </Select.Option>
                            <Select.Option value="master">
                                <Tag color={getTierColor('master')}>
                                    {getTierLabel('master')}
                                </Tag>
                            </Select.Option>
                            <Select.Option value="legendary">
                                <Tag color={getTierColor('legendary')}>
                                    {getTierLabel('legendary')}
                                </Tag>
                            </Select.Option>
                        </Select>
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item
                        name="rarity"
                        label="Độ hiếm"
                        rules={[{ required: true, message: 'Vui lòng chọn độ hiếm' }]}
                    >
                        <Select placeholder="Chọn độ hiếm">
                            <Select.Option value="common">
                                <Tag color={getRarityColor('common')}>
                                    {getRarityLabel('common')}
                                </Tag>
                            </Select.Option>
                            <Select.Option value="uncommon">
                                <Tag color={getRarityColor('uncommon')}>
                                    {getRarityLabel('uncommon')}
                                </Tag>
                            </Select.Option>
                            <Select.Option value="rare">
                                <Tag color={getRarityColor('rare')}>
                                    {getRarityLabel('rare')}
                                </Tag>
                            </Select.Option>
                            <Select.Option value="epic">
                                <Tag color={getRarityColor('epic')}>
                                    {getRarityLabel('epic')}
                                </Tag>
                            </Select.Option>
                            <Select.Option value="legendary">
                                <Tag color={getRarityColor('legendary')}>
                                    {getRarityLabel('legendary')}
                                </Tag>
                            </Select.Option>
                        </Select>
                    </Form.Item>
                </Col>
            </Row>

            <Row gutter={[16, 16]}>
                <Col span={6}>
                    <Form.Item
                        name="level"
                        label="Level yêu cầu"
                        initialValue={1}
                    >
                        <InputNumber 
                            min={1} 
                            max={100}
                            style={{ width: '100%' }}
                            placeholder="Level 1"
                        />
                    </Form.Item>
                </Col>
                <Col span={6}>
                    <Form.Item
                        name="value"
                        label="Giá trị (Gold)"
                        initialValue={1000}
                    >
                        <InputNumber 
                            min={0}
                            style={{ width: '100%' }}
                            placeholder="1000"
                        />
                    </Form.Item>
                </Col>
                <Col span={6}>
                    <Form.Item
                        name="maxStack"
                        label="Số lượng tối đa"
                        initialValue={99}
                    >
                        <InputNumber 
                            min={1}
                            max={999}
                            style={{ width: '100%' }}
                            placeholder="99"
                        />
                    </Form.Item>
                </Col>
                <Col span={6}>
                    <Form.Item
                        name="status"
                        label="Trạng thái"
                        valuePropName="checked"
                        initialValue={true}
                    >
                        <Switch 
                            checkedChildren="Hoạt động" 
                            unCheckedChildren="Ẩn" 
                        />
                    </Form.Item>
                </Col>
            </Row>

            <Form.Item
                name="tags"
                label="Tags"
            >
                <Select mode="tags" placeholder="Thêm tags...">
                    <Select.Option value="starter">Starter</Select.Option>
                    <Select.Option value="limited">Limited</Select.Option>
                    <Select.Option value="event">Event</Select.Option>
                    <Select.Option value="premium">Premium</Select.Option>
                </Select>
            </Form.Item>
        </Card>
    );

    // Cost & Requirements Step
    const CostRequirementsStep = () => (
        <Card title="💰 Chi phí & Yêu cầu" bordered={false}>
            <Row gutter={[16, 16]}>
                <Col span={12}>
                    <Card title="Chi phí mở" size="small">
                        <Row gutter={[16, 16]}>
                            <Col span={12}>
                                <Form.Item
                                    name={['openCost', 'currency']}
                                    label="Loại tiền tệ"
                                    initialValue="gold"
                                >
                                    <Select>
                                        <Select.Option value="gold">Vàng</Select.Option>
                                        <Select.Option value="diamond">Kim cương</Select.Option>
                                        <Select.Option value="honor">Danh vọng</Select.Option>
                                        <Select.Option value="festival_coin">Xu lễ hội</Select.Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    name={['openCost', 'amount']}
                                    label="Số lượng"
                                    initialValue={1000}
                                >
                                    <InputNumber 
                                        min={0}
                                        style={{ width: '100%' }}
                                        placeholder="1000"
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Card>
                </Col>
                <Col span={12}>
                    <Card title="Giới hạn mở" size="small">
                        <Row gutter={[8, 8]}>
                            <Col span={12}>
                                <Form.Item
                                    name={['openLimits', 'daily']}
                                    label="Hàng ngày"
                                >
                                    <InputNumber 
                                        min={0}
                                        style={{ width: '100%' }}
                                        placeholder="Không giới hạn"
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    name={['openLimits', 'weekly']}
                                    label="Hàng tuần"
                                >
                                    <InputNumber 
                                        min={0}
                                        style={{ width: '100%' }}
                                        placeholder="Không giới hạn"
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    name={['openLimits', 'monthly']}
                                    label="Hàng tháng"
                                >
                                    <InputNumber 
                                        min={0}
                                        style={{ width: '100%' }}
                                        placeholder="Không giới hạn"
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    name={['openLimits', 'total']}
                                    label="Tổng số"
                                >
                                    <InputNumber 
                                        min={0}
                                        style={{ width: '100%' }}
                                        placeholder="Không giới hạn"
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Card>
                </Col>
            </Row>

            <Divider />

            <Card title="Yêu cầu mở rương" size="small">
                <Row gutter={[16, 16]}>
                    <Col span={8}>
                        <Form.Item
                            name={['openRequirements', 'minLevel']}
                            label="Level tối thiểu"
                        >
                            <InputNumber 
                                min={1}
                                style={{ width: '100%' }}
                                placeholder="Không yêu cầu"
                            />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item
                            name={['openRequirements', 'vipLevel']}
                            label="VIP Level"
                        >
                            <InputNumber 
                                min={0}
                                max={10}
                                style={{ width: '100%' }}
                                placeholder="Không yêu cầu"
                            />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item
                            name={['openRequirements', 'achievements']}
                            label="Thành tích yêu cầu"
                        >
                            <Select mode="tags" placeholder="Thêm thành tích...">
                                <Select.Option value="first_blood">First Blood</Select.Option>
                                <Select.Option value="dragon_slayer">Dragon Slayer</Select.Option>
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>
            </Card>
        </Card>
    );

    // Reward Configuration Step
    const RewardConfigurationStep = () => (
        <Card title="🎁 Cấu hình phần thưởng" bordered={false}>
            <div style={{ marginBottom: 16 }}>
                <Button 
                    type="dashed" 
                    icon={<PlusOutlined />}
                    onClick={() => setRewardPools([...rewardPools, createNewPool()])}
                >
                    Thêm nhóm phần thưởng
                </Button>
            </div>

            <Tabs type="card">
                {rewardPools.map((pool, index) => (
                    <TabPane 
                        key={pool.id}
                        tab={
                            <span>
                                {pool.name} 
                                <Tag style={{ marginLeft: 8 }}>Tỷ trọng: {pool.weight}</Tag>
                            </span>
                        }
                    >
                        <RewardPoolForm
                            pool={pool}
                            index={index}
                            onUpdate={(updatedPool) => {
                                const newPools = [...rewardPools];
                                newPools[index] = updatedPool;
                                setRewardPools(newPools);
                            }}
                            onDelete={() => {
                                const newPools = rewardPools.filter((_, i) => i !== index);
                                setRewardPools(newPools);
                            }}
                        />
                    </TabPane>
                ))}
            </Tabs>

            {rewardPools.length === 0 && (
                <div style={{ 
                    textAlign: 'center', 
                    padding: '40px',
                    border: '2px dashed #d9d9d9',
                    borderRadius: 8
                }}>
                    <p style={{ color: '#999', marginBottom: 16 }}>
                        Chưa có nhóm phần thưởng nào
                    </p>
                    <Button 
                        type="primary" 
                        icon={<PlusOutlined />}
                        onClick={() => setRewardPools([createNewPool()])}
                    >
                        Thêm nhóm phần thưởng đầu tiên
                    </Button>
                </div>
            )}
        </Card>
    );

    // Advanced Settings Step
    const AdvancedSettingsStep = () => (
        <Card title="⚙️ Cài đặt nâng cao" bordered={false}>
            <Tabs>
                <TabPane tab="Hệ thống đảm bảo" key="guaranteed">
                    <GuaranteedDropsSettings />
                </TabPane>
                <TabPane tab="Pity System" key="pity">
                    <PitySystemSettings />
                </TabPane>
                <TabPane tab="Hiệu ứng & Animation" key="effects">
                    <VisualEffectsSettings />
                </TabPane>
                <TabPane tab="Metadata" key="metadata">
                    <MetadataSettings />
                </TabPane>
            </Tabs>
        </Card>
    );

    const steps = [
        {
            title: 'Thông tin cơ bản',
            content: <BasicInformationStep />,
        },
        {
            title: 'Chi phí & Yêu cầu',
            content: <CostRequirementsStep />,
        },
        {
            title: 'Phần thưởng',
            content: <RewardConfigurationStep />,
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
            const lootBoxData: Partial<LootBox> = {
                ...values,
                rewardTable: {
                    id: `rt_${Date.now()}`,
                    name: `Bảng phần thưởng - ${values.name}`,
                    pools: rewardPools,
                    rules: {
                        distributionType: 'weighted',
                        antiDuplicate: true,
                        duplicateProtection: 10
                    }
                },
                id: `lb_${Date.now()}`,
                createdBy: 'admin_001',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };
            
            onSave(lootBoxData);
        });
    };

    const createNewPool = (): RewardPool => ({
        id: `pool_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: `Nhóm phần thưởng ${rewardPools.length + 1}`,
        weight: 100,
        minDrops: 1,
        maxDrops: 1,
        rewards: []
    });

    return (
        <div style={{ padding: '24px' }}>
            <div style={{ marginBottom: 24 }}>
                <Button 
                    icon={<ArrowLeftOutlined />}
                    onClick={onCancel}
                    style={{ marginRight: 16 }}
                >
                    Quay lại
                </Button>
                <span style={{ fontSize: '20px', fontWeight: 'bold' }}>
                    Thêm Rương Quà Mới
                </span>
            </div>

            <Steps current={currentStep} style={{ marginBottom: 32 }}>
                {steps.map(item => (
                    <Step key={item.title} title={item.title} />
                ))}
            </Steps>

            <Form
                form={form}
                layout="vertical"
                initialValues={{
                    status: true,
                    stackable: true,
                    tradable: true,
                    destroyable: true,
                    sellable: true,
                    bound: 'none',
                    level: 1,
                    value: 1000,
                    maxStack: 99
                }}
            >
                {steps[currentStep].content}
            </Form>

            <div style={{ 
                marginTop: 24, 
                textAlign: 'right',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <Button
                    icon={<EyeOutlined />}
                    onClick={() => setPreviewVisible(true)}
                    disabled={rewardPools.length === 0}
                >
                    Xem trước
                </Button>

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
                            Tạo rương quà
                        </Button>
                    )}
                </Space>
            </div>

            {/* Preview Modal */}
            <Modal
                title="Xem trước rương quà"
                open={previewVisible}
                onCancel={() => setPreviewVisible(false)}
                footer={null}
                width={1000}
            >
                <LootBoxPreview
                    formData={form.getFieldsValue()}
                    rewardPools={rewardPools}
                />
            </Modal>
        </div>
    );
};

// Sub-components
const RewardPoolForm: React.FC<{
    pool: RewardPool;
    index: number;
    onUpdate: (pool: RewardPool) => void;
    onDelete: () => void;
}> = ({ pool, onUpdate, onDelete }) => {
    const [rewards, setRewards] = useState<RewardItem[]>(pool.rewards);

    const addReward = () => {
        const newReward: RewardItem = {
            id: `reward_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            type: 'currency',
            currencyType: 'gold',
            amount: 100,
            weight: 10,
            rarity: 'common',
            bound: 'none'
        };
        const newRewards = [...rewards, newReward];
        setRewards(newRewards);
        onUpdate({ ...pool, rewards: newRewards });
    };

    return (
        <Card 
            title={
                <Space>
                    <Input
                        value={pool.name}
                        onChange={(e) => onUpdate({ ...pool, name: e.target.value })}
                        style={{ width: 200 }}
                    />
                    <Button 
                        danger 
                        icon={<DeleteOutlined />}
                        onClick={onDelete}
                        size="small"
                    >
                        Xóa
                    </Button>
                </Space>
            }
            extra={
                <Space>
                    <span>Tỷ trọng:</span>
                    <InputNumber
                        value={pool.weight}
                        onChange={(value) => onUpdate({ ...pool, weight: value || 0 })}
                        min={1}
                        max={1000}
                        size="small"
                    />
                    <span>Số vật phẩm:</span>
                    <InputNumber
                        value={pool.minDrops}
                        onChange={(value) => onUpdate({ ...pool, minDrops: value || 0 })}
                        min={1}
                        size="small"
                        style={{ width: 80 }}
                    />
                    <span>-</span>
                    <InputNumber
                        value={pool.maxDrops}
                        onChange={(value) => onUpdate({ ...pool, maxDrops: value || 0 })}
                        min={pool.minDrops}
                        size="small"
                        style={{ width: 80 }}
                    />
                </Space>
            }
        >
            {/* Reward items table would go here */}
            <Button 
                type="dashed" 
                icon={<PlusOutlined />}
                onClick={addReward}
                block
            >
                Thêm vật phẩm vào nhóm
            </Button>
        </Card>
    );
};

const GuaranteedDropsSettings = () => (
    <div>
        <p>Thiết lập phần thưởng đảm bảo sau số lần mở nhất định</p>
        {/* Implementation for guaranteed drops */}
    </div>
);

const PitySystemSettings = () => (
    <div>
        <p>Hệ thống bù đảm bảo vật phẩm hiếm sau nhiều lần mở</p>
        {/* Implementation for pity system */}
    </div>
);

const VisualEffectsSettings = () => (
    <div>
        <p>Hiệu ứng hình ảnh và âm thanh khi mở rương</p>
        {/* Implementation for visual effects */}
    </div>
);

const MetadataSettings = () => (
    <div>
        <p>Thông tin metadata và tags bổ sung</p>
        {/* Implementation for metadata */}
    </div>
);

const LootBoxPreview: React.FC<{
    formData: any;
    rewardPools: RewardPool[];
}> = ({ formData }) => (
    <div>
        <Card title="Thông tin cơ bản">
            <Row gutter={[16, 8]}>
                <Col span={8}>
                    <strong>Tên:</strong> {formData.name}
                </Col>
                <Col span={8}>
                    <strong>Loại:</strong> {getBoxTypeLabel(formData.boxType)}
                </Col>
                <Col span={8}>
                    <strong>Cấp độ:</strong> {getTierLabel(formData.tier)}
                </Col>
            </Row>
        </Card>
        {/* More preview content */}
    </div>
);

export default CreateLootBoxForm;
