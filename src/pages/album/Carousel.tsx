import React, { useState } from "react";
import { Box, Image, Flex, Button } from "@chakra-ui/react";
import { AnimatePresence, motion } from "framer-motion";

type Media = {
  id: string;
  imageUrl: string;
};

interface CarouselProps {
  media: Media[];
}

const Carousel: React.FC<CarouselProps> = ({ media }) => {
  const [current, setCurrent] = useState(0);

  const paginate = (newDirection: number) => {
    setCurrent((current + newDirection + media.length) % media.length);
  };

  const imageSize = {
    width: "100%", // Adjust the width as needed
    height: "600px", // Adjust the height as needed
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 500 : -500,
      opacity: 1,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 500 : -500,
      opacity: 1,
    }),
  };

  return (
    <Flex
      justifyContent="center"
      alignItems="center"
      position="relative"
      width={imageSize.width}
      height={imageSize.height}
      overflow="hidden"
    >
      <AnimatePresence custom={current}>
        {media?.map((item, index) => (
          <motion.div
            key={item.id}
            custom={index - current}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
            }}
            style={{
              position: "absolute",
              width: imageSize.width,
              display: index === current ? "block" : "none",
            }}
          >
            <Image
              src={item.imageUrl}
              alt={`image-${item.id}`}
              width={imageSize.width}
              height={imageSize.height}
              objectFit="cover"
            />
          </motion.div>
        ))}
      </AnimatePresence>
      <Button
        onClick={() => paginate(-1)}
        position="absolute"
        left="0"
        zIndex="2"
      >
        Prev
      </Button>
      <Button
        onClick={() => paginate(1)}
        position="absolute"
        right="0"
        zIndex="2"
      >
        Next
      </Button>
    </Flex>
  );
};

export default Carousel;
