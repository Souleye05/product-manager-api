import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { config } from 'dotenv';
import routes from './api/routes';
import { errorHandler, notFound } from './api/middlewares/errorHandler';
import { logger } from './utils/logger';

// Charger les variables d'environnement
config();

// Initialiser l'application Express
const app = express();

// Middlewares
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logger les requêtes
app.use(morgan('dev'));

// Routes
app.use('/api', routes);

// Middleware pour les routes non trouvées
app.use(notFound);

// Middleware de gestion d'erreurs
app.use(errorHandler);

// Port d'écoute
const PORT = process.env.PORT || 3000;

// Démarrer le serveur
app.listen(PORT, () => {
  logger.info(`Serveur démarré sur le port ${PORT}`);
});

export default app;