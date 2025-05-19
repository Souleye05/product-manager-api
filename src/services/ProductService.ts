import { IProductService } from "../core/interfaces/services/IProductService";
import { CreateProductDTO, ProductDTO, UpdateProductDTO } from "../core/dtos/ProductDTO";
import prisma from "../config/prisma";
import { logger } from "../utils/logger";

export class ProductService implements IProductService {
  
  async getAllProducts(limit: number = 10, offset: number = 0): Promise<ProductDTO[]> {
    try {
      const products = await prisma.product.findMany({
        take: limit,
        skip: offset,
        orderBy: {
          createdAt: 'desc'
        }
      });
      
      return products;
    } catch (error) {
      logger.error('Erreur lors de la récupération des produits:', error);
      throw error;
    }
  }

  async getProductById(id: number): Promise<ProductDTO | null> {
    try {
      const product = await prisma.product.findUnique({
        where: { id }
      });
      
      return product;
    } catch (error) {
      logger.error('Erreur lors de la recherche du produit par ID:', error);
      throw error;
    }
  }

  async getProductsByCategory(category: string, limit: number = 10, offset: number = 0): Promise<ProductDTO[]> {
    try {
      const products = await prisma.product.findMany({
        where: { category },
        take: limit,
        skip: offset,
        orderBy: {
          createdAt: 'desc'
        }
      });
      
      return products;
    } catch (error) {
      logger.error('Erreur lors de la recherche des produits par catégorie:', error);
      throw error;
    }
  }

  async createProduct(productData: CreateProductDTO, userId: number): Promise<ProductDTO> {
    try {
      const product = await prisma.product.create({
        data: {
          name: productData.name,
          description: productData.description,
          price: productData.price,
          quantity: productData.quantity,
          category: productData.category,
          imageUrl: productData.imageUrl,
          userId: userId
        }
      });
      
      return product;
    } catch (error) {
      logger.error('Erreur lors de la création du produit:', error);
      throw error;
    }
  }

  async updateProduct(id: number, productData: UpdateProductDTO): Promise<ProductDTO | null> {
    try {
      const product = await prisma.product.update({
        where: { id },
        data: productData
      });
      
      return product;
    } catch (error) {
      logger.error('Erreur lors de la mise à jour du produit:', error);
      
      // Si l'erreur est due à un produit non trouvé
      if (error.code === 'P2025') {
        return null;
      }
      
      throw error;
    }
  }

  async deleteProduct(id: number): Promise<boolean> {
    try {
      await prisma.product.delete({
        where: { id }
      });
      
      return true;
    } catch (error) {
      logger.error('Erreur lors de la suppression du produit:', error);
      
      // Si l'erreur est due à un produit non trouvé
      if (error.code === 'P2025') {
        return false;
      }
      
      throw error;
    }
  }

  async searchProducts(query: string, limit: number = 10, offset: number = 0): Promise<ProductDTO[]> {
    try {
      const products = await prisma.product.findMany({
        where: {
          OR: [
            { name: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } }
          ]
        },
        take: limit,
        skip: offset,
        orderBy: {
          createdAt: 'desc'
        }
      });
      
      return products;
    } catch (error) {
      logger.error('Erreur lors de la recherche de produits:', error);
      throw error;
    }
  }
}