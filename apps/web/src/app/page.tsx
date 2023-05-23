'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

export default function Home() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { delay: 0.5, duration: 1 },
    },
    exit: {
      x: '-100vw',
      transition: { ease: 'easeInOut' },
    },
  };

  const router = useRouter();
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const alertBoxId = formData.get('alertBoxId');
    router.push(`/alert-box/${alertBoxId}`);
  };

  return (
    <motion.div
      className="container flex place-items-center h-screen w-full mx-auto my-0 justify-center"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <motion.div className="text-center space-y-4 p-4 md:p-0">
        <motion.h1
          className="text-4xl font-bold"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
        >
          OPEN ALERTBOX
        </motion.h1>
        <motion.p
          className="text-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
        >
          Easily customize your AlertBox for broadcast.
        </motion.p>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col space-y-4 place-items-center">
            <motion.input
              type="text"
              className="border-2 border-gray-300 p-2 rounded w-full"
              name="alertBoxId"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.75, duration: 1 }}
              placeholder="Enter your AlertBox ID"
            />
            <motion.button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              Open AlertBox
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
