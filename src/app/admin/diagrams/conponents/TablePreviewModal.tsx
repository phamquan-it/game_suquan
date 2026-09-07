"use client";

import { useEffect, useMemo, useState } from 'react';
import { Modal, Table, Spin, Typography, message, Tag, Button, Space, Select, Input } from 'antd';
import { CopyOutlined, SearchOutlined } from '@ant-design/icons';
import Editor, { loader } from '@monaco-editor/react';
import { supabase } from '@/utils/supabase/client';
import { TableMenuAction } from './TableRightClickMenu';

const { Text } = Typography;

// Cấu hình Monaco (giống trang admin/func) — tải VS code qua CDN đã pin
loader.config({
  paths: {
    vs: 'https://cdn.jsdelivr.net/npm/monaco-editor@0.45.0/min/vs',
  },
});

interface TablePreviewModalProps {
  open: boolean;
  tableName: string | null;
  schemaName?: string | null;
  /** Tên cột schema của bảng (nếu biết) để làm nguồn chọn cột hiển thị */
  tableColumns?: string[];
  mode: TableMenuAction | null; // 'data' hoặc 'ddl'
  onClose: () => void;
}

const DATA_LIMIT = 200;

/**
 * Modal xem nhanh 1 bảng khi bấm chuột phải:
 *  - mode 'data': fetch rows qua supabase.from → AntD Table động (chỉ đọc)
 *  - mode 'ddl' : load DDL vào Monaco Editor SQL — cho phép SỬA + Sao chép
 */
