'use client';

import { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useInterval } from 'react-use';
import { ScaleUpDownSpan } from '@/components/ScaleUpDownSpan';
import { useWebSocket } from 'react-use-websocket/dist/lib/use-websocket';
import YouTube, { YouTubeProps } from 'react-youtube';
import { getStartSeconds, getVideoId } from '@/utils/youtube';
import { useParams } from 'next/navigation';
import DefaultImage from '@/assets/default.webp';
import Image from 'next/image';

type Message = {
  name: string;
  amount?: number;
  message?: string;
  type: 'TEXT' | 'VIDEO';
};

export default function Overlay() {
  const [messages, setMessages] = useState<Message[]>([]);

  const [message, setMessage] = useState<Message | null>(null);
  const videoId = getVideoId(message?.message ?? '');
  const startTime = getStartSeconds(message?.message ?? '');

  const [isVisible, setIsVisible] = useState(false);

  const { id } = useParams();

  const socketUrl = `ws://localhost:8080/${id}`;
  const { lastMessage, readyState } = useWebSocket(socketUrl, {
    shouldReconnect: () => true,
  });

  useEffect(() => {
    if (lastMessage) {
      const data: Message[] = JSON.parse(lastMessage.data);
      setMessages((prev) => prev.concat(data));
    }
  }, [lastMessage, readyState]);

  const handleTimeOut = useCallback((ms: number) => {
    setTimeout(() => {
      setIsVisible(false);
    }, ms);
  }, []);

  useInterval(() => {
    if (messages.length === 0) {
      return;
    }
    if (isVisible) {
      return;
    }

    const newMessage = messages[0];
    setMessage(newMessage);
    setMessages((prevMessages) => prevMessages.slice(1));

    setIsVisible(true);

    if (newMessage?.type === 'TEXT') {
      handleTimeOut(10000);
    }
  }, 1000);

  const handleOnPlay = useCallback(() => {
    handleTimeOut(10000);
  }, [handleTimeOut]);

  const handleOnPlayerReady: YouTubeProps['onReady'] = (event) => {
    event.target.playVideo();
  };

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
          className="fixed bottom-0 left-0 right-0 w-full h-full items-center justify-end text-center text-6xl font-bold text-white drop-shadow-md shadow-black flex flex-col pb-4"
        >
          {message?.type === 'VIDEO' ? (
            <YouTube
              videoId={videoId}
              opts={opts}
              onReady={handleOnPlayerReady}
              onPlay={handleOnPlay}
              className="relative w-full h-full flex-1 mb-8"
            />
          ) : (
            <Image src={DefaultImage} className="w-1/2 mb-16" alt="" />
          )}
          <div className="flex flex-col gap-8">
            <p>
              <ScaleUpDownSpan>{message?.name}</ScaleUpDownSpan> 님{' '}
              <ScaleUpDownSpan>
                {Intl.NumberFormat().format(message?.amount ?? 0)}
              </ScaleUpDownSpan>{' '}
              후원 감사합니다
            </p>
            <p className="leading-normal">
              {message.type === 'TEXT' ? message?.message : '[Video]'}
            </p>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
