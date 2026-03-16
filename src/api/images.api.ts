import api from './axios';
import type { Image } from '../types';

export const imagesApi = {
  addByUrl: (programId: number, url: string) =>
    api.post<Image>(`/images/program/${programId}`, { url }),

  // Field name đổi thành 'files' cho đúng với FilesInterceptor('files')
  uploadFile: (programId: number, file: File) => {
    const form = new FormData();
    form.append('files', file); // ← 'files' không phải 'file'
    return api.post<Image>(`/images/program/${programId}/upload`, form);
  },

  uploadToCloudinary: (file: File) => {
    const form = new FormData();
    form.append('file', file); // ← upload.controller dùng 'file' → giữ nguyên
    return api.post<{ url: string }>('/upload', form);
  },

  getByProgram: (programId: number) =>
    api.get<Image[]>(`/images/program/${programId}`),

  delete: (id: number) =>
    api.delete(`/images/${id}`),
};