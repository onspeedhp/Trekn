/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { ListDetail } from '../components/ListDetail';
import { useAuthContext } from '../context/AuthContext';
import { FaPlus } from 'react-icons/fa6';
import { useNavigate } from 'react-router';
import request from '../axios';
import { IDrop } from '../models/types';
import { Button, Spin } from 'antd';
import { getLeaderBoardPoint } from '../middleware/data/user';
import { useDispatch, useSelector } from 'react-redux';
import {
  setLastFetch,
  updateNearBy,
  updateReadyToCollect,
} from '../redux/slides/locationSlides';
import moment from 'moment';

function Home() {
  const { windowSize, leaderBoard, init } = useAuthContext();
  const [readyToCollect, setReadyToCollect] = useState<IDrop[]>([]);
  const user = useSelector((state: any) => state.user);
  const location = useSelector((state: any) => state.location);
  const dispatch = useDispatch();
  const [nearBy, setNearBy] = useState<IDrop[]>([]);
  const [loading, setLoading] = useState(false);
  const [leaderBoardPoint, setLeaderBoardPoint] = useState([]);
  const [loadingPoint, setLoadingPoint] = useState(false);
  const [loadingNearBy, setLoadingNearBy] = useState(false);
  const [loadingReadyToCollect, setLoadingReadyToCollet] = useState(false);
  const navigate = useNavigate();

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
    setLoadingNearBy(true);
    const res = await request.post('drop/getNearBy', {
      lat: lat,
      lng: log,
    });

    dispatch(updateNearBy({ nearBy: res.data.data }));
    dispatch(setLastFetch());
    setNearBy(res.data.data);
    setLoadingNearBy(false);
  };

  const getReadyToCollect = async (lat: number, log: number) => {
    setLoadingReadyToCollet(true);
    const res = await request.post('drop/getReadyToCollect', {
      lat: lat,
      lng: log,
    });

    dispatch(updateReadyToCollect({ readyToCollect: res.data.data }));
    dispatch(setLastFetch());
    setReadyToCollect(res.data.data);
    setLoadingReadyToCollet(false);
  };

  useEffect(() => {
    if (user.lat) {
      if (
        location.readyToCollect.length === 0 ||
        location.lastFetch === -1 ||
        (location.lastFetch - new Date().getTime()) / 1000 > 300
      ) {
        getReadyToCollect(user.lat, user.lng);
      } else {
        setReadyToCollect(location.readyToCollect);
      }

      if (
        location.nearBy.length === 0 ||
        location.lastFetch === -1 ||
        (location.lastFetch - new Date().getTime()) / 1000 > 300
      ) {
        getNearBy(user.lat, user.lng);
      } else {
        setNearBy(location.nearBy);
      }
    }
  }, [user]);

  return (
    <>
      <div className='w-full px-[20px] sm:px-0 relative'>
        {!leaderBoard ? (
          <>
            <div className='mt-10'>
              <div className='text-[14px] text-black opacity-70 font-medium mb-2'>
                {moment().format('dddd, Do MMM')}
              </div>

              <div className='font-semibold text-[28px]'>
                Nearby experiences
              </div>

              <div style={{ marginTop: 24 }}>
                <Spin
                  tip='Loading...'
                  spinning={loadingReadyToCollect}
                  className='flex items-center mt-10'
                >
                  {nearBy.length !== 0 && (
                    <ListDetail
                      status={'ReadyToCollect'}
                      data={readyToCollect}
                    />
                  )}
                </Spin>
              </div>

              <div style={{ marginTop: 0 }}>
                <Spin
                  tip='Loading nearby'
                  spinning={loadingNearBy}
                  className='flex items-center mt-10'
                >
                  {nearBy.length !== 0 && (
                    <ListDetail status={'Nearby'} data={nearBy} />
                  )}
                </Spin>
              </div>
            </div>

            <Button
              className='fixed top-[90%] right-4 w-[56px] h-[56px] rounded-full border-0'
              style={{ backgroundColor: 'rgba(148, 255, 65, 0.80)' }}
              onClick={async () => {
                if (user.id) {
                  navigate('/drop-onboarding/upload-image');
                } else {
                  setLoading(true);
                  await init();
                  setLoading(false);
                }
              }}
            >
              <FaPlus size={24} className='text-black' />
            </Button>
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
                              <span className='text-black opacity-50'>
                                {user.point === 1 ? ' point' : ' points'}
                              </span>
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
