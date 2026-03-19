import { useEffect, useState, useRef } from "react";

interface Options extends IntersectionObserverInit {
  triggerOnce?: boolean;
}

export const useInView = (options?: Options) => {
  const [isInView, setIsInView] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsInView(true);
        if (options?.triggerOnce) {
          observer.unobserve(entry.target);
        }
      } else {
        if (!options?.triggerOnce) {
          setIsInView(false);
        }
      }
    }, options);

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [options]);

  return { ref, isInView };
};
