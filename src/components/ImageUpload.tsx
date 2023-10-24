import React, { useState } from 'react';
import { useAuthContext } from '../context/AuthContext';
import { FaUpload } from 'react-icons/fa6';
import { ListImage } from './ListImage';
import { Button } from 'antd';
import { useNavigate } from 'react-router';
import { supabase } from '../utils/supabaseClients';

export const ImageUpload: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const { metadata, setMetadata, windowSize } = useAuthContext();
  const [loading, setLoading] = useState(false);

  const fileSelectedHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const selectedFiles = Array.from(event.target.files);

      if (files.length + selectedFiles.length > 9) {
        alert('The number of photos cannot exceed 9!');
        return;
      }

      setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);
    }
  };
  const navigate = useNavigate();

  return (
    <>
      {files.length > 0 ? (
        // <ListImage />
        <>
          <div
            style={{ height: 371, width: windowSize.width - 40 }}
            className='bg-[#2C2C2C] rounded-xl p-2.5 flex-col relative mb-6'
          >
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
              {files.map((file, index) => (
                <img
                  key={index}
                  src={URL.createObjectURL(file)}
                  alt={`Uploaded ${index}`}
                  className='m-1.5 rounded-xl'
                  style={{
                    width:
                      files.length >= 6
                        ? (windowSize.width - 96) / 3
                        : (windowSize.width - 84) / 2,
                    height: '93px',
                    objectFit: 'cover',
                    objectPosition: 'center',
                  }}
                />
              ))}
            </div>
            <label
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
            />
          </div>

          <Button
            loading={loading}
            className='bg-[#2C2C2C] text-white w-full h-12 rounded-3xl font-semibold text-base border-0'
            onClick={() => {
              setLoading(true);
              let imageArray: string[] = [];
              files.forEach(async (file, index) => {
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
              setMetadata({
                ...metadata,
                image: imageArray[0],
                imageArray: imageArray,
              });
              setLoading(false);

              navigate(`/drop-onboarding/drag-location`);
            }}
          >
            Continue
          </Button>
        </>
      ) : (
        <>
          <div
            className='relative'
            style={{
              background: '#2C2C2C',
              width: windowSize.width - 40,
              height: 389,
              marginBottom: 62,
              borderRadius: 12,
            }}
          >
            <div
              style={{ width: windowSize.width - 72, height: 357 }}
              className='absolute m-4 flex-col'
            >
              <div
                className='bg-black rounded-xl flex items-center justify-center mb-3'
                style={{ height: 303, width: windowSize.width - 72 }}
              >
                <input
                  type='file'
                  accept='image/*'
                  className='absolute opacity-0 w-full h-full'
                  onChange={fileSelectedHandler}
                  multiple
                />
                <FaUpload size={16} />
                <span className='ml-2 text-base font-bold'>
                  Upload your image *.*
                </span>
              </div>
              <div style={{ fontSize: 13 }}>
                <div style={{ opacity: 0.7 }} className='flex justify-center'>
                  For optimal performance
                </div>
                <div className='flex justify-center'>
                  1024x1024, PNG, GIF max 10MB
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};
