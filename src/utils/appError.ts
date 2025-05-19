/**
 * Classe pour représenter une erreur d'application
 */
export class AppError extends Error {
  statusCode: number;
  status: string;
  isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Crée une erreur de validation
 * @param message Message d'erreur
 */
export const createValidationError = (message: string): AppError => {
  return new AppError(message, 400);
};

/**
 * Crée une erreur pour ressource non trouvée
 * @param resource Nom de la ressource
 */
export const createNotFoundError = (resource: string): AppError => {
  return new AppError(`${resource} non trouvé(e)`, 404);
};

/**
 * Crée une erreur d'authentification
 * @param message Message d'erreur
 */
export const createAuthError = (message: string = 'Non autorisé'): AppError => {
  return new AppError(message, 401);
};

/**
 * Crée une erreur de permission
 * @param message Message d'erreur
 */
export const createForbiddenError = (message: string = 'Accès refusé'): AppError => {
  return new AppError(message, 403);
};

/**
 * Crée une erreur de conflit
 * @param message Message d'erreur
 */
export const createConflictError = (message: string): AppError => {
  return new AppError(message, 409);
};