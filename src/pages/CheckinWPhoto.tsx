import React, { useState } from 'react';
import { ImageUpload } from '../components/ImageUpload';
import { useAuthContext } from '../context/AuthContext';
import { FaPlusCircle, FaTimesCircle, FaUpload } from 'react-icons/fa';
import { FaCirclePlus } from 'react-icons/fa6';
import { Button } from 'antd';

export default function CheckinWPhoto() {
  const { windowSize } = useAuthContext();
  const [files, setFiles] = useState<File | null>(null);
  const [desc, setDesc] = useState<string>('');

  const fileSelectedHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFiles(event.target.files[0]);
    }
  };
  return (
    <>
      <div
        className='bg-black'
        style={{ width: windowSize.width, height: windowSize.height }}
      >
        <div className='p-5 text-white font-semibold'>
          <div className='mb-6'>
            <div className='text-white text-center text-xl font-semibold leading-10'>
              Add your moments
            </div>
          </div>

          <div
            className='mb-6 mx-auto rounded-xl relative flex items-center justify-center bg-[#1F1F1F]'
            style={{
              width: windowSize.width - 216,
              height: 200,
            }}
          >
            {files ? (
              <>
                <img
                  src={URL.createObjectURL(files)}
                  className='rounded-xl w-full h-full object-cover object-center'
                />
                <FaTimesCircle
                  size={24}
                  className='absolute right-[-14px] top-[-16px] opacity-70'
                  onClick={() => setFiles(null)}
                />
              </>
            ) : (
              <>
                <input
                  type='file'
                  accept='image/*'
                  className='absolute opacity-0 w-full h-full z-10'
                  onChange={fileSelectedHandler}
                />
                <FaPlusCircle size={32} className='opacity-70 z-0' />
              </>
            )}
          </div>
          <div className='mb-[98px]'>
            <label className='text-[13px] text-[#BDBDBA] font-medium leading-4'>
              Description
            </label>
            <div className='border-none overflow-hidden mt-1'>
              <textarea
                onChange={(e) => {
                  setDesc(e.currentTarget.value);
                }}
                value={desc}
                className='py-4 px-3 w-full h-32 rounded-xl focus-visible:outline-none text-base font-medium resize-none bg-[#212121de] text-white'
              />
            </div>
          </div>
          <div className='flex items-center justify-between'>
            <Button
              className='bg-[#2C2C2C] text-white py-3 h-auto rounded-3xl font-semibold text-base border-0'
              style={{ width: (windowSize.width - 40 - 12) / 2 }}
            >
              Cancel
            </Button>
            <Button
              className='bg-[#2C2C2C] text-white py-3 h-auto rounded-3xl font-semibold text-base border-0'
              disabled={true}
              style={{
                backgroundColor: files && desc ? '#99FF48' : '#2E2E2E',
                color: files && desc ? 'black' : '#FFFFFF80',
                width: (windowSize.width - 40 - 12) / 2,
              }}
            >
              Confirm
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
