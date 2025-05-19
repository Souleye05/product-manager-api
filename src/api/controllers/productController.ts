import { Request, Response } from 'express';
import { ProductService } from '../../services/ProductService';
import { CreateProductDTO, UpdateProductDTO } from '../../core/dtos/ProductDTO';
import { logger } from '../../utils/logger';

export class ProductController {
  private productService: ProductService;

  constructor() {
    this.productService = new ProductService();
  }

  /**
   * Récupère tous les produits
   */
  getAllProducts = async (req: Request, res: Response): Promise<void> => {
    try {
      const products = await this.productService.getAllProducts();
      res.status(200).json(products);
    } catch (error) {
      logger.error('Erreur lors de la récupération des produits:', error);
      res.status(500).json({ message: 'Erreur lors de la récupération des produits' });
    }
  };

  /**
   * Récupère un produit par son ID
   */
  getProductById = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        res.status(400).json({ message: 'ID de produit invalide' });
        return;
      }
      
      const product = await this.productService.getProductById(id);
      
      if (!product) {
        res.status(404).json({ message: 'Produit non trouvé' });
        return;
      }
      
      res.status(200).json(product);
    } catch (error) {
      logger.error(`Erreur lors de la récupération du produit ${req.params.id}:`, error);
      res.status(500).json({ message: 'Erreur lors de la récupération du produit' });
    }
  };

  /**
   * Récupère les produits par catégorie
   */
  getProductsByCategory = async (req: Request, res: Response): Promise<void> => {
    try {
      const { category } = req.params;
      
      if (!category) {
        res.status(400).json({ message: 'Catégorie requise' });
        return;
      }
      
      const products = await this.productService.getProductsByCategory(category);
      res.status(200).json(products);
    } catch (error) {
      logger.error(`Erreur lors de la récupération des produits de la catégorie ${req.params.category}:`, error);
      res.status(500).json({ message: 'Erreur lors de la récupération des produits par catégorie' });
    }
  };

  /**
   * Crée un nouveau produit
   */
  createProduct = async (req: Request, res: Response): Promise<void> => {
    try {
      const productData: CreateProductDTO = req.body;
      
      // Validation de base
      if (!productData.name || productData.price === undefined || productData.quantity === undefined) {
        res.status(400).json({ message: 'Nom, prix et quantité sont requis' });
        return;
      }
      
      // Récupérer l'ID de l'utilisateur depuis le middleware d'authentification
      const userId = req.user?.id;
      
      const newProduct = await this.productService.createProduct(productData, userId);
      
      res.status(201).json(newProduct);
    } catch (error) {
      logger.error('Erreur lors de la création du produit:', error);
      res.status(500).json({ message: 'Erreur lors de la création du produit' });
    }
  };

  /**
   * Met à jour un produit existant
   */
  updateProduct = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      const productData: UpdateProductDTO = req.body;
      
      if (isNaN(id)) {
        res.status(400).json({ message: 'ID de produit invalide' });
        return;
      }
      
      // Vérifier si au moins un champ est fourni pour la mise à jour
      if (Object.keys(productData).length === 0) {
        res.status(400).json({ message: 'Aucune donnée fournie pour la mise à jour' });
        return;
      }
      
      const updatedProduct = await this.productService.updateProduct(id, productData);
      
      if (!updatedProduct) {
        res.status(404).json({ message: 'Produit non trouvé' });
        return;
      }
      
      res.status(200).json(updatedProduct);
    } catch (error) {
      logger.error(`Erreur lors de la mise à jour du produit ${req.params.id}:`, error);
      res.status(500).json({ message: 'Erreur lors de la mise à jour du produit' });
    }
  };

  /**
   * Supprime un produit
   */
  deleteProduct = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        res.status(400).json({ message: 'ID de produit invalide' });
        return;
      }
      
      const result = await this.productService.deleteProduct(id);
      
      if (!result) {
        res.status(404).json({ message: 'Produit non trouvé' });
        return;
      }
      
      res.status(200).json({ message: 'Produit supprimé avec succès' });
    } catch (error) {
      logger.error(`Erreur lors de la suppression du produit ${req.params.id}:`, error);
      res.status(500).json({ message: 'Erreur lors de la suppression du produit' });
    }
  };

  /**
   * Recherche des produits par mot-clé
   */
  searchProducts = async (req: Request, res: Response): Promise<void> => {
    try {
      const { query } = req.query as { query: string };
      
      if (!query) {
        res.status(400).json({ message: 'Terme de recherche requis' });
        return;
      }
      
      const products = await this.productService.searchProducts(query);
      res.status(200).json(products);
    } catch (error) {
      logger.error(`Erreur lors de la recherche de produits "${req.query.query}":`, error);
      res.status(500).json({ message: 'Erreur lors de la recherche de produits' });
    }
  };
}

// Export d'une instance du contrôleur
export const productController = new ProductController();