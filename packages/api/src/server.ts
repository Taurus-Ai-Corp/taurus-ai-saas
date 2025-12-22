/**
 * Taurus AI API Server
 * Fastify backend with OpenCode integration
 */

import 'dotenv/config';
import Fastify from 'fastify';
import cors from '@fastify/cors';
import cookie from '@fastify/cookie';

import { OpencodeService } from './services/opencode-service.js';
import { sessionRoutes } from './routes/session.js';
import { healthRoutes } from './routes/health.js';
import { eventRoutes } from './routes/events.js';

// Create Fastify instance
const fastify = Fastify({
  logger: {
    level: process.env.LOG_LEVEL || 'info',
    transport: {
      target: 'pino-pretty',
      options: { colorize: true },
    },
  },
});

// Initialize OpenCode service
const opencodeService = new OpencodeService();

// Decorate Fastify with OpenCode service
fastify.decorate('opencode', opencodeService);

// Declare module augmentation for TypeScript
declare module 'fastify' {
  interface FastifyInstance {
    opencode: OpencodeService;
  }
}

async function start() {
  try {
    // Register plugins
    await fastify.register(cors, {
      origin: process.env.CORS_ORIGIN || ['http://localhost:3000'],
      credentials: true,
    });

    await fastify.register(cookie);

    // Initialize OpenCode
    fastify.log.info('Initializing OpenCode service...');
    await opencodeService.initialize();
    fastify.log.info('OpenCode service initialized');

    // Register routes
    await fastify.register(healthRoutes);
    await fastify.register(sessionRoutes, { prefix: '/api/session' });
    await fastify.register(eventRoutes, { prefix: '/api/session' });

    // Graceful shutdown
    const shutdown = async () => {
      fastify.log.info('Shutting down...');
      await opencodeService.shutdown();
      await fastify.close();
      process.exit(0);
    };

    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);

    // Start server
    const port = parseInt(process.env.PORT || '3001');
    const host = process.env.HOST || '0.0.0.0';

    await fastify.listen({ port, host });

    fastify.log.info(`
╔═══════════════════════════════════════════════════╗
║           TAURUS AI API SERVER                     ║
╠═══════════════════════════════════════════════════╣
║  API:      http://${host}:${port}
║  Health:   http://${host}:${port}/health
║  OpenCode: ${opencodeService.getServerUrl()}
╚═══════════════════════════════════════════════════╝
    `);

  } catch (error) {
    fastify.log.error(error);
    process.exit(1);
  }
}

start();
