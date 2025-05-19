import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../../services/AuthService';
import { logger } from '../../utils/logger';

// Extension de l'interface Request pour ajouter la propriété user
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export class AuthMiddleware {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  /**
   * Middleware pour vérifier si l'utilisateur est authentifié
   */
  authenticate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Récupérer le token du header Authorization
      const authHeader = req.headers.authorization;
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ message: 'Authentification requise' });
        return;
      }

      // Extraire le token
      const token = authHeader.split(' ')[1];
      
      // Valider le token
      const user = await this.authService.validateToken(token);
      
      if (!user) {
        res.status(401).json({ message: 'Token invalide ou expiré' });
        return;
      }

      // Ajouter l'utilisateur à la requête
      req.user = user;
      
      next();
    } catch (error) {
      logger.error('Erreur dans le middleware d\'authentification:', error);
      res.status(401).json({ message: 'Erreur d\'authentification' });
    }
  };

  /**
   * Middleware pour vérifier si l'utilisateur est admin
   */
  isAdmin = (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ message: 'Authentification requise' });
      return;
    }

    if (req.user.role !== 'admin') {
      res.status(403).json({ message: 'Accès refusé. Droits d\'administrateur requis' });
      return;
    }

    next();
  };
}

// Export d'une instance du middleware
export const authMiddleware = new AuthMiddleware();