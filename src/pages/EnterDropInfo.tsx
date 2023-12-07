import { useNavigate } from 'react-router';
import { useEffect, useState } from 'react';
import { useAuthContext } from '../context/AuthContext';
import { Button, Modal } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { FaCheckCircle, FaPen } from 'react-icons/fa';
import { supabase } from '../utils/supabaseClients';
import { createDrop } from '../middleware/data/drop';
import { addNewReadyToCollect } from '../redux/slides/locationSlides';

export const EnterDropInfo = () => {
  const navigate = useNavigate();
  const { metadata, setMetadata } = useAuthContext();
  const user = useSelector((state: any) => state.user);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  const handleError = () => {
    const modal = Modal.error({
      title: 'Error',
      content: 'Something is wrong',
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
      navigate('/check-in/upload-image');
    }, 2000);
  };

  useEffect(() => {
    if (
      !metadata.image ||
      !metadata.imageArray ||
      !user.id ||
      !metadata.location ||
      !metadata.location_name ||
      !metadata.lat ||
      !metadata.lng
    ) {
      handleError();
    }
  }, []);
  return (
    <>
      <div className='bg-black min-h-screen'>
        <div className='p-5 text-white font-semibold'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            width='17'
            height='16'
            viewBox='0 0 17 16'
            fill='none'
            className='mb-6'
            onClick={() => {
              navigate('/check-in/drag-location');
            }}
          >
            <path
              d='M9.21347 13.9093L8.51972 14.6031C8.22597 14.8968 7.75097 14.8968 7.46035 14.6031L1.38535 8.5312C1.0916 8.23745 1.0916 7.76245 1.38535 7.47183L7.46035 1.39683C7.7541 1.10308 8.2291 1.10308 8.51972 1.39683L9.21347 2.09058C9.51035 2.38745 9.5041 2.87183 9.20097 3.16245L5.43535 6.74995H14.4166C14.8322 6.74995 15.1666 7.08433 15.1666 7.49995V8.49995C15.1666 8.91558 14.8322 9.24996 14.4166 9.24996H5.43535L9.20097 12.8375C9.50722 13.1281 9.51347 13.6125 9.21347 13.9093Z'
              fill='white'
              fillOpacity='0.7'
            />
          </svg>
          <div className='flex items-center justify-between mb-6'>
            <div className="relative w-[120px] h-[120px] rounded-xl overflow-hidden">
              {(metadata.image || metadata.imageArray) &&
                <img className='w-full h-full object-cover' src={URL.createObjectURL(metadata.image || metadata?.imageArray[0])} alt="" />
              }

              {metadata.imageArray?.length > 1 &&
                <div className="absolute px-3 py-1 bg-[#ffffff70] text-black bottom-2 right-2 rounded-[999px] font-medium text-[13px]">
                  {metadata.imageArray?.length}
                </div>
              }
            </div>
            <div className="py-2 px-4 bg-white rounded-full text-black font-medium" onClick={() => navigate('/check-in/upload-image')}>Edit media</div>
          </div>

          <div className='relative flex flex-col gap-4'>
            <div>
              <label className='text-[13px] text-[#BDBDBA] font-medium leading-4'>Location name</label>
              <div className="border-none rounded-xl overflow-hidden mt-1">
                <input defaultValue={metadata.name}
                  onChange={(e) => {
                    setMetadata({ ...metadata, name: e.target.value });
                  }} type="text" className='py-4 px-3 w-full focus-visible:outline-none text-base font-medium bg-[#212121de] text-white' />
              </div>
            </div>
            <div>
              <label className='text-[13px] text-[#BDBDBA] font-medium leading-4'>Description</label>
              <div className="border-none overflow-hidden mt-1">
                <textarea onChange={(e) => {
                  setMetadata({ ...metadata, description: e.target.value });
                }} value={metadata.description}
                  className="py-4 px-3 w-full h-32 rounded-xl focus-visible:outline-none text-base font-medium resize-none bg-[#212121de] text-white"
                />
              </div>
            </div>
            <div>
              <label className='text-[13px] text-[#BDBDBA] font-medium leading-4'>Location address</label>
              <div className="border-none rounded-xl overflow-hidden mt-1 relative">
                <input defaultValue={metadata.location} disabled={true} className='text-ellipsis py-4 px-3 pr-12 w-full focus-visible:outline-none text-base font-medium bg-[#212121de] text-white' />
                <div className="rounded-full bg-[#373737] p-2 absolute top-3 right-3">
                  <FaPen onClick={() => navigate('/check-in/edit-location')} />
                </div>
              </div>
            </div>
          </div>

          <Button
            className='bg-[#2E2E2E] flex items-center justify-center w-full h-12 mt-7 rounded-3xl font-semibold text-base border-0'
            disabled={metadata.name ? false : true}
            style={{
              backgroundColor: metadata.name && metadata.description ? '#2E2E2E' : '#2E2E2E',
              color: metadata.name && metadata.description ? 'white' : '#FFFFFF80',
            }}
            onClick={async () => {
              setIsLoading(true);

              let imageArray: string[] = [];
              let reduxImageArray: string[] = [];
              await metadata.imageArray.forEach(async (file: any) => {
                const fileExt = file.name.split('.').pop();
                const fileName = `${Math.random()}.${fileExt}`;
                const newFilePath = `${fileName}`;
                imageArray.push(
                  `${process.env.REACT_APP_SUPABASE_URL}/storage/v1/object/public/drop_image/${fileName}`
                );
                reduxImageArray.push(URL.createObjectURL(file));

                await supabase.storage
                  .from('drop_image')
                  .upload(newFilePath, file);
              });
              const image = imageArray[0];
              await createDrop({
                drop: {
                  ...metadata,
                  image,
                  imageArray: imageArray,
                  author_id: user.id,
                },
                user: user,
                onSuccess: (data) => {
                  const drop = data[0];
                  dispatch(
                    addNewReadyToCollect({
                      newReadyToCollect: {
                        ...drop,
                        image: URL.createObjectURL(metadata.image),
                        imageArray: reduxImageArray,
                      },
                    })
                  );
                },
              });
              setIsLoading(false);
              navigate('/drop-onboarding/success');
            }}
            loading={isLoading}
          >
            <FaCheckCircle size={18} className='text-[#FFFFFF] mr-2' />
            Confirm to drop
          </Button>
        </div>
      </div >
    </>
  );
};
