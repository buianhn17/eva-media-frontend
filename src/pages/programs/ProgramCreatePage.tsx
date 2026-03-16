import { useState, useEffect } from 'react';
import {
  Form, Input, Select, Button, Card, message,
  Upload, Row, Col, Typography, Space,
} from 'antd';
import {
  ArrowLeftOutlined, SaveOutlined, UploadOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import type { UploadFile } from 'antd';
import { programsApi } from '../../api/programs.api';
import { directorsApi } from '../../api/directors.api';
import { locationsApi } from '../../api/locations.api';
import { imagesApi } from '../../api/images.api';
import type { Director, Location } from '../../types';

const { Title } = Typography;
const { TextArea } = Input;

export default function ProgramCreatePage() {
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const [directors, setDirectors] = useState<Director[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [uploadingThumb, setUploadingThumb] = useState(false);

  useEffect(() => {
    directorsApi.getAll().then((r) => setDirectors(r.data));
    locationsApi.getAll().then((r) => setLocations(r.data));
  }, []);

  // Upload thumbnail lên Cloudinary
  const handleThumbnailUpload = async (file: File) => {
    setUploadingThumb(true);
    try {
      const res = await imagesApi.uploadToCloudinary(file);
      setThumbnailUrl(res.data.url);
      form.setFieldValue('thumbnail', res.data.url);
      message.success('Upload thumbnail thành công!');
    } catch {
      message.error('Upload thumbnail thất bại!');
    } finally {
      setUploadingThumb(false);
    }
    return false;
  };

  const onFinish = async (values: any) => {
    setSubmitting(true);
    try {
      // Tạo program – gửi đúng field BE yêu cầu, tự gen slug
      const res = await programsApi.create({
        title: values.title,
        content: values.content,
        directorId: Number(values.directorId),
        locationId: Number(values.locationId),
        thumbnail: thumbnailUrl || values.thumbnail,
        videoUrl: values.videoUrl, 
        metaTitle: values.metaTitle,
        metaDescription: values.metaDescription,
      });
      const programId = res.data.id;

      // Upload gallery nếu có
      if (fileList.length > 0) {
        const uploads = fileList
          .filter((f) => f.originFileObj)
          .map((f) => imagesApi.uploadFile(programId, f.originFileObj as File));
        await Promise.all(uploads);
      }

      message.success('Tạo program thành công!');
      navigate('/dashboard/programs');
    } catch (err: any) {
      const msg = err?.response?.data?.message;
      message.error(
        Array.isArray(msg) ? msg.join(', ') : msg || 'Tạo program thất bại!'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Col>
          <Space>
            <Button
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate('/dashboard/programs')}
            />
            <Title level={4} style={{ margin: 0 }}>
              Thêm Program mới
            </Title>
          </Space>
        </Col>
      </Row>

      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Row gutter={24}>
          {/* ── Cột trái ── */}
          <Col xs={24} lg={16}>
            <Card title="Thông tin chính" style={{ marginBottom: 16 }}>
              <Form.Item
                name="title"
                label="Tiêu đề"
                rules={[{ required: true, message: 'Vui lòng nhập tiêu đề' }]}
              >
                <Input placeholder="VD: Live Concert 2025" size="large" />
              </Form.Item>

              <Form.Item
                name="content"
                label="Nội dung"
                rules={[{ required: true, message: 'Vui lòng nhập nội dung' }]}
              >
                <TextArea rows={8} placeholder="Mô tả chi tiết chương trình..." />
              </Form.Item>
            </Card>

            <Card title="SEO" style={{ marginBottom: 16 }}>
              <Form.Item name="metaTitle" label="Meta Title">
                <Input placeholder="Tiêu đề SEO (để trống sẽ dùng tiêu đề chính)" />
              </Form.Item>
              <Form.Item name="metaDescription" label="Meta Description">
                <TextArea rows={3} placeholder="Mô tả SEO ngắn gọn..." />
              </Form.Item>
            </Card>

            <Card title="Gallery ảnh (tùy chọn)">
              <Upload
                multiple
                listType="picture-card"
                fileList={fileList}
                beforeUpload={() => false}
                onChange={({ fileList: newList }) => setFileList(newList)}
                accept="image/*"
              >
                <div>
                  <UploadOutlined />
                  <div style={{ marginTop: 8 }}>Chọn ảnh</div>
                </div>
              </Upload>
              <div style={{ color: '#999', fontSize: 12, marginTop: 8 }}>
                * Gallery sẽ được upload sau khi tạo program
              </div>
            </Card>
          </Col>

          {/* ── Cột phải ── */}
          <Col xs={24} lg={8}>
            <Card title="Phân loại" style={{ marginBottom: 16 }}>
              <Form.Item
                name="directorId"
                label="Director"
                rules={[{ required: true, message: 'Vui lòng chọn director' }]}
              >
                <Select
                  placeholder="Chọn Director"
                  options={directors.map((d) => ({ value: d.id, label: d.name }))}
                  showSearch
                  filterOption={(input, opt) =>
                    (opt?.label as string)?.toLowerCase().includes(input.toLowerCase())
                  }
                />
              </Form.Item>

              <Form.Item
                name="locationId"
                label="Location"
                rules={[{ required: true, message: 'Vui lòng chọn location' }]}
              >
                <Select
                  placeholder="Chọn Location"
                  options={locations.map((l) => ({ value: l.id, label: l.name }))}
                  showSearch
                  filterOption={(input, opt) =>
                    (opt?.label as string)?.toLowerCase().includes(input.toLowerCase())
                  }
                />
              </Form.Item>
            </Card>

            <Card title="Thumbnail" style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 8 }}>
                <Upload
                  listType="picture-card"
                  maxCount={1}
                  beforeUpload={handleThumbnailUpload}
                  accept="image/*"
                  showUploadList={false}
                >
                  {thumbnailUrl ? (
                    <img
                      src={thumbnailUrl}
                      alt="thumbnail"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        borderRadius: 8,
                      }}
                    />
                  ) : (
                    <div>
                      {uploadingThumb ? (
                        'Đang upload...'
                      ) : (
                        <>
                          <UploadOutlined />
                          <div style={{ marginTop: 8 }}>Upload</div>
                        </>
                      )}
                    </div>
                  )}
                </Upload>
              </div>

              <Form.Item name="thumbnail" style={{ marginBottom: 0 }}>
                <Input
                  placeholder="Hoặc nhập URL thumbnail..."
                  onChange={(e) => setThumbnailUrl(e.target.value)}
                />
              </Form.Item>
              <Form.Item
                name="videoUrl"
                label="Video YouTube"
                tooltip="Dán link YouTube: https://youtube.com/watch?v=xxx hoặc https://youtu.be/xxx"
                >
                <Input
                    placeholder="https://www.youtube.com/watch?v=..."
                    prefix={<span style={{ fontSize: 16 }}>▶️</span>}
                />
                </Form.Item>
            </Card>

            <Button
              type="primary"
              htmlType="submit"
              block
              size="large"
              loading={submitting}
              icon={<SaveOutlined />}
            >
              Tạo Program
            </Button>
          </Col>
        </Row>
      </Form>
    </div>
  );
}