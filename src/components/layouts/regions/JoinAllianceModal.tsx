import { Modal, Button, Alert, Space, Card, Typography, Input } from "antd"
const { Text } = Typography
export const JoinAllianceModal = ({
    alliance,
    visible,
    onClose,
    onConfirm
}: {
    alliance: Alliance | null;
    visible: boolean;
    onClose: () => void;
    onConfirm: () => void;
}) => {
    if (!alliance) return null;

    return (
        <Modal
            title="Gửi Yêu Cầu Gia Nhập"
            open={visible}
            onCancel={onClose}
            footer={[
                <Button key="cancel" onClick={onClose}>
                    Hủy
                </Button>,
                <Button
                    key="submit"
                    type="primary"
                    onClick={onConfirm}
                    style={{
                        background: 'linear-gradient(135deg, #D4AF37, #FFD700)',
                        border: 'none',
                        color: '#8B0000',
                        fontWeight: 'bold'
                    }}
                >
                    Gửi Yêu Cầu
                </Button>
            ]}
        >
            <Space direction="vertical" style={{ width: '100%' }} size="middle">
                <Alert
                    message="Yêu cầu gia nhập liên minh"
                    description={
                        <Space direction="vertical">
                            <Text>Bạn đang yêu cầu gia nhập:</Text>
                            <Text strong style={{ color: '#8B0000', fontSize: '16px' }}>
                                {alliance.name} [{alliance.tag}]
                            </Text>
                            {alliance.requirements.approvalRequired && (
                                <Text type="warning">
                                    Liên minh này yêu cầu phê duyệt. Yêu cầu của bạn sẽ được xem xét bởi Tộc trưởng.
                                </Text>
                            )}
                        </Space>
                    }
                    type="info"
                    showIcon
                />

                <Card title="Yêu Cầu Của Liên Minh" size="small">
                    <Space direction="vertical" size="small">
                        <Text>Cấp độ tối thiểu: Lv.{alliance.requirements.minLevel}</Text>
                        <Text>Sức mạnh tối thiểu: {(alliance.requirements.minPower / 1000).toFixed(0)}K</Text>
                        <Text>Phê duyệt: {alliance.requirements.approvalRequired ? 'Có' : 'Không'}</Text>
                    </Space>
                </Card>

                <Input.TextArea
                    placeholder="Lời nhắn cho Tộc trưởng (tuỳ chọn)"
                    rows={4}
                    maxLength={200}
                    showCount
                />
            </Space>
        </Modal>
    );
};


