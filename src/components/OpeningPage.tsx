import { motion } from 'motion/react';
import { useState } from 'react';
import { ECardSettings } from '../types';

interface Props {
  settings: ECardSettings;
  onClickEmbedded: () => void;
  onStartTransition?: () => void;
  key?: string;
}

export function OpeningPage({ settings, onClickEmbedded, onStartTransition }: Props) {
  const [isOpening, setIsOpening] = useState(false);

  const handleClick = () => {
    if (isOpening) return;
    setIsOpening(true);
    if (onStartTransition) onStartTransition();
    setTimeout(() => {
      onClickEmbedded();
    }, 1000);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
      transition={{ duration: 0.8 }}
      className="relative w-full h-full min-h-full overflow-hidden flex items-center justify-center"
      style={{ backgroundColor: settings.openingBgColor || '#fce7f3' }}
    >
      {/* Background Color is applied to the wrapper directly */}

      {/* Corner Emojis */}
      <motion.div className="absolute top-4 left-4 text-3xl pointer-events-none z-10" animate={{ y: [0, -10, 0], rotate: [0, 5, -5, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}>🌿</motion.div>
      <motion.div className="absolute top-4 right-4 text-3xl pointer-events-none z-10" animate={{ y: [0, 10, 0], rotate: [0, -5, 5, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}>🌸</motion.div>
      <motion.div className="absolute bottom-4 left-4 text-3xl pointer-events-none z-10" animate={{ y: [0, -8, 0], rotate: [0, 8, -8, 0] }} transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}>🌼</motion.div>
      <motion.div className="absolute bottom-4 right-4 text-3xl pointer-events-none z-10" animate={{ y: [0, 12, 0], rotate: [0, -10, 10, 0] }} transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}>☘️</motion.div>

      {/* Text Elements */}
      {settings.textElements?.map(textEl => (
        <motion.div
          key={textEl.id}
          className="absolute z-10 pointer-events-none drop-shadow-md whitespace-pre-wrap"
          style={{
            top: `${textEl.top}%`,
            left: `${textEl.left}%`,
            color: textEl.color,
            fontFamily: `"${textEl.fontFamily}", sans-serif`,
            fontSize: `${textEl.fontSize}rem`,
            textAlign: textEl.textAlign,
            transform: 'translate(-50%, -50%)',
          }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          {textEl.text}
        </motion.div>
      ))}

      {/* Embedded Clickable Image */}
      {settings.embeddedImageUrl && (
        <button
          onClick={handleClick}
          className="absolute z-10 group focus:outline-none"
          style={{
            top: `${settings.embeddedImageTop}%`,
            left: `${settings.embeddedImageLeft}%`,
            width: `${settings.embeddedImageWidth}%`,
            transform: 'translate(-50%, -50%)',
          }}
          aria-label="Enter E-Card"
          disabled={isOpening}
        >
          <motion.div
            animate={
              isOpening
                ? { 
                    scale: [1, 0.9, 0.95, 1.1, 1.5, 2], 
                    rotate: [0, -3, 3, -2, 2, 0],
                    opacity: [1, 1, 0.9, 0.7, 0.3, 0] 
                  }
                : { scale: 1, opacity: 1, rotate: 0 }
            }
            transition={{
              duration: isOpening ? 2 : 0,
              ease: "easeInOut",
              times: [0, 0.1, 0.3, 0.6, 0.8, 1]
            }}
          >
            <motion.img
              whileHover={!isOpening ? { scale: 1.05 } : {}}
              whileTap={!isOpening ? { scale: 0.95 } : {}}
              src={settings.embeddedImageUrl}
              className="w-full h-auto drop-shadow-2xl transition-transform"
              alt="Click to enter"
              referrerPolicy="no-referrer"
              
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://placehold.co/800x800/cccccc/666666?text=Invalid+Image+URL';
              }}
            />
          </motion.div>
        </button>
      )}
    </motion.div>
  );
}
