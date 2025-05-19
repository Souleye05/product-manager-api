import { Request, Response, NextFunction } from 'express';
import { CreateProductDTO, UpdateProductDTO } from '../../core/dtos/ProductDTO';
import { createValidationError } from '../../utils/appError';

/**
 * Middleware pour valider les données de création d'un produit
 */
// export const validateCreateProduct = (req: Request, res: Response, next: NextFunction) => {
//   const productData: CreateProductDTO = req.body;
  
//   // Vérifier les champs obligatoires
//   if (!productData.name || productData.name.trim() === '') {
//     return next(createValidationError('Le nom du produit est requis'));
//   }
  
//   if (productData.price === undefined || isNaN(productData.price) || productData.price < 0) {
//     return next(createValidationError('Le prix doit être un nombre positif'));
//   }
  
//   if (productData.quantity === undefined || isNaN(productData.quantity) || productData.quantity < 0) {
//     return next(createValidationError('La quantité doit être un nombre positif'));
//   }
  
//   // Vérifier les longueurs maximales
//   if (productData.name.length > 100) {
//     return next(createValidationError('Le nom du produit ne doit pas dépasser 100 caractères'));
//   }

//   if (productData.description && productData.description.length > 1000) {
//     return res.status(400).json({ message: 'La description ne doit pas dépasser 1000 caractères' });
//   }
  
//   if (productData.category && productData.category.length > 50) {
//     return res.status(400).json({ message: 'La catégorie ne doit pas dépasser 50 caractères' });
//   }
  
//   next();
//   return
// };

/**
 * Middleware pour valider les données de mise à jour d'un produit
 */
// export const validateUpdateProduct = (req: Request, res: Response, next: NextFunction) => {
//   const productData: UpdateProductDTO = req.body;
  
//   // Vérifier si au moins un champ est fourni
//   if (Object.keys(productData).length === 0) {
//     return res.status(400).json({ message: 'Aucun champ fourni pour la mise à jour' });
//   }
  
//   // Valider le nom si fourni
//   if (productData.name !== undefined) {
//     if (productData.name.trim() === '') {
//       return res.status(400).json({ message: 'Le nom du produit ne peut pas être vide' });
//     }
    
//     if (productData.name.length > 100) {
//       return res.status(400).json({ message: 'Le nom du produit ne doit pas dépasser 100 caractères' });
//     }
//   }
  
//   // Valider le prix si fourni
//   if (productData.price !== undefined) {
//     if (isNaN(productData.price) || productData.price < 0) {
//       return res.status(400).json({ message: 'Le prix doit être un nombre positif' });
//     }
//   }
  
//   // Valider la quantité si fournie
//   if (productData.quantity !== undefined) {
//     if (isNaN(productData.quantity) || productData.quantity < 0) {
//       return res.status(400).json({ message: 'La quantité doit être un nombre positif' });
//     }
//   }
  
//   // Valider la description si fournie
//   if (productData.description && productData.description.length > 1000) {
//     return res.status(400).json({ message: 'La description ne doit pas dépasser 1000 caractères' });
//   }
  
//   // Valider la catégorie si fournie
//   if (productData.category && productData.category.length > 50) {
//     return res.status(400).json({ message: 'La catégorie ne doit pas dépasser 50 caractères' });
//   }
  
//   next();
//   return;
// };

export const validateCreateProduct = (req: Request, res: Response, next: NextFunction) => {
  const productData: CreateProductDTO = req.body;
  
  // Vérifier les champs obligatoires
  if (!productData.name || productData.name.trim() === '') {
    return next(createValidationError('Le nom du produit est requis'));
  }
  
  if (productData.price === undefined || isNaN(productData.price) || productData.price < 0) {
    return next(createValidationError('Le prix doit être un nombre positif'));
  }
  
  if (productData.quantity === undefined || isNaN(productData.quantity) || productData.quantity < 0) {
    return next(createValidationError('La quantité doit être un nombre positif'));
  }
  
  // Vérifier les longueurs maximales
  if (productData.name.length > 100) {
    return next(createValidationError('Le nom du produit ne doit pas dépasser 100 caractères'));
  }

  if (productData.description && productData.description.length > 1000) {
    return next(createValidationError('La description ne doit pas dépasser 1000 caractères'));
  }
  
  if (productData.category && productData.category.length > 50) {
    return next(createValidationError('La catégorie ne doit pas dépasser 50 caractères'));
  }
  
  next();
};

export const validateUpdateProduct = (req: Request, res: Response, next: NextFunction) => {
  const productData: UpdateProductDTO = req.body;
  
  // Vérifier si au moins un champ est fourni
  if (Object.keys(productData).length === 0) {
    return next(createValidationError('Aucun champ fourni pour la mise à jour'));
  }
  
  // Valider le nom si fourni
  if (productData.name !== undefined) {
    if (productData.name.trim() === '') {
      return next(createValidationError('Le nom du produit ne peut pas être vide'));
    }
    
    if (productData.name.length > 100) {
      return next(createValidationError('Le nom du produit ne doit pas dépasser 100 caractères'));
    }
  }
  
  // Valider le prix si fourni
  if (productData.price !== undefined) {
    if (isNaN(productData.price) || productData.price < 0) {
      return next(createValidationError('Le prix doit être un nombre positif'));
    }
  }
  
  // Valider la quantité si fournie
  if (productData.quantity !== undefined) {
    if (isNaN(productData.quantity) || productData.quantity < 0) {
      return next(createValidationError('La quantité doit être un nombre positif'));
    }
  }
  
  // Valider la description si fournie
  if (productData.description && productData.description.length > 1000) {
    return next(createValidationError('La description ne doit pas dépasser 1000 caractères'));
  }
  
  // Valider la catégorie si fournie
  if (productData.category && productData.category.length > 50) {
    return next(createValidationError('La catégorie ne doit pas dépasser 50 caractères'));
  }
  
  next();
};