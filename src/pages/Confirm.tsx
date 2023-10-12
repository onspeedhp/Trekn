import { useNavigate } from 'react-router';
import { useAuthContext } from '../context/AuthContext';
import { Button, Modal } from 'antd';
import { useEffect, useState } from 'react';
import { createDrop } from '../middleware/data/drop';
import { PublicKey } from '@solana/web3.js';
import RPC from '../utils/solanaRPC';

export const Confirm: React.FC = () => {
  const navigate = useNavigate();
  const { metadata, setMetadata, user } = useAuthContext();
  const [isLoading, setIsLoading] = useState(false);

  const [name, setName] = useState('');
  const [image, setImage] = useState('');
  const [location, setLocation] = useState('');
  const [locationName, setLocationName] = useState('');
  const [description, setDescription] = useState('');

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
      navigate('/drop-onboarding/enter-name');
    }, 2000);
  };

  useEffect(() => {
    if (
      !metadata.name ||
      !metadata.image ||
      !metadata.location ||
      !metadata.location_name ||
      !metadata.description
    ) {
      // handleError();
      console.log(metadata);

      console.log();
    } else {
      setName(metadata.name);
      setImage(metadata.image);
      setLocationName(metadata.location_name);
      setLocation(metadata.location);
      setDescription(metadata.description);
    }
  }, []);

  return (
    <div className='bg-black absolute w-full' style={{ height: 812 }}>
      <div className='mx-5 text-white font-semibold' style={{ marginTop: 58 }}>
        <div className='flex items-center justify-center'>
          <img
            src={image}
            alt='Uploaded'
            className='rounded-xl mb-3'
            style={{
              width: 178,
              height: 178,
              objectFit: 'cover',
              objectPosition: 'center',
            }}
          />
        </div>

        <div className='flex items-center mb-6'>
          <div className='flex-col mr-4' style={{ width: 268 }}>
            <div className='text-[#BDBDBA] text-[13px]'>Drop name</div>
            <div>{name}</div>
          </div>
          <div
            className='flex bg-[#373737] rounded-full items-center justify-center'
            style={{ width: 35, height: 35 }}
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='16'
              height='17'
              viewBox='0 0 16 17'
              fill='none'
            >
              <g clipPath='url(#clip0_70_1462)'>
                <path
                  d='M9.08548 3.41388L13.0861 7.41451L4.39891 16.1017L0.832039 16.4954C0.354539 16.5483 -0.0488989 16.1445 0.00422611 15.667L0.401101 12.0976L9.08548 3.41388ZM15.5605 2.81826L13.682 0.939819C13.0961 0.353882 12.1458 0.353882 11.5599 0.939819L9.79267 2.70701L13.7933 6.70763L15.5605 4.94044C16.1464 4.35419 16.1464 3.40419 15.5605 2.81826Z'
                  fill='white'
                />
              </g>
              <defs>
                <clipPath id='clip0_70_1462'>
                  <rect
                    width='16'
                    height='16'
                    fill='white'
                    transform='translate(0 0.5)'
                  />
                </clipPath>
              </defs>
            </svg>
          </div>
        </div>
        <div className='flex items-center mb-6'>
          <div className='flex-col mr-4' style={{ width: 268 }}>
            <div className='text-[#BDBDBA] text-[13px]'>Drop location</div>
            <div>{location}</div>
          </div>
          <div
            className='flex bg-[#373737] rounded-full items-center justify-center'
            style={{ width: 35, height: 35 }}
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='16'
              height='17'
              viewBox='0 0 16 17'
              fill='none'
            >
              <g clipPath='url(#clip0_70_1462)'>
                <path
                  d='M9.08548 3.41388L13.0861 7.41451L4.39891 16.1017L0.832039 16.4954C0.354539 16.5483 -0.0488989 16.1445 0.00422611 15.667L0.401101 12.0976L9.08548 3.41388ZM15.5605 2.81826L13.682 0.939819C13.0961 0.353882 12.1458 0.353882 11.5599 0.939819L9.79267 2.70701L13.7933 6.70763L15.5605 4.94044C16.1464 4.35419 16.1464 3.40419 15.5605 2.81826Z'
                  fill='white'
                />
              </g>
              <defs>
                <clipPath id='clip0_70_1462'>
                  <rect
                    width='16'
                    height='16'
                    fill='white'
                    transform='translate(0 0.5)'
                  />
                </clipPath>
              </defs>
            </svg>
          </div>
        </div>
        <div className='flex items-˝center' style={{ marginBottom: 113 }}>
          <div className='flex-col mr-4' style={{ width: 268 }}>
            <div className='text-[#BDBDBA] text-[13px]'>Drop desctiption</div>
            <div>{description}</div>
          </div>
          <div
            className='flex bg-[#373737] rounded-full items-center justify-center'
            style={{ width: 35, height: 35 }}
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='16'
              height='17'
              viewBox='0 0 16 17'
              fill='none'
            >
              <g clipPath='url(#clip0_70_1462)'>
                <path
                  d='M9.08548 3.41388L13.0861 7.41451L4.39891 16.1017L0.832039 16.4954C0.354539 16.5483 -0.0488989 16.1445 0.00422611 15.667L0.401101 12.0976L9.08548 3.41388ZM15.5605 2.81826L13.682 0.939819C13.0961 0.353882 12.1458 0.353882 11.5599 0.939819L9.79267 2.70701L13.7933 6.70763L15.5605 4.94044C16.1464 4.35419 16.1464 3.40419 15.5605 2.81826Z'
                  fill='white'
                />
              </g>
              <defs>
                <clipPath id='clip0_70_1462'>
                  <rect
                    width='16'
                    height='16'
                    fill='white'
                    transform='translate(0 0.5)'
                  />
                </clipPath>
              </defs>
            </svg>
          </div>
        </div>

        <Button
          className='bg-[#2E2E2E] text-white border-0  w-full h-12 rounded-3xl font-semibold text-base'
          loading={isLoading}
          onClick={async () => {
            setIsLoading(true);

            try {
              await createDrop({
                drop: {
                  ...metadata,
                  author_id: user.id,
                },
                onSuccess: (data) => {
                  console.log(data);
                },
              });
            } catch (e) {
              console.error('Error during drop', e);
            } finally {
              setIsLoading(false);
            }

            navigate('/drop-onboarding/success');
          }}
        >
          Confirm to drop
        </Button>
      </div>
    </div>
  );
};
