'use server';
import { prisma } from 'database';
import { zact } from 'zact/server';
import { z } from 'zod';

type FormValues = {
  name: string;
  amount: number;
  message: string;
};

export const donation = zact(
  z.object({
    name: z.string(),
    amount: z.number(),
    message: z.string(),
  }),
)(async (input) => {
  await prisma.alertEvent.create({
    data: {
      name: input.name,
      amount: input.amount,
      message: input.message,
      type: 'DONATION',
    },
  });
});
