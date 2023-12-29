import React from 'react'
import { useSelector } from 'react-redux'
import { Outlet } from 'react-router'
import NotLoginComponent from '../components/account/NotLoginComponent'

export default function PrivateRoute() {
    const user = useSelector((state: any) => state.user)

    return (
        <>
            {user.address ? <Outlet /> : <NotLoginComponent />}
        </>
    )
}
