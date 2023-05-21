'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useInterval } from 'react-use';
import { ScaleUpDownSpan } from '@/components/ScaleUpDownSpan';
import { useWebSocket } from 'react-use-websocket/dist/lib/use-websocket';
import YouTube, { YouTubeProps } from 'react-youtube';

type Message = {
  name: string;
  amount?: number;
  message?: string;
  type: 'TEXT' | 'VIDEO';
};

export default function Overlay() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState<Message | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  const socketUrl = 'ws://localhost:8080/websocket';
  const { lastMessage, readyState } = useWebSocket(socketUrl, {
    shouldReconnect: () => true,
  });

  useEffect(() => {
    if (lastMessage) {
      const data: Message[] = JSON.parse(lastMessage.data);
      setMessages((prev) => prev.concat(data));
    }
  }, [lastMessage, readyState]);

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

  const onPlayerReady: YouTubeProps['onReady'] = (event) => {
    event.target.playVideo();
  };

  const regex = /youtu.be\/([a-zA-Z0-9_-]*)\?.*t=(\d*)/;
  const match = message?.message.match(regex);

  const videoId = match[1];
  const startTime = match[2];
  console.log(videoId, startTime);

  const opts: YouTubeProps['opts'] = {
    height: '100%',
    width: '100%',
    playerVars: {
      autoplay: 1,
      controls: 0,
      disablekb: 1,
      fs: 0,
      start: startTime,
    },
  };

  return (
    <AnimatePresence>
      {isVisible ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 3 }}
          className="fixed bottom-0 left-0 right-0 w-full h-full items-center justify-end text-center text-6xl font-bold text-white drop-shadow-md shadow-black flex flex-col pb-4"
        >
          {message?.type === 'VIDEO' ? (
            <YouTube
              videoId={videoId}
              opts={opts}
              onReady={onPlayerReady}
              className="relative w-full h-full flex-1 mb-4"
            />
          ) : null}
          <p>
            <ScaleUpDownSpan>{message?.name}</ScaleUpDownSpan> 님{' '}
            <ScaleUpDownSpan>
              {Intl.NumberFormat().format(message?.amount ?? 0)}
            </ScaleUpDownSpan>{' '}
            후원 감사합니다
          </p>
          <p>{message.type === 'TEXT' ? message?.message : '[Video]'}</p>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
