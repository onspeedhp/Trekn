/* eslint-disable react-hooks/exhaustive-deps */
import React, { Fragment, useEffect, useRef, useState } from 'react';
import { ListDetail } from '../components/ListDetail';
import { useAuthContext } from '../context/AuthContext';
import { FaMap, FaPlus } from 'react-icons/fa6';
import { useLocation, useNavigate } from 'react-router';
import request from '../axios';
import { IDrop } from '../models/types';
import { Button, Drawer, Spin } from 'antd';
import { getFollowerById, getFollowingById, getLeaderBoardPoint } from '../middleware/data/user';
import { useDispatch, useSelector } from 'react-redux';
import {
  setLastFetch,
  updateNearBy,
  updateReadyToCollect,
} from '../redux/slides/locationSlides';
import moment from 'moment';
import { updateInit } from '../redux/slides/userSlides';
import useApi from '../hooks/useAPI';
import { capitalizeFirstLetter } from '../functions/text';
import { getDropByUserAddress, getDropType } from '../middleware/data/drop';
import { getMintedByUserAddress } from '../middleware/data/minted';
import { sortDataByTimeline } from '../utils/account.util';
import Feed from '../components/Feed';
import { useDraggable } from "react-use-draggable-scroll";
import { setDropType } from '../redux/slides/configSlice';

