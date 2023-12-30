import { Button, Input, Spin } from 'antd';
import { useState } from 'react';
import { useAuthContext } from '../context/AuthContext';
import { Divider } from 'antd';
import { FaPlus, FaTimesCircle } from 'react-icons/fa';
import { supabase } from '../utils/supabaseClients';
import { ListDetail } from '../components/ListDetail';
import { useSelector } from 'react-redux';
import { calculateDistance } from '../functions/calculateDistance';
import { useNavigate } from 'react-router';
type Status = 'Beginning' | 'HaveResult' | 'DontHave';

export const Search = () => {
  const [value, setValue] = useState('');
  const user = useSelector((state: any) => state.user);
  const { windowSize, init } = useAuthContext();
  const histories: any[] = [
    'Xmas pub',
    'Acoustic coffee',
    'Blablabla',
    'Nanami',
    'BeMind',
    'Rang Rang Coffe',
    'Circle K',
    'GS25',
  ];
  const [visibleItems, setVisibleItems] = useState(4);
  const popular = [
    'Street food',
    'Coffee',
    'Brunch',
    'Pub',
    'Museum',
    'Library',
  ];

  const [selectedPopular, setSelectedPopolar] = useState(-1);

  const handleViewMore = () => {
    setVisibleItems((prev) => prev + 3);
  };
  const [listSearch, setListSearch] = useState<any[]>([]);
  const [status, setStatus] = useState<Status>('Beginning');
  const [loadingSearching, setLoadingSearching] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      <div className='mx-5 mt-6'>
        <Input
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
          }}
          className='rounded-xl h-[51px] w-full px-3 py-4 mb-6 bg-[#F5F5F5] border-0 text-black'
          placeholder='Search for an IRL experience...'
          type='Input'
          onPressEnter={async () => {
            if (value !== '') {
              setLoadingSearching(true);
              setStatus('HaveResult');
              setListSearch([]);
              const searchTerms = value.split(' ');
              const searchInput =
                searchTerms.length === 1
                  ? searchTerms[0]
                  : `'${searchTerms.join("' & '")}'`;

              const { data, error } = await supabase
                .from('drop')
                .select('*, user(*)')
                .textSearch('name', searchInput);

              if (!error) {
                if (data.length > 0) {
                  let nearBy = [];
                  for (let i = 0; i < data.length; i++) {
                    nearBy.push({
                      ...data[0],
                      distance: calculateDistance(
                        user.lat,
                        user.lng,
                        data[0].lat,
                        data[0].lng
                      ),
                    });
                  }
                  nearBy.sort((a, b) => a.distance - b.distance);
                  setListSearch(nearBy);
                  console.log('data');
                } else {
                  setStatus('DontHave');
                }
              } else {
                setStatus('Beginning');
              }
              setLoadingSearching(false);
            }
          }}
          suffix={
            value ? (
              <FaTimesCircle
                onClick={() => {
                  setValue('');
                }}
              />
            ) : (
              <></>
            )
          }
        />
        {status === 'Beginning' && histories && histories.length > 0 && (
          <div className='w-full text-black opacity-80 px-3'>
            {histories.length <= 3 ? (
              <>
                {histories.map((item, index) => (
                  <>
                    <div>
                      <div>{item}</div>
                      <Divider className='my-3' />
                    </div>
                  </>
                ))}
              </>
            ) : (
              <>
                <div className='overflow-y-auto h-[196px]'>
                  {histories.slice(0, visibleItems).map((item, index) => (
                    <>
                      <div
                        onClick={() => {
                          setValue(item);
                          setSelectedPopolar(-1);
                        }}
                      >
                        <div>{item}</div>
                        <Divider className='my-3' />
                      </div>
                    </>
                  ))}
                </div>

                <div className='flex items-center justify-center'>
                  <Button
                    className='border-0 shadow-none mb-3'
                    onClick={handleViewMore}
                  >
                    View more
                  </Button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
      {status === 'Beginning' ? (
        <>
          <div className='w-full h-2 bg-[#F5F5F5]'></div>
          <div className='mx-5 my-6' style={{ width: windowSize.width - 40 }}>
            <div className='mb-4  text-[#0B0808]'>Popular</div>
            <div className='flex flex-wrap gap-x-3 gap-y-[10px] text-black opacity-80'>
              {popular.map((item, index) => (
                <>
                  <Button
                    className='h-[51px] w-fit rounded-full'
                    onClick={() => {
                      if (selectedPopular !== -1 && selectedPopular === index) {
                        setSelectedPopolar(-1);
                        setValue('');
                      } else {
                        setSelectedPopolar(index);
                        setValue(item);
                      }
                    }}
                  >
                    {item}
                  </Button>
                </>
              ))}
            </div>
          </div>
        </>
      ) : (
        <>
          <div className='px-5'>
            {status === 'HaveResult' ? (
              <>
                <Spin
                  tip='Loading result'
                  spinning={loadingSearching}
                  className={`flex items-center mt-10 text-black font-semibold`}
                  style={{ top: loadingSearching ? 208 : 0 }}
                >
                  {listSearch.length !== 0 && (
                    <ListDetail status={'Nearby'} data={listSearch} />
                  )}
                </Spin>
              </>
            ) : (
              <>
                {!loadingSearching && (
                  <div className='flex flex-col items-center mt-4'>
                    <img src='/Route_search.svg' alt='' />
                    <div className='text-black'>No Results Found</div>
                    <p className='text-center text-[15px] text-black opacity-50'>
                      Couldn't find what you were looking for? If you're at an
                      interesting place, consider adding it to help others
                      discover it too!
                    </p>
                    <Button
                      loading={loading}
                      className='flex gap-2 items-center justify-center border-none rounded-3xl bg-black text-white text-base font-semibold w-full h-auto mt-6 py-3'
                      onClick={async () => {
                        if (user.id) {
                          navigate('/check-in/upload-image');
                        } else {
                          setLoading(true);
                          await init();
                          setLoading(false);
                        }
                      }}
                    >
                      <FaPlus size={24} />
                      <span>Add a new place</span>
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </>
      )}
    </>
  );
};
