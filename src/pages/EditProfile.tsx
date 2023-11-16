import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import CustomiseInput from '../components/CustomiseInput';
import { updateUserDB } from '../middleware/data/user';
import { updateUser } from '../redux/slides/userSlides';
import { Spin } from 'antd';

interface initFormType { label: string; type: string; key: string };

export default function EditProfile() {
    const initForm: Array<initFormType> = [
        { label: 'Name', type: 'input', key: 'name' },
        { label: 'Description', type: 'textarea', key: 'description' },
    ]
    const navigate = useNavigate();
    const user = useSelector((state: any) => state.user);
    const dispatch = useDispatch();
    const [profileForm, setProfileForm] = useState<any>(null);
    const [isDisabled, setIsDisabled] = useState(true);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const { name, description } = user;
        setProfileForm({
            name,
            description
        })
    }, [])

    const handleOnChange = (key: string, value: string) => {
        setIsDisabled(false);
        setProfileForm((prev: any) => ({ ...prev, [key]: value }))
    }

    const handleSubmit = async () => {
        setLoading(true);
        setIsDisabled(true);
        try {
            await updateUserDB({
                userId: user.id, updateData: profileForm, onSuccess: (data) => {
                    dispatch(updateUser(data));
                }
            })
        } catch (e) {
            console.log(e);
        }
        setLoading(false);
        setIsDisabled(false);
        navigate('/account');
    };
    return (
        <>
            <div className='absolute w-full h-screen overflow-scroll'>
                <div className='m-4 font-semibold flex items-center'>
                    <svg
                        xmlns='http://www.w3.org/2000/svg'
                        width='17'
                        height='16'
                        viewBox='0 0 17 16'
                        fill='none'
                        onClick={() => {
                            navigate('/account');
                        }}
                    >
                        <path
                            d='M9.21347 13.9093L8.51972 14.6031C8.22597 14.8968 7.75097 14.8968 7.46035 14.6031L1.38535 8.5312C1.0916 8.23745 1.0916 7.76245 1.38535 7.47183L7.46035 1.39683C7.7541 1.10308 8.2291 1.10308 8.51972 1.39683L9.21347 2.09058C9.51035 2.38745 9.5041 2.87183 9.20097 3.16245L5.43535 6.74995H14.4166C14.8322 6.74995 15.1666 7.08433 15.1666 7.49995V8.49995C15.1666 8.91558 14.8322 9.24996 14.4166 9.24996H5.43535L9.20097 12.8375C9.50722 13.1281 9.51347 13.6125 9.21347 13.9093Z'
                            fill='black'
                            fillOpacity='0.7'
                        />
                    </svg>
                    <div className="text-xl leading-4 flex-1 flex justify-center">
                        Edit Profile
                    </div>
                </div>
                <div className='flex flex-col items-center justify-center gap-4 mt-9'>
                    <img
                        className='rounded-full w-[100px] h-[100px]'
                        src={`${user.profileImage}`}
                        alt=''
                    />
                    <div className="text-[13px] leading-4 font-medium">
                        Edit avatar
                    </div>
                </div>
                <div className="px-5">
                    <div className="flex flex-col justify-center mt-7 gap-4">
                        {profileForm && initForm.map(({ type, label, key }, idx) => (
                            <CustomiseInput type={type} label={label} value={profileForm[key]} itemKey={key} key={idx} onChange={handleOnChange} />
                        ))}
                    </div>
                    <button className={`border-none rounded-3xl text-base w-full mt-6 py-3 text-white font-semibold ${isDisabled ? `bg-[#00000033]` : `bg-black`}`} onClick={() => !isDisabled && handleSubmit()}>
                        {!loading ?
                            'Save'
                            : <Spin />
                        }
                    </button>
                </div>
            </div>
        </>
    )
}
