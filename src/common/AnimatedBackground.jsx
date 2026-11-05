import { useEffect } from "react";
import { motion, useAnimate } from "framer-motion";

const AnimatedBackground = () => {
  const [scope, animate] = useAnimate();
  const [scope2, animate2] = useAnimate();

  useEffect(() => {
    animate(
      [
        [
          scope.current,
          {
            pathLength: 1,
            pathOffset: 0,
          },
          {
            duration: 2,
          },
        ],
        [
          scope.current,
          {
            pathLength: 1,
            pathOffset: 1,
          },
          {
            duration: 2,
            delay: 1,
          },
        ],
      ],
      {
        repeat: Infinity,
      }
    );

    animate2(
      [
        [
          scope2.current,
          {
            pathLength: 1,
            pathOffset: 0,
          },
          {
            duration: 2,
          },
        ],
        [
          scope2.current,
          {
            pathLength: 1,
            pathOffset: 1,
          },
          {
            duration: 2,
            delay: 1,
          },
        ],
      ],
      {
        repeat: Infinity,
        delay: 1.5,
      }
    );
  }, []);

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1440 1080"
      className="fixed blur-lg -z-50 top-0 min-w-[110vw] min-h-[1080px]"
      fill="transparent"
    >
      <motion.path
        d="M0,288L48,272C96,256,192,224,288,197.3C384,171,480,149,576,165.3C672,181,768,235,864,250.7C960,267,1056,245,1152,250.7C1248,256,1344,288,1392,304L1440,320L1440,320"
        stroke="#4e8490"
        strokeWidth={4}
        initial={{
          pathLength: 0,
          pathOffset: 0,
        }}
        ref={scope}
      />

      <motion.path
        d="M 0 606 L 48 584.7 C 96 563 192 521 288 510 C 384 499 480 521 576 499.3 C 672 478 768 414 864 430 C 960 446 1056 542 1152 547.3 C 1248 553 1344 467 1392 424.7 L 1440 382"
        stroke="#ff511c"
        strokeWidth={4}
        initial={{
          pathLength: 0,
          pathOffset: 0,
        }}
        ref={scope2}
      />
    </svg>
  );
};

export default AnimatedBackground;
