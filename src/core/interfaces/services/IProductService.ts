import { CreateProductDTO, ProductDTO, UpdateProductDTO } from "../../../core/dtos/ProductDTO";

export interface IProductService {
  getAllProducts(limit?: number, offset?: number): Promise<ProductDTO[]>;
  getProductById(id: number): Promise<ProductDTO | null>;
  getProductsByCategory(category: string, limit?: number, offset?: number): Promise<ProductDTO[]>;
  createProduct(productData: CreateProductDTO, userId: number): Promise<ProductDTO>;
  updateProduct(id: number, productData: UpdateProductDTO): Promise<ProductDTO | null>;
  deleteProduct(id: number): Promise<boolean>;
  searchProducts(query: string, limit?: number, offset?: number): Promise<ProductDTO[]>;
}