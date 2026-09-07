import { FC, useState } from "react";
import {
  Button, Tag, Space, Typography, Badge,
  message, Modal, Table, Input
} from 'antd';
import {
  TableOutlined,
  SearchOutlined,
  CheckOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import {
  addTable,
  setTablePosition,
  snapshotForUndo,
  selectSelectedTables
} from "../../../../lib/redux/diagramSlice";
import { getBorderColor } from "../utils";
import { TableInfo } from "../types/diagram";

const { Text } = Typography;

interface TableSelectorProps {
  tables: TableInfo[];
  loadingTables: boolean;
}

// ===== Table Selector Modal =====
export const TableSelectorModal: FC<TableSelectorProps> = ({
  tables,
  loadingTables,
}) => {
  const dispatch = useAppDispatch();
  const [showTableSelector, setShowTableSelector] = useState(false);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [searchText, setSearchText] = useState('');
  const selectedTables = useAppSelector(selectSelectedTables);
  // Filter tables cho selector
  const filteredTables = tables.filter((t) =>
    !selectedTables.includes(t.table_name) &&
    t.table_name.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns = [
    {
      title: 'Tên bảng',
      dataIndex: 'table_name',
      key: 'table_name',
      render: (text: string) => (
        <Space>
          <TableOutlined style={{ color: getBorderColor(text) }} />
          <Text strong>{text}</Text>
        </Space>
      ),
    },
    {
      title: 'Schema',
      dataIndex: 'schema_name',
      key: 'schema_name',
      render: (text: string) => <Tag color="default">{text}</Tag>,
    },
    {
      title: 'Trạng thái',
      key: 'status',
      render: (_: any, record: any) => (
        <Tag color={selectedTables.includes(record.table_name) ? 'green' : 'blue'}>
          {selectedTables.includes(record.table_name) ? 'Đã chọn' : 'Có sẵn'}
        </Tag>
      ),
    },
  ];

  // Thêm nhiều bảng cùng lúc
  const handleAddMultipleTables = (tableNames: string[]) => {
    let addedCount = 0;

    // Ghi điểm trước khi thêm — cả loạt là 1 bước undo
    dispatch(snapshotForUndo());

    tableNames.forEach((name, index) => {
      if (!selectedTables.includes(name)) {
        dispatch(addTable(name));
        // Set vị trí mặc định cho bảng
        const posIndex = selectedTables.length + addedCount;
        dispatch(setTablePosition({
          tableName: name,
          position: {
            x: 100 + posIndex * 200,
            y: 100 + posIndex * 50
          }
        }));
        addedCount++;
      }
    });

    setShowTableSelector(false);
    setSelectedRows([]);
    if (addedCount > 0) {
      message.success(`Đã thêm ${addedCount} bảng`);
    }
  };

  // Reset khi đóng modal
  const handleClose = () => {
    setShowTableSelector(false);
    setSelectedRows([]);
    setSearchText('');
  };

  return (
    <>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={() => {
          setSearchText('');
          setShowTableSelector(true);
        }}
        disabled={loadingTables}
        style={{ width: 180 }}
      >
        Chọn bảng...
      </Button>

      <Modal
        title={
          <Space>
            <TableOutlined />
            <Text strong>Chọn bảng</Text>
            <Badge count={selectedRows.length} style={{ backgroundColor: '#8B0000' }} />
          </Space>
        }
        width="90%"
        style={{
          maxWidth: '900px',
          top: 20,
        }}
        styles={{
          body: {
            maxHeight: 'calc(100vh - 200px)',
            overflow: 'auto',
            padding: '16px 24px',
          }
        }}
        open={showTableSelector}
        onCancel={handleClose}
        footer={
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
            <Space>
              <Button
                onClick={() => {
                  const allTables = tables.map(t => t.table_name);
                  setSelectedRows(allTables.filter(name => !selectedTables.includes(name)));
                }}
              >
                Chọn tất cả
              </Button>
              <Button onClick={() => setSelectedRows([])}>Bỏ chọn</Button>
            </Space>
            <Space>
              <Button onClick={handleClose}>Hủy</Button>
              <Button
                type="primary"
                onClick={() => {
                  handleAddMultipleTables(selectedRows);
                  setSelectedRows([]);
                }}
                disabled={selectedRows.length === 0}
                icon={<CheckOutlined />}
              >
                Thêm {selectedRows.length} bảng
              </Button>
            </Space>
          </div>
        }
      >
        <div style={{ marginBottom: 16 }}>
          <Input
            placeholder="Tìm kiếm bảng..."
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            allowClear
            size="large"
          />
          {searchText && (
            <div style={{ marginTop: 8, fontSize: 12, color: '#999' }}>
              Tìm thấy {filteredTables.length} bảng
            </div>
          )}
        </div>
        <Table
          rowSelection={{
            type: 'checkbox',
            selectedRowKeys: selectedRows,
            onChange: (selectedRowKeys) => {
              setSelectedRows(selectedRowKeys as string[]);
            },
            getCheckboxProps: (record) => ({
              disabled: selectedTables.includes(record.table_name),
            }),
          }}
          columns={columns}
          dataSource={filteredTables}
          rowKey="table_name"
          pagination={{ pageSize: 8 }}
          size="middle"
          scroll={{ y: 350 }}
        />
      </Modal>
    </>
  );
};
