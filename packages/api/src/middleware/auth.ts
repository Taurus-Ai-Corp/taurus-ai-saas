/**
 * Authentication Middleware
 * Supports API key and JWT-based authentication
 */

import { FastifyRequest, FastifyReply, FastifyPluginAsync } from 'fastify';

export interface AuthenticatedRequest extends FastifyRequest {
  user?: {
    id: string;
    email?: string;
    provider?: string;
  };
}

// API key validation
export async function validateApiKey(
  request: AuthenticatedRequest,
  reply: FastifyReply
) {
  const apiKey = request.headers['x-api-key'] as string;

  if (!apiKey) {
    return; // Allow anonymous access for now
  }

  // Validate API key (implement your logic here)
  // For now, just set a user context
  request.user = {
    id: 'api-user',
    provider: 'api-key',
  };
}

// JWT validation (for Firebase Auth)
export async function validateJwt(
  request: AuthenticatedRequest,
  reply: FastifyReply
) {
  const authHeader = request.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    return; // Allow anonymous access for now
  }

  const token = authHeader.slice(7);

  try {
    // TODO: Verify Firebase JWT token
    // const decodedToken = await admin.auth().verifyIdToken(token);
    // request.user = {
    //   id: decodedToken.uid,
    //   email: decodedToken.email,
    //   provider: 'firebase',
    // };
  } catch (error) {
    // Invalid token
    reply.status(401).send({ error: 'Invalid token' });
  }
}

// Auth plugin
export const authPlugin: FastifyPluginAsync = async (fastify) => {
  // Add auth hook to all routes
  fastify.addHook('preHandler', async (request: AuthenticatedRequest, reply) => {
    // Try API key first
    await validateApiKey(request, reply);

    // Then try JWT
    if (!request.user) {
      await validateJwt(request, reply);
    }
  });
};

// Require authentication decorator
export function requireAuth(
  request: AuthenticatedRequest,
  reply: FastifyReply,
  done: () => void
) {
  if (!request.user) {
    reply.status(401).send({ error: 'Authentication required' });
    return;
  }
  done();
}
