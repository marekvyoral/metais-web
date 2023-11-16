import React from 'react'
import { Outlet } from 'react-router-dom'

const CiDetail: React.FC = () => {
    return (
        <>
            <h1>CI DETAIL</h1>
            <Outlet />
        </>
    )
}

export default CiDetail
