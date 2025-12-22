/**
 * Session Routes
 * CRUD operations for chat sessions
 */

import { FastifyPluginAsync } from 'fastify';

export const sessionRoutes: FastifyPluginAsync = async (fastify) => {
  // List all sessions
  fastify.get('/', async (request, reply) => {
    try {
      const sessions = await fastify.opencode.listSessions();
      return { sessions };
    } catch (error) {
      reply.status(500).send({ error: 'Failed to list sessions' });
    }
  });

  // Create new session
  fastify.post('/', async (request, reply) => {
    try {
      const body = request.body as { title?: string };
      const session = await fastify.opencode.createSession(body?.title);
      return { session };
    } catch (error) {
      reply.status(500).send({ error: 'Failed to create session' });
    }
  });

  // Get session by ID
  fastify.get<{ Params: { id: string } }>('/:id', async (request, reply) => {
    try {
      const session = await fastify.opencode.getSession(request.params.id);
      return { session };
    } catch (error) {
      reply.status(404).send({ error: 'Session not found' });
    }
  });

  // Delete session
  fastify.delete<{ Params: { id: string } }>('/:id', async (request, reply) => {
    try {
      await fastify.opencode.deleteSession(request.params.id);
      return { success: true };
    } catch (error) {
      reply.status(500).send({ error: 'Failed to delete session' });
    }
  });

  // Get session messages
  fastify.get<{ Params: { id: string } }>('/:id/messages', async (request, reply) => {
    try {
      const messages = await fastify.opencode.getMessages(request.params.id);
      return { messages };
    } catch (error) {
      reply.status(500).send({ error: 'Failed to get messages' });
    }
  });

  // Send prompt (synchronous)
  fastify.post<{
    Params: { id: string };
    Body: {
      parts: Array<{ type: string; text?: string }>;
      model?: { providerID: string; modelID: string };
      agent?: string;
      noReply?: boolean;
    };
  }>('/:id/prompt', async (request, reply) => {
    try {
      const { parts, model, agent, noReply } = request.body;
      const result = await fastify.opencode.prompt(
        request.params.id,
        parts,
        { model, agent, noReply }
      );
      return result;
    } catch (error) {
      fastify.log.error(error);
      reply.status(500).send({ error: 'Failed to send prompt' });
    }
  });

  // Send prompt (async - for streaming)
  fastify.post<{
    Params: { id: string };
    Body: {
      parts: Array<{ type: string; text?: string }>;
      model?: { providerID: string; modelID: string };
      agent?: string;
    };
  }>('/:id/prompt/async', async (request, reply) => {
    try {
      const { parts, model, agent } = request.body;
      await fastify.opencode.promptAsync(
        request.params.id,
        parts,
        { model, agent }
      );
      return { success: true };
    } catch (error) {
      fastify.log.error(error);
      reply.status(500).send({ error: 'Failed to send prompt' });
    }
  });

  // Abort session
  fastify.post<{ Params: { id: string } }>('/:id/abort', async (request, reply) => {
    try {
      await fastify.opencode.abortSession(request.params.id);
      return { success: true };
    } catch (error) {
      reply.status(500).send({ error: 'Failed to abort session' });
    }
  });
};
