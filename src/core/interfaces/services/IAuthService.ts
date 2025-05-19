import { AuthResponseDTO, LoginDTO, RegisterDTO, UserDTO } from "../../../core/dtos/UserDTO";

export interface IAuthService {
  register(userData: RegisterDTO): Promise<AuthResponseDTO>;
  login(credentials: LoginDTO): Promise<AuthResponseDTO | null>;
  validateToken(token: string): Promise<UserDTO | null>;
}