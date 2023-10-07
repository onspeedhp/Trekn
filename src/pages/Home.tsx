/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { ListDetail } from '../components/ListDetail';
import { useAuthContext } from '../context/AuthContext';
import { FaPlus, FaMap } from 'react-icons/fa6';
import { useNavigate } from 'react-router';
import request from '../axios';
import { IDrop } from '../models/types';
import Slider from '../components/Slider';
import { DetailCard } from '../components/DetailCard';
import { Button, Spin } from 'antd';
import { getLeaderBoardPoint } from '../middleware/data/user';

function Home() {
  const { coordsNow, loggedIn, windowSize, leaderBoard, init } =
    useAuthContext();
  const [readyToCollect, setReadyToCollect] = useState<IDrop[]>([]);

  const [nearBy, setNearBy] = useState<IDrop[]>([]);
  const [loading, setLoading] = useState(false);
  const [leaderBoardPoint, setLeaderBoardPoint] = useState([]);
  const [loadingPoint, setLoadingPoint] = useState(false);

  const navigate = useNavigate();

  const getReadyToCollect = async (lat: number, log: number) => {
    const res = await request.post('drop/getReadyToCollect', {
      lat: lat,
      lng: log,
    });
    setReadyToCollect(res.data.data);
  };

  useEffect(() => {
    setLoadingPoint(true);
    getLeaderBoardPoint({
      onSuccess: (data) => {
        setLeaderBoardPoint(data);
      },
    });
    setLoadingPoint(false);
  }, []);

  const getNearBy = async (lat: number, log: number) => {
    const res = await request.post('drop/getNearBy', {
      lat: lat,
      lng: log,
    });

    setNearBy(res.data.data);
  };

  useEffect(() => {
    const { log, lat } = coordsNow;
    if (log !== -1 && lat !== -1) {
      getReadyToCollect(lat, log);
      getNearBy(lat, log);
    }
  }, [coordsNow]);

  return (
    <>
      <div className='w-full px-[20px] sm:px-0'>
        {!leaderBoard ? (
          <>
            <div className='w-full sm:h-[704px] flex items-end bg-cover mt-[40px]'>
              <div className='flex flex-col rounded-tr-[24px] sm:h-[336px] sm:bg-white sm:py-[40px] sm:pl-[142px] sm:pr-[48px] '>
                <div className='text-[34px] font-bold leading-10 w-[335px]'>
                  Discover Local Hidden Gems
                </div>
                {readyToCollect.length !== 0 ? (
                  <>
                    <div
                      className='mt-6'
                      style={{ width: windowSize.width - 20 }}
                    >
                      <Slider>
                        {readyToCollect.map((item: any, index: any) => (
                          <DetailCard
                            key={index}
                            data={item}
                            status={'ReadyToCollect'}
                          />
                        ))}
                      </Slider>
                    </div>
                  </>
                ) : (
                  <>
                    <div className='flex items-center justify-center mt-7'>
                      <img src='./Route_search.svg' alt='' />
                    </div>
                    <div className='text-center text-[20px] font-semibold text-black opacity-50'>
                      Go further to discover or drop something in the area
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className='max-w-[870px] ml-auto mr-auto mb-10'>
              <Button
                loading={loading}
                className='w-full h-[48px] relative items-center justify-center rounded-3xl bg-black text-white text-base font-semibold px-[32px] mt-6 flex sm:hidden'
                onClick={async () => {
                  if (loggedIn) {
                    navigate('/drop-onboarding');
                  } else {
                    setLoading(true);
                    await init();
                    setLoading(false);
                  }
                }}
              >
                <p className='absolute flex items-center'>
                  <FaPlus size={24} className='font-white mr-2' /> Drop a new
                  experience
                </p>
              </Button>
              <div
                className='w-full h-[48px] relative items-center justify-center rounded-3xl bg-white text-black text-base font-semibold px-[32px] mt-4 flex sm:hidden'
                style={{ border: '1px solid gray' }}
                onClick={() => {
                  navigate('/map-view');
                }}
              >
                <p className='absolute flex items-center'>
                  <FaMap size={24} className='mr-2' /> View map
                </p>
              </div>

              <div style={{ marginTop: 43 }}>
                {nearBy.length !== 0 && (
                  <ListDetail status={'Nearby'} data={nearBy} />
                )}
              </div>
            </div>
          </>
        ) : (
          <>
            <div className='collection-detail'>
              <div className='text-[34px] font-bold leading-10 mb-6 mt-10'>
                Leader board
              </div>

              <>
                <Spin
                  tip='Loading...'
                  spinning={loadingPoint}
                  className='flex items-center mt-16 mx-3'
                >
                  {leaderBoardPoint.length !== 0 && (
                    <>
                      <div className='flex-col mt-6 mx-3'>
                        {leaderBoardPoint.map((user: any, index) => (
                          <div
                            className='flex items-center relative w-full mb-4'
                            key={index}
                          >
                            <img
                              src={`${user?.profileImage}`}
                              alt=''
                              className='w-9 h-9 mr-2 rounded-full'
                            />
                            <div className='font-medium'>{user?.name}</div>
                            <div className='absolute inset-y-0 right-0'>
                              {user.point}
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </Spin>
              </>
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default Home;
