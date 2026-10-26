import pino from 'pino';
import { env } from './env';

export const logger = pino(
  env.NODE_ENV !== 'production'
    ? {
        level: 'debug',
        transport: {
          target: require.resolve('pino-pretty'),
          options: {
            colorize: true,
            translateTime: 'HH:MM:ss',
            ignore: 'pid,hostname',
          },
        },
      }
    : {
        level: 'info',
      }
);