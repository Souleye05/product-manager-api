import winston from 'winston';

// Configuration du logger
export const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: winston.format.combine(
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json()
  ),
  defaultMeta: { service: 'api' },
  transports: [
    // Écrire tous les logs dans la console
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.printf(
          info => `${info.timestamp} ${info.level}: ${info.message}`
        )
      )
    }),
    // Écrire tous les logs avec niveau `error` et au-dessus dans `error.log`
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    // Écrire tous les logs dans `combined.log`
    new winston.transports.File({ filename: 'logs/combined.log' })
  ]
});

// Si nous ne sommes pas en production, loguer également dans la console avec un format coloré
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    )
  }));
}