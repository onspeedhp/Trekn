import { useNavigate, useParams } from 'react-router';
import { useAuthContext } from '../context/AuthContext';
import { Button, Modal } from 'antd';
import { useEffect, useState } from 'react';
import {
  FaFaceFrown,
  FaFaceKissWinkHeart,
  FaFaceLaughBeam,
  FaFaceMeh,
  FaFaceSadCry,
} from 'react-icons/fa6';
import { useSelector } from 'react-redux';
import { addReaction } from '../middleware/data/reaction';
import { FaStar } from 'react-icons/fa';
import { supabase } from '../utils/supabaseClients';

export const Reaction = () => {
  const navigate = useNavigate();
  const { windowSize } = useAuthContext();
  const [value, setValue] = useState<number>(4);
  const { dropId } = useParams();
  const user = useSelector((state: any) => state.user);
  const [loading, setLoading] = useState(false);

  const handleError = async () => {
    if (!user.id || !dropId) {
      navigate('/');
    } else {
      const { data } = await supabase
        .from('reaction')
        .select('*')
        .eq('drop_id', dropId)
        .eq('user_id', user.id);

      if (data && data.length > 0) {
        navigate('/');
      }
    }
  };

  useEffect(() => {
    handleError();
  }, []);

  const reactions = [
    {
      icon: (
        <FaFaceSadCry
          size={52}
          className='text-[#CFCFCF]'
          style={{ color: value === 0 ? '#66C61B' : '#CFCFCF' }}
        />
      ),
      value: 'Crying',
    },
    {
      icon: (
        <FaFaceFrown
          size={52}
          className='text-[#CFCFCF]'
          style={{ color: value === 1 ? '#66C61B' : '#CFCFCF' }}
        />
      ),
      value: 'Nah 👎🏻',
    },
    {
      icon: (
        <FaFaceMeh
          size={52}
          className='text-[#CFCFCF]'
          style={{ color: value === 2 ? '#66C61B' : '#CFCFCF' }}
        />
      ),
      value: 'Hmmm',
    },

    {
      icon: (
        <FaFaceLaughBeam
          size={52}
          className='text-[#CFCFCF]'
          style={{ color: value === 3 ? '#66C61B' : '#CFCFCF' }}
        />
      ),
      value: 'I love it ❤️',
    },
    {
      icon: (
        <FaFaceKissWinkHeart
          size={52}
          className='text-[#CFCFCF]'
          style={{ color: value === 4 ? '#66C61B' : '#CFCFCF' }}
        />
      ),
      value: 'Obssesed!',
    },
  ];

  return (
    <div
      className='bg-white absolute w-full'
      style={{ height: windowSize.height }}
    >
      <div className='m-5 text-black font-semibold'>
        <div className='flex-col mb-6'>
          <FaStar size={48} color='#66C61B' />

          <div className='text-2xl my-3 font-semibold'>
            Rate your experience
          </div>
          <div className='text-black opacity-50 font-normal'>
            By owning this drop, you now can give your opinion on the experience
          </div>
        </div>
        <div className='flex items-center justify-center mt-[94px] mb-4'>
          <div className='flex items-center justify-center'>
            {reactions.map((items, index) => (
              <div
                key={index}
                onClick={() => {
                  if (value === index) {
                    setValue(-1);
                  } else {
                    setValue(index);
                  }
                }}
                className='mx-[6px] my-3'
              >
                {items.icon}
              </div>
            ))}
          </div>
        </div>

        <div className='flex items-center justify-center'>
          <div
            className='flex items-center justify-center w-fit h-[35px] px-[24px] rounded-full text-[#525252] font-medium text-base mb-[171px]'
            style={{
              border: '1px solid #E8E8E8',
            }}
          >
            {reactions[value].value}
          </div>
        </div>

        <Button
          className='bg-[#2E2E2E] text-white border-0  w-full h-12 rounded-3xl font-semibold text-base'
          loading={loading}
          onClick={async () => {
            setLoading(true);
            const { data } = await supabase
              .from('reaction')
              .insert({
                drop_id: dropId,
                user_id: user?.id,
                kind: value,
              })
              .select('*');

            if (data) {
              const { data: test, error } = await supabase
                .from('minted')
                .update({ reaction_id: data[0].id })
                .eq('ownerId', user?.id)
                .eq('drop_id', dropId);

              if (error) {
                console.log(error);
              }
            }
            setLoading(false);

            navigate(`/drop/details/${dropId}`);
          }}
        >
          Confirm
        </Button>
      </div>
    </div>
  );
};
