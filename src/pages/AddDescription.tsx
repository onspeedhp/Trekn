import { useNavigate } from 'react-router';
import { useAuthContext } from '../context/AuthContext';
import { Button, Modal } from 'antd';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

export const AddDescription: React.FC = () => {
  const navigate = useNavigate();
  const { metadata, setMetadata, windowSize } = useAuthContext();
  const user = useSelector((state: any) => state.user);

  const handleError = () => {
    const modal = Modal.error({
      title: 'Error',
      content: 'Something is wrong',
      okButtonProps: {
        type: 'default',
        style: {
          background: 'red',
          color: 'white',
        },
      },
    });

    setTimeout(() => {
      setMetadata({});
      modal.destroy();
      navigate('/drop-onboarding/upload-image');
    }, 2000);
  };

  useEffect(() => {
    if (
      !metadata.image ||
      !metadata.imageArray ||
      !user.id ||
      !metadata.location ||
      !metadata.location_name ||
      !metadata.lat ||
      !metadata.lng ||
      !metadata.name
    ) {
      handleError();
    }
  });

  return (
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
            navigate(-1);
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
            Share something?
          </div>
          <div className='text-white text-lg opacity-70'>
            How was the experience? Add your own stories or tips for others.
          </div>
        </div>

        <div className='relative'>
          <input
            placeholder='It’s actually the coolest...'
            className='text-white bg-black w-full text-2xl h-10 font-normal pr-10 focus:outline-none overflow-hidden'
            style={{ maxWidth: windowSize.width - 40 }}
            value={metadata.description}
            onChange={(e) =>
              setMetadata({ ...metadata, description: e.target.value })
            }
          />
        </div>

        <Button
          className='bg-white w-full h-12 rounded-3xl font-semibold text-base mt-80 border-0'
          disabled={metadata.description ? false : true}
          style={{
            backgroundColor: metadata.description ? '#2E2E2E' : '#2E2E2E',
            color: metadata.description ? 'white' : '#FFFFFF80',
          }}
          onClick={() => {
            navigate('/drop-onboarding/confirm');
          }}
        >
          Continue
        </Button>
      </div>
    </div>
  );
};
