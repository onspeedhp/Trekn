import { useEffect } from 'react';

const useAutoPlay = (videoRef: any) => {
  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.5,
    };

    if (videoRef.current) {
      const handleIntersection = (entries: any, observer: any) => {
        entries.forEach((entry: any) => {
          if (entry.isIntersecting) {
            videoRef.current.play().catch((error: any) => {
              console.error('Autoplay failed:', error);
            });
          } else {
            // Video is out of view, pause it
            videoRef.current.pause();
          }
        });
      };

      const observer = new IntersectionObserver(handleIntersection, options);
      observer.observe(videoRef.current);

      return () => {
        observer.disconnect();
      };
    }
  }, [videoRef]);

  return null;
};

export default useAutoPlay;
