import * as React from 'react'
import { Outlet } from 'react-router'

import { Footer } from '@/components/Footer'
import { MainContentWrapper } from '@/components/MainContentWrapper'
import { Navbar } from '@/components/navbar/Navbar'

export const RootRouteContainer: React.FC = () => {
    return (
        <>
            <Navbar />
            <MainContentWrapper>
                <Outlet />
            </MainContentWrapper>
            <Footer />
        </>
    )
}
