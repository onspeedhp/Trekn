import React, { useMemo, useState } from 'react';
import { DetailCard } from './DetailCard';
import { LocationDetail } from '../models/types';

export const ListDetail = ({ data }: ListDetailProps) => {
  const [amountShowItem, setAmountShowItem] = useState(3);

  const handleShowMore = () => {
    if (data?.length === 0) return;
    if (amountShowItem + 3 >= data.length) {
      setAmountShowItem(data?.length);
    } else {
      setAmountShowItem(amountShowItem + 3);
    }
  };

  const isShowShowMore = useMemo(() => {
    return data?.length > 0 && amountShowItem < data?.length;
  }, [amountShowItem, data]);

  return (
    <div className='w-full'>
      <div className='grid gap-[24px] grid-cols-1 sm:grid-cols-3 '>
        {data?.slice(0, amountShowItem).map((item, index) => (
          <DetailCard key={index} data={item} />
        ))}
      </div>
      {isShowShowMore && (
        <div
          className='w-full flex justify-center text-sm font-semibold text-[#00A868] cursor-pointer '
          onClick={() => handleShowMore()}
        >
          View more
        </div>
      )}
    </div>
  );
};

interface ListDetailProps {
  data: LocationDetail[];
}
