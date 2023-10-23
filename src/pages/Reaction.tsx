import { useNavigate } from 'react-router';
import { useAuthContext } from '../context/AuthContext';
import { Button, Modal } from 'antd';
import { useEffect, useState } from 'react';
import {
  FaFaceFrown,
  FaFaceKissWinkHeart,
  FaFaceLaughBeam,
  FaFaceMeh,
  FaFaceSadCry,
} from 'react-icons/fa6';
import { updateDrop } from '../middleware/data/drop';
import { useSelector } from 'react-redux';

export const Reaction = () => {
  const navigate = useNavigate();
  const { metadata, setMetadata } = useAuthContext();
  const [value, setValue] = useState<number>();
  const user = useSelector((state: any) => state.user);

  const handleError = () => {
    const modal = Modal.error({
      title: 'Error',
      content: 'Something was wrong',
      okButtonProps: {
        type: 'default',
        style: {
          background: 'red',
          color: 'white',
        },
      },
    });

    setTimeout(() => {
      modal.destroy();
      navigate('/map-view');
    }, 2000);
  };

  const reactions = [
    {
      icon: (
        <FaFaceKissWinkHeart
          size={52}
          className='text-[#CFCFCF]'
          style={{ color: value === 0 ? '#66C61B' : '#CFCFCF' }}
        />
      ),
    },
    {
      icon: (
        <FaFaceLaughBeam
          size={52}
          className='text-[#CFCFCF]'
          style={{ color: value === 1 ? '#66C61B' : '#CFCFCF' }}
        />
      ),
    },
    {
      icon: (
        <FaFaceMeh
          size={52}
          className='text-[#CFCFCF]'
          style={{ color: value === 2 ? '#66C61B' : '#CFCFCF' }}
        />
      ),
    },
    {
      icon: (
        <FaFaceFrown
          size={52}
          className='text-[#CFCFCF]'
          style={{ color: value === 3 ? '#66C61B' : '#CFCFCF' }}
        />
      ),
    },
    {
      icon: (
        <FaFaceSadCry
          size={52}
          className='text-[#CFCFCF]'
          style={{ color: value === 4 ? '#66C61B' : '#CFCFCF' }}
        />
      ),
    },
  ];
  useEffect(() => {
    if (!metadata.id) {
      handleError();
    }
  });

  return (
    <div className='bg-white absolute w-full' style={{ height: 812 }}>
      <div className='mx-5 text-black font-semibold' style={{ marginTop: 58 }}>
        <div className='flex-col mb-6'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            width='48'
            height='48'
            viewBox='0 0 48 48'
            fill='none'
          >
            <path
              d='M46.2488 31.3528L33.5054 24L46.2488 16.6472C46.967 16.2328 47.2126 15.3159 46.7982 14.5978L43.7963 9.40125C43.382 8.68406 42.4642 8.4375 41.746 8.85188L29.0026 16.2047V1.5C29.0026 0.67125 28.3304 0 27.5017 0H21.4979C20.6692 0 19.997 0.67125 19.997 1.5V16.2056L7.25353 8.85281C6.53541 8.43844 5.6176 8.685 5.20322 9.40219L2.20135 14.5978C1.78697 15.315 2.0326 16.2328 2.75072 16.6472L15.4942 24L2.75072 31.3528C2.0326 31.7672 1.78697 32.685 2.20135 33.4022L5.20322 38.5988C5.6176 39.3159 6.53541 39.5616 7.25353 39.1481L19.997 31.7953V46.5C19.997 47.3288 20.6692 48 21.4979 48H27.5017C28.3304 48 29.0026 47.3288 29.0026 46.5V31.7944L41.746 39.1472C42.4642 39.5616 43.382 39.3159 43.7963 38.5978L46.7982 33.4012C47.2126 32.6841 46.967 31.7672 46.2488 31.3528Z'
              fill='#66C61B'
            />
          </svg>
          <div className='text-2xl my-3 font-semibold'>
            Rate your experience
          </div>
          <div className='text-black opacity-50 font-normal'>
            By owning this drop, you now can give your opinion on the experience
          </div>
        </div>
        <div className='flex' style={{ marginTop: 56, marginBottom: 206 }}>
          {reactions.reverse().map((items, index) => (
            <div
              key={index}
              onClick={() => {
                if (value === Math.abs(index - 4)) {
                  setValue(undefined);
                } else {
                  setValue(Math.abs(index - 4));
                }
              }}
              className='mx-2'
            >
              {items.icon}
            </div>
          ))}
        </div>

        <Button
          className='bg-[#2E2E2E] text-white border-0  w-full h-12 rounded-3xl font-semibold text-base'
          onClick={async () => {
            if (metadata.id) {
              console.log(value);

              await updateDrop({
                drop: metadata,
                value: String(value),
                userId: user.id,
              });
              setMetadata({});
              navigate('/account');
            }
          }}
        >
          Done
        </Button>
      </div>
    </div>
  );
};
