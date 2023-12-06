import React, { useEffect, useState } from 'react'
import DefaultBlackBg from '../components/DefaultBlackBg'
import { useNavigate } from 'react-router';
import { FaChevronRight, FaSearch } from 'react-icons/fa';
import CustomiseInputWIco from '../components/CustomiseInputWIco';
import useApi from '../hooks/useAPI';
import { useSelector } from 'react-redux';
import { camelToSnakeCase, capitalizeFirstLetter } from '../functions/text';
import { set } from 'immer/dist/internal';

export default function EditLocation() {
    const navigate = useNavigate();
    const apiService = useApi();
    const user = useSelector((state: any) => state.user)
    const [currentEdit, setCurrentEdit] = useState('');
    const [searchValue, setSearchValue] = useState('');
    const [addressForm, setAddressForm] = useState<{ state?: string; city?: string; district?: string, subDistrict?: string }>({});
    const [dataList, setDataList] = useState<Array<any>>([]);
    const [filteredDataList, setFilteredDataList] = useState<Array<any>>([]);
    const [currentCode, setCurrentCode] = useState(null);
    const stepList = user.country === 'Vietnam' ? ['cities', 'district', 'subDistrict'] : ['state', 'cities'];
    const handleFilterLocation = (value: string) => {
        setSearchValue(value);
        const result = value ? dataList.filter((location: any) => location.name.toLowerCase().includes(value)) : dataList;
        setFilteredDataList(result);
    }

    useEffect(() => {
        (async () => {
            let data: any;
            if (user.country === 'Vietnam') {
                switch (currentEdit) {
                    case 'cities':
                        data = await apiService.get('https://provinces.open-api.vn/api/p/');
                        break;
                    case 'district':
                        const p: any = await apiService.get(`https://provinces.open-api.vn/api/p/${currentCode}?depth=2`);
                        data = p.districts;
                        break;
                    case 'subDistrict':
                        const d: any = await apiService.get(`https://provinces.open-api.vn/api/d/${currentCode}?depth=2`);
                        data = d.wards;
                        break;
                    default:
                }
            } else {
                // another country
            }
            setDataList(data);
            setFilteredDataList(data);
        })()
    }, [currentEdit])

    const handleReturn = () => {
        setCurrentEdit('');
        setSearchValue('');
    }

    const handleChoose = (item: any) => {
        const currentStepIdx = stepList.indexOf(currentEdit);
        setAddressForm((prev) => ({ ...prev, [currentEdit === 'cities' ? 'city' : currentEdit]: item.name }));
        setCurrentCode(item.code);
        setDataList([]);
        setFilteredDataList([]);
        setSearchValue('');
        setCurrentEdit(stepList[currentStepIdx + 1])
    }

    const handleChangeAddress = (key: string) => {
        // switch (key) {
        //     case 'city':
        //         user.country === 'Vietnam' ? setAddressForm({}) : setAddressForm((prev) => {
        //             const newForm = { ...prev };
        //             delete newForm.city;
        //             return newForm;
        //         })
        //         setCurrentEdit('cities');
        //         break;
        //     default:
        //         setAddressForm((prev) => {
        //             const newForm: any = { ...prev };
        //             delete newForm[key];
        //             return newForm;
        //         })
        //         setCurrentEdit(key);
        // }
        setAddressForm({})
        setCurrentEdit('cities');
    }

    const selectedState = () => (
        <div className="flex flex-col py-4 px-2 gap-4">
            {Object.entries(addressForm).map(([key, value]: any, idx: number) =>
                <div className="flex items-center gap-1" key={idx} onClick={() => handleChangeAddress(key)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <circle cx="10" cy="10" r="10" fill="#99FF48" fill-opacity="0.4" />
                        <circle cx="10" cy="10" r="6" fill="#99FF48" />
                    </svg>
                    <div className="text-base text-white font-medium leading-[120%]">
                        {value}
                    </div>
                </div>
            )}
        </div>
    )

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
                    onClick={() => currentEdit ? handleReturn() : navigate(-1)}
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
                        <div className="text-base font-semibold leading-[120%] text-[#ffffff50] rounded-xl bg-[#33333387] py-4 px-3 flex items-center justify-between gap-4" onClick={() => Object.entries(addressForm)?.length > 0 ? handleChangeAddress(user.country === 'Vietnam' ? 'cities' : 'state') : setCurrentEdit(user.country === 'Vietnam' ? 'cities' : 'state')}>
                            {Object.entries(addressForm)?.length > 0 ? selectedState() : 'Quận/Huyện, Phường/Xã'}
                            <FaChevronRight size={16} className='text-[#ffffff70]' />
                        </div>
                        <div className="text-base font-semibold leading-[120%] text-[#ffffff50] rounded-xl bg-[#33333387] py-4 px-3" onClick={() => setCurrentEdit('address')}>
                            Tên đường, Toà nhà, Số nhà
                        </div>
                    </div>

                </>
            }

            {currentEdit &&
                <div className={`flex flex-col ${Object.keys(addressForm)?.length ? 'gap-[19px]' : 'gap-6'}`}>
                    <CustomiseInputWIco style={'dark'} value={searchValue} onChange={handleFilterLocation} label={null} placeholder={currentEdit === 'address' ? 'Tên đường, Tòa nhà, Số nhà' : 'Quận/Huyện, Phường/Xã'} leftIco={<FaSearch size={16} className="text-[#ffffff70]" />} />
                    <>
                        {currentEdit !== 'address' && Object.entries(addressForm)?.length > 0 && selectedState()}
                        <div className="px-2">
                            <div className={`font-medium text-[13px] text-[#FFFFFF70] leading-[120%] mb-6`}>
                                {capitalizeFirstLetter(currentEdit)}
                            </div>
                            {filteredDataList?.length && filteredDataList.map((item, idx) =>
                                <div key={idx}>
                                    <div className="text-base text-white font-medium leading-[120%]" onClick={() => handleChoose(item)}>
                                        {item.name}
                                    </div>
                                    {idx + 1 !== filteredDataList.length &&
                                        <div className="my-4 h-[1px] bg-[#626262]"></div>
                                    }
                                </div>
                            )}
                        </div>
                    </>
                </div>
            }


        </DefaultBlackBg>
    )
}
