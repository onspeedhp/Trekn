import { useNavigate } from 'react-router';
import { useAuthContext } from '../context/AuthContext';
import { Button, Modal } from 'antd';
import { useEffect, useState } from 'react';
import { FaExternalLinkAlt, FaShare } from 'react-icons/fa';

export const MintSuccess = () => {
  const navigate = useNavigate();
  const { metadata } = useAuthContext();

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

  useEffect(() => {
    if (!metadata.sig || !metadata.image) {
      handleError();
    }
  });

  return (
    <div className='bg-black absolute w-full' style={{ height: 812 }}>
      <div className='mx-5 text-white font-semibold' style={{ marginTop: 58 }}>
        <div className='flex-col'>
          <div className='text-2xl mb-3 font-bold flex items-center gap-3'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='37'
              height='36'
              viewBox='0 0 37 36'
              fill='none'
            >
              <path
                d='M35.9375 18C35.9375 27.6305 28.1305 35.4375 18.5 35.4375C8.86951 35.4375 1.0625 27.6305 1.0625 18C1.0625 8.36951 8.86951 0.5625 18.5 0.5625C28.1305 0.5625 35.9375 8.36951 35.9375 18ZM16.483 27.233L29.4205 14.2955C29.8598 13.8562 29.8598 13.1439 29.4205 12.7046L27.8296 11.1136C27.3902 10.6742 26.6779 10.6742 26.2385 11.1136L15.6875 21.6645L10.7615 16.7385C10.3222 16.2992 9.60983 16.2992 9.17045 16.7385L7.57948 18.3295C7.14017 18.7688 7.14017 19.4811 7.57948 19.9204L14.892 27.2329C15.3314 27.6723 16.0436 27.6723 16.483 27.233Z'
                fill='#66C61B'
              />
            </svg>
            <span>Checkin successful</span>
          </div>
          <div className='text-[#FFFFFF80] font-medium text-base'>
            This experience has been stored in your custodial wallet. Check your Profile Assets.
          </div>
        </div>
        <div className='my-8'>
          <img
            src={metadata.image}
            alt='Uploaded'
            className='rounded-xl mb-3 mx-auto'
            style={{
              width: 339,
              height: 339,
              objectFit: 'cover',
              objectPosition: 'center',
            }}
          />
          <div className="flex justify-center gap-6 text-[13px] font-bold">
            <div className='flex items-center'
              //   href={}
              onClick={() => {
                const url = `https://solscan.io/tx/${metadata.sig}`;
                // Open a new window or tab with the specified URL
                const newWindow = window.open(url, '_blank');

                // Focus on the new window (optional)
                if (newWindow) {
                  newWindow.focus();
                }
              }}
            >
              <FaExternalLinkAlt className='mr-2' />
              View on scanner
            </div>
            <div className='flex items-center'>
              <FaShare className='mr-2' />
              Share on social
            </div>
          </div>
        </div>
        <Button
          className='bg-[#2E2E2E] text-white border-0  w-full h-12 rounded-3xl font-semibold text-base'
          onClick={() => {
            navigate('/reaction-drop');
          }}
        >
          Done
        </Button>
      </div>
    </div>
  );
};
