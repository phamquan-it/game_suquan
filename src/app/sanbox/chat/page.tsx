"use client"
// components/ChatUI.tsx
import React, { useState, useEffect, useRef } from 'react';
import {
  Card,
  Input,
  Button,
  Avatar,
  List,
  Space,
  Typography,
  Divider,
  Badge,
  Tag,
  Row,
  Col,
  Form,
  Dropdown,
  MenuProps,
  Tabs,
  Modal,
  message,
  Spin,
} from 'antd';
import {
  SendOutlined,
  UserOutlined,
  CrownOutlined,
  TeamOutlined,
  GlobalOutlined,
  MessageOutlined,
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import { createClient } from '@supabase/supabase-js';

const { TextArea } = Input;
const { Text, Title } = Typography;
const { TabPane } = Tabs;
const { confirm } = Modal;

// Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Types based on your database schema
interface Player {
  id: string;
  username: string;
  level: number;
  power: number;
  alliance: string | null;
  status: string;
  title: string | null;
  specialization: string | null;
  victory_points: number;
  win_rate: number;
}

interface ChatMessage {
  id: string;
  sender_id: string;
  message_type: 'text' | 'image' | 'system' | 'trade' | 'item';
  content: string;
  channel_type: 'world' | 'alliance' | 'group' | 'private';
  channel_id: string | null;
  recipient_id: string | null;
  created_date: string;
  is_edited: boolean;
  is_deleted: boolean;
  reply_to_id: string | null;
  metadata: any;
  sender?: Player;
}

const ChatUI: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [selectedChannel, setSelectedChannel] = useState<'world' | 'alliance' | 'group' | 'private'>('world');
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [editingMessage, setEditingMessage] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch initial data
  useEffect(() => {
    fetchPlayers();
    fetchMessages();
    setupRealtimeSubscription();
  }, [selectedChannel, selectedUser]);

  const fetchPlayers = async () => {
    try {
      const { data, error } = await supabase
        .from('players')
        .select('*')
        .order('level', { ascending: false });

      if (error) throw error;
      setPlayers(data || []);
    } catch (error) {
      console.error('Error fetching players:', error);
      message.error('Lỗi tải danh sách người chơi');
    }
  };

  const fetchMessages = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('chat_messages')
        .select(`
          *
        `)
        .eq('is_deleted', false)
        .order('created_date', { ascending: true });

      // Filter by channel type
      if (selectedChannel === 'world') {
        query = query.eq('channel_type', 'world');
      } else if (selectedChannel === 'alliance') {
        query = query.eq('channel_type', 'alliance');
      } else if (selectedChannel === 'private' && selectedUser) {
        query = query
          .eq('channel_type', 'private')
          .or(`sender_id.eq.${selectedUser},recipient_id.eq.${selectedUser}`);
      }

      const { data, error } = await query;

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
      message.error('Lỗi tải tin nhắn');
    } finally {
      setLoading(false);
    }
  };

  const setupRealtimeSubscription = () => {
    const subscription = supabase
      .channel('chat_messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
        },
        (payload) => {
          // Fetch sender details for new message
          const fetchSender = async () => {
            const { data: sender } = await supabase
              .from('players')
              .select('*')
              .eq('id', payload.new.sender_id)
              .single();

            setMessages(prev => [...prev, { ...payload.new, sender }]);
          };
          fetchSender();
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'chat_messages',
        },
        (payload) => {
          setMessages(prev =>
            prev.map(msg =>
              msg.id === payload.new.id ? { ...msg, ...payload.new } : msg
            )
          );
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    setSending(true);
    try {
      const messageData: any = {
        sender_id: 'current-user-id', // Replace with actual user ID
        message_type: 'text',
        content: inputValue.trim(),
        channel_type: selectedChannel,
      };

      if (selectedChannel === 'private' && selectedUser) {
        messageData.recipient_id = selectedUser;
      } else if (selectedChannel === 'alliance') {
        // Add alliance channel ID if needed
        messageData.channel_id = 'alliance-channel-id';
      }

      const { error } = await supabase
        .from('chat_messages')
        .insert([messageData]);

      if (error) throw error;

      setInputValue('');
      setEditingMessage(null);
    } catch (error) {
      console.error('Error sending message:', error);
      message.error('Lỗi gửi tin nhắn');
    } finally {
      setSending(false);
    }
  };

  const handleEditMessage = async (messageId: string, newContent: string) => {
    try {
      const { error } = await supabase
        .from('chat_messages')
        .update({
          content: newContent,
          is_edited: true,
          updated_date: new Date().toISOString(),
        })
        .eq('id', messageId);

      if (error) throw error;

      setEditingMessage(null);
      message.success('Đã sửa tin nhắn');
    } catch (error) {
      console.error('Error editing message:', error);
      message.error('Lỗi sửa tin nhắn');
    }
  };

  const handleDeleteMessage = (messageId: string) => {
    confirm({
      title: 'Xóa tin nhắn?',
      icon: <ExclamationCircleOutlined />,
      content: 'Tin nhắn sẽ bị xóa vĩnh viễn.',
      okText: 'Xóa',
      cancelText: 'Hủy',
      okType: 'danger',
      onOk: async () => {
        try {
          const { error } = await supabase
            .from('chat_messages')
            .update({
              is_deleted: true,
              deleted_date: new Date().toISOString(),
            })
            .eq('id', messageId);

          if (error) throw error;

          message.success('Đã xóa tin nhắn');
        } catch (error) {
          console.error('Error deleting message:', error);
          message.error('Lỗi xóa tin nhắn');
        }
      },
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getPlayerTitle = (player: Player) => {
       return 'Binh Sĩ';
  };

  const getTitleColor = (title: string) => {
    switch (title) {
      case 'Đại Đế': return '#D4AF37'; // Gold
      case 'Chúa': return '#8B0000'; // Red
      case 'Tướng': return '#003366'; // Navy
      case 'Hiệu Úy': return '#2E8B57'; // Green
      default: return '#8B4513'; // Brown
    }
  };

  const moreItems = (message: ChatMessage): MenuProps['items'] => [
    {
      key: 'edit',
      label: 'Sửa tin nhắn',
      icon: <EditOutlined />,
      onClick: () => setEditingMessage(message.id),
    },
    {
      key: 'delete',
      label: 'Xóa tin nhắn',
      icon: <DeleteOutlined />,
      danger: true,
      onClick: () => handleDeleteMessage(message.id),
    },
  ];

  const renderMessageContent = (message: ChatMessage) => {
    if (message.is_deleted) {
      return (
        <Text type="secondary" italic>
          Tin nhắn đã bị xóa
        </Text>
      );
    }

    if (editingMessage === message.id) {
      return (
        <Input
          defaultValue={message.content}
          onPressEnter={(e) => {
            handleEditMessage(message.id, e.currentTarget.value);
          }}
          onBlur={(e) => handleEditMessage(message.id, e.target.value)}
          autoFocus
        />
      );
    }

    return (
      <Space direction="vertical" size={0}>
        <Text>{message.content}</Text>
        {message.is_edited && (
          <Text type="secondary" style={{ fontSize: '12px' }}>
            (đã chỉnh sửa)
          </Text>
        )}
      </Space>
    );
  };

  return (
    <Card 
      title={
        <Tabs
          activeKey={selectedChannel}
          onChange={(key) => setSelectedChannel(key as any)}
          style={{ marginBottom: -16 }}
        >
          <TabPane 
            tab={
              <Space>
                <GlobalOutlined />
                Thế Giới
              </Space>
            } 
            key="world" 
          />
          <TabPane 
            tab={
              <Space>
                <TeamOutlined />
                Liên Minh
              </Space>
            } 
            key="alliance" 
          />
          <TabPane 
            tab={
              <Space>
                <MessageOutlined />
                Tin Nhắn
              </Space>
            } 
            key="private" 
          />
        </Tabs>
      }
      style={{ 
        height: '600px',
        background: 'linear-gradient(135deg, #F5F5DC 0%, #F1E8D6 100%)',
      }}
      bodyStyle={{ padding: '16px', height: '100%' }}
    >
      <Row gutter={16} style={{ height: '100%' }}>
        {/* Players List */}
        <Col span={6}>
          <Card 
            size="small" 
            title="Danh Tướng"
            style={{ height: '100%', border: '2px solid #D4AF37' }}
          >
            <List
              size="small"
              dataSource={players}
              loading={loading}
              renderItem={(player) => (
                <List.Item
                  style={{ 
                    cursor: 'pointer',
                    background: selectedUser === player.id ? '#F1E8D6' : 'transparent',
                    borderRadius: '6px',
                    padding: '8px',
                    margin: '4px 0',
                    border: selectedUser === player.id ? '1px solid #D4AF37' : 'none'
                  }}
                  onClick={() => {
                    setSelectedUser(player.id);
                    setSelectedChannel('private');
                  }}
                >
                  <List.Item.Meta
                    avatar={
                      <Badge 
                        dot 
                        color={player.status === 'online' ? '#2E8B57' : '#DC143C'} 
                        offset={[-2, 24]}
                      >
                        <Avatar 
                          style={{ 
                            background: getTitleColor(getPlayerTitle(player)),
                            border: '2px solid #CD7F32'
                          }}
                          icon={<UserOutlined />}
                        />
                      </Badge>
                    }
                    title={
                      <Space>
                        <Text strong style={{ fontSize: '12px' }}>
                          {player.username}
                        </Text>
                        {getPlayerTitle(player) === 'Đại Đế' && (
                          <CrownOutlined style={{ color: '#D4AF37' }} />
                        )}
                      </Space>
                    }
                    description={
                      <Space direction="vertical" size={0}>
                        <Tag 
                          color={getTitleColor(getPlayerTitle(player))}
                          style={{ fontSize: '10px', margin: 0 }}
                        >
                          {getPlayerTitle(player)}
                        </Tag>
                        <Text type="secondary" style={{ fontSize: '10px' }}>
                          Lv.{player.level} • {player.victory_points} VP
                        </Text>
                      </Space>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>

        {/* Chat Area */}
        <Col span={18}>
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            {/* Messages */}
            <Card 
              size="small"
              style={{ 
                flex: 1, 
                marginBottom: '16px',
                border: '2px solid #CD7F32',
                background: '#FFFFFF',
                overflow: 'auto'
              }}
              bodyStyle={{ padding: '16px', height: '100%' }}
            >
              {loading ? (
                <div style={{ textAlign: 'center', padding: '20px' }}>
                  <Spin size="large" />
                </div>
              ) : (
                <List
                  dataSource={messages}
                  renderItem={(message) => (
                    <List.Item style={{ border: 'none', padding: '8px 0' }}>
                      <Space align="start" style={{ width: '100%' }}>
                        <Avatar 
                          style={{ 
                            background: getTitleColor(getPlayerTitle(message.sender!)),
                            border: '2px solid #CD7F32'
                          }}
                          icon={<UserOutlined />}
                        />
                        <div style={{ flex: 1 }}>
                          <Space>
                            <Text strong style={{ color: '#8B0000' }}>
                              {message.sender?.username}
                            </Text>
                            <Tag 
                              color={getTitleColor(getPlayerTitle(message.sender!))}
                              style={{ 
                                fontSize: '10px', 
                                border: 'none',
                                color: '#FFFFFF',
                                margin: 0
                              }}
                            >
                              {getPlayerTitle(message.sender!)}
                            </Tag>
                            <Text type="secondary" style={{ fontSize: '12px' }}>
                              {new Date(message.created_date).toLocaleTimeString('vi-VN')}
                            </Text>
                          </Space>
                          <div style={{ 
                            marginTop: '4px',
                            padding: '8px 12px',
                            background: message.sender_id === 'current-user-id' ? '#F1E8D6' : '#FFFFFF',
                            border: `1px solid ${message.sender_id === 'current-user-id' ? '#D4AF37' : '#CD7F32'}`,
                            borderRadius: '8px',
                          }}>
                            {renderMessageContent(message)}
                          </div>
                        </div>
                        {message.sender_id === 'current-user-id' && !message.is_deleted && (
                          <Dropdown menu={{ items: moreItems(message) }} trigger={['click']}>
                            <Button 
                              type="text" 
                              icon={<EditOutlined />} 
                              size="small"
                            />
                          </Dropdown>
                        )}
                      </Space>
                    </List.Item>
                  )}
                />
              )}
              <div ref={messagesEndRef} />
            </Card>

            {/* Input Area */}
            <Space.Compact style={{ width: '100%' }}>
              <TextArea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={
                  selectedChannel === 'world' 
                    ? 'Nhắn tin với toàn thế giới...' 
                    : selectedChannel === 'alliance'
                    ? 'Nhắn tin với liên minh...'
                    : 'Nhắn tin riêng...'
                }
                autoSize={{ minRows: 1, maxRows: 4 }}
                style={{ border: '2px solid #CD7F32' }}
              />
              <Button
                type="primary"
                icon={<SendOutlined />}
                onClick={handleSendMessage}
                loading={sending}
                style={{ 
                  background: '#8B0000',
                  border: '2px solid #D4AF37',
                  height: 'auto'
                }}
              >
                Gửi
              </Button>
            </Space.Compact>
          </div>
        </Col>
      </Row>
    </Card>
  );
};

export default ChatUI;
