import React, { useRef, useState } from 'react';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';

// import required modules
import { Pagination } from 'swiper/modules';

export const ReadyToCollectSlider = ({ data }: { data: any }) => {
  return (
    <>
      <div className='mt-9'>
        <Swiper
          // slidesPerView={'auto'}
          spaceBetween={0}
          width={335}
          height={338}
          modules={[Pagination]}
          className='w-[300px]'
          autoplay={true}
          // className='mySwiper'
        >
          {data.map((drop: any, index: any) => (
            <SwiperSlide className=''>
              <img
                key={index}
                src={`${drop.image}`}
                style={{
                  width: 300,
                  height: 338,
                  objectFit: 'cover',
                  objectPosition: 'center',
                }}
                alt=''
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </>
  );
};
