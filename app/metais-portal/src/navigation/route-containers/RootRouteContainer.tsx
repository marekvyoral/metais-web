import * as React from 'react'
import { Outlet } from 'react-router'

import { Footer } from '@/components/Footer'
import { Navbar } from '@/components/Navbar'
import { MainContentWrapper } from '@/components/MainContentWrapper'

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
