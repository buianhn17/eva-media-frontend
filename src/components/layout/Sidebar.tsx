import { Layout, Menu } from 'antd';
import {
  PlayCircleOutlined,
  UserOutlined,
  EnvironmentOutlined,
  AppstoreOutlined,
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';

const { Sider } = Layout;

const menuItems = [
  {
    key: '/dashboard/programs',
    icon: <PlayCircleOutlined />,
    label: 'Programs',
  },
  {
    key: '/dashboard/directors',
    icon: <UserOutlined />,
    label: 'Directors',
  },
  {
    key: '/dashboard/locations',
    icon: <EnvironmentOutlined />,
    label: 'Locations',
  },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Sider theme="dark" width={220}>
      <div
        style={{
          height: 64,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          color: '#fff',
          fontSize: 18,
          fontWeight: 700,
          borderBottom: '1px solid #303030',
        }}
      >
        <AppstoreOutlined />
        Media CMS
      </div>

      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[location.pathname]}
        items={menuItems}
        onClick={({ key }) => navigate(key)}
        style={{ marginTop: 8 }}
      />
    </Sider>
  );
}