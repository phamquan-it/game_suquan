import { Layout } from "antd";
import { Content, Header } from "antd/es/layout/layout";
import QuestManagement from "./components/QuestManagement";

export default () => {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{
        display: 'flex',
        alignItems: 'center',
        background: '#8B0000',
        padding: '0 24px'
      }}>
        <div style={{ color: '#D4AF37', fontSize: 20, fontWeight: 'bold' }}>
          🏰 12 Warlords - Quest Master
        </div>
      </Header>
      <Content>
        <QuestManagement />
      </Content>
    </Layout>);
}