function Home() {
  const { windowSize, leaderBoard, init } = useAuthContext();
  const { state: locationState } = useLocation();
  const { get } = useApi();
  const filterScrollRef: any = useRef();
  const { events } = useDraggable(filterScrollRef);
  const [readyToCollect, setReadyToCollect] = useState<IDrop[]>([]);
  const user = useSelector((state: any) => state.user);
  const location = useSelector((state: any) => state.location);
  const typeList = useSelector((state: any) => state.config?.dropType);
  const dispatch = useDispatch();
  const [nearBy, setNearBy] = useState<IDrop[]>([]);
  const [loading, setLoading] = useState(false);
  const [leaderBoardPoint, setLeaderBoardPoint] = useState([]);
  const [loadingPoint, setLoadingPoint] = useState(false);
  const [loadingNearBy, setLoadingNearBy] = useState(false);
  const [loadingFollow, setLoadingFollow] = useState(false);
  const [loadingReadyToCollect, setLoadingReadyToCollet] = useState(false);
  const [openDrawer, setOpenDrawer] = useState(true);
  const [follow, setFollowData] = useState({});
  const [currentView, setCurrentView] = useState('exploring')
  const [filter, setFilter] = useState('all')
  const [viewList, setViewList] = useState<any>([])

  const navigate = useNavigate();

  useEffect(() => {
    if (locationState?.login && !user.address) {
      init();
      window.history.replaceState({}, document.title)
    }
    getDropType({ onSuccess: (data) => dispatch(setDropType(data)) })
    setLoadingPoint(true);
    getLeaderBoardPoint({
      onSuccess: (data) => {
        setLeaderBoardPoint(data);
      },
    });
    setLoadingPoint(false);
  }, []);

  useEffect(()=>{
    if(filter !== 'all') {
      const result = [...readyToCollect,...nearBy].filter((item: any) => item.type === filter);
      return setViewList(result);
    }
    return setViewList([...readyToCollect,...nearBy]);
  },[readyToCollect, nearBy, filter])

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
  }, [user.lat]);

  useEffect(() => {
    if (user.id) {
      (async () => {
        await getFollowingById({
          userId: user.id, onSuccess: (followingList: any) => {
            dispatch(updateInit({ following: followingList }));
          }
        });
        await getFollowerById({
          userId: user.id, onSuccess: (followerList: any) => {
            dispatch(updateInit({ follower: followerList }));
          }
        });
      })();
    }
  }, [user.id])

  useEffect(() => {
    if (!user.country || !user.city) {
      (async () => {
        const countryInfo: any = await get(`https://nominatim.openstreetmap.org/reverse.php?lat=${user.lat}&lon=${user.lng}&zoom=5&format=jsonv2&accept-language=en`);
        dispatch(updateInit({
          country: countryInfo?.address?.country,
          city: countryInfo?.address?.city,
        }));
      })();
    }
  }, [user.id, user.lng, user.lat])

  useEffect(() => {
    if (user.following && user.following.length > 0) {
      (async () => {
        setLoadingFollow(true);
        const userData: any = [];
        await getDropByUserAddress({
          userId: user.following,
          onSuccess: (res: any) => {
            userData.push(
              ...res.map((item: any) => {
                item.type = 'drop';
                return item;
              })
            );
          },
        });

        await getMintedByUserAddress({
          userId: user.following,
          onSuccess: (res: any) => {
            userData.push(
              ...res.map((item: any) => {
                item.type = 'minted';
                return item;
              })
            );
          },
        });
        setLoadingFollow(false);
        setFollowData(sortDataByTimeline(userData));
      })()
    }
  }, [user.following])

  const ChangeViewButton = ({ label }: { label: string }) => (
    <div
      className={`w-1/2 font-bold text-[14.65px] leading-[18px] text-center py-2 rounded-[10px] transition duration-300 ${currentView !== label ? 'bg-transparent text-[#00000070]' : 'bg-white'
        }`}
      onClick={() => setCurrentView(label)}
    >
      {capitalizeFirstLetter(label)}
    </div>
  )


  return (
    <>
      <div
        className="mt-6 flex items-center gap-3 pl-5 overflow-x-scroll scrollbar-hide"
        {...events}
        ref={filterScrollRef}
      >
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center border border-black flex-shrink-0"
          onClick={() => {
            navigate('/map-view');
          }}
        >
          <FaMap
            size={16}
          />
        </div>
        <div
          className={`${filter === 'all' ? 'bg-[#99FF48]' : 'bg-[#F2F2F2]'} px-[10px] py-[6px] text-[#020303] rounded-full font-medium leading-[18px] tracking-[-0.08px] whitespace-nowrap`}
          onClick={() => setFilter('all')}
        >
          All in {user.city}
        </div>
        {typeList?.map((item:any,idx:number) =>
          <div
            className={`${filter === item.id ? 'bg-[#99FF48]' : 'bg-[#F2F2F2]'} px-[10px] py-[6px] text-[#020303] rounded-full font-medium leading-[18px] tracking-[-0.08px] whitespace-nowrap`}
            onClick={() => setFilter(item.id)}
            key={idx}
          >
            {capitalizeFirstLetter(item.type)}
          </div>
        )}
      </div>
      <div className='w-full px-[20px] sm:px-0 relative'>
        {/* {user.address &&
          <div className="p-1 bg-[#ECECEC] rounded-[10px] mt-10 flex items-center">
            <ChangeViewButton label={'exploring'} />
            <ChangeViewButton label={'following'} />
          </div>
        } */}
        {!leaderBoard ? (
          <>
            {currentView === 'exploring' &&
              <>
                <div className={`mt-6`}>
                  {/* <div className='text-[14px] text-black opacity-70 font-medium mb-2 leading-[18px]'>
                    {moment().format('dddd, Do MMM')}
                  </div> */}

                  <div className='font-semibold text-[28px] leading-9'>
                    Nearby experiences
                  </div>

                  {/* <div style={{ marginTop: 24 }}>
                    <Spin
                  tip='Loading...'
                  className='flex items-center mt-10'
                >
                    {nearBy.length !== 0 && (
                      <ListDetail
                        status={'Nearby'}
                        data={readyToCollect}
                      />
                    )}
                    </Spin>
                  </div> */}

                  <div style={{ marginTop: 24 }}>
                    <Spin
                      tip='Loading nearby'
                      spinning={loadingNearBy}
                      className={`flex items-center mt-10 text-black font-semibold`}
                      style={{ top: (loadingNearBy ? 208 : 0) }}
                    >
                      {viewList.length !== 0 ? (
                        <ListDetail status={'Nearby'} data={viewList} />
                      ) :
                        <>
                          {!loadingNearBy &&
                            <div className="flex flex-col items-center">
                              <img src="/Route_search.svg" alt="" />
                              <p className='text-center text-[15px] text-black opacity-50'>Seems like this is a whole new place for you to explore and share, be the first one!</p>
                              <Button className='flex gap-2 items-center justify-center border-none rounded-3xl bg-black text-white text-base font-semibold w-full h-auto mt-6 py-3'
                                onClick={async () => {
                                  if (user.id) {
                                    navigate('/check-in/upload-image');
                                  } else {
                                    setLoading(true);
                                    await init();
                                    setLoading(false);
                                  }
                                }}>
                                <FaPlus size={24} />
                                <span>Drop a new experience</span>
                              </Button>
                            </div>
                          }
                        </>
                      }
                    </Spin>
                  </div>
                </div>
                {/* {nearBy.length !== 0 && !loadingNearBy &&
                  <Button
                    className='fixed top-[90%] right-4 w-[56px] h-[56px] rounded-full border-0'
                    style={{ backgroundColor: 'rgba(148, 255, 65, 0.80)' }}
                    onClick={async () => {
                      if (user.id) {
                        navigate('/check-in/nearby');
                      } else {
                        setLoading(true);
                        await init();
                        setLoading(false);
                      }
                    }}
                  >
                    <FaPlus size={24} className='text-black' />
                  </Button>
                } */}
              </>
            }
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
      {currentView === 'following' &&
        <>
          <div className='mt-9'>
            <Spin
              tip='Loading Follow'
              spinning={loadingFollow}
              className='flex items-center mt-10 text-black font-semibold'
              style={{ top: (loadingFollow ? 208 : 0) }}
            >
              {Object.entries(follow).length > 0 && Object.entries(follow).map(([key, data]: any, dataIdx) => (
                <Fragment key={dataIdx}>
                  {data.map((item: any, itemIdx: number) => (
                    <Fragment key={itemIdx}>
                      <Feed wrapperData={follow} data={data} dataIdx={dataIdx} item={item} itemIdx={itemIdx} />
                    </Fragment>
                  ))}
                </Fragment>
              ))
              }
            </Spin>
            {!loadingFollow && Object.entries(follow).length === 0 &&
              <div className='absolute top-[106px] bottom-0 left-0 right-0 flex flex-col justify-center items-center z-[-1] px-[11.736%]'>
                <img src="/bubble-with-a-cross.svg" alt="" className='w-[152px] h-[158px] object-cover object-center mb-4' />
                <p className='text-[13px] font-medium leading-[18.2px] text-[#707070CC] text-center'>Your Following list is empty. Start connecting! Follow people or add friends to see their updates here.</p>
              </div>}
          </div>
        </>
      }
      {/* <Drawer onClose={() => setOpenDrawer(false)} open={openDrawer} placement='bottom'
        height={windowSize.height * 0.9}>
        aaa
      </Drawer> */}
    </>
  );
}

export default Home;
