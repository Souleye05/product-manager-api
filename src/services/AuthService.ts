import { IAuthService } from "../core/interfaces/services/IAuthService";
import { AuthResponseDTO, LoginDTO, RegisterDTO, UserDTO } from "../core/dtos/UserDTO";
import { hashPassword, comparePasswords } from "../utils/passwordUtils";
import prisma from "../config/prisma";
import jwt from "jsonwebtoken";
// import { logger } from "../utils/logger";

export class AuthService implements IAuthService {
  private jwtSecret: string;
  private jwtExpiresIn: string;

  constructor() {
    this.jwtSecret = process.env.JWT_SECRET || "default_secret";
    this.jwtExpiresIn = process.env.JWT_EXPIRES_IN || "24h";
  }

  async register(userData: RegisterDTO): Promise<AuthResponseDTO> {
    try {
      // Vérifier si l'utilisateur existe déjà
      const existingUserByEmail = await prisma.user.findUnique({
        where: { email: userData.email }
      });
      
      if (existingUserByEmail) {
        throw new Error("Un utilisateur avec cet email existe déjà");
      }

      const existingUserByUsername = await prisma.user.findUnique({
        where: { username: userData.username }
      });
      
      if (existingUserByUsername) {
        throw new Error("Ce nom d'utilisateur est déjà pris");
      }

      // Hasher le mot de passe
      const hashedPassword = await hashPassword(userData.password);

      // Créer l'utilisateur
      const newUser = await prisma.user.create({
        data: {
          username: userData.username,
          email: userData.email,
          password: hashedPassword,
          role: 'user'
        }
      });

      // Créer un token JWT
      const token = this.generateToken(newUser.id, newUser.role);

      // Retourner l'utilisateur sans le mot de passe
      const userDto: UserDTO = {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
        createdAt: newUser.createdAt,
        updatedAt: newUser.updatedAt
      };

      return { user: userDto, token };
    } catch (error) {
      // logger.error('Erreur lors de l\'enregistrement de l\'utilisateur:', error);
      throw error;
    }
  }

  async login(credentials: LoginDTO): Promise<AuthResponseDTO | null> {
    try {
      // Trouver l'utilisateur par email
      const user = await prisma.user.findUnique({
        where: { email: credentials.email }
      });

      if (!user) {
        return null;
      }

      // Vérifier le mot de passe
      const isPasswordValid = await comparePasswords(credentials.password, user.password);
      if (!isPasswordValid) {
        return null;
      }

      // Créer un token JWT
      const token = this.generateToken(user.id, user.role);

      // Retourner l'utilisateur sans le mot de passe
      const userDto: UserDTO = {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      };

      return { user: userDto, token };
    } catch (error) {
      // logger.error('Erreur lors de la connexion de l\'utilisateur:', error);
      throw error;
    }
  }

  async validateToken(token: string): Promise<UserDTO | null> {
    try {
      // Vérifier et décoder le token
      const decoded = jwt.verify(token, this.jwtSecret) as { id: number; role: string };
      
      // Trouver l'utilisateur par ID
      const user = await prisma.user.findUnique({
        where: { id: decoded.id }
      });

      if (!user) {
        return null;
      }

      // Retourner les informations de l'utilisateur sans le mot de passe
      return {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      };
    } catch (error) {
      // logger.error('Erreur lors de la validation du token:', error);
      return null;
    }
  }

  private generateToken(userId: number, role: string): string {
    return jwt.sign(
      { id: userId, role },
      this.jwtSecret,
      { expiresIn: this.jwtExpiresIn } as jwt.SignOptions
    );
  }
}
