import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/all";
import gsap from "gsap";
import { RefObject } from "react";

type Direction = "left" | "right" | "top" | "bottom";

interface ScrollRevealOptions {
  direction?: Direction;
  duration?: number;
  delay?: number;
  stagger?: number;
  disabled?: boolean;
}

export function useScrollReveal(
  ref: RefObject<HTMLElement | null>, 
  options: ScrollRevealOptions = {}
) {
  const {
    direction = 'left',
    duration = 1,
    delay,
    stagger,
    disabled = false,
  } = options;

  useGSAP(() => {
    if (disabled || !ref.current) return;

    gsap.registerPlugin(ScrollTrigger);

    const getFromValues = () => {
      switch (direction) {
        case 'left': return { x: -50, y: 0 };
        case 'right': return { x: 50, y: 0 };
        case 'top': return { x: 0, y: -50 };
        case 'bottom': return { x: 0, y: 50 };
        default: return { x: 0, y: 0 };
      }
    };

    const from = {
      opacity: 0,
      ...getFromValues(),
    };

    const to = {
      opacity: 1,
      x: 0,
      y: 0,
      ease: 'power3.out',
      duration,
      delay,
      stagger,
      scrollTrigger: {
        trigger: ref.current,
        start: 'top 80%',
        toggleActions: 'play reverse play reverse',
      },
    };

    gsap.fromTo(ref.current, from, to);

  }, [ref, disabled]);
}
