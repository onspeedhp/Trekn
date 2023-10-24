import { useNavigate } from 'react-router';
import { useAuthContext } from '../context/AuthContext';
import { Button, Drawer, Modal } from 'antd';
import { useEffect, useState } from 'react';
import { createDrop } from '../middleware/data/drop';
import './style.css';
import { useSelector } from 'react-redux';
import { FaCheckCircle, FaImage, FaUpload, FaInfoCircle } from 'react-icons/fa';

import { supabase } from '../utils/supabaseClients';

export const Confirm: React.FC = () => {
  const navigate = useNavigate();
  const { metadata, setMetadata, windowSize } = useAuthContext();
  const user = useSelector((state: any) => state.user);
  const [sellected, setSellected] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);

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

  const onClose = () => {
    setIsDrawerVisible(false);
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
    }
    console.log(metadata);
  }, []);

  return (
    <div className='bg-black absolute w-full h-full'>
      <Drawer
        placement='bottom'
        closable={false}
        onClose={onClose}
        open={isDrawerVisible}
        height={558}
        className='drawer rounded-t-3xl'
        style={{
          background:
            'radial-gradient(278.82% 137.51% at 1.95% 3.59%, rgba(255, 255, 255, 0.40) 0%, rgba(255, 255, 255, 0.00) 100%)',
        }}
      >
        <div className='w-full flex items-center justify-center text-white font-semibold mb-3.5 text-base'>
          Sellect your art *.*
        </div>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            marginLeft: -4,
            width: windowSize.width - 25,
          }}
        >
          {metadata.imageArray && metadata.imageArray?.length === 1 ? (
            <img
              src={metadata.imageArray[0]}
              className='rounded-xl'
              style={{
                width: windowSize.width,
                height: 303,
                objectFit: 'cover',
                objectPosition: 'center',
              }}
            />
          ) : (
            <>
              {metadata.imageArray.map((file: File, index: any) => (
                <>
                  <div className='relative'>
                    <img
                      key={index}
                      src={URL.createObjectURL(file)}
                      alt={`Uploaded ${index}`}
                      className='rounded-xl mr-[13px] mb-[15px]'
                      onClick={() => {
                        setSellected(index);
                      }}
                      style={{
                        width: (windowSize.width - 69) / 3,
                        height: (windowSize.width - 69) / 3,
                        objectFit: 'cover',
                        objectPosition: 'center',
                        border: sellected === index ? '3px solid #99FF48' : 0,
                      }}
                    />
                    {sellected === index && (
                      <FaCheckCircle
                        size={18}
                        className='text-[#FFFFFF] absolute top-2 right-6'
                      />
                    )}
                  </div>
                </>
              ))}
            </>
          )}
        </div>
        <div
          className='absolute flex items-center justify-center bottom-28 text-white w-full'
          style={{ width: windowSize.width - 48 }}
        >
          <FaUpload size={16} />
          <span className='ml-2 text-base font-bold'>
            Upload your image *.*
          </span>
        </div>
        <Button
          className='absolute bottom-5 bg-[#2C2C2C] text-white h-12 rounded-3xl font-semibold text-base border-0'
          style={{ width: windowSize.width - 48 }}
          onClick={() => {
            setIsDrawerVisible(false);
            setMetadata({ ...metadata, image: metadata.imageArray[sellected] });
          }}
        >
          Done
        </Button>
      </Drawer>
      <div className='mx-5 text-white font-semibold'>
        <div className='flex w-full items-center justify-center text-white text-base font-semibold mt-5 mb-3'>
          Experience art <FaInfoCircle className='ml-2' />
        </div>
        <div className='flex items-center justify-center mb-4'>
          <div className='relative'>
            <img
              src={URL.createObjectURL(metadata.image)}
              alt='Uploaded'
              className='rounded-xl'
              style={{
                width: windowSize.width - 102,
                height: windowSize.width - 102,
                objectFit: 'cover',
                objectPosition: 'center',
              }}
            />

            <Button
              className='absolute rounded-full bg-[rgba(33,33,33,0.87)] w-9 h-9 text-white flex items-center justify-center border-0 bottom-3 right-3'
              style={{
                padding: 0,
                zIndex: 10,
              }}
              onClick={() => {
                setIsDrawerVisible(true);
              }}
            >
              <FaImage />
            </Button>
          </div>
        </div>

        <div className='flex items-center mb-3 bg-[rgba(33,33,33,0.87)] rounded-xl p-3'>
          <div className='flex-col mr-4' style={{ width: 268 }}>
            <div className='text-[#BDBDBA] text-[13px]'>Drop name</div>
            <div>{metadata.name}</div>
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

        <div className='flex items-center mb-3 bg-[rgba(33,33,33,0.87)] rounded-xl p-3'>
          <div className='flex-col mr-4' style={{ width: 268 }}>
            <div className='text-[#BDBDBA] text-[13px]'>Drop location</div>
            <div>{metadata.location}</div>
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
        <div className='flex items-center bg-[rgba(33,33,33,0.87)] rounded-xl p-3 mb-3'>
          <div className='flex-col mr-4' style={{ width: 268 }}>
            <div className='text-[#BDBDBA] text-[13px]'>Drop desctiption</div>
            <div>{metadata.description}</div>
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
          className='bg-[#2E2E2E] text-white border-0  w-full h-12 rounded-3xl font-semibold text-base flex  items-center justify-center'
          loading={isLoading}
          onClick={async () => {
            setIsLoading(true);

            let imageArray: string[] = [];
            await metadata.imageArray.forEach(async (file: any) => {
              const fileExt = file.name.split('.').pop();
              const fileName = `${Math.random()}.${fileExt}`;
              const newFilePath = `${fileName}`;
              imageArray.push(
                `${process.env.REACT_APP_SUPABASE_URL}/storage/v1/object/public/drop_image/${fileName}`
              );

              await supabase.storage
                .from('drop_image')
                .upload(newFilePath, file);
            });

            if (imageArray.length === metadata.imageArray.length) {
              await createDrop({
                drop: {
                  ...metadata,
                  imageArray: imageArray,
                  image: imageArray[sellected],
                  author_id: user.id,
                },
                onSuccess: (data) => {
                  console.log(data);
                },
              });
              setIsLoading(false);
              navigate('/drop-onboarding/success');
            }
          }}
        >
          Confirm to drop
          <FaCheckCircle size={18} className='text-[#FFFFFF] ml-2' />
        </Button>
      </div>
    </div>
  );
};
