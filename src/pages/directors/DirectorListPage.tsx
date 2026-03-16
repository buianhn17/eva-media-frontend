import { useEffect, useState } from 'react';
import {
  Table, Button, Space, Input, Modal, Form,
  message, Popconfirm, Typography, Row, Col, Tag, Tooltip,
} from 'antd';
import {
  PlusOutlined, EditOutlined, DeleteOutlined,
  SearchOutlined, UserOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { directorsApi } from '../../api/directors.api';
import type { Director } from '../../types';

const { Title } = Typography;

export default function DirectorListPage() {
  const [directors, setDirectors] = useState<Director[]>([]);
  const [filtered, setFiltered] = useState<Director[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Director | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [form] = Form.useForm();

  const fetchDirectors = async () => {
    setLoading(true);
    try {
      const res = await directorsApi.getAll();
      setDirectors(res.data);
      setFiltered(res.data);
    } catch {
      message.error('Không thể tải danh sách directors');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDirectors(); }, []);

  // Filter local
  useEffect(() => {
    const keyword = search.toLowerCase();
    setFiltered(
      directors.filter((d) => d.name.toLowerCase().includes(keyword))
    );
  }, [search, directors]);

  const openCreate = () => {
    setEditingItem(null);
    form.resetFields();
    setModalOpen(true);
  };

  const openEdit = (item: Director) => {
    setEditingItem(item);
    form.setFieldsValue({ name: item.name });
    setModalOpen(true);
  };

  const handleSubmit = async (values: { name: string }) => {
    setSubmitting(true);
    try {
      if (editingItem) {
        await directorsApi.update(editingItem.id, values.name);
        message.success('Cập nhật thành công!');
      } else {
        await directorsApi.create(values.name);
        message.success('Tạo director thành công!');
      }
      setModalOpen(false);
      fetchDirectors();
    } catch {
      message.error('Thao tác thất bại!');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await directorsApi.delete(id);
      message.success('Đã xóa!');
      fetchDirectors();
    } catch {
      message.error('Xóa thất bại!');
    }
  };

  const columns: ColumnsType<Director> = [
    {
      title: '#',
      dataIndex: 'id',
      width: 60,
      render: (_, __, index) => index + 1,
    },
    {
      title: 'Tên Director',
      dataIndex: 'name',
      render: (name) => (
        <Space>
          <UserOutlined style={{ color: '#1677ff' }} />
          <span style={{ fontWeight: 500 }}>{name}</span>
        </Space>
      ),
    },
    {
      title: 'Số Programs',
      dataIndex: 'programs',
      width: 130,
      align: 'center',
      render: (programs) => (
        <Tag color="blue">{programs?.length ?? 0} programs</Tag>
      ),
    },
    {
      title: 'Hành động',
      width: 120,
      align: 'center',
      render: (_, record) => (
        <Space>
          <Tooltip title="Chỉnh sửa">
            <Button
              type="primary"
              ghost
              icon={<EditOutlined />}
              size="small"
              onClick={() => openEdit(record)}
            />
          </Tooltip>
          <Popconfirm
            title="Xóa director này?"
            description="Các program liên quan sẽ bị ảnh hưởng!"
            onConfirm={() => handleDelete(record.id)}
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
          >
            <Tooltip title="Xóa">
              <Button danger icon={<DeleteOutlined />} size="small" />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      {/* Header */}
      <Row justify="space-between" align="middle" style={{ marginBottom: 20 }}>
        <Col>
          <Title level={4} style={{ margin: 0 }}>👤 Directors</Title>
        </Col>
        <Col>
          <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
            Thêm Director
          </Button>
        </Col>
      </Row>

      {/* Search */}
      <Row style={{ marginBottom: 16 }}>
        <Col xs={24} sm={10}>
          <Input
            placeholder="Tìm kiếm director..."
            prefix={<SearchOutlined />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            allowClear
          />
        </Col>
      </Row>

      {/* Table */}
      <Table
        columns={columns}
        dataSource={filtered}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 10, showTotal: (t) => `Tổng ${t} directors` }}
      />

      {/* Modal Create / Edit */}
      <Modal
        title={editingItem ? 'Chỉnh sửa Director' : 'Thêm Director mới'}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        footer={null}
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit} style={{ marginTop: 16 }}>
          <Form.Item
            name="name"
            label="Tên Director"
            rules={[{ required: true, message: 'Vui lòng nhập tên director' }]}
          >
            <Input placeholder="VD: Nguyễn Văn A" size="large" />
          </Form.Item>

          <Row justify="end" gutter={8}>
            <Col>
              <Button onClick={() => setModalOpen(false)}>Hủy</Button>
            </Col>
            <Col>
              <Button type="primary" htmlType="submit" loading={submitting}>
                {editingItem ? 'Lưu thay đổi' : 'Tạo mới'}
              </Button>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
}