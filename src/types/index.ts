export type Role = 'ADMIN';

export interface User {
  id: number;
  email: string;
  role: Role;
  createdAt: string;
}

export interface Director {
  id: number;
  name: string;
  programs?: Program[];
}

export interface Location {
  id: number;
  name: string;
  programs?: Program[];
}

export interface Image {
  id: number;
  url: string;
  programId: number;
}

export interface Program {
  id: number;
  title: string;
  slug: string;
  content: string;
  thumbnail?: string;
  videoUrl?: string;
  metaTitle?: string;
  metaDescription?: string;
  directorId: number;
  locationId: number;
  director?: Director;
  location?: Location;
  images?: Image[];
  createdAt: string;
  updatedAt: string;
}

// API Response types
export interface LoginResponse {
  access_token: string;
  user: User;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

// Form types
export interface ProgramFormValues {
  title: string;
  content: string;
  directorId: number;
  locationId: number;
  thumbnail?: string;
  metaTitle?: string;
  metaDescription?: string;
}