export interface ProductDTO {
  id: number;
  name: string;
  description?: string | null;
  price: number;
  quantity: number;
  category?: string | null;
  imageUrl?: string | null;
  userId?: number | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateProductDTO {
  name: string;
  description?: string;
  price: number;
  quantity: number;
  category?: string;
  imageUrl?: string;
}

export interface UpdateProductDTO {
  name?: string;
  description?: string | null;
  price?: number;
  quantity?: number;
  category?: string | null;
  imageUrl?: string | null;
}