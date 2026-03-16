import { useEffect, useState } from 'react';
import {
  Table, Button, Space, Input, Select, Popconfirm,
  message, Tag, Image, Typography, Row, Col, Tooltip,
} from 'antd';
import {
  PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { programsApi } from '../../api/programs.api';
import { directorsApi } from '../../api/directors.api';
import { locationsApi } from '../../api/locations.api';
import type { Program, Director, Location } from '../../types';

const { Title } = Typography;

export default function ProgramListPage() {
  const navigate = useNavigate();

  // Data state
  const [programs, setPrograms] = useState<Program[]>([]);
  const [directors, setDirectors] = useState<Director[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);

  // Loading state
  const [loading, setLoading] = useState(false);

  // Filter state
  const [search, setSearch] = useState('');
  const [directorId, setDirectorId] = useState<number | undefined>();
  const [locationId, setLocationId] = useState<number | undefined>();

  // Pagination state
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 10;

  // Load dropdown data
  useEffect(() => {
    directorsApi.getAll().then((r) => setDirectors(r.data));
    locationsApi.getAll().then((r) => setLocations(r.data));
  }, []);

  // Load programs
  const fetchPrograms = async () => {
    setLoading(true);
    try {
      const res = await programsApi.getAll({
        page,
        limit,
        search: search || undefined,
        director: directorId,
        location: locationId,
      });
      setPrograms(res.data.data);
      setTotal(res.data.total);
    } catch {
      message.error('Không thể tải danh sách programs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrograms();
  }, [page, directorId, locationId]);

  // Search on Enter
  const handleSearch = () => {
    setPage(1);
    fetchPrograms();
  };

  // Delete
  const handleDelete = async (id: number) => {
    try {
      await programsApi.delete(id);
      message.success('Đã xóa program!');
      fetchPrograms();
    } catch {
      message.error('Xóa thất bại!');
    }
  };

  const columns: ColumnsType<Program> = [
    {
      title: 'Thumbnail',
      dataIndex: 'thumbnail',
      width: 80,
      render: (url) =>
        url ? (
          <Image src={url} width={60} height={40} style={{ objectFit: 'cover', borderRadius: 4 }} />
        ) : (
          <div
            style={{
              width: 60, height: 40, background: '#f0f0f0',
              borderRadius: 4, display: 'flex', alignItems: 'center',
              justifyContent: 'center', color: '#bbb', fontSize: 11,
            }}
          >
            No img
          </div>
        ),
    },
    {
      title: 'Tiêu đề',
      dataIndex: 'title',
      render: (title, record) => (
        <Space direction="vertical" size={0}>
          <span style={{ fontWeight: 600 }}>{title}</span>
          <span style={{ color: '#999', fontSize: 12 }}>{record.slug}</span>
        </Space>
      ),
    },
    {
      title: 'Director',
      dataIndex: 'director',
      width: 150,
      render: (d: Director) =>
        d ? <Tag color="blue">{d.name}</Tag> : <Tag color="default">—</Tag>,
    },
    {
      title: 'Location',
      dataIndex: 'location',
      width: 150,
      render: (l: Location) =>
        l ? <Tag color="green">{l.name}</Tag> : <Tag color="default">—</Tag>,
    },
    {
      title: 'Ảnh',
      dataIndex: 'images',
      width: 70,
      align: 'center',
      render: (images: any[]) => (
        <Tag>{images?.length ?? 0}</Tag>
      ),
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      width: 120,
      render: (date) => dayjs(date).format('DD/MM/YYYY'),
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
              onClick={() => navigate(`/dashboard/programs/${record.id}/edit`)}
            />
          </Tooltip>
          <Popconfirm
            title="Xóa program này?"
            description="Hành động này không thể hoàn tác!"
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
          <Title level={4} style={{ margin: 0 }}>🎬 Programs</Title>
        </Col>
        <Col>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate('/dashboard/programs/create')}
          >
            Thêm Program
          </Button>
        </Col>
      </Row>

      {/* Filters */}
      <Row gutter={12} style={{ marginBottom: 16 }}>
        <Col flex="auto">
          <Input
            placeholder="Tìm kiếm theo tiêu đề..."
            prefix={<SearchOutlined />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onPressEnter={handleSearch}
            allowClear
            onClear={() => { setSearch(''); setPage(1); fetchPrograms(); }}
          />
        </Col>
        <Col>
          <Select
            placeholder="Lọc theo Director"
            style={{ width: 180 }}
            allowClear
            value={directorId}
            onChange={(val) => { setDirectorId(val); setPage(1); }}
            options={directors.map((d) => ({ value: d.id, label: d.name }))}
          />
        </Col>
        <Col>
          <Select
            placeholder="Lọc theo Location"
            style={{ width: 180 }}
            allowClear
            value={locationId}
            onChange={(val) => { setLocationId(val); setPage(1); }}
            options={locations.map((l) => ({ value: l.id, label: l.name }))}
          />
        </Col>
        <Col>
          <Button type="primary" ghost onClick={handleSearch} icon={<SearchOutlined />}>
            Tìm
          </Button>
        </Col>
      </Row>

      {/* Table */}
      <Table
        columns={columns}
        dataSource={programs}
        rowKey="id"
        loading={loading}
        pagination={{
          current: page,
          pageSize: limit,
          total,
          onChange: setPage,
          showTotal: (t) => `Tổng ${t} programs`,
          showSizeChanger: false,
        }}
      />
    </div>
  );
}