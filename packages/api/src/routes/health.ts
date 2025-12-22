/**
 * Health Check Routes
 */

import { FastifyPluginAsync } from 'fastify';

export const healthRoutes: FastifyPluginAsync = async (fastify) => {
  // Simple health check
  fastify.get('/health', async () => {
    return {
      status: 'ok',
      timestamp: Date.now(),
      opencode: fastify.opencode.isInitialized(),
    };
  });

  // Detailed status
  fastify.get('/status', async () => {
    return {
      status: 'ok',
      timestamp: Date.now(),
      services: {
        opencode: {
          initialized: fastify.opencode.isInitialized(),
          url: fastify.opencode.getServerUrl(),
        },
        hedera: {
          network: process.env.HEDERA_NETWORK || 'testnet',
          operatorId: process.env.HEDERA_OPERATOR_ID,
        },
        mongodb: {
          configured: !!process.env.MONGODB_URI,
        },
      },
    };
  });
};
