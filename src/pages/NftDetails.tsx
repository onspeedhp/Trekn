import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { getMintedById } from '../middleware/data/minted';
import { getDropByID } from '../middleware/data/drop';
import moment from 'moment';
import { useAuthContext } from '../context/AuthContext';

export const NftDetails = () => {
  const { mintedId, dropId } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState<any>(null);
  const { loggedIn } = useAuthContext();

  useEffect(() => {
    if (!loggedIn) {
      navigate('/');
    }

    if (mintedId) {
      getMintedById({
        mintedId: mintedId,
        onSuccess: (data: any) => {
          const minted = data[0];
          setData({
            image_link: minted.drop.image_link,
            created_at: minted.created_at,
            name: minted.drop.name,
            location_name: minted.drop.location_name,
            location: minted.drop.location,
            desc: minted.drop.desc,
          });
        },
      });
    } else if (dropId) {
      getDropByID({
        dropId: dropId,
        onSuccess: (data: any) => {
          setData(data[0]);
          console.log(data[0]);
        },
      });
    }
  }, []);
  return (
    <>
      <div className='bg-black absolute w-full h-screen overflow-scroll'>
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
                  src={`${data.image_link}`}
                  style={{ width: 335, height: 335 }}
                  className='rounded-xl'
                />

                {mintedId && (
                  <div className='flex-col mt-4'>
                    <div className='text-[#BDBDBA] text-[13px] font-medium'>
                      Author
                    </div>
                    <div className='text-white font-semibold flex mt-1'>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        width='24'
                        height='25'
                        viewBox='0 0 24 25'
                        fill='none'
                      >
                        <g clipPath='url(#clip0_52_5107)'>
                          <mask
                            id='mask0_52_5107'
                            maskUnits='userSpaceOnUse'
                            x='0'
                            y='0'
                            width='24'
                            height='25'
                          >
                            <path
                              d='M24 12.4658C24 5.8384 18.6274 0.46582 12 0.46582C5.37258 0.46582 0 5.8384 0 12.4658C0 19.0932 5.37258 24.4658 12 24.4658C18.6274 24.4658 24 19.0932 24 12.4658Z'
                              fill='white'
                            />
                          </mask>
                          <g mask='url(#mask0_52_5107)'>
                            <path
                              d='M9 0.46582H6V3.46582H9V0.46582Z'
                              fill='#FFAD08'
                            />
                            <path
                              d='M15 0.46582H12V3.46582H15V0.46582Z'
                              fill='#EDD75A'
                            />
                            <path
                              d='M21 0.46582H18V3.46582H21V0.46582Z'
                              fill='#EDD75A'
                            />
                            <path
                              d='M6 0.46582H3V3.46582H6V0.46582Z'
                              fill='#EDD75A'
                            />
                            <path
                              d='M12 0.46582H9V3.46582H12V0.46582Z'
                              fill='#FFAD08'
                            />
                            <path
                              d='M18 0.46582H15V3.46582H18V0.46582Z'
                              fill='#EDD75A'
                            />
                            <path
                              d='M24 0.46582H21V3.46582H24V0.46582Z'
                              fill='#FFAD08'
                            />
                            <path
                              d='M3 3.46582H0V6.46582H3V3.46582Z'
                              fill='#EDD75A'
                            />
                            <path
                              d='M3 6.46582H0V9.46582H3V6.46582Z'
                              fill='#73B06F'
                            />
                            <path
                              d='M3 9.46582H0V12.4658H3V9.46582Z'
                              fill='#FFAD08'
                            />
                            <path
                              d='M3 12.4658H0V15.4658H3V12.4658Z'
                              fill='#0C8F8F'
                            />
                            <path
                              d='M3 15.4658H0V18.4658H3V15.4658Z'
                              fill='#EDD75A'
                            />
                            <path
                              d='M3 18.4658H0V21.4658H3V18.4658Z'
                              fill='#73B06F'
                            />
                            <path
                              d='M3 21.4658H0V24.4658H3V21.4658Z'
                              fill='#FFAD08'
                            />
                            <path
                              d='M9 3.46582H6V6.46582H9V3.46582Z'
                              fill='#FFAD08'
                            />
                            <path
                              d='M9 6.46582H6V9.46582H9V6.46582Z'
                              fill='#EDD75A'
                            />
                            <path
                              d='M9 9.46582H6V12.4658H9V9.46582Z'
                              fill='#FFAD08'
                            />
                            <path
                              d='M9 12.4658H6V15.4658H9V12.4658Z'
                              fill='#73B06F'
                            />
                            <path
                              d='M9 15.4658H6V18.4658H9V15.4658Z'
                              fill='#EDD75A'
                            />
                            <path
                              d='M9 18.4658H6V21.4658H9V18.4658Z'
                              fill='#FFAD08'
                            />
                            <path
                              d='M9 21.4658H6V24.4658H9V21.4658Z'
                              fill='#405059'
                            />
                            <path
                              d='M15 3.46582H12V6.46582H15V3.46582Z'
                              fill='#405059'
                            />
                            <path
                              d='M15 6.46582H12V9.46582H15V6.46582Z'
                              fill='#0C8F8F'
                            />
                            <path
                              d='M15 9.46582H12V12.4658H15V9.46582Z'
                              fill='#EDD75A'
                            />
                            <path
                              d='M15 12.4658H12V15.4658H15V12.4658Z'
                              fill='#FFAD08'
                            />
                            <path
                              d='M15 15.4658H12V18.4658H15V15.4658Z'
                              fill='#FFAD08'
                            />
                            <path
                              d='M15 18.4658H12V21.4658H15V18.4658Z'
                              fill='#EDD75A'
                            />
                            <path
                              d='M15 21.4658H12V24.4658H15V21.4658Z'
                              fill='#FFAD08'
                            />
                            <path
                              d='M21 3.46582H18V6.46582H21V3.46582Z'
                              fill='#73B06F'
                            />
                            <path
                              d='M21 6.46582H18V9.46582H21V6.46582Z'
                              fill='#FFAD08'
                            />
                            <path
                              d='M21 9.46582H18V12.4658H21V9.46582Z'
                              fill='#73B06F'
                            />
                            <path
                              d='M21 12.4658H18V15.4658H21V12.4658Z'
                              fill='#EDD75A'
                            />
                            <path
                              d='M21 15.4658H18V18.4658H21V15.4658Z'
                              fill='#405059'
                            />
                            <path
                              d='M21 18.4658H18V21.4658H21V18.4658Z'
                              fill='#FFAD08'
                            />
                            <path
                              d='M21 21.4658H18V24.4658H21V21.4658Z'
                              fill='#FFAD08'
                            />
                            <path
                              d='M6 3.46582H3V6.46582H6V3.46582Z'
                              fill='#FFAD08'
                            />
                            <path
                              d='M6 6.46582H3V9.46582H6V6.46582Z'
                              fill='#0C8F8F'
                            />
                            <path
                              d='M6 9.46582H3V12.4658H6V9.46582Z'
                              fill='#EDD75A'
                            />
                            <path
                              d='M6 12.4658H3V15.4658H6V12.4658Z'
                              fill='#FFAD08'
                            />
                            <path
                              d='M6 15.4658H3V18.4658H6V15.4658Z'
                              fill='#FFAD08'
                            />
                            <path
                              d='M6 18.4658H3V21.4658H6V18.4658Z'
                              fill='#73B06F'
                            />
                            <path
                              d='M6 21.4658H3V24.4658H6V21.4658Z'
                              fill='#405059'
                            />
                            <path
                              d='M12 3.46582H9V6.46582H12V3.46582Z'
                              fill='#FFAD08'
                            />
                            <path
                              d='M12 6.46582H9V9.46582H12V6.46582Z'
                              fill='#EDD75A'
                            />
                            <path
                              d='M12 9.46582H9V12.4658H12V9.46582Z'
                              fill='#FFAD08'
                            />
                            <path
                              d='M12 12.4658H9V15.4658H12V12.4658Z'
                              fill='#EDD75A'
                            />
                            <path
                              d='M12 15.4658H9V18.4658H12V15.4658Z'
                              fill='#EDD75A'
                            />
                            <path
                              d='M12 18.4658H9V21.4658H12V18.4658Z'
                              fill='#EDD75A'
                            />
                            <path
                              d='M12 21.4658H9V24.4658H12V21.4658Z'
                              fill='#0C8F8F'
                            />
                            <path
                              d='M18 3.46582H15V6.46582H18V3.46582Z'
                              fill='#FFAD08'
                            />
                            <path
                              d='M18 6.46582H15V9.46582H18V6.46582Z'
                              fill='#405059'
                            />
                            <path
                              d='M18 9.46582H15V12.4658H18V9.46582Z'
                              fill='#FFAD08'
                            />
                            <path
                              d='M18 12.4658H15V15.4658H18V12.4658Z'
                              fill='#EDD75A'
                            />
                            <path
                              d='M18 15.4658H15V18.4658H18V15.4658Z'
                              fill='#0C8F8F'
                            />
                            <path
                              d='M18 18.4658H15V21.4658H18V18.4658Z'
                              fill='#FFAD08'
                            />
                            <path
                              d='M18 21.4658H15V24.4658H18V21.4658Z'
                              fill='#0C8F8F'
                            />
                            <path
                              d='M24 3.46582H21V6.46582H24V3.46582Z'
                              fill='#405059'
                            />
                            <path
                              d='M24 6.46582H21V9.46582H24V6.46582Z'
                              fill='#EDD75A'
                            />
                            <path
                              d='M24 9.46582H21V12.4658H24V9.46582Z'
                              fill='#73B06F'
                            />
                            <path
                              d='M24 12.4658H21V15.4658H24V12.4658Z'
                              fill='#FFAD08'
                            />
                            <path
                              d='M24 15.4658H21V18.4658H24V15.4658Z'
                              fill='#405059'
                            />
                            <path
                              d='M24 18.4658H21V21.4658H24V18.4658Z'
                              fill='#0C8F8F'
                            />
                            <path
                              d='M24 21.4658H21V24.4658H24V21.4658Z'
                              fill='#EDD75A'
                            />
                          </g>
                        </g>
                        <defs>
                          <clipPath id='clip0_52_5107'>
                            <rect
                              width='24'
                              height='24'
                              fill='white'
                              transform='translate(0 0.46582)'
                            />
                          </clipPath>
                        </defs>
                      </svg>

                      <div className='ml-2'>Undefined</div>
                    </div>
                  </div>
                )}
                <div className='flex-col mt-4'>
                  <div className='text-[#BDBDBA] text-[13px] font-medium'>
                    Number of owners
                  </div>
                  <div className='text-white font-semibold'>1200</div>
                </div>

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
                    {data.location_name}, {data.location}
                  </div>
                </div>

                <div className='flex-col mt-4'>
                  <div className='text-[#BDBDBA] text-[13px] font-medium'>
                    Drop discription
                  </div>
                  <div className='text-white font-semibold'>{data.desc}</div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};
