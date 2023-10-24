import { useNavigate } from 'react-router';
import { FaUpload } from 'react-icons/fa';
import { useEffect, useRef, useState } from 'react';
import { Button, Modal } from 'antd';
import { BsCardImage } from 'react-icons/bs';
import { useAuthContext } from '../context/AuthContext';
import { supabase } from '../utils/supabaseClients';
import { ImageUpload } from '../components/ImageUpload';

export const UploadImage = () => {
  const [selectedImage, setSelectedImage] = useState<any>(null);
  const [fileName, setFileName] = useState<string>('');
  const { metadata, setMetadata, windowSize } = useAuthContext();

  const handleError = () => {
    const modal = Modal.error({
      title: 'Error',
      content: 'Name of this drop is missing',
      okButtonProps: {
        style: {
          background: 'red',
          border: 'none',
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
    if (!metadata.name) {
      handleError();
    }
  }, []);

  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null); // 1. Add a reference to the file input

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setSelectedImage(event.target?.result);
      };
      reader.readAsDataURL(e.target.files[0]);

      const file = e.target?.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const newFilePath = `${fileName}`;
      setFileName(fileName);
      await supabase.storage.from('drop_image').upload(newFilePath, file);
    }
  };

  const resetFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = ''; // Reset the file input
    }
  };

  const handleReplaceClick = () => {
    resetFileInput(); // Reset the file input first
    fileInputRef.current?.click(); // Then trigger the file input's click event
  };

  return (
    <>
      <div className='bg-black absolute' style={{ height: 812 }}>
        <div className='m-5 text-white font-semibold'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            width='17'
            height='16'
            viewBox='0 0 17 16'
            fill='none'
            className='mb-6'
            onClick={() => {
              navigate('/drop-onboarding/enter-name');
            }}
          >
            <path
              d='M9.21347 13.9093L8.51972 14.6031C8.22597 14.8968 7.75097 14.8968 7.46035 14.6031L1.38535 8.5312C1.0916 8.23745 1.0916 7.76245 1.38535 7.47183L7.46035 1.39683C7.7541 1.10308 8.2291 1.10308 8.51972 1.39683L9.21347 2.09058C9.51035 2.38745 9.5041 2.87183 9.20097 3.16245L5.43535 6.74995H14.4166C14.8322 6.74995 15.1666 7.08433 15.1666 7.49995V8.49995C15.1666 8.91558 14.8322 9.24996 14.4166 9.24996H5.43535L9.20097 12.8375C9.50722 13.1281 9.51347 13.6125 9.21347 13.9093Z'
              fill='white'
              fillOpacity='0.7'
            />
          </svg>

          <div className='mb-12'>
            <div className='text-white text-2xl font-bold mb-2'>
              Bring in your experience
            </div>
            <div className='text-white text-lg opacity-70'>
              Upload your image and let us transform it into an NFT, use your
              imagination.
            </div>
          </div>

          <ImageUpload />
        
        </div>
      </div>
    </>
  );
};
