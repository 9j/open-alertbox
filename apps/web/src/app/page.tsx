'use client';

import { useForm } from 'react-hook-form';
import { useZact } from 'zact/client';

import { donation } from '@/utils/donation.server';

type FormValues = {
  type: 'TEXT' | 'VIDEO';
  name: string;
  amount: number;
  message: string;
};
export default function Home() {
  const { register, watch, handleSubmit } = useForm<FormValues>({
    defaultValues: {
      type: 'TEXT',
      amount: 1000,
    },
  });
  const type = watch('type');
  const { mutate } = useZact(donation);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <form
        onSubmit={handleSubmit(mutate)}
        className="w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex flex-col"
      >
        <div className="mb-4">
          <span className="block text-gray-700 text-sm font-bold mb-2">
            Type:
          </span>
          <div className="flex items-center">
            <input
              type="radio"
              id="text"
              value="TEXT"
              {...register('type', { required: true })}
              className="text-blue-500 focus:ring-blue-500"
            />
            <label htmlFor="text" className="ml-2 text-gray-700 text-sm">
              Text
            </label>
          </div>
          <div className="flex items-center mt-2">
            <input
              type="radio"
              id="video"
              value="VIDEO"
              {...register('type', { required: true })}
              className="text-blue-500 focus:ring-blue-500"
            />
            <label htmlFor="video" className="ml-2 text-gray-700 text-sm">
              Video
            </label>
          </div>
        </div>

        <div className="mb-4">
          <label
            htmlFor="name"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Name:
          </label>
          <input
            type="text"
            id="name"
            {...register('name', { required: true })}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Your Name"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="amount"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Amount:
          </label>
          <input
            type="number"
            id="amount"
            {...register('amount', { required: true, valueAsNumber: true })}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Amount"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="message"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            {type === 'TEXT' ? 'Message' : 'Video URL'}:
          </label>
          <textarea
            id="message"
            {...register('message', { required: true })}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Your Message"
          ></textarea>
        </div>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Submit
        </button>
      </form>
    </main>
  );
}
