import React, { Fragment } from 'react'
import { useLocation, useNavigate } from 'react-router'

export default function Navbar() {
    const navBarList = [
        {
            name: 'home',
            path: '/',
            element: (active: boolean) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M12 1.94531L11.4609 2.46094L1.71094 12.2109L2.78906 13.2891L3.75 12.3281V21H10.5V13.5H13.5V21H20.25V12.3281L21.2109 13.2891L22.2891 12.2109L12.5391 2.46094L12 1.94531ZM12 4.07812L18.75 10.8281V19.5H15V12H9V19.5H5.25V10.8281L12 4.07812Z" fill="black" fillOpacity={!active ? '0.7' : '1'} />
            </svg>
        },
        {
            name: 'search',
            path: '/search',
            element: (active: boolean) => <svg xmlns="http://www.w3.org/2000/svg" width="25" height="24" viewBox="0 0 25 24" fill="none">
                <path d="M14.916 2.25C10.7822 2.25 7.41602 5.61621 7.41602 9.75C7.41602 11.5459 8.0459 13.1924 9.10352 14.4844L3.12695 20.4609L4.20508 21.5391L10.1816 15.5625C11.4736 16.6201 13.1201 17.25 14.916 17.25C19.0498 17.25 22.416 13.8838 22.416 9.75C22.416 5.61621 19.0498 2.25 14.916 2.25ZM14.916 3.75C18.2383 3.75 20.916 6.42773 20.916 9.75C20.916 13.0723 18.2383 15.75 14.916 15.75C11.5938 15.75 8.91602 13.0723 8.91602 9.75C8.91602 6.42773 11.5938 3.75 14.916 3.75Z" fill="black" fillOpacity={!active ? '0.7' : '1'} />
            </svg>
        },
        {
            name: 'account',
            path: '/account',
            element: (active: boolean) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M12 3.75C9.1084 3.75 6.75 6.1084 6.75 9C6.75 10.8076 7.67285 12.4131 9.07031 13.3594C6.39551 14.5078 4.5 17.1621 4.5 20.25H6C6 16.9277 8.67773 14.25 12 14.25C15.3223 14.25 18 16.9277 18 20.25H19.5C19.5 17.1621 17.6045 14.5078 14.9297 13.3594C16.3271 12.4131 17.25 10.8076 17.25 9C17.25 6.1084 14.8916 3.75 12 3.75ZM12 5.25C14.0801 5.25 15.75 6.91992 15.75 9C15.75 11.0801 14.0801 12.75 12 12.75C9.91992 12.75 8.25 11.0801 8.25 9C8.25 6.91992 9.91992 5.25 12 5.25Z" fill="black" fillOpacity={!active ? '0.7' : '1'} />
            </svg>
        },
    ]

    const location = useLocation();
    const navigate = useNavigate();
    return (
        <div className="flex items-center justify-between w-full px-8 py-6 fixed bottom-0 bg-white z-50 border-t border-[#0000001A]">
            {navBarList.map((item: any, idx: number) => (
                <div className='relative' key={idx} onClick={() => navigate(item.path)}>
                    {item.element(item.path === location.pathname)}
                    {item.path === location.pathname &&
                        <div className='bg-[#FF5348] w-1 h-1 mx-auto mt-1 rounded-full'></div>
                    }
                </div>
            ))}
        </div>
    )
}
