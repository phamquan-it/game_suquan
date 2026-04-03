'use client';

import React, { useState } from 'react';
import { Row, Col, Card, Typography, notification, Spin, Alert, message, Modal, Form, Select, Button, Input } from 'antd';
import AllianceTable from './components/AllianceTable';
import AllianceMetrics from './components/AllianceMetrics';
import { Alliance } from '@/types/alliance';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { allianceService } from '@/lib/hooks/useAlliances';
import AllianceFormModal from '@/components/AllianceFormModal';
import { playerService } from '@/lib/hooks/admin/usePlayers';
import { useAllianceMembers } from './hooks/useAllianceMembers';

const { Title } = Typography;
const { Option } = Select;

export default function AlliancesPage() {
  const [selectedAlliances, setSelectedAlliances] = useState<Alliance[]>([]);
  const [editMemberModalVisible, setEditMemberModalVisible] = useState(false);
  const [currentMember, setCurrentMember] = useState<any>(null);
  const [currentAlliance, setCurrentAlliance] = useState<Alliance | null>(null);
  const [memberForm] = Form.useForm();
  const queryClient = useQueryClient();

  // Fetch alliances with proper service
  const {
    data: alliancesData,
    isLoading,
    isError,
    error
  } = useQuery({
    queryKey: ['alliances'],
    queryFn: () => allianceService.getAlliances(0, 100),
  });

  // Fetch players for member selection
  const {
    data: playersData,
    isLoading: playersLoading
  } = useQuery({
    queryKey: ['players'],
    queryFn: () => playerService.getPlayers(1, 1000),
  });

  // Mutation for bulk actions
  const bulkActionMutation = useMutation({
    mutationFn: async ({ action, allianceIds }: { action: string; allianceIds: string[] }) => {
      switch (action) {
        case 'suspend':
          await Promise.all(
            allianceIds.map(id =>
              allianceService.updateAllianceStatus(id, 'suspended')
            )
          );
          break;
        case 'activate':
          await Promise.all(
            allianceIds.map(id =>
              allianceService.updateAllianceStatus(id, 'active')
            )
          );
          break;
        case 'disband':
          await Promise.all(
            allianceIds.map(id =>
              allianceService.deleteAlliance(id)
            )
          );
          break;
        case 'edit':
          message.open({
            type: 'info',
            content: 'Chức năng chỉnh sửa sẽ được phát triển trong tương lai.',
          });
          break;
        default:
          throw new Error(`Unknown action: ${action}`);
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['alliances'] });
      notification.success({
        message: 'Thành công',
        description: `Đã thực hiện hành động ${getActionText(variables.action)} cho ${variables.allianceIds.length} liên minh`,
      });
      setSelectedAlliances([]);
    },
    onError: (error: Error) => {
      notification.error({
        message: 'Lỗi',
        description: `Không thể thực hiện hành động: ${error.message}`,
      });
    }
  });

  // Mutation for editing member
  const editMemberMutation = useMutation({
    mutationFn: async ({ allianceId, playerId, role }: { allianceId: string; playerId: string; role: string }) => {
      // This would need to be implemented in your allianceService
      // For now, we'll use the updateMemberRole from useAllianceMembers
      const { updateMemberRole } = useAllianceMembers(allianceId);
      await updateMemberRole(playerId, role);
    },
    onSuccess: () => {
      notification.success({
        message: 'Thành công',
        description: 'Đã cập nhật thông tin thành viên thành công',
      });
      setEditMemberModalVisible(false);
      memberForm.resetFields();
      queryClient.invalidateQueries({ queryKey: ['alliance-members', currentAlliance?.id] });
    },
    onError: (error: Error) => {
      notification.error({
        message: 'Lỗi',
        description: `Không thể cập nhật thành viên: ${error.message}`,
      });
    }
  });

  const handleBulkAction = async (action: string, allianceIds: string[]) => {
    bulkActionMutation.mutate({ action, allianceIds });
  };

  const handleEditMember = (member: any, alliance: Alliance) => {
    setCurrentMember(member);
    setCurrentAlliance(alliance);
    memberForm.setFieldsValue({
      role: member.role,
      playerId: member.player?.id,
    });
    setEditMemberModalVisible(true);
  };

  const handleMemberSubmit = async () => {
    try {
      const values = await memberForm.validateFields();
      if (currentAlliance && currentMember) {
        await editMemberMutation.mutate({
          allianceId: currentAlliance.id,
          playerId: currentMember.player.id,
          role: values.role,
        });
      }
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const getActionText = (action: string): string => {
    switch (action) {
      case 'suspend': return 'tạm đình chỉ';
      case 'activate': return 'kích hoạt';
      case 'disband': return 'giải tán';
      default: return action;
    }
  };

  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
        <div style={{ marginTop: 16 }}>
          <Typography.Text type="secondary">
            Đang tải dữ liệu liên minh...
          </Typography.Text>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <Alert
        message="Lỗi tải dữ liệu"
        description={`Không thể tải danh sách liên minh: ${error?.message || 'Unknown error'}`}
        type="error"
        showIcon
      />
    );
  }

  const alliances: any = alliancesData?.data || [];
  const players = playersData?.players || [];

  return (
    <div>
      <Title level={2} style={{ color: '#8B0000', marginBottom: 24 }}>
        Quản Lý Liên Minh
      </Title>
      <AllianceFormModal />

      <Row gutter={[16, 16]}>
        {/* Metrics Overview */}
        <Col xs={24}>
          <AllianceMetrics metrics={{
            activeAlliances: alliances.filter((a: any) => a.status === 'active').length,
            avgWinRate: 0, // Calculate from actual data
            totalAlliances: alliances.length,
            totalMembers: alliances.reduce((sum: number, a: any) => sum + (a.member_count || 0), 0),
            totalPower: alliances.reduce((sum: number, a: any) => sum + (a.total_power || 0), 0)
          }} />
        </Col>

        {/* Main Content */}
        <Col xs={24}>
          <Card
            variant="borderless"
            styles={{ body: { padding: 0 } }}
          >
            <AllianceTable
              alliances={alliances}
              selectedAlliances={selectedAlliances}
              onSelectionChange={setSelectedAlliances}
              onBulkAction={handleBulkAction}
              onEditMember={handleEditMember}
              loading={isLoading || bulkActionMutation.isPending}
            />
          </Card>
        </Col>
      </Row>

      {/* Edit Member Modal */}
      <Modal
        title="Chỉnh Sửa Thành Viên"
        open={editMemberModalVisible}
        onCancel={() => {
          setEditMemberModalVisible(false);
          memberForm.resetFields();
        }}
        footer={[
          <Button key="cancel" onClick={() => {
            setEditMemberModalVisible(false);
            memberForm.resetFields();
          }}>
            Hủy
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={editMemberMutation.isPending}
            onClick={handleMemberSubmit}
          >
            Cập Nhật
          </Button>,
        ]}
        width={500}
      >
        <Form
          form={memberForm}
          layout="vertical"
        >
          <Form.Item
            name="playerName"
            label="Tên Người Chơi"
          >
            <Input
              value={currentMember?.player?.username}
              disabled
              placeholder="Tên người chơi"
            />
          </Form.Item>

          <Form.Item
            name="role"
            label="Vai Trò"
            rules={[{ required: true, message: 'Vui lòng chọn vai trò' }]}
          >
            <Select placeholder="Chọn vai trò">
              <Option value="leader">Leader</Option>
              <Option value="co_leader">Co-leader</Option>
              <Option value="officer">Officer</Option>
              <Option value="member">Member</Option>
              <Option value="recruit">Recruit</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="playerId"
            label="ID Người Chơi"
            hidden
          >
            <Input disabled />
          </Form.Item>
        </Form>
      </Modal>

      {/* Debug information - remove in production */}
      {process.env.NODE_ENV === 'development' && (
        <div style={{ marginTop: 16, padding: 16, background: '#f5f5f5', borderRadius: 6 }}>
          <Title level={5}>Debug Info</Title>
          <Typography.Text type="secondary">
            Total alliances: {alliances.length} |
            Selected: {selectedAlliances.length} |
            Total players: {players.length} |
            Data source: Supabase
          </Typography.Text>
        </div>
      )}
    </div>
  );
}
