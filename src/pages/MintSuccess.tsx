import { useNavigate } from 'react-router';
import { useAuthContext } from '../context/AuthContext';
import { Button, Modal } from 'antd';
import { useEffect, useState } from 'react';
import { FaExternalLinkAlt, FaShare } from 'react-icons/fa';
import PointPlusItem from '../components/PointPlusItem';

export const MintSuccess = () => {
  const navigate = useNavigate();
  const { metadata, windowSize } = useAuthContext();

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
    <div className='bg-black absolute w-full' style={{ minHeight: windowSize.height }}>
      <div className='mx-5 text-white font-semibold' style={{ marginTop: 58 }}>
        <div className='flex-col'>
          <PointPlusItem icon point='100'/>
          <div className='text-2xl my-3 font-bold gap-3'>
            Checkin successful
          P</div>
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
            navigate('/');
          }}
        >
          Done
        </Button>
      </div>
    </div>
  );
};
