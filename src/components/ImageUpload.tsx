import React, { useState } from 'react';
import { useAuthContext } from '../context/AuthContext';
import { FaUpload } from 'react-icons/fa6';
import { Button } from 'antd';
import { useNavigate } from 'react-router';
import { FaPlus, FaTimesCircle } from 'react-icons/fa';
import './image-upload.css';

export const ImageUpload: React.FC = () => {
  const { metadata, setMetadata, windowSize } = useAuthContext();
  const navigate = useNavigate();
  const [files, setFiles] = useState<any>(()=>{
    const remainingEmptySlots = 9 - metadata?.imageArray?.length || 0;
    const emptyFiles = Array.from({ length: remainingEmptySlots }, () => null);
    return [...[...metadata?.imageArray || []], ...emptyFiles];
  });
  const [edit, setEdit] = useState(false);
  const [loading, setLoading] = useState(false);

  const fileSelectedHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const selectedFiles = Array.from(event.target.files);

      const newFiles = [...files.filter((file: any)=>file?.name && file), ...selectedFiles].slice(0, 9);

      if (newFiles.length > 9) {
        alert('The number of photos cannot exceed 9!');
        return;
      }
      handleEmpty(newFiles);
    }
  };

  const handleEmpty = (newFiles: any) => {
    const remainingEmptySlots = 9 - newFiles.length;
    const emptyFiles = Array.from({ length: remainingEmptySlots }, () => null);
    if(emptyFiles.length === 0) {
      setEdit(false);
    }
    setFiles([...newFiles, ...emptyFiles]);
  }

  return (
    <div className='flex-1 flex flex-col'>
      {files.length > 0 ? (
        <>
          <div
            style={{ height: 371, width: windowSize.width - 40 }}
            className='bg-[#1E1E1E] rounded-xl p-2.5 flex-col relative mb-6'
          >
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
              {/* {files.length === 1 ? (
                <div className='relative'>
                  {files[0].type.includes('video') ?
                    <video src={URL.createObjectURL(files[0])}
                      autoPlay
                      controls
                      className='m-1.5 rounded-xl'
                      style={{
                        width: windowSize.width - 72,
                        height: 303,
                        objectFit: 'cover',
                        objectPosition: 'center',
                      }} />
                    :
                    <img
                      src={URL.createObjectURL(files[0])}
                      alt=""
                      className='m-1.5 rounded-xl'
                      style={{
                        width: windowSize.width - 72,
                        height: 303,
                        objectFit: 'cover',
                        objectPosition: 'center',
                      }}
                    />
                  }
                  {edit === true && (
                    <FaTimesCircle
                      size={18}
                      className='text-[#FFFFFF] absolute top-[-4px] right-[-4px]'
                      onClick={() => {
                        setFiles([]);
                      }}
                    />
                  )}
                </div>
              ) : (
                <>
                  {files.map((file, index) => (
                    <div
                      className={`relative ${edit && 'shaking'}`}
                      key={index}
                    >
                      <img
                        key={index}
                        src={URL.createObjectURL(file)}
                        alt={`Uploaded`}
                        className='m-1.5 rounded-xl'
                        id='image'
                        style={{
                          width:
                            files.length > 6
                              ? (windowSize.width - 96) / 3
                              : (windowSize.width - 84) / 2,
                          height: '93px',
                          objectFit: 'cover',
                          objectPosition: 'center',
                        }}
                      />
                      {edit === true && (
                        <FaTimesCircle
                          size={18}
                          className='text-[#FFFFFF] absolute top-[-4px] right-[-4px]'
                          onClick={() => {
                            const newItems = [...files];
                            newItems.splice(index, 1);
                            setFiles(newItems);
                          }}
                        />
                      )}
                    </div>
                  ))}
                </>
              )} */}
              <>
                {files.map((file: any, index: number) => (
                  <>
                    {file?.name ?
                      <div
                        className={`relative ${edit && 'shaking'}`}
                        key={index}
                      >
                        <img
                          key={index}
                          src={URL.createObjectURL(file)}
                          alt={`Uploaded`}
                          className='m-1.5 rounded-xl'
                          id='image'
                          style={{
                            width: (windowSize.width - 96) / 3,
                            height: '93px',
                            objectFit: 'cover',
                            objectPosition: 'center',
                          }}
                        />
                        {edit === true && (
                          <FaTimesCircle
                            size={18}
                            className='text-[#FFFFFF] absolute top-[-4px] right-[-4px]'
                            onClick={() => {
                              const newItems = [...files];
                              newItems.splice(index, 1);
                              handleEmpty(newItems);
                            }}
                          />
                        )}
                      </div>
                      :
                      <div
                        className='m-1.5 rounded-xl flex items-center justify-center bg-[#252525] relative'
                        style={{ width: (windowSize.width - 96) / 3, height: '93px' }}
                      >
                        <input
                          type='file'
                          accept='image/*,video/mp4'
                          className='absolute opacity-0 w-full h-full'
                          onChange={fileSelectedHandler}
                          multiple
                        />
                        <FaPlus size={16} color='#FFFFFFB2'/>
                      </div>
                    }
                  </>
                ))}
              </>
            </div>
            <div
              className='absolute bottom-0 flex justify-center mb-4 text-[#99FF48] font-semibold'
              style={{ width: windowSize.width - 72 }}
              onClick={() => {
                setEdit(!edit);
              }}
            >
              {edit ? 'Done' : 'Edit'}
            </div>
            {/* <label
              htmlFor='file-upload'
              className='custom-file-upload absolute bottom-0 flex justify-center mb-4 text-[#99FF48] font-semibold'
              style={{ width: windowSize.width - 64 }}
            >
              Edit
            </label>
            <input
              id='file-upload'
              type='file'
              accept='image/*'
              onChange={fileSelectedHandler}
              multiple
              style={{ display: 'none' }}
            /> */}
          </div>

          <div
            className='bg-[#2C2C2C] flex items-center justify-center text-white w-full h-12 rounded-3xl font-semibold text-base border-0 mt-auto'
            onClick={() => {
              setLoading(true);
              let imageArray: File[] = [];
              files.forEach(async (file: any) => {
                if (file?.name) {
                  imageArray.push(file);
                }
              });
              setMetadata({
                ...metadata,
                image: imageArray[0],
                imageArray: imageArray,
              });
              setLoading(false);

              navigate(`/check-in/edit-location`);
            }}
          >
            Continue
          </div>
        </>
      ) : (
        <>
          <div
            className='relative p-6'
            style={{
              background: '#1E1E1E',
              width: windowSize.width - 40,
              marginBottom: 62,
              borderRadius: 12,
            }}
          >
            <img src="/upload-card.png" alt="" className='mx-auto object-center w-[177px] h-[197px]' />
            <p className='mt-4 text-[13px] text-[#FFFFFFB2] leading-[18px] text-center font-normal tracking-[-0.08px]'>
              Upload images or video to give others a vivid and detailed view of this place.
            </p>
          </div>
          <div
            className='relative mt-auto bg-[#2E2E2E] flex items-center justify-center text-white w-full h-12 rounded-3xl font-semibold text-base border-0'
          >
            <input
              type='file'
              accept='image/*,video/mp4'
              className='absolute opacity-0 w-full h-full'
              onChange={fileSelectedHandler}
              multiple
            />
            <span className='ml-2 text-base font-bold leading-6'>
              Upload image or video
            </span>
          </div>
        </>
      )}
    </div>
  );
};
