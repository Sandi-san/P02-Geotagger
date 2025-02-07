import { useEffect, useState } from 'react';

const useMediaQuery = (breakpoint: number) => {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < breakpoint);

  useEffect(() => {
    const checkWidth = () => {
      const mobile = window.innerWidth < breakpoint;
      if (mobile !== isMobile) {
        setIsMobile(mobile);
      }
    };

    checkWidth(); // Set initial state correctly
    window.addEventListener('resize', checkWidth);
    
    return () => {
      window.removeEventListener('resize', checkWidth);
    };
  }, [isMobile]); // Depend on isMobile to ensure correct updates

  return { isMobile };
};

export default useMediaQuery;

// import { useEffect, useState } from 'react';

// const useMediaQuery = (breakpoint: number) => {
//   const [isMobile, toggle] = useState(false);
//   const checkWidth = () => {
//     if (window.innerWidth < breakpoint) {
//       toggle(true);
//     } else {
//       toggle(false);
//     }
//   };

//   useEffect(() => {
//     checkWidth();
//     window.addEventListener('resize', checkWidth);
//     return () => {
//       window.removeEventListener('resize', checkWidth);
//     };
//   });

//   return { isMobile };
// };

// export default useMediaQuery;
