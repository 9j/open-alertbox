'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useInterval } from 'react-use';
import { ScaleUpDownSpan } from '@/components/ScaleUpDownSpan';

type Message = {
  name: string;
  amount: number;
  message: string;
};

export default function Overlay() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState<Message | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const source = new EventSource('/api/overlay');

    source.onmessage = function (event) {
      console.log('Server-sent event received:', event.data);
      const newMessages = JSON.parse(event.data);
      setMessages((prevMessages) => [...prevMessages, ...newMessages]);
    };

    source.onerror = function (error) {
      console.error(
        'Error occurred while receiving server-sent events:',
        error,
      );
    };

    return () => {
      source.close();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useInterval(() => {
    if (messages.length === 0) {
      return;
    }
    setMessage(messages[0]);
    setMessages((prevMessages) => prevMessages.slice(1));
    setIsVisible(true);
    setTimeout(() => {
      setIsVisible(false);
    }, 3000);
  }, 5000);

  return (
    <AnimatePresence>
      {isVisible ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 3 }}
          className="fixed bottom-0 left-0 right-0 p-4 text-3xl font-bold text-white drop-shadow-md shadow-black w-fit"
        >
          <p>
            <ScaleUpDownSpan>{message?.name}</ScaleUpDownSpan> 님{' '}
            <ScaleUpDownSpan>
              {Intl.NumberFormat().format(message?.amount ?? 0)}
            </ScaleUpDownSpan>{' '}
            후원 감사합니다
          </p>
          <p className="text-center">{message?.message}</p>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
