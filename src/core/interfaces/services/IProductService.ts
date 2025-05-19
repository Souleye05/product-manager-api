import { CreateProductDTO, ProductDTO, UpdateProductDTO } from "../../../core/dtos/ProductDTO";

export interface IProductService {
  /**
   * Récupère tous les produits
   * @param limit Limite le nombre de produits retournés
   * @param offset Décale le début de la liste des produits
   */
  getAllProducts(limit?: number, offset?: number): Promise<ProductDTO[]>;

  /**
   * Récupère un produit par son ID
   * @param id ID du produit à récupérer
   */
  getProductById(id: number): Promise<ProductDTO | null>;

  /**
   * Récupère les produits par catégorie
   * @param category Catégorie des produits à récupérer
   * @param limit Limite le nombre de produits retournés
   * @param offset Décale le début de la liste des produits
   */
  getProductsByCategory(category: string, limit?: number, offset?: number): Promise<ProductDTO[]>;
  /**
   * Crée un nouveau produit
   * @param productData Données du produit à créer
   * @param userId ID de l'utilisateur qui crée le produit
   */
  createProduct(productData: CreateProductDTO, userId: number): Promise<ProductDTO>;
  /**
   * Met à jour un produit
   * @param id ID du produit à mettre à jour
   * @param productData Données mises à jour du produit
   */
  updateProduct(id: number, productData: UpdateProductDTO): Promise<ProductDTO | null>;
  /**
   * Supprime un produit
   * @param id ID du produit à supprimer
   */
  deleteProduct(id: number): Promise<boolean>;
  /**
   * Recherche des produits par mot-clé
   * @param query Mot-clé de recherche
   * @param limit Limite le nombre de produits retournés
   * @param offset Décale le début de la liste des produits
   */
  searchProducts(query: string, limit?: number, offset?: number): Promise<ProductDTO[]>;
}