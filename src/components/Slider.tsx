'use client';
import useEmblaCarousel, { EmblaOptionsType } from 'embla-carousel-react';
import { PropsWithChildren } from 'react';

// Define the props
type Props = PropsWithChildren & EmblaOptionsType;

export const Slider = ({ children, ...options }: Props) => {
  // 1. useEmblaCarousel returns a `emblaRef` and we must attach the ref to a container element like a div.
  // EmblaCarousel will use that ref as basis for swipe and other functionality.
  const [emblaRef] = useEmblaCarousel(options);

  return (
    // Attach ref to a div
    // 2. The wrapper div must have overflow:hidden
    <div className='overflow-hidden' ref={emblaRef}>
      {/* 3. The inner div must have a display:flex property for horizontal scrolling*/}
      {/* 4. We pass the children as-is so that the outside component can style it accordingly */}
      <div className='flex'>{children}</div>
    </div>
  );
};
export default Slider;
