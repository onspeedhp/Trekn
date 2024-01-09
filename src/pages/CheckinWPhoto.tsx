import React, { useEffect, useState } from 'react';
import { ImageUpload } from '../components/ImageUpload';
import { useAuthContext } from '../context/AuthContext';
import { FaPlusCircle, FaTimesCircle, FaUpload } from 'react-icons/fa';
import { FaCirclePlus } from 'react-icons/fa6';
import { Button, Modal, Spin } from 'antd';
import { useNavigate, useParams } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { mintCompressedNFT } from '../functions/mintCompressedNFT';
import { getDropByID } from '../middleware/data/drop';
import { PublicKey } from '@solana/web3.js';
import { supabase } from '../utils/supabaseClients';
import { setAccountData } from '../redux/slides/accountSlice';

export default function CheckinWPhoto() {
  const { id: dropId } = useParams();
  const { windowSize, setMetadata, metadata } = useAuthContext();
  const user = useSelector((state: any) => state.user);
  const userAccountData = useSelector((state: any) => state.account);
  const dispatch = useDispatch();
  const [files, setFiles] = useState<File | null>(null);
  const [desc, setDesc] = useState<string>('');
  const [selectedLocation, setSelectedLocation] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false)
  const navigate = useNavigate();

  useEffect(() => {
    if (dropId) {
      getDropByID({
        dropId,
        onSuccess: (data: any) => {
          setSelectedLocation(data[0]);
        }
      })
    }
  }, [])

  const fileSelectedHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFiles(event.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (user.address) {
      setLoading(true)
      let imageUrl: string | undefined;

      if (files) {
        const fileExt = files.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const newFilePath = `${fileName}`;
        imageUrl = `${process.env.REACT_APP_SUPABASE_URL}/storage/v1/object/public/minted_image/${fileName}`
        await supabase.storage
          .from('minted_image')
          .upload(newFilePath, files);
        setMetadata({ ...metadata, image: imageUrl })
      }

      await mintCompressedNFT({
        drop: selectedLocation,
        userAddress: new PublicKey(user.address),
        userId: user.id,
        ...(imageUrl && { image: imageUrl }),
        ...(desc && { description: desc }),
        onSuccess: (data: any, sig: any) => {
          setMetadata({
            sig,
            ...selectedLocation,
            ...(imageUrl && { image: imageUrl }),
            ...(desc && { description: desc }),
          });
          if (user.id === userAccountData.id) {
            dispatch(setAccountData({
              ...userAccountData, minted: [...userAccountData.minted,
              {
                drop: selectedLocation,
                ...data,
                user,
                ...(imageUrl && { image: imageUrl }),
                ...(desc && { description: desc }),
              }]
            }))
          }
          navigate('/collect-success');
        },
        onError: (error) => {
          Modal.error({
            title: 'Error',
            content: error,
            okButtonProps: {
              type: 'default',
              style: {
                background: 'red',
                color: 'white',
              },
            },
          });
        },
      });
    }
  }
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
            <div
              className='bg-[#2C2C2C] text-white py-3 h-auto rounded-3xl font-semibold text-base border-0 flex items-center justify-center'
              style={{ width: (windowSize.width - 40 - 12) / 2 }}
              onClick={() => navigate(-1)}
            >
              Cancel
            </div>
            <div
              className='bg-[#2C2C2C] text-white py-3 h-auto rounded-3xl font-semibold text-base border-0 min-h-[48px] flex items-center justify-center'
              style={{
                backgroundColor: loading ? '#898989' : files && desc ? '#99FF48' : '#2E2E2E',
                color: files && desc ? 'black' : '#FFFFFF80',
                width: (windowSize.width - 40 - 12) / 2,
              }}
              onClick={handleSubmit}
            >
              {loading ? <Spin /> : 'Confirm'}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
