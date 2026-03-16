import { useState, useEffect } from 'react';
import {
  Form, Input, Select, Button, Card, message,
  Upload, Row, Col, Typography, Space, Image,
  Popconfirm, Spin, Divider,
} from 'antd';
import {
  ArrowLeftOutlined, SaveOutlined, UploadOutlined, DeleteOutlined,
} from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import type { UploadFile } from 'antd';
import { programsApi } from '../../api/programs.api';
import { directorsApi } from '../../api/directors.api';
import { locationsApi } from '../../api/locations.api';
import { imagesApi } from '../../api/images.api';
import type { Director, Location, Program, Image as ProgramImage } from '../../types';

const { Title } = Typography;
const { TextArea } = Input;

export default function ProgramEditPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [form] = Form.useForm();

  const [program, setProgram] = useState<Program | null>(null);
  const [directors, setDirectors] = useState<Director[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [gallery, setGallery] = useState<ProgramImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [newFiles, setNewFiles] = useState<UploadFile[]>([]);
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [uploadingThumb, setUploadingThumb] = useState(false);

  // Load tất cả data cần thiết
  useEffect(() => {
    const init = async () => {
      try {
        const [dirsRes, locsRes] = await Promise.all([
          directorsApi.getAll(),
          locationsApi.getAll(),
        ]);
        setDirectors(dirsRes.data);
        setLocations(locsRes.data);

        // Load program detail
        // Backend dùng slug cho GET, nhưng chúng ta lưu id để edit
        // → Cần load list rồi find, hoặc BE cần thêm GET /programs/:id
        // Tạm thời dùng getAll rồi find theo id
        const programsRes = await programsApi.getAll({ limit: 1000 });
        const found = programsRes.data.data.find((p) => p.id === Number(id));

        if (!found) {
          message.error('Không tìm thấy program!');
          navigate('/dashboard/programs');
          return;
        }

        setProgram(found);
        setThumbnailUrl(found.thumbnail ?? '');

        form.setFieldsValue({
          title: found.title,
          content: found.content,
          directorId: found.directorId,
          locationId: found.locationId,
          thumbnail: found.thumbnail,
          metaTitle: found.metaTitle,
          metaDescription: found.metaDescription,
        });

        // Load gallery
        const galleryRes = await imagesApi.getByProgram(found.id);
        setGallery(galleryRes.data);
      } catch {
        message.error('Lỗi khi tải dữ liệu!');
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [id]);

  // Upload thumbnail
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

  // Xóa ảnh khỏi gallery
  const handleDeleteImage = async (imageId: number) => {
    try {
      await imagesApi.delete(imageId);
      setGallery((prev) => prev.filter((img) => img.id !== imageId));
      message.success('Đã xóa ảnh!');
    } catch {
      message.error('Xóa ảnh thất bại!');
    }
  };

  // Upload ảnh mới vào gallery
  const handleUploadNewImages = async () => {
    if (!program || newFiles.length === 0) return;
    const uploads = newFiles.map((f) =>
      imagesApi.uploadFile(program.id, f.originFileObj as File)
    );
    const results = await Promise.all(uploads);
    const newImages = results.map((r) => r.data);
    setGallery((prev) => [...prev, ...newImages]);
    setNewFiles([]);
    message.success(`Đã upload ${newImages.length} ảnh!`);
  };

  const onFinish = async (values: any) => {
    if (!program) return;
    setSubmitting(true);
    try {
      await programsApi.update(program.id, {
        ...values,
        thumbnail: thumbnailUrl || values.thumbnail,
      });

      // Upload gallery mới nếu có
      if (newFiles.length > 0) {
        await handleUploadNewImages();
      }

      message.success('Cập nhật thành công!');
      navigate('/dashboard/programs');
    } catch {
      message.error('Cập nhật thất bại!');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: 80 }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div>
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Col>
          <Space>
            <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/dashboard/programs')} />
            <Title level={4} style={{ margin: 0 }}>
              Chỉnh sửa: {program?.title}
            </Title>
          </Space>
        </Col>
      </Row>

      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Row gutter={24}>
          {/* Cột trái */}
          <Col xs={24} lg={16}>
            <Card title="Thông tin chính" style={{ marginBottom: 16 }}>
              <Form.Item
                name="title"
                label="Tiêu đề"
                rules={[{ required: true, message: 'Vui lòng nhập tiêu đề' }]}
              >
                <Input size="large" />
              </Form.Item>

              <Form.Item
                name="content"
                label="Nội dung"
                rules={[{ required: true, message: 'Vui lòng nhập nội dung' }]}
              >
                <TextArea rows={8} />
              </Form.Item>
            </Card>

            <Card title="SEO" style={{ marginBottom: 16 }}>
              <Form.Item name="metaTitle" label="Meta Title">
                <Input />
              </Form.Item>
              <Form.Item name="metaDescription" label="Meta Description">
                <TextArea rows={3} />
              </Form.Item>
            </Card>

            {/* Gallery */}
            <Card title={`Gallery ảnh (${gallery.length} ảnh)`}>
              {/* Ảnh hiện có */}
              {gallery.length > 0 && (
                <>
                  <Row gutter={[8, 8]}>
                    {gallery.map((img) => (
                      <Col key={img.id}>
                        <div style={{ position: 'relative', display: 'inline-block' }}>
                          <Image
                            src={img.url}
                            width={100}
                            height={70}
                            style={{ objectFit: 'cover', borderRadius: 4 }}
                          />
                          <Popconfirm
                            title="Xóa ảnh này?"
                            onConfirm={() => handleDeleteImage(img.id)}
                            okText="Xóa"
                            cancelText="Hủy"
                          >
                            <Button
                              danger
                              size="small"
                              icon={<DeleteOutlined />}
                              style={{
                                position: 'absolute', top: 2, right: 2,
                                padding: '0 4px', height: 22,
                              }}
                            />
                          </Popconfirm>
                        </div>
                      </Col>
                    ))}
                  </Row>
                  <Divider />
                </>
              )}

              {/* Upload ảnh mới */}
              <Upload
                multiple
                listType="picture-card"
                fileList={newFiles}
                beforeUpload={() => false}
                onChange={({ fileList }) => setNewFiles(fileList)}
                accept="image/*"
              >
                <div>
                  <UploadOutlined />
                  <div style={{ marginTop: 8 }}>Thêm ảnh</div>
                </div>
              </Upload>
            </Card>
          </Col>

          {/* Cột phải */}
          <Col xs={24} lg={8}>
            <Card title="Phân loại" style={{ marginBottom: 16 }}>
              <Form.Item
                name="directorId"
                label="Director"
                rules={[{ required: true }]}
              >
                <Select
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
                rules={[{ required: true }]}
              >
                <Select
                  options={locations.map((l) => ({ value: l.id, label: l.name }))}
                  showSearch
                  filterOption={(input, opt) =>
                    (opt?.label as string)?.toLowerCase().includes(input.toLowerCase())
                  }
                />
              </Form.Item>
            </Card>

            <Card title="Thumbnail" style={{ marginBottom: 16 }}>
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
                    style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 8 }}
                  />
                ) : (
                  <div>
                    {uploadingThumb ? 'Đang upload...' : (
                      <>
                        <UploadOutlined />
                        <div style={{ marginTop: 8 }}>Upload</div>
                      </>
                    )}
                  </div>
                )}
              </Upload>

              <Form.Item name="thumbnail" style={{ marginTop: 8 }}>
                <Input
                  placeholder="Hoặc nhập URL..."
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
              Lưu thay đổi
            </Button>
          </Col>
        </Row>
      </Form>
    </div>
  );
}