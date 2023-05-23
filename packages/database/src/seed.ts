import { prisma } from '.';

import type { Streamer } from '@prisma/client';

const DEFAULT_USERS = [
  // Add your own user to pre-populate the database with
  {
    name: 'Tim Cook',
    username: 'tim_cook',
  },
  {
    name: 'Jeff Bezos',
    username: 'jeffbezos',
  },
  {
    name: 'Elon Musk',
    username: 'elonmusk',
  },
] as Array<Streamer>;

(async () => {
  try {
    await Promise.all(
      DEFAULT_USERS.map((user) =>
        prisma.streamer.upsert({
          where: {
            username: user.username,
          },
          update: {
            ...user,
          },
          create: {
            ...user,
          },
        }),
      ),
    );
  } catch (error) {
    console.error(error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
})();
