import winston from 'winston';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import env from './env.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const logsDir = path.join(__dirname, '../../logs');

if (!env.isTest && !fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

const logFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.errors({ stack: true }),
  winston.format.json(),
);

const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    const metaStr = Object.keys(meta).length ? JSON.stringify(meta) : '';
    return `${timestamp} [${level}]: ${message} ${metaStr}`;
  }),
);

const buildTransports = () => {
  if (env.isTest) {
    return [new winston.transports.Console({ silent: true })];
  }

  const transports = [
    new winston.transports.File({
      filename: path.join(logsDir, 'error.log'),
      level: 'error',
    }),
    new winston.transports.File({
      filename: path.join(logsDir, 'combined.log'),
    }),
  ];

  if (env.isDevelopment) {
    transports.push(new winston.transports.Console({ format: consoleFormat }));
  }

  return transports;
};

const logger = winston.createLogger({
  level: env.isDevelopment ? 'debug' : 'info',
  format: logFormat,
  transports: buildTransports(),
});

export const accessLogger = winston.createLogger({
  level: 'info',
  format: logFormat,
  transports: env.isTest
    ? [new winston.transports.Console({ silent: true })]
    : [
        new winston.transports.File({
          filename: path.join(logsDir, 'access.log'),
        }),
      ],
});

export default logger;
