import { useNavigate } from 'react-router';
import { useAuthContext } from '../context/AuthContext';
import { ConfigProvider, Modal, Radio, RadioChangeEvent } from 'antd';
import { useEffect, useState } from 'react';
import { FaSearch } from 'react-icons/fa';

export const SelectLocation: React.FC = () => {
  const navigate = useNavigate();
  const { metadata, setMetadata } = useAuthContext();

  const locations = [
    'Trấn Quốc Pagoda',
    'Tây Hồ Temple',
    'Ciputra Hanoi',
    'Quảng An Flower Market',
    'Võng Thị Street',
    'InterContinental Hanoi Westlake',
    'West Lake Water Park',
    'Lotte Center Hanoi',
    'Mac Plaza Ha Dong',
    'Dai hoc Back khoa',
    'Ho Hoan Kiem',
  ];
  const [location, setLocation] = useState(locations[0]);

  const handleError = () => {
    const modal = Modal.error({
      title: 'Error',
      content: 'Name or image of this drop is missing',
    });

    setTimeout(() => {
      setMetadata({});
      modal.destroy();
      navigate('/drop-onboarding/enter-name');
    }, 2000);
  };

  useEffect(() => {
    if (!metadata.image_link || !metadata.name) {
      handleError();
    }
  }, []);

  // State to hold the current search term
  const [searchTerm, setSearchTerm] = useState('');

  const removeDiacritics = (str: string) => {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  };

  // Filtered locations based on the search term
  const filteredLocations = locations.filter((location) =>
    removeDiacritics(location)
      .toLowerCase()
      .includes(removeDiacritics(searchTerm).toLowerCase())
  );

  return (
    <ConfigProvider
      theme={{
        components: {
          Radio: {
            buttonBg: 'green',
            buttonCheckedBg: 'green',
            buttonColor: 'green',
          },
        },
      }}
    >
      <div className='bg-black absolute' style={{ height: 812 }}>
        <div className='m-5 text-white font-semibold'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            width='17'
            height='16'
            viewBox='0 0 17 16'
            fill='none'
            className='mb-6'
            onClick={() => {
              navigate('/drop-onboarding/upload-image');
            }}
          >
            <path
              d='M9.21347 13.9093L8.51972 14.6031C8.22597 14.8968 7.75097 14.8968 7.46035 14.6031L1.38535 8.5312C1.0916 8.23745 1.0916 7.76245 1.38535 7.47183L7.46035 1.39683C7.7541 1.10308 8.2291 1.10308 8.51972 1.39683L9.21347 2.09058C9.51035 2.38745 9.5041 2.87183 9.20097 3.16245L5.43535 6.74995H14.4166C14.8322 6.74995 15.1666 7.08433 15.1666 7.49995V8.49995C15.1666 8.91558 14.8322 9.24996 14.4166 9.24996H5.43535L9.20097 12.8375C9.50722 13.1281 9.51347 13.6125 9.21347 13.9093Z'
              fill='white'
              fillOpacity='0.7'
            />
          </svg>

          <div className='mb-12'>
            <div className='text-white text-2xl font-bold mb-2'>
              Drop this somewhere
            </div>
            <div className='text-white text-lg opacity-70'>
              Select a nearby location to drop your experience.
            </div>
          </div>

          <div className='relative mb-6'>
            <input
              placeholder='Search a nearby location'
              className='text-white bg-[#202020] w-full rounded-xl text-base h-14 font-normal pr-10 focus:outline-none pl-10'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <span className='absolute inset-y-0 left-0 flex items-center ml-4'>
              <FaSearch size={16} className='text-white opacity-70' />
            </span>
          </div>

          <div className='flex-col text-[#FFFFFF]'>
            <div className='overflow-scroll' style={{ height: 396 }}>
              <Radio.Group
                name='radiogroup'
                defaultValue={0}
                onChange={(e: RadioChangeEvent) => {
                  setLocation(locations[e.target.value]);

                  setMetadata({
                    ...metadata,
                    location: location,
                  });

                  navigate('/drop-onboarding/add-description');
                }}
              >
                {filteredLocations.map((location: any, index: any) => (
                  <div className='mb-5' key={index}>
                    <Radio value={index} className='text-white text-[15px]'>
                      {location}
                    </Radio>
                  </div>
                ))}
              </Radio.Group>
            </div>
            <div>Add a new location</div>
          </div>
        </div>
      </div>
    </ConfigProvider>
  );
};
