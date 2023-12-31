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
  const histories: any = JSON.parse(localStorage.getItem('search-history') || '[]');
  const type = useSelector((state: any) => state.config?.dropType)
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

  const handleSearch = async (type?: any) => {
    setLoadingSearching(true);
    setStatus('HaveResult');
    setListSearch([]);
    const searchTerms = value.split(' ');
    console.log('Debug 2');

    const searchInput =
      searchTerms.length === 1
        ? searchTerms[0]
        : `'${searchTerms.join("' & '")}'`;
    console.log('Debug 1');
    let _data: any;
    let _error: any;
    if (type) {
      setValue(type.type)
      const { data, error } = await supabase
        .from('drop')
        .select('*, user(*)')
        .eq('type', type.id)
      _data = data;
      _error = error;
    } else {
      localStorage.setItem('search-history', JSON.stringify([value, ...histories]))
      const { data, error } = await supabase
        .from('drop')
        .select('*, user(*)')
        .textSearch('name', searchInput)
      _data = data;
      _error = error;
    }

    console.log(_data);

    if (!_error) {
      if (_data.length > 0) {
        let nearBy = [];
        nearBy.push(..._data.map((item: any) => ({
          ...item,
          distance: calculateDistance(
            user.lat,
            user.lng,
            item.lat,
            item.lng
          ),
        })));
        nearBy.sort((a, b) => a.distance - b.distance);
        setListSearch(nearBy);
      } else {
        setStatus('DontHave');
      }
    }
    setLoadingSearching(false);
  }

  return (
    <>
      <div className='mx-5 mt-6'>
        <Input
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
          }}

          className='search-input rounded-xl h-[51px] w-full px-3 py-4 mb-6 bg-[#F5F5F5] border-0 text-black'
          placeholder='Search for an IRL experience...'
          type='Input'
          onPressEnter={async () => {
            if (value !== '') {
              handleSearch()
            } else {
              setStatus('Beginning');
            }
            setLoadingSearching(false);
          }
          }
          suffix={
            value ? (
              <FaTimesCircle
                onClick={() => {
                  setValue('');
                  setStatus('Beginning');
                }}
              />
            ) : (
              <></>
            )
          }
        />
        {status === 'Beginning' && histories && histories.length > 0 && (
          <div className='w-full text-black opacity-80 px-3'>
            {histories.length > 0 && histories.length <= 3 ? (
              <>
                {histories.map((item: any, index: number) => (
                  <>
                    <div key={index}>
                      <p className='text-[#0B080880] font-medium text-base leading-5'>{item}</p>
                      <Divider className='my-3' />
                    </div>
                  </>
                ))}
              </>
            ) : (
              <>
                <div className='overflow-y-auto h-[196px]'>
                  {histories.slice(0, visibleItems).map((item: any, index: number) => (
                    <>
                      <div
                        onClick={() => {
                          setValue(item);
                          setSelectedPopolar(-1);
                        }}
                        key={index}
                      >
                        <p className='text-[#0B080880] font-medium text-base leading-5'>{item}</p>
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
            <div className='mb-4  text-[#0B0808] font-medium text-base leading-5'>Popular</div>
            <div className='flex flex-wrap gap-x-3 gap-y-[10px] text-black opacity-80'>
              {type.slice(0, 3).map((item: any, index: number) => (
                <div
                  key={index}
                  className='p-4 border border-[#000000B2] font-medium text-base leading-[17px] rounded-full'
                  onClick={() => {
                    if (selectedPopular !== -1 && selectedPopular === index) {
                      setSelectedPopolar(-1);
                      setValue('');
                    } else {
                      setSelectedPopolar(index);
                      handleSearch(item);
                    }
                  }}
                >
                  {item.type}
                </div>
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
