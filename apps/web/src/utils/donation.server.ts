'use server';
import { prisma } from 'database';
import { zact } from 'zact/server';
import { z } from 'zod';

const donationSchema = z.object({
  type: z.enum(['TEXT', 'VIDEO']),
  name: z.string(),
  amount: z.number(),
  message: z.string(),
  username: z.string(),
});

export type DonationInput = z.infer<typeof donationSchema>;

export const donation = zact(donationSchema)(async (input) => {
  await prisma.alertEvent.create({
    data: {
      streamer: {
        connect: {
          username: input.username,
        },
      },
      name: input.name,
      amount: input.amount,
      message: input.message,
      type: input.type,
    },
  });
});
