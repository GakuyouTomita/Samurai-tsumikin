import React, { useEffect, useRef } from 'react';

const PopAnimation = ({ children }) => {
  const elementRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-pop', 'opacity-100');
        }
      },
      {
        threshold: 0.5, // 要素が50%以上表示されたら発火
      }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={elementRef}
      className="opacity-0 transition-opacity duration-500" // 初期状態は透明
    >
      {children}
    </div>
  );
};

export default PopAnimation;
