import bcrypt from 'bcryptjs';

/**
 * Hache un mot de passe en utilisant bcrypt
 * @param password Le mot de passe en clair
 * @returns Le mot de passe haché
 */
export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
};

/**
 * Compare un mot de passe en clair avec un mot de passe haché
 * @param password Le mot de passe en clair
 * @param hashedPassword Le mot de passe haché
 * @returns True si les mots de passe correspondent, sinon false
 */
export const comparePasswords = async (password: string, hashedPassword: string): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword);
};
