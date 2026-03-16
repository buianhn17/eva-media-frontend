import { Form, Input, Button, Card, message, Typography } from 'antd';
import { UserOutlined, LockOutlined, PlayCircleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../../api/auth.api';
import { useAuthStore } from '../../store/authStore';

const { Title, Text } = Typography;

export default function LoginPage() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [form] = Form.useForm();

  const onFinish = async (values: { email: string; password: string }) => {
    try {
      const res = await authApi.login(values.email, values.password);
      setAuth(res.data.user, res.data.access_token);
      message.success('Đăng nhập thành công!');
      navigate('/dashboard/programs');
    } catch {
      message.error('Email hoặc mật khẩu không đúng!');
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #141414 0%, #1a1a2e 100%)',
      }}
    >
      <Card style={{ width: 400, borderRadius: 12 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <PlayCircleOutlined style={{ fontSize: 48, color: '#1677ff' }} />
          <Title level={3} style={{ margin: '12px 0 4px' }}>
            Media CMS
          </Title>
          <Text type="secondary">Đăng nhập vào hệ thống quản trị</Text>
        </div>

        <Form form={form} layout="vertical" onFinish={onFinish} size="large">
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Vui lòng nhập email' },
              { type: 'email', message: 'Email không hợp lệ' },
            ]}
            initialValue="admin@media.com"
          >
            <Input prefix={<UserOutlined />} placeholder="admin@media.com" />
          </Form.Item>

          <Form.Item
            name="password"
            label="Mật khẩu"
            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu' }]}
            initialValue="123456"
          >
            <Input.Password prefix={<LockOutlined />} placeholder="••••••" />
          </Form.Item>

          <Button type="primary" htmlType="submit" block style={{ marginTop: 8 }}>
            Đăng nhập
          </Button>
        </Form>
      </Card>
    </div>
  );
}