import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { getMintedById } from '../middleware/data/minted';
import { getDropByID } from '../middleware/data/drop';
import moment, { min } from 'moment';
import { useAuthContext } from '../context/AuthContext';
import { useSelector } from 'react-redux';
import { FaCirclePlus, FaFaceKissWinkHeart, FaMapPin, FaThumbsUp } from 'react-icons/fa6';
import { getScore } from '../utils/account.util';
import Map, { Marker } from 'react-map-gl';
import { getUserByDropId } from '../middleware/data/user';

export const NftDetails = () => {
  const { mintedId, dropId } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState<any>(null);
  const [userChecked, setUserChecked] = useState<any>([]);
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
      getUserByDropId({
        dropId: Number(dropId),
        onSuccess: (data: any) => {
          setUserChecked(data);
        },
      })
    }



  }, []);
  return (
    <>
      <div className='absolute w-full h-full overflow-scroll'>
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
              fill='black'
              fillOpacity='0.7'
            />
          </svg>
          {data && (
            <>
              <div className='flex flex-col gap-6'>
                <div className="flex flex-col gap-3">
                  <div className="flex gap-2">
                    <img
                      className='rounded-full w-10 h-10'
                      src={`${data.user.profileImage}`}
                      alt=''
                    />
                    <div>
                      <div className="text-[15px] font-medium leading-4 mb-2">
                        {data.user.name}
                      </div>
                      <div className="flex items-center gap-1 leading-4">
                        <FaCirclePlus className='w-3 h-3' />
                        <div className="text-[13px] text-[#02030380]">
                          {moment(data.created_at).format('Do MMM, h:mm A')}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-xl leading-9 font-semibold">
                    {data.name}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="font-medium flex items-center gap-1">
                      <FaThumbsUp className='w-3 h-3 text-[#FFB800]' />
                      <div className="text-[13px] text-[#000000b3] font-medium whitespace-nowrap">
                        {data && getScore(data)}
                      </div>
                    </div>
                    <div className="rounded-full bg-[#dfdfdfb3] w-2 h-2"></div>
                    <div className="text-[13px] text-[#02030380] font-medium truncate">
                      {data.location_name}
                    </div>
                  </div>

                </div>
                <div>
                  <img
                    src={`${data.image}`}
                    style={{
                      width: windowSize.width - 40,
                      height: 335,
                      objectFit: 'cover',
                      objectPosition: 'center',
                    }}
                    className='rounded-xl mb-4'
                  />
                  <div className="text-[#02030380] font-medium text-[15px] leading-6 px-2">
                    {data.description}
                  </div>
                  <div className='border-b mt-5'></div>
                </div>
                <div className='flex flex-col gap-4'>
                  <div className="leading-10 text-xl font-bold">
                    Location
                  </div>
                  <div className="leading-4 text-[#02030380] font-medium">
                    {data.location}
                  </div>
                  <Map
                    mapboxAccessToken={`${process.env.REACT_APP_MAP_BOX_ACCESS_TOKEN}`}
                    initialViewState={{
                      longitude: data.lng - 0.001,
                      latitude: data.lat,
                      zoom: 14,
                    }}
                    style={{
                      height: 200,
                      borderRadius: 24,
                    }}
                    mapStyle='mapbox://styles/mapbox/streets-v9'
                  >
                    <Marker
                      longitude={data.lng}
                      latitude={data.lat}
                      anchor='bottom'
                      onClick={() => { }}
                    >
                      <FaMapPin size={24} className='text-[#278EFF]' />
                    </Marker>
                  </Map>
                  <div className='border-b'></div>
                </div>
                <div className="leading-10 text-xl font-bold">
                  Other check-ins
                </div>
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-3">
                    <img src={data.user.profileImage} alt="main user" className="rounded-full w-12 h-12" />
                    <div className="text-base font-medium">
                      {data.user.name}
                    </div>
                    <div className="rounded-full bg-[#F5F5F5] py-2 px-3 text-[13px] text-[#828282] font-medium">
                      {data.user.address.slice(0, 2)}...
                      {data.user.address.slice(-6, -1)}
                    </div>
                  </div>
                  {userChecked.length > 0 ? userChecked.map((user: any, idx: number) => (
                    <div className="flex items-center gap-3" key={idx}>
                      <img src={user.profileImage} alt="main user" className="rounded-full w-12 h-12" />
                      <div className="text-base font-medium">
                        {user.name}
                      </div>
                      <div className="rounded-full bg-[#F5F5F5] py-2 px-3 text-[13px] text-[#828282] font-medium">
                        {user.address.slice(0, 2)}...
                        {user.address.slice(-6, -1)}
                      </div>
                      <FaFaceKissWinkHeart
                        size={24}
                        className='text-black ml-auto'
                      />
                    </div>
                  )) :
                    <div className="flex justify-center items-center flex-col gap-4 bg-[#F5F5F5] rounded-lg py-9 px-16">
                      <img src="/traveler.svg" alt="" />
                      <p>Be the first one checked in here</p>
                    </div>
                  }
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};
