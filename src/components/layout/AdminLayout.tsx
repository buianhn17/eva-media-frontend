import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

const { Content } = Layout;

export default function AdminLayout() {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sidebar />
      <Layout>
        <Header />
        <Content style={{ margin: '24px', background: '#f5f5f5' }}>
          <div style={{ padding: 24, background: '#fff', borderRadius: 8, minHeight: 500 }}>
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}