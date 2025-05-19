import { Request, Response, NextFunction } from 'express';
import { logger } from '../../utils/logger';

/**
 * Middleware pour la gestion des erreurs
 */
export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  // Journalisation de l'erreur
  logger.error(`${err.name}: ${err.message}`, { stack: err.stack });

  // Déterminer le code d'état HTTP
  const statusCode = err.statusCode || 500;

  // Renvoyer une réponse d'erreur
  res.status(statusCode).json({
    message: err.message || 'Une erreur est survenue',
    stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack
  });
};

/**
 * Middleware pour les routes non trouvées
 */
export const notFound = (req: Request, res: Response, next: NextFunction) => {
  const error = new Error(`Route non trouvée - ${req.originalUrl}`);
  res.status(404);
  next(error);
};