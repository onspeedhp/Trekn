import React, { useCallback, useEffect, useState } from 'react'
import DefaultBlackBg from '../components/DefaultBlackBg'
import { useNavigate } from 'react-router';
import { FaChevronRight, FaMapPin, FaSearch } from 'react-icons/fa';
import CustomiseInputWIco from '../components/CustomiseInputWIco';
import useApi from '../hooks/useAPI';
import { useSelector } from 'react-redux';
import { capitalizeFirstLetter } from '../functions/text';
import { useDebouncedCallback } from 'use-debounce';
import { useAuthContext } from '../context/AuthContext';
import { Button } from 'antd';
import Map, { Layer, Marker, Source, ViewStateChangeEvent } from 'react-map-gl';

export default function EditLocation() {
    const navigate = useNavigate();
    const { setMetadata, metadata, windowSize } = useAuthContext();
    const apiService = useApi();
    const user = useSelector((state: any) => state.user)
    const [currentEdit, setCurrentEdit] = useState('');
    const [searchValue, setSearchValue] = useState('');
    const [addressForm, setAddressForm] = useState<{ state?: string; city?: string; district?: string, subDistrict?: string }>({});
    const [dataList, setDataList] = useState<Array<any>>([]);
    const [filteredDataList, setFilteredDataList] = useState<Array<any>>([]);
    const [currentCode, setCurrentCode] = useState(null);
    const [addressLocation, setAddressLocation] = useState<any>(null);
    const stepList = user.country === 'Vietnam' ? ['cities', 'district', 'subDistrict'] : ['state', 'cities'];

    const handleFilterLocation = (value: string) => {
        setSearchValue(value);
        if (currentEdit === 'address') {
            fetchSuggestAddress(value)
        } else {
            const result = value ? dataList.filter((location: any) => location.name.toLowerCase().includes(value)) : dataList;
            setFilteredDataList(result);
        }
    }

    const fetchSuggestAddress = useDebouncedCallback(async (value) => {
        let subValue = '';
        Object.entries(addressForm).reverse().map(([_, value]) => {
            subValue += ` ${value},`
        })
        // const {items}: any = await apiService.get(`https://autosuggest.search.hereapi.com/v1/autosuggest?at=${user.lat},${user.lng}&limit=3&lang=en&q=${`${value} ${subValue}`}&apiKey=${process.env.REACT_APP_HERE_API_KEY}`)
        // setFilteredDataList([
        //     {
        //         "title": "2/34 Đường Cao Thắng, Phường 5, Quận 3, Ho Chi Minh City (Thành Phố Hồ Chí Minh), Vietnam",
        //         "id": "here:af:streetsection:dBWMxoxyxWoJwCwN8GWwdB:CggIBCDyxrWwAxABGgQyLzM0",
        //         "resultType": "houseNumber",
        //         "houseNumberType": "PA",
        //         "address": {
        //             "label": "2/34 Đường Cao Thắng, Phường 5, Quận 3, Ho Chi Minh City, Vietnam"
        //         },
        //         "position": {
        //             "lat": 10.77018,
        //             "lng": 106.68558
        //         },
        //         "access": [
        //             {
        //                 "lat": 10.77041,
        //                 "lng": 106.68572
        //             }
        //         ],
        //         "distance": 8717,
        //         "mapView": {
        //             "west": 106.68213,
        //             "south": 10.76829,
        //             "east": 106.68572,
        //             "north": 10.77061
        //         },
        //         "highlights": {
        //             "title": [
        //                 {
        //                     "start": 2,
        //                     "end": 4
        //                 },
        //                 {
        //                     "start": 11,
        //                     "end": 20
        //                 },
        //                 {
        //                     "start": 22,
        //                     "end": 28
        //                 },
        //                 {
        //                     "start": 32,
        //                     "end": 36
        //                 },
        //                 {
        //                     "start": 58,
        //                     "end": 67
        //                 }
        //             ],
        //             "address": {
        //                 "label": [
        //                     {
        //                         "start": 2,
        //                         "end": 4
        //                     },
        //                     {
        //                         "start": 11,
        //                         "end": 20
        //                     },
        //                     {
        //                         "start": 22,
        //                         "end": 28
        //                     },
        //                     {
        //                         "start": 32,
        //                         "end": 36
        //                     }
        //                 ]
        //             }
        //         }
        //     },
        //     {
        //         "title": "34 Đường Cao Thắng, Phường 17, Quận Phú Nhuận, Ho Chi Minh City (Thành Phố Hồ Chí Minh), Vietnam",
        //         "id": "here:af:streetsection:OaWJ89wkFJ7Jz0v-gshF.A:CggIBCDGz7_mAhABGgIzNA",
        //         "resultType": "houseNumber",
        //         "houseNumberType": "PA",
        //         "address": {
        //             "label": "34 Đường Cao Thắng, Phường 17, Quận Phú Nhuận, Ho Chi Minh City, Vietnam"
        //         },
        //         "position": {
        //             "lat": 10.79424,
        //             "lng": 106.68283
        //         },
        //         "access": [
        //             {
        //                 "lat": 10.79419,
        //                 "lng": 106.68288
        //             }
        //         ],
        //         "distance": 6962,
        //         "mapView": {
        //             "west": 106.68123,
        //             "south": 10.79226,
        //             "east": 106.68333,
        //             "north": 10.79477
        //         },
        //         "highlights": {
        //             "title": [
        //                 {
        //                     "start": 0,
        //                     "end": 2
        //                 },
        //                 {
        //                     "start": 9,
        //                     "end": 18
        //                 },
        //                 {
        //                     "start": 20,
        //                     "end": 26
        //                 },
        //                 {
        //                     "start": 31,
        //                     "end": 39
        //                 },
        //                 {
        //                     "start": 65,
        //                     "end": 74
        //                 }
        //             ],
        //             "address": {
        //                 "label": [
        //                     {
        //                         "start": 0,
        //                         "end": 2
        //                     },
        //                     {
        //                         "start": 9,
        //                         "end": 18
        //                     },
        //                     {
        //                         "start": 20,
        //                         "end": 26
        //                     },
        //                     {
        //                         "start": 31,
        //                         "end": 39
        //                     }
        //                 ]
        //             }
        //         }
        //     },
        //     {
        //         "title": "Đường Cao Thắng, Phường 3, Quận 3, Ho Chi Minh City (Thành Phố Hồ Chí Minh), Vietnam",
        //         "id": "here:af:streetsection:RgzYKOtybnbJfx2reoZOvA",
        //         "resultType": "street",
        //         "address": {
        //             "label": "Đường Cao Thắng, Phường 3, Quận 3, Ho Chi Minh City, Vietnam"
        //         },
        //         "position": {
        //             "lat": 10.77138,
        //             "lng": 106.68059
        //         },
        //         "distance": 8224,
        //         "mapView": {
        //             "west": 106.67906,
        //             "south": 10.77003,
        //             "east": 106.68213,
        //             "north": 10.77274
        //         },
        //         "highlights": {
        //             "title": [
        //                 {
        //                     "start": 6,
        //                     "end": 15
        //                 },
        //                 {
        //                     "start": 17,
        //                     "end": 23
        //                 },
        //                 {
        //                     "start": 27,
        //                     "end": 31
        //                 },
        //                 {
        //                     "start": 53,
        //                     "end": 62
        //                 }
        //             ],
        //             "address": {
        //                 "label": [
        //                     {
        //                         "start": 6,
        //                         "end": 15
        //                     },
        //                     {
        //                         "start": 17,
        //                         "end": 23
        //                     },
        //                     {
        //                         "start": 27,
        //                         "end": 31
        //                     }
        //                 ]
        //             }
        //         }
        //     }
        // ]);
        setFilteredDataList([]);
    }, 1000)

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

    const handleConfirmAddress = async (itemAccess?: any) => {
        if (itemAccess) {
            setAddressLocation({ ...itemAccess });
        } else {
            const locationInfo: any = await apiService.get(`https://nominatim.openstreetmap.org/search.php?q=${addressForm.subDistrict ? `${addressForm.subDistrict} ${addressForm.district}` : `${addressForm.city} ${addressForm.state}`}&polygon_geojson=1&format=jsonv2`)
            setAddressLocation({ lng: locationInfo[0].lon, lat: locationInfo[0].lat });
        }
        setCurrentEdit('confirm');
    }

    const onMapMove = useCallback(async (event: ViewStateChangeEvent) => {
        setAddressLocation({
            lng: event.viewState.longitude,
            lat: event.viewState.latitude,
        });
    }, []);

    const handleSubmit = () => {
        setMetadata({
            ...metadata, 
            location: searchValue,
            location_name: searchValue,
            lat: addressLocation.lat,
            lng: addressLocation.lng,
        })
        navigate('/check-in/enter-info')
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
        <DefaultBlackBg className={'p-4 relative'}>
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
                <>
                    {currentEdit !== 'confirm' &&
                        <div className={`flex flex-col ${Object.keys(addressForm)?.length ? 'gap-[19px]' : 'gap-6'}`}>
                            <CustomiseInputWIco style={'dark'} value={searchValue} onChange={handleFilterLocation} label={null} placeholder={currentEdit === 'address' ? 'Tên đường, Tòa nhà, Số nhà' : 'Quận/Huyện, Phường/Xã'} leftIco={currentEdit !== 'address' && <FaSearch size={16} className="text-[#ffffff70]" />} />
                            <>
                                {currentEdit !== 'address' && Object.entries(addressForm)?.length > 0 && selectedState()}
                                <div className="px-2">
                                    <div className={`font-medium text-[13px] text-[#FFFFFF70] leading-[120%] mb-6`}>
                                        {capitalizeFirstLetter(currentEdit)}
                                    </div>
                                    {filteredDataList?.length && filteredDataList.map((item, idx) =>
                                        <div key={idx}>
                                            <div className="text-base text-white font-medium leading-[120%]" onClick={() => currentEdit !== 'address' ? handleChoose(item) : handleConfirmAddress(item?.access)}>
                                                {item.name || item.title}
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
                    {currentEdit === 'address' && !filteredDataList?.length && searchValue &&
                        <Button
                            className='bg-[#2C2C2C] absolute bottom-0 left-1/2 -translate-x-1/2 text-white py-3 h-auto rounded-3xl font-semibold text-base border-0 w-full mb-5'
                            style={{ width: 'calc(100% - 32px)' }}
                            onClick={() => handleConfirmAddress()}
                        >
                            Confirm
                        </Button>
                    }
                    {currentEdit === 'confirm' &&
                        <div className='absolute left-0 right-0' style={{ height: windowSize.height - 80 }}>
                            <div className="absolute top-[11px] left-5 right-5 bg-white px-3 py-4 z-50">
                                <div className="text-[13px] text-[#00000050] leading-[120%] font-medium">Location address</div>
                                <div className="text-base text-[#353535] leading-[120%] font-semibold px-1">{searchValue}</div>
                            </div>
                            <Button
                                className='bg-[#2C2C2C] absolute bottom-0 left-1/2 -translate-x-1/2 text-white py-3 h-auto rounded-3xl font-semibold text-base border-0 w-full mb-5 z-50'
                                style={{ width: 'calc(100% - 32px)' }}
                                onClick={() => handleSubmit()}
                            >
                                Confirm
                            </Button>
                            <Map
                                mapboxAccessToken={`${process.env.REACT_APP_MAP_BOX_ACCESS_TOKEN}`}
                                initialViewState={{
                                    longitude: !addressLocation.lng ? 105.8342 : addressLocation.lng,
                                    latitude: !addressLocation.lat ? 21.0278 : addressLocation.lat,
                                    zoom: 16,
                                }}
                                style={{
                                    width: '100%',
                                    height: '100%'
                                }}
                                mapStyle='mapbox://styles/mapbox/streets-v9'
                                onDrag={onMapMove}
                            >
                                <Marker
                                    longitude={addressLocation.lng}
                                    latitude={addressLocation.lat}
                                    anchor='center'
                                >
                                    <FaMapPin size={24} className='text-[#278EFF]' />
                                </Marker>
                            </Map>
                        </div>}
                </>
            }
        </DefaultBlackBg>
    )
}
