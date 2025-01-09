import { useEffect, useState } from 'react';

//TODO:
/*
USE: Register.tsx
*/

const useMediaQuery = (breakpoint: number) => {
  const [isMobile, toggle] = useState(false);
  const checkWidth = () => {
    if (window.innerWidth < breakpoint) {
      toggle(true);
    } else {
      toggle(false);
    }
  };

  useEffect(() => {
    checkWidth();
    window.addEventListener('resize', checkWidth);
    return () => {
      window.removeEventListener('resize', checkWidth);
    };
  });

  return { isMobile };
};

export default useMediaQuery;
