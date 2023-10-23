import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { getMintedById } from '../middleware/data/minted';
import { getDropByID } from '../middleware/data/drop';
import moment, { min } from 'moment';
import { useAuthContext } from '../context/AuthContext';
import { useSelector } from 'react-redux';

export const NftDetails = () => {
  const { mintedId, dropId } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState<any>(null);
  const { windowSize } = useAuthContext();
  const user = useSelector((state: any) => state.user);

  useEffect(() => {
    if (!user.id) {
      navigate('/');
    }

    if (mintedId) {
      getMintedById({
        mintedId: mintedId,
        onSuccess: async (data, count) => {
          const minted = data[0];

          setData({
            dropId: minted.drop.id,
            image: minted.drop.image,
            created_at: minted.created_at,
            name: minted.drop.name,
            location_name: minted.drop.location_name,
            location: minted.drop.location,
            description: minted.drop.description,
            user: minted.drop.user,
            count: count,
          });
        },
      });
    } else if (dropId) {
      getDropByID({
        dropId: dropId,
        onSuccess: (data: any) => {
          setData(data[0]);
        },
      });
    }
  }, []);
  return (
    <>
      <div className='bg-black absolute w-full h-full overflow-scroll'>
        <div className='m-5 font-semibold'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            width='17'
            height='16'
            viewBox='0 0 17 16'
            fill='none'
            className='mb-6'
            onClick={() => {
              navigate('/account');
            }}
          >
            <path
              d='M9.21347 13.9093L8.51972 14.6031C8.22597 14.8968 7.75097 14.8968 7.46035 14.6031L1.38535 8.5312C1.0916 8.23745 1.0916 7.76245 1.38535 7.47183L7.46035 1.39683C7.7541 1.10308 8.2291 1.10308 8.51972 1.39683L9.21347 2.09058C9.51035 2.38745 9.5041 2.87183 9.20097 3.16245L5.43535 6.74995H14.4166C14.8322 6.74995 15.1666 7.08433 15.1666 7.49995V8.49995C15.1666 8.91558 14.8322 9.24996 14.4166 9.24996H5.43535L9.20097 12.8375C9.50722 13.1281 9.51347 13.6125 9.21347 13.9093Z'
              fill='white'
              fillOpacity='0.7'
            />
          </svg>
          {data && (
            <>
              <div className='flex-col'>
                <img
                  src={`${data.image}`}
                  style={{
                    width: windowSize.width - 40,
                    height: 335,
                    objectFit: 'cover',
                    objectPosition: 'center',
                  }}
                  className='rounded-xl'
                />

                {mintedId && (
                  <>
                    <div className='flex-col mt-4'>
                      <div className='text-[#BDBDBA] text-[13px] font-medium'>
                        Author
                      </div>
                      <div className='text-white font-semibold flex mt-1 items-center'>
                        <img
                          className='rounded-full w-6 h-6'
                          src={`${data.user.profileImage}`}
                          alt=''
                        />

                        <div className='ml-2'>{data.user.name}</div>
                      </div>
                    </div>
                    <div className='flex-col mt-4'>
                      <div className='text-[#BDBDBA] text-[13px] font-medium'>
                        Number of owners
                      </div>
                      <div className='text-white font-semibold'>
                        {data.count}
                      </div>
                    </div>
                  </>
                )}

                <div className='flex-col mt-4'>
                  <div className='text-[#BDBDBA] text-[13px] font-medium'>
                    {mintedId ? 'Collected' : 'Drop'} time
                  </div>
                  <div className='text-white font-semibold'>
                    {moment(data.created_at).format('MMMM Do YYYY, h:mm:ss a')}
                  </div>
                </div>

                <div className='flex-col mt-4'>
                  <div className='text-[#BDBDBA] text-[13px] font-medium'>
                    Drop name
                  </div>
                  <div className='text-white font-semibold'>{data.name}</div>
                </div>

                <div className='flex-col mt-4'>
                  <div className='text-[#BDBDBA] text-[13px] font-medium'>
                    Drop location
                  </div>
                  <div className='text-white font-semibold'>
                    {data.location}
                  </div>
                </div>

                <div className='flex-col mt-4'>
                  <div className='text-[#BDBDBA] text-[13px] font-medium'>
                    Drop discription
                  </div>
                  <div className='text-white font-semibold'>
                    {data.description}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};