export function TablePreviewModal({
  open,
  tableName,
  schemaName,
  tableColumns = [],
  mode,
  onClose,
}: TablePreviewModalProps) {
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState<Record<string, any>[]>([]);
  const [ddl, setDdl] = useState(''); // nội dung SQL (gốc & sau khi sửa)
  /** Các cột được chọn để hiển thị; [] = hiển thị tất cả */
  const [selectedCols, setSelectedCols] = useState<string[]>([]);
  /** Từ khoá tìm kiếm (lọc client-side trên dữ liệu đã tải) */
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    if (!open || !tableName || !mode) return;
    setLoading(true);
    setRows([]);
    setDdl('');

    (async () => {
      try {
        if (mode === 'data') {
          // Xây nguồn truy vấn, hỗ trợ schema nếu khác 'public'
          const builder =
            schemaName && schemaName !== 'public'
              ? supabase.schema(schemaName).from(tableName)
              : supabase.from(tableName);

          const { data, error } = await builder.select('*').limit(DATA_LIMIT);

          if (error) throw error;
          setRows(data ?? []);
        } else {
          // mode 'ddl'
          const { data, error } = await supabase.rpc('generate_table_ddl', {
            target_table_name: tableName,
          });
          if (error) throw error;
          setDdl(typeof data === 'string' ? data : '');
        }
      } catch (err: any) {
        message.error(err?.message || `Lỗi khi đọc ${tableName}`);
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [open, tableName, schemaName, mode]);

  // Toàn bộ cột khả dụng: ưu tiên thứ tự xuất hiện trong dữ liệu, bổ sung cột schema
  const availableCols = useMemo(() => {
    const rowKeys = rows.length ? Object.keys(rows[0]) : [];
    if (rowKeys.length === 0) return tableColumns;
    // bổ sung các cột schema chưa có trong data
    const extras = tableColumns.filter((c) => !rowKeys.includes(c));
    return [...rowKeys, ...extras];
  }, [rows, tableColumns]);

  // Khi đổi bảng/mở mới → chọn lại tất cả cột
  useEffect(() => {
    setSelectedCols([]);
  }, [tableName, mode]);

  // Dữ liệu sau tìm kiếm (lọc theo toàn bộ giá trị của row)
  const filteredRows = useMemo(() => {
    const term = searchText.trim().toLowerCase();
    if (!term) return rows;
    return rows.filter((row) =>
      Object.values(row).some((v) => {
        if (v === null || v === undefined) return false;
        if (typeof v === 'object') {
          try {
            return JSON.stringify(v).toLowerCase().includes(term);
          } catch {
            return false;
          }
        }
        return String(v).toLowerCase().includes(term);
      })
    );
  }, [rows, searchText]);

  // Cột hiển thị cuối: chỉ những cột được chọn; nếu chọn rỗng → tất cả
  const visibleCols = selectedCols.length > 0 ? selectedCols : availableCols;

  // Định nghĩa cột AntD Table từ tập hiển thị
  const columns = visibleCols.map((key) => ({
    title: key,
    dataIndex: key,
    key,
    ellipsis: true,
    render: (v: any) => {
      if (v === null) return <Text type="secondary">null</Text>;
      if (typeof v === 'object') {
        try {
          return (
            <Text code style={{ whiteSpace: 'pre-wrap' }}>
              {JSON.stringify(v)}
            </Text>
          );
        } catch {
          return String(v);
        }
      }
      return String(v);
    },
  })) as any;

  const handleCopyDDL = async () => {
    try {
      await navigator.clipboard.writeText(ddl);
      message.success('Đã sao chép DDL vào clipboard');
    } catch (err) {
      message.error('Không thể sao chép');
    }
  };

  const title = tableName ? (
    <span style={{ fontFamily: 'monospace' }}>{tableName}</span>
  ) : (
    '—'
  );

  return (
    <Modal
      title={
        <>
          {mode === 'data' ? 'Xem data · ' : 'Xem DDL · '}
          {title}
          {schemaName && <Tag style={{ marginLeft: 8 }}>{schemaName}</Tag>}
        </>
      }
      open={open}
      onCancel={onClose}
      footer={
        mode === 'data' && rows.length >= DATA_LIMIT ? (
          <Text type="secondary">Chỉ hiện tối đa {DATA_LIMIT} dòng.</Text>
        ) : null
      }
      width="90vw"
      style={{ top: 40 }}
    >
      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          <Spin />
          <div>
            <Text type="secondary">Đang tải…</Text>
          </div>
        </div>
      ) : mode === 'data' ? (
        rows.length === 0 ? (
          <Text type="secondary">Bảng trống hoặc không đọc được dữ liệu.</Text>
        ) : (
          <>
            {/* Toolbar: chọn cột + tìm kiếm */}
            <div style={{ marginBottom: 12 }}>
              <Space wrap style={{ width: '100%', justifyContent: 'space-between' }}>
                <Space wrap>
                  <Text strong style={{ fontSize: 12 }}>
                    Chọn cột:
                  </Text>
                  <Select
                    mode="multiple"
                    allowClear
                    size="small"
                    style={{ minWidth: 320 }}
                    placeholder="Chọn cột hiển thị (bỏ trống = tất cả)"
                    maxTagCount="responsive"
                    options={availableCols.map((c) => ({ value: c, label: c }))}
                    value={selectedCols.length > 0 ? selectedCols : undefined}
                    onChange={(vals) => setSelectedCols(vals)}
                  />
                  {selectedCols.length > 0 && (
                    <Button type="link" size="small" onClick={() => setSelectedCols([])}>
                      Tất cả
                    </Button>
                  )}
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    {visibleCols.length}/{availableCols.length} cột
                  </Text>
                </Space>
                <Input
                  allowClear
                  size="small"
                  style={{ width: 240 }}
                  prefix={<SearchOutlined />}
                  placeholder="Tìm trong dữ liệu…"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                />
              </Space>
            </div>

            {filteredRows.length === 0 ? (
              <Text type="secondary">Không có dòng nào khớp tìm kiếm.</Text>
            ) : (
              <Table
                size="small"
                columns={columns}
                dataSource={filteredRows.map((r, i) => ({ ...r, __rowKey: i }))}
                rowKey="__rowKey"
                scroll={{ x: 'max-content' }}
                pagination={{ pageSize: 10, showSizeChanger: true }}
                bordered
              />
            )}
          </>
        )
      ) : (
        // mode ddl — Monaco có thể sửa
        <>
          <Space style={{ marginBottom: 8, justifyContent: 'space-between', width: '100%' }}>
            <Space>
              <Tag color="processing">Có thể sửa</Tag>
              <Text type="secondary" style={{ fontSize: 12 }}>
                Chỉnh sửa SQL tại đây (chưa áp dụng). Dùng nút Sao chép để dùng nơi khác.
              </Text>
            </Space>
            <Button size="small" icon={<CopyOutlined />} onClick={handleCopyDDL}>
              Sao chép
            </Button>
          </Space>
          <div style={{ height: 480, border: '1px solid #333', borderRadius: 6, overflow: 'hidden' }}>
            <Editor
              height="480px"
              language="sql"
              theme="vs-dark"
              value={ddl}
              onChange={(val) => setDdl(val ?? '')}
              options={{
                readOnly: false,
                minimap: { enabled: false },
                fontSize: 13,
                lineNumbers: 'on',
                wordWrap: 'on',
                scrollBeyondLastLine: false,
                automaticLayout: true,
                scrollbar: { vertical: 'visible' },
                folding: true,
              }}
            />
          </div>
          <div style={{ textAlign: 'right', marginTop: 8 }}>
            <Text type="secondary" style={{ fontSize: 12 }}>
              Ghi chú: bản sửa chỉ dừng trong editor — không tự execute.
            </Text>
          </div>
        </>
      )}
    </Modal>
  );
}
