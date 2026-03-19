"use client";

import React, { useState, useEffect, useCallback } from "react";

interface TypewriterProps {
  phrases: string[];
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseDuration?: number;
}

const Typewriter: React.FC<TypewriterProps> = ({
  phrases,
  typingSpeed = 100,
  deletingSpeed = 50,
  pauseDuration = 3000,
}) => {
  const [index, setIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [reverse, setReverse] = useState(false);
  const [blink, setBlink] = useState(true);

  // Blinking cursor effect
  useEffect(() => {
    const timeout2 = setTimeout(() => {
      setBlink((prev) => !prev);
    }, 500);
    return () => clearTimeout(timeout2);
  }, [blink]);

  // Main typing logic
  useEffect(() => {
    if (index === phrases.length) {
      setIndex(0);
      return;
    }

    if (subIndex === phrases[index].length + 1 && !reverse) {
      // Pause at the end of typing
      const timeout = setTimeout(() => setReverse(true), pauseDuration);
      return () => clearTimeout(timeout);
    }

    if (subIndex === 0 && reverse) {
      // Finished deleting, move to next phrase
      setReverse(false);
      setIndex((prev) => (prev + 1) % phrases.length);
      return;
    }

    const timeout = setTimeout(() => {
      setSubIndex((prev) => prev + (reverse ? -1 : 1));
    }, reverse ? deletingSpeed : typingSpeed);

    return () => clearTimeout(timeout);
  }, [subIndex, index, reverse, phrases, typingSpeed, deletingSpeed, pauseDuration]);

  // Reset when phrases change (language change)
  useEffect(() => {
    setIndex(0);
    setSubIndex(0);
    setReverse(false);
  }, [phrases]);

  return (
    <span className="inline-block">
      {phrases[index].substring(0, subIndex)}
      <span 
        className={`inline-block ml-1 border-r-4 border-primary h-[0.9em] align-middle ${blink ? 'opacity-100' : 'opacity-0'}`}
      ></span>
    </span>
  );
};

export default Typewriter;
