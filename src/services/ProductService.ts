import { IProductService } from "../core/interfaces/services/IProductService";
import { CreateProductDTO, ProductDTO, UpdateProductDTO } from "../core/dtos/ProductDTO";
import prisma from "../config/prisma";
import { logger } from "../utils/logger";

export class ProductService implements IProductService {
  async getAllProducts(): Promise<ProductDTO[]> {
    try {
      const products = await prisma.product.findMany({
        orderBy: {
          createdAt: 'desc'
        }
      });
      
      // Mapper les objets Prisma vers ProductDTO
      return products.map(product => ({
        ...product,
        price: Number(product.price) // Convertir Decimal en number
      }));
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
      
      if (!product) return null;
      
      // Mapper l'objet Prisma vers ProductDTO
      return {
        ...product,
        price: Number(product.price) // Convertir Decimal en number
      };
    } catch (error) {
      logger.error(`Erreur lors de la récupération du produit ${id}:`, error);
      throw error;
    }
  }

  async getProductsByCategory(category: string): Promise<ProductDTO[]> {
    try {
      const products = await prisma.product.findMany({
        where: {
          category: {
            contains: category,
            mode: 'insensitive'
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      });
      
      // Mapper les objets Prisma vers ProductDTO
      return products.map(product => ({
        ...product,
        price: Number(product.price) // Convertir Decimal en number
      }));
    } catch (error) {
      logger.error(`Erreur lors de la récupération des produits de la catégorie ${category}:`, error);
      throw error;
    }
  }

  async createProduct(productData: CreateProductDTO, userId?: number): Promise<ProductDTO> {
    try {
      const newProduct = await prisma.product.create({
        data: {
          name: productData.name,
          description: productData.description,
          price: productData.price,
          quantity: productData.quantity,
          category: productData.category,
          imageUrl: productData.imageUrl,
          userId: userId || null
        }
      });
      
      // Mapper l'objet Prisma vers ProductDTO
      return {
        ...newProduct,
        price: Number(newProduct.price) // Convertir Decimal en number
      };
    } catch (error) {
      logger.error('Erreur lors de la création du produit:', error);
      throw error;
    }
  }

  async updateProduct(id: number, productData: UpdateProductDTO): Promise<ProductDTO | null> {
    try {
      // Vérifier si le produit existe
      const existingProduct = await prisma.product.findUnique({
        where: { id }
      });
      
      if (!existingProduct) {
        return null;
      }
      
      // Mettre à jour le produit
      const updatedProduct = await prisma.product.update({
        where: { id },
        data: productData
      });
      
      // Mapper l'objet Prisma vers ProductDTO
      return {
        ...updatedProduct,
        price: Number(updatedProduct.price) // Convertir Decimal en number
      };
    } catch (error) {
      logger.error(`Erreur lors de la mise à jour du produit ${id}:`, error);
      throw error;
    }
  }

  async deleteProduct(id: number): Promise<boolean> {
    try {
      // Vérifier si le produit existe
      const existingProduct = await prisma.product.findUnique({
        where: { id }
      });
      
      if (!existingProduct) {
        return false;
      }
      
      // Supprimer le produit
      await prisma.product.delete({
        where: { id }
      });
      
      return true;
    } catch (error) {
      logger.error(`Erreur lors de la suppression du produit ${id}:`, error);
      throw error;
    }
  }

  async searchProducts(query: string): Promise<ProductDTO[]> {
    try {
      const products = await prisma.product.findMany({
        where: {
          OR: [
            {
              name: {
                contains: query,
                mode: 'insensitive'
              }
            },
            {
              description: {
                contains: query,
                mode: 'insensitive'
              }
            },
            {
              category: {
                contains: query,
                mode: 'insensitive'
              }
            }
          ]
        },
        orderBy: {
          createdAt: 'desc'
        }
      });
      
      // Mapper les objets Prisma vers ProductDTO
      return products.map(product => ({
        ...product,
        price: Number(product.price) // Convertir Decimal en number
      }));
    } catch (error) {
      logger.error(`Erreur lors de la recherche de produits "${query}":`, error);
      throw error;
    }
  }
}