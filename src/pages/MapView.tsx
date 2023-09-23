import { Button, Image } from 'antd';
import { FaPlus } from 'react-icons/fa6';
import { useNavigate } from 'react-router';

export const MapView = () => {
  const navigate = useNavigate();
  return (
    <>
      <div className='relative w-[fit-content]'>
        <Image
          className='block'
          height={812}
          preview={false}
          src='./fake_map.png'
        />
        <Button
          onClick={() => {
            navigate('/drop-onboarding');
          }}
          style={{ marginLeft: 155 }}
          className='fixed bg-black bottom-0 rounded-full w-16 h-16 text-white flex items-center justify-center mb-4'
        >
          <FaPlus size={24} />
        </Button>
      </div>
    </>
  );
};
