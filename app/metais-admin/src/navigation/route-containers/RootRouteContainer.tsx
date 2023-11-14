import * as React from 'react'
import { Outlet } from 'react-router'

import { Footer } from '@/components/Footer'
import { Navbar } from '@/components/Navbar'

export const RootRouteContainer: React.FC = () => {
    return (
        <>
            <Navbar isAdmin />
            <Outlet />
            <Footer />
        </>
    )
}
