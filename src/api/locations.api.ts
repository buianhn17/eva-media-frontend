import api from './axios';
import type { Location, Program } from '../types';

export const locationsApi = {
  getAll: () =>
    api.get<Location[]>('/locations'),

  getOne: (id: number) =>
    api.get<Location>(`/locations/${id}`),

  getPrograms: (id: number) =>
    api.get<Program[]>(`/locations/${id}/programs`),

  create: (name: string) =>
    api.post<Location>('/locations', { name }),

  // BE dùng PUT không phải PATCH
  update: (id: number, name: string) =>
    api.put<Location>(`/locations/${id}`, { name }),

  delete: (id: number) =>
    api.delete(`/locations/${id}`),
};