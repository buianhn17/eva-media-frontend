import { Layout, Button, Space, Typography, Popconfirm } from 'antd';
import { LogoutOutlined, UserOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

const { Header: AntHeader } = Layout;
const { Text } = Typography;

export default function Header() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <AntHeader
      style={{
        background: '#fff',
        padding: '0 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        borderBottom: '1px solid #f0f0f0',
        boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
      }}
    >
      <Space>
        <UserOutlined />
        <Text strong>{user?.email ?? 'Admin'}</Text>
        <Popconfirm
          title="Đăng xuất?"
          onConfirm={handleLogout}
          okText="Đăng xuất"
          cancelText="Hủy"
        >
          <Button icon={<LogoutOutlined />} danger type="text">
            Đăng xuất
          </Button>
        </Popconfirm>
      </Space>
    </AntHeader>
  );
}