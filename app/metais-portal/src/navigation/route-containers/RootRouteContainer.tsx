import * as React from 'react'
import { Outlet } from 'react-router'

import { Footer } from '@/components/Footer'
import { Navbar } from '@/components/navbar/Navbar'

export const RootRouteContainer: React.FC = () => {
    return (
        <>
            <Navbar />
            <Outlet />
            <Footer />
        </>
    )
}
