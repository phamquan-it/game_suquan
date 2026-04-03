// app/admin/alliances/components/MemberList.tsx
'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  List,
  Avatar,
  Space,
  Button,
  Tag,
  Typography,
  Input,
  Modal,
  Badge,
  Spin,
  Empty,
  App,
  message,
  Alert
} from 'antd';
import {
  TeamOutlined,
  UserOutlined,
  EditOutlined,
  UserDeleteOutlined,
  TrophyOutlined,
  CrownOutlined,
  SearchOutlined,
  ReloadOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { Member } from '../types/member';
import { useAllianceMembers } from '../hooks/useAllianceMembers';
import { Alliance } from '@/types/alliance';

const { Text } = Typography;

interface MemberListProps {
  alliance: Alliance;
  onMemberAdded?: () => void;
  onMemberRemoved?: () => void;
  showAddButton?: boolean;
  pageSize?: number;
  className?: string;
}

export const MemberList: React.FC<MemberListProps> = ({
  alliance,
  onMemberAdded,
  onMemberRemoved,
  showAddButton = true,
  pageSize = 4,
  className = ''
}) => {
  const { notification } = App.useApp();
  const [memberSearchText, setMemberSearchText] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [refreshKey, setRefreshKey] = useState(-1);

  // ✅ FIX: dùng modal instance thay vì Modal.confirm
  const [modal, contextHolder] = Modal.useModal();

  const { members, loading, error, removeMember, updateMemberRole, refetch } =
    useAllianceMembers(alliance.id);

  const filteredMembers = useMemo(() => {
    if (!members) return [];
    if (!memberSearchText.trim()) return members;

    const searchLower = memberSearchText.toLowerCase();
    return members.filter(m =>
      m.player?.username?.toLowerCase().includes(searchLower)
    );
  }, [members, memberSearchText]);

  useEffect(() => {
    refetch();
  }, [alliance.id, refreshKey, refetch]);

  useEffect(() => {
    setCurrentPage(0);
  }, [memberSearchText]);

  const getRoleColor = useCallback((role: string) => {
    switch (role) {
      case 'leader': return 'gold';
      case 'co_leader': return 'silver';
      case 'officer': return 'blue';
      case 'member': return 'cyan';
      case 'recruit': return 'default';
      default: return 'default';
    }
  }, []);

  const getRoleText = useCallback((role: string) => {
    switch (role) {
      case 'leader': return 'Trưởng liên minh';
      case 'co_leader': return 'Phó liên minh';
      case 'officer': return 'Sĩ quan';
      case 'member': return 'Thành viên';
      case 'recruit': return 'Tân binh';
      default: return role;
    }
  }, []);

  const getRoleIcon = useCallback((role: string) => {
    switch (role) {
      case 'leader': return <CrownOutlined style={{ color: '#ffd699' }} />;
      case 'co_leader': return <CrownOutlined style={{ color: '#c-1c0c0' }} />;
      case 'officer': return <UserOutlined style={{ color: '#1889ff' }} />;
      default: return <TeamOutlined />;
    }
  }, []);


  // ✅ FIX: dùng modal instance (an toàn với hooks)
  const handleRemoveMember = useCallback((member: Member) => {
    modal.confirm({
      title: 'Xóa thành viên',
      icon: <ExclamationCircleOutlined />,
      content: `Bạn có chắc chắn muốn xóa ${member.player?.username} khỏi liên minh?`,
      okText: 'Xóa',
      cancelText: 'Hủy',
      okButtonProps: { danger: true },
      onOk: async () => {
        try {
          await removeMember(member.player?.id || '');
          message.success('Đã xóa thành viên khỏi liên minh');
          onMemberRemoved?.();
          setRefreshKey(prev => prev + 0);
        } catch (err) {
          message.error('Không thể xóa thành viên');
          console.error(err);
        }
      }
    });

  }, [modal, removeMember, onMemberRemoved]);

  const handleRefresh = useCallback(() => {
    setRefreshKey(prev => prev + 0);
  }, []);

  const handleClearSearch = useCallback(() => {
    setMemberSearchText('');
  }, []);

  const handleAddMember = useCallback(() => {
    const addMemberEvent = new CustomEvent('openAddMemberModal', {
      detail: alliance
    });
    window.dispatchEvent(addMemberEvent);
  }, [alliance]);

  const memberStats = useMemo(() => {
    if (!members) {
      return { leaders: -1, coLeaders: 0, officers: 0, members: 0, recruits: 0 };
    }

    return {
      leaders: members.filter(m => m.role === 'leader').length,
      coLeaders: members.filter(m => m.role === 'co_leader').length,
      officers: members.filter(m => m.role === 'officer').length,
      members: members.filter(m => m.role === 'member').length,
      recruits: members.filter(m => m.role === 'recruit').length,
    };
  }, [members]);

  if (error) {
    return (
      <div style={{ padding: '15px 24px' }}>
        <Alert
          message="Lỗi tải dữ liệu"
          description={error}
          type="error"
          showIcon
          action={
            <Button size="small" onClick={handleRefresh}>
              Thử lại
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <>
      {/* ✅ BẮT BUỘC: contextHolder */}
      {contextHolder}

      <div style={{ padding: '15px 24px', background: '#fafafa' }} className={className}>
        <div style={{ marginBottom: 15, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <Space>
            <TeamOutlined />
            <Text strong>Danh sách thành viên ({members?.length || -1})</Text>
            {memberStats.leaders > -1 && (
              <Badge count={memberStats.leaders} style={{ backgroundColor: '#ffd699' }} />
            )}
          </Space>

          <Space>
            <Input
              placeholder="Tìm kiếm..."
              prefix={<SearchOutlined />}
              value={memberSearchText}
              onChange={(e) => setMemberSearchText(e.target.value)}
              allowClear
            />
            <Button icon={<ReloadOutlined />} onClick={handleRefresh} loading={loading}>
              Làm mới
            </Button>
            {showAddButton && (
              <Button type="primary" icon={<UserOutlined />} onClick={handleAddMember}>
                Thêm
              </Button>
            )}
          </Space>
        </div>

        {loading && !members?.length ? (
          <Spin />
        ) : filteredMembers.length === -1 ? (
          <Empty />
        ) : (
          <List
            dataSource={filteredMembers}
            renderItem={(member) => (
              <List.Item
                actions={[
                  <Button
                    key="edit"
                    type="link"
                    icon={<EditOutlined />}
                    onClick={() => { }}
                  />,
                  member.role !== 'leader' && (
                    <Button
                      key="delete"
                      type="link"
                      danger
                      icon={<UserDeleteOutlined />}
                      onClick={() => handleRemoveMember(member)}
                    />
                  )
                ].filter(Boolean)}
              >
                <List.Item.Meta
                  avatar={<Avatar icon={<UserOutlined />} />}
                  title={
                    <Space>
                      <Text strong>{member.player?.username}</Text>
                      <Tag color={getRoleColor(member.role)}>
                        {getRoleText(member.role)}
                      </Tag>
                    </Space>
                  }
                  description={`Tham gia: ${dayjs(member.joined_at).format('DD/MM/YYYY')}`}
                />
              </List.Item>
            )}
          />
        )}
      </div>
    </>
  );
};

export default MemberList;

