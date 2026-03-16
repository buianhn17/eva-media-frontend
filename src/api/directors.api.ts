import api from './axios';
import type { Director, Program } from '../types';

function generateSlug(name: string): string {
  return (
    name
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

export const directorsApi = {
  getAll: () =>
    api.get<Director[]>('/directors'),

  getOne: (id: number) =>
    api.get<Director>(`/directors/${id}`),

  getPrograms: (id: number) =>
    api.get<Program[]>(`/directors/${id}/programs`),

  // Gửi cả slug
  create: (name: string) =>
    api.post<Director>('/directors', {
      name,
      slug: generateSlug(name),
    }),

  // BE dùng PUT
  update: (id: number, name: string) =>
    api.put<Director>(`/directors/${id}`, {
      name,
      slug: generateSlug(name),
    }),

  delete: (id: number) =>
    api.delete(`/directors/${id}`),
};