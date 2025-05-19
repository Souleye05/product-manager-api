import { Request, Response } from 'express';
import { AuthService } from '../../services/AuthService';
import { LoginDTO, RegisterDTO } from '../../core/dtos/UserDTO';
import { logger } from '../../utils/logger';

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  /**
   * Route pour l'inscription d'un utilisateur
   */
  register = async (req: Request, res: Response): Promise<void> => {
    try {
      const userData: RegisterDTO = req.body;

      // Validation des données
      if (!userData.email || !userData.password || !userData.username) {
        res.status(400).json({ message: 'Email, nom d\'utilisateur et mot de passe requis' });
        return;
      }

      // Appel au service d'authentification
      const result = await this.authService.register(userData);
      
      res.status(201).json(result);
    } catch (error: any) {
      logger.error('Erreur lors de l\'inscription:', error);
      
      // Gérer les erreurs spécifiques
      if (error.message.includes('existe déjà') || error.message.includes('déjà pris')) {
        res.status(409).json({ message: error.message });
        return;
      }
      
      res.status(500).json({ message: 'Erreur lors de l\'inscription' });
    }
  };

  /**
   * Route pour la connexion d'un utilisateur
   */
  login = async (req: Request, res: Response): Promise<void> => {
    try {
      const credentials: LoginDTO = req.body;

      // Validation des données
      if (!credentials.email || !credentials.password) {
        res.status(400).json({ message: 'Email et mot de passe requis' });
        return;
      }

      // Appel au service d'authentification
      const result = await this.authService.login(credentials);
      
      if (!result) {
        res.status(401).json({ message: 'Email ou mot de passe incorrect' });
        return;
      }
      
      res.status(200).json(result);
    } catch (error) {
      logger.error('Erreur lors de la connexion:', error);
      res.status(500).json({ message: 'Erreur lors de la connexion' });
    }
  };

  /**
   * Route pour vérifier si l'utilisateur est authentifié
   */
  me = async (req: Request, res: Response): Promise<void> => {
    try {
      // L'utilisateur est déjà disponible grâce au middleware d'authentification
      res.status(200).json({ user: req.user });
    } catch (error) {
      logger.error('Erreur lors de la récupération du profil:', error);
      res.status(500).json({ message: 'Erreur lors de la récupération du profil' });
    }
  };
}

// Export d'une instance du contrôleur
export const authController = new AuthController();