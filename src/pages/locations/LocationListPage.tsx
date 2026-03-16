import { useEffect, useState } from 'react';
import {
  Table, Button, Space, Input, Modal, Form,
  message, Popconfirm, Typography, Row, Col, Tag, Tooltip,
} from 'antd';
import {
  PlusOutlined, EditOutlined, DeleteOutlined,
  SearchOutlined, EnvironmentOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { locationsApi } from '../../api/locations.api';
import type { Location } from '../../types';

const { Title } = Typography;

export default function LocationListPage() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [filtered, setFiltered] = useState<Location[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Location | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [form] = Form.useForm();

  const fetchLocations = async () => {
    setLoading(true);
    try {
      const res = await locationsApi.getAll();
      setLocations(res.data);
      setFiltered(res.data);
    } catch {
      message.error('Không thể tải danh sách locations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchLocations(); }, []);

  useEffect(() => {
    const keyword = search.toLowerCase();
    setFiltered(
      locations.filter((l) => l.name.toLowerCase().includes(keyword))
    );
  }, [search, locations]);

  const openCreate = () => {
    setEditingItem(null);
    form.resetFields();
    setModalOpen(true);
  };

  const openEdit = (item: Location) => {
    setEditingItem(item);
    form.setFieldsValue({ name: item.name });
    setModalOpen(true);
  };

  const handleSubmit = async (values: { name: string }) => {
    setSubmitting(true);
    try {
      if (editingItem) {
        await locationsApi.update(editingItem.id, values.name);
        message.success('Cập nhật thành công!');
      } else {
        await locationsApi.create(values.name);
        message.success('Tạo location thành công!');
      }
      setModalOpen(false);
      fetchLocations();
    } catch {
      message.error('Thao tác thất bại!');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await locationsApi.delete(id);
      message.success('Đã xóa!');
      fetchLocations();
    } catch {
      message.error('Xóa thất bại!');
    }
  };

  const columns: ColumnsType<Location> = [
    {
      title: '#',
      dataIndex: 'id',
      width: 60,
      render: (_, __, index) => index + 1,
    },
    {
      title: 'Tên Location',
      dataIndex: 'name',
      render: (name) => (
        <Space>
          <EnvironmentOutlined style={{ color: '#52c41a' }} />
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
        <Tag color="green">{programs?.length ?? 0} programs</Tag>
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
            title="Xóa location này?"
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
          <Title level={4} style={{ margin: 0 }}>📍 Locations</Title>
        </Col>
        <Col>
          <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
            Thêm Location
          </Button>
        </Col>
      </Row>

      {/* Search */}
      <Row style={{ marginBottom: 16 }}>
        <Col xs={24} sm={10}>
          <Input
            placeholder="Tìm kiếm location..."
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
        pagination={{ pageSize: 10, showTotal: (t) => `Tổng ${t} locations` }}
      />

      {/* Modal Create / Edit */}
      <Modal
        title={editingItem ? 'Chỉnh sửa Location' : 'Thêm Location mới'}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        footer={null}
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit} style={{ marginTop: 16 }}>
          <Form.Item
            name="name"
            label="Tên Location"
            rules={[{ required: true, message: 'Vui lòng nhập tên location' }]}
          >
            <Input placeholder="VD: Nhà hát lớn Hà Nội" size="large" />
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