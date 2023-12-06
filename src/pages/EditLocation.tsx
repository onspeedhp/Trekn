import React, { useEffect, useState } from 'react'
import DefaultBlackBg from '../components/DefaultBlackBg'
import { useNavigate } from 'react-router';
import { FaChevronRight, FaSearch } from 'react-icons/fa';
import CustomiseInputWIco from '../components/CustomiseInputWIco';
import useApi from '../hooks/useAPI';

export default function EditLocation() {
    const navigate = useNavigate();
    const apiService = useApi();
    const [currentEdit, setCurrentEdit] = useState('');
    const [searchValue, setSearchValue] = useState('');
    const handleFilterLocation = (value: string) => {
        setSearchValue(value);
    }

    useEffect(()=>{
        // if()
    },[currentEdit])
    return (
        <DefaultBlackBg className={'p-4'}>
            <div className='font-semibold flex items-center relative text-white mb-6'>
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
                    Edit location address
                </div>
            </div>
            {!currentEdit &&
                <>
                    <div className="flex flex-col gap-2">
                        <div className="font-medium text-[13px] text-[#FFFFFF70] leading-[120%]">
                            Location address
                        </div>
                        <div className="text-base font-semibold leading-[120%] text-[#ffffff50] rounded-xl bg-[#33333387] py-4 px-3 flex items-center justify-between gap-4" onClick={() => setCurrentEdit('state')}>
                            Quận/Huyện, Phường/Xã
                            <FaChevronRight size={16} className='text-[#ffffff70]' />
                        </div>
                        <div className="text-base font-semibold leading-[120%] text-[#ffffff50] rounded-xl bg-[#33333387] py-4 px-3" onClick={() => setCurrentEdit('address')}>
                            Tên đường, Toà nhà, Số nhà
                        </div>
                    </div>

                </>
            }

            {currentEdit === 'cities' || currentEdit === 'state' || currentEdit === 'district' &&
                <div className='flex flex-col gap-6'>
                    <CustomiseInputWIco style={'dark'} value={searchValue} onChange={handleFilterLocation} label={null} placeholder='Quận/Huyện, Phường/Xã' leftIco={<FaSearch size={16} className="text-[#ffffff70]"/>} />
                    <div className="font-medium text-[13px] text-[#FFFFFF70] leading-[120%]">
                        Cities
                    </div>
                </div>
            }

        </DefaultBlackBg>
    )
}
