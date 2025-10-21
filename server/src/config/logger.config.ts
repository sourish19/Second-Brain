import pino from 'pino';
import { cwd } from 'node:process';
import { join } from 'node:path';
import { TransportTargetOptions } from 'pino';

import ENV from './env.config';

const logDir = join(cwd(), 'logs');

// default targets
const targets: TransportTargetOptions[] = [
  {
    target: 'pino/file',
    level: ENV.PINO_LOG_LEVEL || 'info',
    options: { destination: join(logDir, 'server.log'), mkdir: true },
  },
];

// pretty printing only in dev env
if (process.env.NODE_ENV !== 'production') {
  targets.push({
    target: 'pino-pretty',
    level: 'debug',
    options: {
      colorize: true,
      translateTime: 'HH:MM:ss',
      ignore: 'pid,hostname',
    },
  });
}

// create the transport
const transport = pino.transport({ targets });

const logger = pino(
  {
    level: process.env.PINO_LOG_LEVEL || 'info',
    timestamp: pino.stdTimeFunctions.isoTime,
    base: {
      env: ENV.NODE_ENV || 'development',
    },
  },
  transport
);

// silent transport error
transport.on('error', (err: unknown) => {
  // use a fallback console only if logger is unavailable
  try {
    logger?.error({ err }, 'Pino transport error');
  } catch {
    // last resort without using console APIs
    try {
      const message = `Pino transport error: ${String(err)}\n`;
      process.stderr.write(message);
    } catch {}
  }
});

export default logger;
