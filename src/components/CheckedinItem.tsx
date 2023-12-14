import React from 'react'
import { FaMapPin, FaPlusCircle, FaThumbsUp } from 'react-icons/fa'
import { checkTimeAgo } from '../utils/common.utils'
import LazyImageCustom from './LazyImageCustom';
import { useNavigate } from 'react-router';
import { useAuthContext } from '../context/AuthContext';
import Item from 'antd/es/list/Item';
import { getScore } from '../utils/account.util';
import { calculateDistance, convertDistance } from '../functions/calculateDistance';
import { useSelector } from 'react-redux';

export default function CheckedinItem({ data, last }: any) {
    const user = useSelector((state: any) => state.user);
    const { windowSize } = useAuthContext();
    const navigate = useNavigate();
    return (
        <div className='pb-8 mx-5'>
            <div className='flex items-center' key={data.id}>
                <img
                    src={`${data?.user?.profileImage}`}
                    onClick={()=>{data?.user.id !== user.id && navigate(`/account/${data?.user?.id}`)}}
                    className='w-10 h-10 mr-2 rounded-full object-cover object-center'
                    alt=''
                />

                <div className='flex-col'>
                    <span className='font-medium mb-2'>{data?.user?.name}</span>
                    <div className='flex items-center'>
                        {data?.type === 'minted' ? (
                            <FaMapPin className='w-3 h-3' />
                        ) : (
                            <FaPlusCircle className='w-3 h-3' />
                        )}
                        <span className='font-medium text-black text-[13px] opacity-50 ml-1'>
                            {checkTimeAgo(data.created_at)}
                        </span>
                    </div>
                </div>
            </div>
            <div
                className='flex justify-center items-center rounded-xl relative mt-3 cursor-pointer rounded-xl'
                style={{
                    height: 377,
                    backgroundColor: '#525252',
                }}
                onClick={() => {
                    // setIsDrawerVisible(true);
                    navigate(`/drop/details/${data?.drop?.id}`);
                }}
            >
                <div className='relative'>
                    <div
                        className='rounded-xl'
                        style={{
                            width: windowSize.width - 40,
                            height: 377,
                            objectFit: 'cover',
                            objectPosition: 'center',
                        }}
                    >
                        <LazyImageCustom
                            src={data?.image}
                            alt='Drop Img'
                            className='skeleton object-cover rounded-xl object-center w-full'
                            size={[windowSize.width - 40, 377]}
                            style={{
                                height: 377,
                                borderRadius: 12,
                                objectFit: 'cover',
                                objectPosition: 'center',
                            }}
                        />
                    </div>
                </div>
            </div>
            <p className="mt-2 text-[13px] font-medium text-[#02030380] leading-4 tracking-[-0.08px]">{data?.description}</p>
            <div className="mt-3 border border-[#E0E0E0] rounded-2xl py-4 px-3 flex gap-4">
                <img src={data?.drop.image} alt="" className='w-[120px] h-[120px] rounded-xl object-cover object-center flex-shrink-0' />
                <div className="flex flex-col py-2">
                    <div className="font-semibold text-sm leading-[18px] tracking-[-0.08px] mb-2 line-clamp-1">{data?.drop.name}</div>
                    <div className='flex items-center text-sm font-medium leading-5 text-black'>
                        <div className='flex items-center justify-center mr-2'>
                            <FaThumbsUp className='text-[#FFB800] mr-1' />
                            <span className='text-[14px] opacity-70'>{getScore(data, false)}</span>
                        </div>
                        <div className='flex items-center justify-center opacity-70'>
                            <p className='mr-2 w-[11px] text-[#dfdfdfb3]'>●</p>{' '}
                            <p className='line-clamp-1'>
                                {convertDistance(
                                    calculateDistance(
                                        data?.drop.lat,
                                        data?.drop.lng,
                                        user.lat,
                                        user.lng
                                    )
                                )}{' '}
                                away
                            </p>
                        </div>
                    </div>
                    <div className="mt-auto flex items-center gap-1">
                        <img src={data?.drop?.user?.profileImage} onClick={()=>data?.drop?.user.id !== user.id && navigate(`/account/${data?.drop?.user?.id}`)} alt="" className="w-4 h-4 rounded-full" />
                        <p className='text-[13px] font-medium leading-4 tracking-[-0.08px] opacity-70 line-clamp-1'>{data?.drop?.user?.name}</p>
                    </div>
                </div>
            </div>
            {!last && <div className='border-b mt-6'></div>}
        </div>
    )
}
