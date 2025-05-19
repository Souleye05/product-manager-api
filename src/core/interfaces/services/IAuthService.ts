import { AuthResponseDTO, LoginDTO, RegisterDTO, UserDTO } from "../../dtos/UserDTO";

export interface IAuthService {
  /**
   * Enregistre un nouvel utilisateur
   * @param userData Les données d'inscription de l'utilisateur
   */
  register(userData: RegisterDTO): Promise<AuthResponseDTO>;
  
  /**
   * Authentifie un utilisateur
   * @param credentials Les identifiants de connexion
   */
  login(credentials: LoginDTO): Promise<AuthResponseDTO | null>;
  
  /**
   * Valide un token JWT et retourne les informations de l'utilisateur
   * @param token Le token JWT à valider
   */
  validateToken(token: string): Promise<UserDTO | null>;
}