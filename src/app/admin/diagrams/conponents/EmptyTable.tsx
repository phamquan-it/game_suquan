"use client"
import { DatabaseOutlined } from "@ant-design/icons"
import styles from "../styles"
import { Typography } from "antd"
const { Text } = Typography;
export const EmptyTable = () => {
  return (
    <div>
      <div style={styles.emptyState}>
        <DatabaseOutlined style={{ fontSize: 64, color: '#D4AF37' }} />
        <div style={{ marginTop: 16 }}>
          <Text type="secondary" style={{ fontSize: 16 }}>
            Chọn ít nhất 2 bảng để bắt đầu
          </Text>
        </div>
      </div>

    </div>
  )
}
