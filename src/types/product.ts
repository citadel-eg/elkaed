export type BranchAvailability = 'all' | 'mahalla' | 'samanoud';

export interface ProductColor {
  name: string;
  hex: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  brand?: string | null;
  description: string | null;
  price: number;
  compare_at_price: number | null;
  image_url: string | null;
  gallery_images?: string[] | null;
  colors?: ProductColor[] | null;
  specs?: Record<string, string> | null;
  highlights?: string[] | null;
  category: string | null;
  stock: number;
  available_branches?: BranchAvailability;
  is_featured: boolean;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export type CreateProductInput = Omit<Product, 'id' | 'created_at' | 'updated_at'>;

export type UpdateProductInput = Partial<CreateProductInput>;

export interface ProductFormData {
  name: string;
  slug?: string;
  brand?: string;
  description?: string;
  price: number;
  compare_at_price?: number | null;
  category?: string;
  stock: number;
  available_branches?: BranchAvailability;
  is_featured: boolean;
  is_active: boolean;
}
