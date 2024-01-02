import React, { useCallback, useEffect, useState } from 'react';
import DefaultBlackBg from '../components/DefaultBlackBg';
import { useNavigate } from 'react-router';
import { FaChevronRight, FaMapPin, FaSearch } from 'react-icons/fa';
import CustomiseInputWIco from '../components/CustomiseInputWIco';
import useApi from '../hooks/useAPI';
import { useSelector } from 'react-redux';
import { capitalizeFirstLetter } from '../functions/text';
import { useDebouncedCallback } from 'use-debounce';
import { useAuthContext } from '../context/AuthContext';
import { Button, Spin } from 'antd';
import Map, { Layer, Marker, Source, ViewStateChangeEvent } from 'react-map-gl';
import axios from 'axios';

export default function EditLocation() {
  const navigate = useNavigate();
  const { setMetadata, metadata, windowSize } = useAuthContext();
  const apiService = useApi();
  const user = useSelector((state: any) => state.user);
  const [currentEdit, setCurrentEdit] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [addressForm, setAddressForm] = useState<{
    state?: string;
    city?: string;
    district?: string;
    subDistrict?: string;
  }>({});
  const [dataList, setDataList] = useState<Array<any>>([]);
  const [filteredDataList, setFilteredDataList] = useState<Array<any>>([]);
  const [currentCode, setCurrentCode] = useState(null);
  const [addressLocation, setAddressLocation] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const stepList =
    user.country === 'Vietnam'
      ? ['cities', 'district', 'subDistrict']
      : ['state', 'cities'];

  const handleFilterLocation = (value: string) => {
    setSearchValue(value);
    if (currentEdit === 'address') {
      fetchSuggestAddress(value);
    } else {
      const result = value
        ? dataList.filter((location: any) =>
          location.name.toLowerCase().includes(value)
        )
        : dataList;
      setFilteredDataList(result);
    }
  };

  const fetchSuggestAddress = useDebouncedCallback(async (value: any) => {
    let subValue = '';
    setLoading(true);
    Object.entries(addressForm)
      .reverse()
      .map(([_, value]) => {
        subValue += ` ${value},`;
      });

    const { items }: any = await apiService.get(
      `https://autosuggest.search.hereapi.com/v1/autosuggest?at=${user.lat},${user.lng
      }&limit=3&lang=en&q=${`${value} ${subValue}`}&apiKey=${process.env.REACT_APP_HERE_API_KEY
      }`
    );
    setFilteredDataList(items);
    setLoading(false);
  }, 1000);

  useEffect(() => {
    (async () => {
      let data: any;
      if (user.country === 'Vietnam') {
        switch (currentEdit) {
          case 'cities':
            data = await apiService.get('https://provinces.open-api.vn/api/p/');
            break;
          case 'district':
            const p: any = await apiService.get(
              `https://provinces.open-api.vn/api/p/${currentCode}?depth=2`
            );
            data = p.districts;
            break;
          case 'subDistrict':
            const d: any = await apiService.get(
              `https://provinces.open-api.vn/api/d/${currentCode}?depth=2`
            );
            data = d.wards;
            break;
          default:
        }
      } else {
        // another country
      }
      setDataList(data);
      setFilteredDataList(data);
    })();
  }, [currentEdit]);

  const handleReturn = () => {
    setCurrentEdit('');
    setSearchValue('');
  };

  const handleChoose = (item: any) => {
    const currentStepIdx = stepList.indexOf(currentEdit);
    setAddressForm((prev) => ({
      ...prev,
      [currentEdit === 'cities' ? 'city' : currentEdit]: item.name,
    }));
    setCurrentCode(item.code);
    setDataList([]);
    setFilteredDataList([]);
    setSearchValue('');
    setCurrentEdit(stepList[currentStepIdx + 1]);
  };

  const handleChangeAddress = (key: string) => {
    switch (key) {
      case 'city':
        user.country === 'Vietnam' ? setAddressForm({}) : setAddressForm((prev) => {
          const newForm = { ...prev };
          delete newForm.city;
          return newForm;
        })
        setCurrentEdit('cities');
        break;
      default:
        setAddressForm((prev) => {
          const newForm: any = { ...prev };
          delete newForm[key];
          return newForm;
        })
        setCurrentEdit(key);
    }
    // setAddressForm({});
    // setCurrentEdit('cities');
  };

  const handleConfirmAddress = async (item?: any) => {
    if (item) {
      setAddressLocation({
        lng: item.position.lng,
        lat: item.position.lat,
        label: item.address.label,
      });
    } else {
      const locationInfo: any = await apiService.get(
        `https://nominatim.openstreetmap.org/search.php?q=${addressForm.subDistrict
          ? `${addressForm.subDistrict} ${addressForm.district}`
          : `${addressForm.city} ${addressForm.state}`
        }&polygon_geojson=1&format=jsonv2`
      );
      setAddressLocation({
        lng: locationInfo[0].lon,
        lat: locationInfo[0].lat,
        label: searchValue,
      });
    }
    setCurrentEdit('confirm');
  };

  // useEffect(() => {
  //   (async () => {
  //     try {
  //       const response = await axios.get(
  //         `https://api.geoapify.com/v1/geocode/reverse?lat=${user.lat}&lon=${user.lng}&apiKey=${process.env.REACT_APP_GEOAPIFY}`
  //       );
  //       setAddress(response.data.features[0].properties.formatted);
  //     } catch (error) {
  //       console.error('Error fetching address: ', error);
  //     }
  //   })()
  // }, [])

  const onMapMove = useCallback(async (event: ViewStateChangeEvent) => {
    setAddressLocation((prev: any) => ({
      ...prev,
      lng: event.viewState.longitude,
      lat: event.viewState.latitude,
    }));
  }, []);

  const handleSubmit = () => {
    setMetadata({
      ...metadata,
      location: addressLocation.label,
      location_name: addressLocation.label,
      lat: addressLocation.lat,
      lng: addressLocation.lng,
    });
    navigate('/check-in/enter-info');
  };

  const selectedState = () => (
    <div className='flex flex-col py-4 px-2 gap-4'>
      {Object.entries(addressForm).map(([key, value]: any, idx: number) => (
        <div
          className='flex items-center gap-1'
          key={idx}
          onClick={() => handleChangeAddress(key)}
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            width='20'
            height='20'
            viewBox='0 0 20 20'
            fill='none'
          >
            <circle cx='10' cy='10' r='10' fill='#99FF48' fillOpacity='0.4' />
            <circle cx='10' cy='10' r='6' fill='#99FF48' />
          </svg>
          <div className='text-base text-white font-medium leading-[120%]'>
            {value}
          </div>
        </div>
      ))}
    </div>
  );

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
          onClick={() => (currentEdit ? handleReturn() : navigate('/check-in/upload-image'))}
        >
          <path
            d='M9.21347 13.9093L8.51972 14.6031C8.22597 14.8968 7.75097 14.8968 7.46035 14.6031L1.38535 8.5312C1.0916 8.23745 1.0916 7.76245 1.38535 7.47183L7.46035 1.39683C7.7541 1.10308 8.2291 1.10308 8.51972 1.39683L9.21347 2.09058C9.51035 2.38745 9.5041 2.87183 9.20097 3.16245L5.43535 6.74995H14.4166C14.8322 6.74995 15.1666 7.08433 15.1666 7.49995V8.49995C15.1666 8.91558 14.8322 9.24996 14.4166 9.24996H5.43535L9.20097 12.8375C9.50722 13.1281 9.51347 13.6125 9.21347 13.9093Z'
            fill='#FFFFFFB2'
            fillOpacity='0.7'
          />
        </svg>
        <div className='text-base leading-10 flex-1 flex justify-center'>
          Edit location address
        </div>
      </div>

      {!currentEdit && (
        <>
          <div className='flex flex-col gap-2'>
            <div className='font-medium text-[13px] text-[#FFFFFF70] leading-[120%]'>
              Location address
            </div>
            <div
              className='text-base font-semibold leading-[120%] text-[#ffffff50] rounded-xl bg-[#33333387] py-4 px-3 flex items-center justify-between gap-4'
              onClick={() =>
                Object.entries(addressForm)?.length > 0
                  ? handleChangeAddress(
                    user.country === 'Vietnam' ? 'cities' : 'state'
                  )
                  : setCurrentEdit(
                    user.country === 'Vietnam' ? 'cities' : 'state'
                  )
              }
            >
              {Object.entries(addressForm)?.length > 0
                ? selectedState()
                : 'Quận/Huyện, Phường/Xã'}
              <FaChevronRight size={16} className='text-[#ffffff70]' />
            </div>
            <div
              className='text-base font-semibold leading-[120%] text-[#ffffff50] rounded-xl bg-[#33333387] py-4 px-3'
              onClick={() => setCurrentEdit('address')}
            >
              Tên đường, Toà nhà, Số nhà
            </div>
          </div>
          <div
            className="text-[#99FF48] font-medium text-[13px] leading-4 mt-6"
            onClick={async () => {
              const response = await axios.get(
                `https://api.geoapify.com/v1/geocode/reverse?lat=${user.lat}&lon=${user.lng}&apiKey=${process.env.REACT_APP_GEOAPIFY}`
              );
              const address = response.data.features[0].properties.formatted;
              setMetadata({
                ...metadata,
                location: address,
                location_name: address,
                lat: user.lat,
                lng: user.lng,
              });
              navigate('/check-in/enter-info');
            }}
          >
            Use my current location
          </div>
        </>
      )}

      {currentEdit && (
        <>
          {currentEdit !== 'confirm' && (
            <div
              className={`flex flex-col ${Object.keys(addressForm)?.length ? 'gap-[19px]' : 'gap-6'
                }`}
            >
              <CustomiseInputWIco
                style={'dark'}
                value={searchValue}
                onChange={handleFilterLocation}
                label={null}
                placeholder={
                  currentEdit === 'address'
                    ? 'Tên đường, Tòa nhà, Số nhà'
                    : 'Quận/Huyện, Phường/Xã'
                }
                leftIco={
                  currentEdit !== 'address' && (
                    <FaSearch size={16} className='text-[#ffffff70]' />
                  )
                }
              />
              <>
                {currentEdit !== 'address' &&
                  Object.entries(addressForm)?.length > 0 &&
                  selectedState()}
                <div className='px-2'>
                  <div
                    className={`font-medium text-[13px] text-[#FFFFFF70] leading-[120%] mb-6`}
                  >
                    {capitalizeFirstLetter(currentEdit)}
                  </div>
                  {filteredDataList?.length > 0 &&
                    filteredDataList.map((item, idx) => (
                      <div key={idx}>
                        <div
                          className='text-base text-white font-medium leading-[120%]'
                          onClick={() =>
                            currentEdit !== 'address'
                              ? handleChoose(item)
                              : handleConfirmAddress(item)
                          }
                        >
                          {item.name || item.title}
                        </div>
                        {idx + 1 !== filteredDataList.length && (
                          <div className='my-4 h-[1px] bg-[#626262]'></div>
                        )}
                      </div>
                    ))}
                </div>
              </>
            </div>
          )}
          {currentEdit === 'address' && searchValue && (
            <Button
              className={`${loading ? 'bg-[#ccc] pointer-events-none' : 'bg-[#2C2C2C]'} absolute bottom-0 left-1/2 -translate-x-1/2 text-white py-3 h-auto rounded-3xl font-semibold text-base border-0 w-full mb-5`}
              style={{ width: 'calc(100% - 32px)' }}
              onClick={() => handleConfirmAddress()}
            >
              {loading ? <Spin /> : 'Confirm'}
            </Button>
          )}
          {currentEdit === 'confirm' && (
            <div
              className='absolute left-0 right-0'
              style={{ height: windowSize.height - 80 }}
            >
              <div className='absolute top-[11px] left-5 right-5 bg-white px-3 py-4 z-50'>
                <div className='text-[13px] text-[#00000050] leading-[120%] font-medium'>
                  Location address
                </div>
                <div className='text-base text-[#353535] leading-[120%] font-semibold px-1'>
                  {addressLocation.label}
                </div>
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
                  longitude: !addressLocation.lng
                    ? 105.8342
                    : addressLocation.lng,
                  latitude: !addressLocation.lat
                    ? 21.0278
                    : addressLocation.lat,
                  zoom: 16,
                }}
                style={{
                  width: '100%',
                  height: '100%',
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
            </div>
          )}
        </>
      )}
    </DefaultBlackBg>
  );
}
