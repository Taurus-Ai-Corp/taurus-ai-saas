/**
 * Event Routes
 * Server-Sent Events for real-time updates
 */

import { FastifyPluginAsync } from 'fastify';

export const eventRoutes: FastifyPluginAsync = async (fastify) => {
  // SSE endpoint for session events
  fastify.get<{ Params: { id: string } }>(
    '/:id/events',
    async (request, reply) => {
      const sessionId = request.params.id;

      // Set SSE headers
      reply.raw.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Access-Control-Allow-Origin': '*',
      });

      // Send initial connection event
      reply.raw.write(`data: ${JSON.stringify({ type: 'connected', sessionId })}\n\n`);

      try {
        // Subscribe to OpenCode events
        const stream = await fastify.opencode.subscribeToEvents();

        // Stream events to client
        for await (const event of stream) {
          // Filter events for this session
          const eventSessionId = event.properties?.sessionID ||
            event.properties?.part?.sessionID;

          if (eventSessionId && eventSessionId !== sessionId) {
            continue;
          }

          // Send event
          reply.raw.write(`data: ${JSON.stringify(event)}\n\n`);
        }
      } catch (error) {
        fastify.log.error('SSE error:', error);
        reply.raw.write(`data: ${JSON.stringify({ type: 'error', message: 'Stream error' })}\n\n`);
      } finally {
        reply.raw.end();
      }
    }
  );

  // Global events endpoint (all sessions)
  fastify.get('/events', async (request, reply) => {
    // Set SSE headers
    reply.raw.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
    });

    // Send initial connection event
    reply.raw.write(`data: ${JSON.stringify({ type: 'connected' })}\n\n`);

    try {
      const stream = await fastify.opencode.subscribeToEvents();

      for await (const event of stream) {
        reply.raw.write(`data: ${JSON.stringify(event)}\n\n`);
      }
    } catch (error) {
      fastify.log.error('SSE error:', error);
    } finally {
      reply.raw.end();
    }
  });
};
