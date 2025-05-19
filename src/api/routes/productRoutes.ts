import { Router } from 'express';
import { productController } from '../controllers/productController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { validateCreateProduct, validateUpdateProduct } from '../middlewares/productValidation';

const router = Router();

/**
 * @route GET /api/products
 * @desc Récupérer tous les produits
 * @access Public
 */
router.get('/', productController.getAllProducts);

/**
 * @route GET /api/products/search
 * @desc Rechercher des produits par mot-clé
 * @access Public
 */
router.get('/search', productController.searchProducts);

/**
 * @route GET /api/products/category/:category
 * @desc Récupérer les produits par catégorie
 * @access Public
 */
router.get('/category/:category', productController.getProductsByCategory);

/**
 * @route GET /api/products/:id
 * @desc Récupérer un produit par son ID
 * @access Public
 */
router.get('/:id', productController.getProductById);

/**
 * @route POST /api/products
 * @desc Créer un nouveau produit
 * @access Private (Admin)
 */
router.post('/', 
  authMiddleware.authenticate, 
  authMiddleware.isAdmin, 
  validateCreateProduct, 
  productController.createProduct
);

/**
 * @route PUT /api/products/:id
 * @desc Mettre à jour un produit
 * @access Private (Admin)
 */
router.put('/:id', 
  authMiddleware.authenticate, 
  authMiddleware.isAdmin, 
  validateUpdateProduct, 
  productController.updateProduct
);

/**
 * @route DELETE /api/products/:id
 * @desc Supprimer un produit
 * @access Private (Admin)
 */
router.delete('/:id', authMiddleware.authenticate, authMiddleware.isAdmin, productController.deleteProduct);

export default router;