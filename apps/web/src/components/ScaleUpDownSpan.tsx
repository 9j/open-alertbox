import { motion } from 'framer-motion';

import React from 'react';

type Props = {
  children: React.ReactNode;
};

const ScaleUpDownSpan = React.forwardRef<HTMLSpanElement, Props>(
  (props, ref) => {
    const { children } = props;
    return (
      <motion.span
        ref={ref}
        className="text-yellow-400 inline-block"
        initial={{ scale: 1 }}
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 1, repeat: Infinity }}
      >
        {children}
      </motion.span>
    );
  },
);
ScaleUpDownSpan.displayName = 'ScaleUpDownSpan';

export { ScaleUpDownSpan };
