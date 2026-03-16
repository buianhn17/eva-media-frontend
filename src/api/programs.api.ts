import api from './axios';
import type { Program, PaginatedResponse } from '../types';

export interface ProgramQuery {
  page?: number;
  limit?: number;
  search?: string;
  director?: number;
  location?: number;
}

export interface ProgramPayload {
  title: string;
  content: string;
  directorId: number;
  locationId: number;
  thumbnail?: string;
  videoUrl?: string; 
  metaTitle?: string;
  metaDescription?: string;
}

// Tự generate slug từ title (tránh trùng bằng timestamp)
function generateSlug(title: string): string {
  return (
    title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-') +
    '-' +
    Date.now()
  );
}

export const programsApi = {
  getAll: (params?: ProgramQuery) =>
    api.get<PaginatedResponse<Program>>('/programs', { params }),

  getBySlug: (slug: string) =>
    api.get<Program>(`/programs/${slug}`),

  create: (data: ProgramPayload) =>
    api.post<Program>('/programs', {
      ...data,
      slug: generateSlug(data.title),
    }),

  update: (id: number, data: Partial<ProgramPayload>) =>
    api.patch<Program>(`/programs/${id}`, data),

  delete: (id: number) =>
    api.delete(`/programs/${id}`),
};