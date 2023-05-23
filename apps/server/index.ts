import fastify from 'fastify';
import { prisma } from 'database';

const server = fastify({ logger: true });

server.register(import('@fastify/websocket'));

server.register(async function (fastify) {
  fastify.get(
    '/:alertBoxId',
    { websocket: true },
    (connection /* SocketStream */, req /* FastifyRequest */) => {
      const { alertBoxId } = req.params as { alertBoxId: string };
      let lastSentTime = new Date();
      let timer = setInterval(async () => {
        const donations = await prisma.alertEvent.findMany({
          select: {
            message: true,
            name: true,
            type: true,
            amount: true,
            createdAt: true,
          },
          where: {
            createdAt: {
              gt: lastSentTime,
            },
            streamer: {
              alertBoxId: alertBoxId,
            },
          },
          orderBy: {
            createdAt: 'asc',
          },
        });

        if (donations.length > 0) {
          lastSentTime = donations[donations.length - 1].createdAt;
          console.log('Sending donations', donations);
          connection.socket.send(JSON.stringify(donations));
        }
      }, 3000);

      connection.socket.on('close', () => {
        clearInterval(timer);
      });
    },
  );
});

server.listen({ port: 8080 }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});
