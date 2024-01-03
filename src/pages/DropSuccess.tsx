import { useNavigate } from 'react-router';
import { useAuthContext } from '../context/AuthContext';
import { Button, Modal } from 'antd';
import { useEffect, useState } from 'react';
import PointPlusItem from '../components/PointPlusItem';

export const DropSuccess = () => {
  const navigate = useNavigate();
  const { metadata, setMetadata, windowSize } = useAuthContext();

  const handleError = () => {
    const modal = Modal.error({
      title: 'Error',
      content: 'Info of this drop is missing',
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
      navigate('/check-in/upload-image');
    }, 2000);
  };

  useEffect(() => {
    if (
      !metadata.name ||
      !metadata.image ||
      !metadata.location ||
      !metadata.description
    ) {
      handleError();
    }
  }, []);

  return (
    <div
      className='bg-black absolute w-full'
      style={{ height: windowSize.height }}
    >
      <div className='mx-5 text-white' style={{ marginTop: 58 }}>
        <div className='flex-col mb-6'>
          <PointPlusItem icon point='200' />
          <div className='text-2xl my-3 font-semibold'>Drop successful</div>
          <div className='text-[#ffffff80]'>
            Now anyone can get here and check-in.
            <br />
            Have fun dropping!
          </div>
        </div>
        <div
          className='flex items-center justify-center'
          style={{ marginBottom: 33 }}
        >
          {metadata.image?.type.includes('video') ?
            <video
              src={URL.createObjectURL(metadata.image)}
              className='rounded-xl mb-3'
              autoPlay
              style={{
                width: 339,
                height: 339,
                objectFit: 'cover',
                objectPosition: 'center',
              }}
            /> :
            <img
              src={URL.createObjectURL(metadata.image)}
              alt='Uploaded'
              className='rounded-xl mb-3'
              style={{
                width: 339,
                height: 339,
                objectFit: 'cover',
                objectPosition: 'center',
              }}
            />
          }
        </div>

        <Button
          className='bg-[#2E2E2E] text-white border-0  w-full h-12 rounded-3xl font-semibold text-base'
          onClick={() => {
            setMetadata({});
            navigate('/',{state: {reload: true}});
          }}
        >
          Done
        </Button>
      </div>
    </div>
  );
};
