import React, { useEffect } from 'react'
import { useAuthContext } from '../context/AuthContext'
import DefaultBlackBg from '../components/DefaultBlackBg';
import { useNavigate } from 'react-router';
import CustomiseInputWIco from '../components/CustomiseInputWIco';
import { useSelector } from 'react-redux';
import { FaSearch } from 'react-icons/fa';
import { Button } from 'antd';

export default function CheckinNearBy() {
    const { windowSize } = useAuthContext();
    const navigate = useNavigate();
    const readyToCollectData = useSelector((state: any) => state?.location?.readyToCollect)
    useEffect(() => {
        console.log(readyToCollectData);
    }, [])
    return (
        <DefaultBlackBg className={'p-4'}>
            <div className="flex flex-col h-full">

                <div className='font-semibold flex items-center relative text-white mb-4'>
                    <svg
                        xmlns='http://www.w3.org/2000/svg'
                        width='17'
                        height='16'
                        viewBox='0 0 17 16'
                        fill='none'
                        className='absolute'
                        onClick={() => {
                            navigate('/');
                        }}
                    >
                        <path
                            d='M9.21347 13.9093L8.51972 14.6031C8.22597 14.8968 7.75097 14.8968 7.46035 14.6031L1.38535 8.5312C1.0916 8.23745 1.0916 7.76245 1.38535 7.47183L7.46035 1.39683C7.7541 1.10308 8.2291 1.10308 8.51972 1.39683L9.21347 2.09058C9.51035 2.38745 9.5041 2.87183 9.20097 3.16245L5.43535 6.74995H14.4166C14.8322 6.74995 15.1666 7.08433 15.1666 7.49995V8.49995C15.1666 8.91558 14.8322 9.24996 14.4166 9.24996H5.43535L9.20097 12.8375C9.50722 13.1281 9.51347 13.6125 9.21347 13.9093Z'
                            fill='#FFFFFFB2'
                            fillOpacity='0.7'
                        />
                    </svg>
                    <div className="text-base leading-10 flex-1 flex justify-center">
                        Check-in
                    </div>
                </div>
                {!readyToCollectData.length ?
                    <>
                        <div className='flex-1 flex flex-col items-center'>
                            <div className="flex-grow flex flex-col items-center justify-center w-[234px]">
                                <div className="mb-4 px-[37.5px]">
                                    <img src="/spyglass.svg" alt="spyglass" />
                                </div>
                                <p className='text-[#BDBDBD] text-[13px] font-medium text-center leading-[140%]'>Seems like this is a whole new place for you to explore and share, be the first one!</p>
                            </div>
                            <Button
                                className='bg-[#2C2C2C] text-white py-3 h-auto rounded-3xl font-semibold text-base border-0 w-full mb-5'
                            >
                                Create a new place
                            </Button>
                        </div>
                    </>
                    :
                    <>
                        <div className='mb-6'>
                            <CustomiseInputWIco style={'dark'} value={''} onChange={() => { }} label={null} placeholder='Where are you?' leftIco={<FaSearch size={16} />} />
                        </div>
                    </>}
            </div>
        </DefaultBlackBg>
    )
}
