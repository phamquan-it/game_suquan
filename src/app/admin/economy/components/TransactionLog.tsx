'use client';

import React, { useState } from 'react';
import { 
  Table, 
  Tag, 
  Space, 
  Button, 
  Input, 
  DatePicker, 
  Select, 
  Card,
  Typography,
  Tooltip,
  Modal,
  message,
  Statistic,
  Col,
  Row
} from 'antd';
import { 
  SearchOutlined, 
  FilterOutlined,
  ExportOutlined,
  EyeOutlined,
  RollbackOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
import { Transaction } from '@/lib/types/economy.types';
import type { ColumnsType } from 'antd/es/table';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;
const { Search } = Input;

interface TransactionLogProps {
  transactions: Transaction[];
}

export default function TransactionLog({ transactions }: TransactionLogProps) {
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>(transactions);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);

  const getTransactionTypeColor = (type: Transaction['type']) => {
    switch (type) {
      case 'purchase': return 'green';
      case 'refund': return 'orange';
      case 'reward': return 'blue';
      case 'transfer': return 'purple';
      case 'exchange': return 'cyan';
      default: return 'default';
    }
  };

  const getTransactionTypeText = (type: Transaction['type']) => {
    switch (type) {
      case 'purchase': return 'Mua hàng';
      case 'refund': return 'Hoàn tiền';
      case 'reward': return 'Thưởng';
      case 'transfer': return 'Chuyển khoản';
      case 'exchange': return 'Quy đổi';
      default: return type;
    }
  };

  const getStatusColor = (status: Transaction['status']) => {
    switch (status) {
      case 'completed': return 'green';
      case 'pending': return 'orange';
      case 'failed': return 'red';
      case 'cancelled': return 'default';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: Transaction['status']) => {
    switch (status) {
      case 'completed': return <CheckCircleOutlined />;
      case 'pending': return <ExclamationCircleOutlined />;
      case 'failed': return <CloseCircleOutlined />;
      case 'cancelled': return <CloseCircleOutlined />;
      default: return null;
    }
  };

  const handleViewDetails = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsDetailModalVisible(true);
  };

  const handleRefund = (transaction: Transaction) => {
    Modal.confirm({
      title: 'Xác nhận hoàn tiền',
      content: `Bạn có chắc chắn muốn hoàn tiền cho giao dịch #${transaction.id}?`,
      onOk: () => {
        message.success('Đã gửi yêu cầu hoàn tiền');
      }
    });
  };

  const columns: ColumnsType<Transaction> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
      render: (id: string) => <Text type="secondary">#{id}</Text>,
    },
    {
      title: 'Thời gian',
      dataIndex: 'timestamp',
      key: 'timestamp',
      width: 150,
      sorter: (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
      render: (timestamp: string) => (
        <Text style={{ fontSize: 12 }}>
          {new Date(timestamp).toLocaleString('vi-VN')}
        </Text>
      ),
    },
    {
      title: 'Người chơi',
      dataIndex: 'playerName',
      key: 'playerName',
      width: 150,
      render: (name: string, record: Transaction) => (
        <div>
          <div style={{ fontWeight: 600 }}>{name}</div>
          <div style={{ fontSize: 12, color: '#666' }}>ID: {record.playerId}</div>
        </div>
      ),
    },
    {
      title: 'Loại giao dịch',
      dataIndex: 'type',
      key: 'type',
      width: 120,
      filters: [
        { text: 'Mua hàng', value: 'purchase' },
        { text: 'Hoàn tiền', value: 'refund' },
        { text: 'Thưởng', value: 'reward' },
      ],
      onFilter: (value, record) => record.type === value,
      render: (type: Transaction['type']) => (
        <Tag color={getTransactionTypeColor(type)}>
          {getTransactionTypeText(type)}
        </Tag>
      ),
    },
    {
      title: 'Số tiền',
      dataIndex: 'amount',
      key: 'amount',
      width: 120,
      sorter: (a, b) => a.amount - b.amount,
      render: (amount: number, record: Transaction) => (
        <Text 
          strong 
          style={{ 
            color: amount >= 0 ? '#2E8B57' : '#DC143C'
          }}
        >
          {amount >= 0 ? '+' : ''}{amount.toLocaleString()} {record.currency}
        </Text>
      ),
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
      width: 200,
      render: (description: string, record: Transaction) => (
        <div>
          <div>{description}</div>
          {record.itemName && (
            <div style={{ fontSize: 12, color: '#666' }}>{record.itemName}</div>
          )}
        </div>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      filters: [
        { text: 'Thành công', value: 'completed' },
        { text: 'Đang chờ', value: 'pending' },
        { text: 'Thất bại', value: 'failed' },
        { text: 'Đã hủy', value: 'cancelled' },
      ],
      onFilter: (value, record) => record.status === value,
      render: (status: Transaction['status']) => (
        <Tag 
          color={getStatusColor(status)} 
          icon={getStatusIcon(status)}
        >
          {status === 'completed' ? 'Thành công' :
           status === 'pending' ? 'Đang chờ' :
           status === 'failed' ? 'Thất bại' : 'Đã hủy'}
        </Tag>
      ),
    },
    {
      title: 'Hành động',
      key: 'actions',
      width: 120,
      render: (_, record) => (
        <Space>
          <Tooltip title="Xem chi tiết">
            <Button 
              type="text" 
              icon={<EyeOutlined />} 
              size="small"
              onClick={() => handleViewDetails(record)}
            />
          </Tooltip>
          {record.type === 'purchase' && record.status === 'completed' && (
            <Tooltip title="Hoàn tiền">
              <Button 
                type="text" 
                icon={<RollbackOutlined />} 
                size="small"
                danger
                onClick={() => handleRefund(record)}
              />
            </Tooltip>
          )}
        </Space>
      ),
    },
  ];

  const totalRevenue = transactions
    .filter(t => t.status === 'completed' && t.amount > 0)
    .reduce((sum, t) => sum + t.amount, 0);

  const successfulTransactions = transactions.filter(t => t.status === 'completed').length;
  const failedTransactions = transactions.filter(t => t.status === 'failed').length;

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      {/* Summary Stats */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={8}>
          <Card size="small">
            <Statistic
              title="Tổng doanh thu"
              value={totalRevenue}
              precision={0}
              prefix="₫"
              valueStyle={{ color: '#2E8B57' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card size="small">
            <Statistic
              title="Giao dịch thành công"
              value={successfulTransactions}
              valueStyle={{ color: '#2E8B57' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card size="small">
            <Statistic
              title="Giao dịch thất bại"
              value={failedTransactions}
              valueStyle={{ color: '#DC143C' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Filters */}
      <Card size="small" variant="borderless">
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={8} md={6}>
            <Search
              placeholder="Tìm theo người chơi..."
              allowClear
              style={{ width: '100%' }}
            />
          </Col>
          <Col xs={24} sm={8} md={6}>
            <RangePicker 
              style={{ width: '100%' }}
              placeholder={['Từ ngày', 'Đến ngày']}
            />
          </Col>
          <Col xs={24} sm={8} md={4}>
            <Select
              style={{ width: '100%' }}
              placeholder="Loại giao dịch"
              allowClear
            >
              <Option value="purchase">Mua hàng</Option>
              <Option value="refund">Hoàn tiền</Option>
              <Option value="reward">Thưởng</Option>
            </Select>
          </Col>
          <Col xs={24} sm={8} md={4}>
            <Select
              style={{ width: '100%' }}
              placeholder="Trạng thái"
              allowClear
            >
              <Option value="completed">Thành công</Option>
              <Option value="pending">Đang chờ</Option>
              <Option value="failed">Thất bại</Option>
            </Select>
          </Col>
          <Col xs={24} sm={24} md={4}>
            <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
              <Button icon={<FilterOutlined />}>
                Lọc
              </Button>
              <Button icon={<ExportOutlined />}>
                Xuất Excel
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Transactions Table */}
      <Card variant="borderless">
        <Table
          columns={columns}
          dataSource={filteredTransactions}
          rowKey="id"
          scroll={{ x: 1000 }}
          pagination={{
            total: filteredTransactions.length,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => 
              `${range[0]}-${range[1]} của ${total} giao dịch`,
          }}
          size="middle"
        />
      </Card>

      {/* Transaction Detail Modal */}
      <Modal
        title={`Chi Tiết Giao Dịch #${selectedTransaction?.id}`}
        open={isDetailModalVisible}
        onCancel={() => setIsDetailModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setIsDetailModalVisible(false)}>
            Đóng
          </Button>,
          selectedTransaction?.type === 'purchase' && selectedTransaction.status === 'completed' && (
            <Button 
              key="refund" 
              type="primary" 
              danger 
              icon={<RollbackOutlined />}
              onClick={() => {
                handleRefund(selectedTransaction);
                setIsDetailModalVisible(false);
              }}
            >
              Hoàn Tiền
            </Button>
          )
        ]}
        width={600}
      >
        {selectedTransaction && (
          <Space direction="vertical" style={{ width: '100%' }} size="middle">
            <Row gutter={16}>
              <Col span={12}>
                <Text strong>Người chơi:</Text>
                <br />
                <Text>{selectedTransaction.playerName} (ID: {selectedTransaction.playerId})</Text>
              </Col>
              <Col span={12}>
                <Text strong>Thời gian:</Text>
                <br />
                <Text>{new Date(selectedTransaction.timestamp).toLocaleString('vi-VN')}</Text>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Text strong>Loại giao dịch:</Text>
                <br />
                <Tag color={getTransactionTypeColor(selectedTransaction.type)}>
                  {getTransactionTypeText(selectedTransaction.type)}
                </Tag>
              </Col>
              <Col span={12}>
                <Text strong>Trạng thái:</Text>
                <br />
                <Tag 
                  color={getStatusColor(selectedTransaction.status)} 
                  icon={getStatusIcon(selectedTransaction.status)}
                >
                  {selectedTransaction.status === 'completed' ? 'Thành công' :
                   selectedTransaction.status === 'pending' ? 'Đang chờ' :
                   selectedTransaction.status === 'failed' ? 'Thất bại' : 'Đã hủy'}
                </Tag>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Text strong>Số tiền:</Text>
                <br />
                <Text 
                  strong 
                  style={{ 
                    color: selectedTransaction.amount >= 0 ? '#2E8B57' : '#DC143C',
                    fontSize: 16
                  }}
                >
                  {selectedTransaction.amount >= 0 ? '+' : ''}
                  {selectedTransaction.amount.toLocaleString()} {selectedTransaction.currency}
                </Text>
              </Col>
              <Col span={12}>
                <Text strong>Máy chủ:</Text>
                <br />
                <Text>{selectedTransaction.server}</Text>
              </Col>
            </Row>

            <div>
              <Text strong>Mô tả:</Text>
              <br />
              <Text>{selectedTransaction.description}</Text>
            </div>

            {selectedTransaction.itemName && (
              <div>
                <Text strong>Vật phẩm:</Text>
                <br />
                <Text>{selectedTransaction.itemName} (ID: {selectedTransaction.itemId})</Text>
              </div>
            )}

            {selectedTransaction.reason && (
              <div>
                <Text strong>Lý do:</Text>
                <br />
                <Text type="secondary">{selectedTransaction.reason}</Text>
              </div>
            )}

            <div>
              <Text strong>Địa chỉ IP:</Text>
              <br />
              <Text type="secondary">{selectedTransaction.ipAddress}</Text>
            </div>
          </Space>
        )}
      </Modal>
    </Space>
  );
}
