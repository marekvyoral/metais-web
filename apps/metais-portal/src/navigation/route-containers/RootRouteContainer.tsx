import * as React from 'react'
import { Outlet } from 'react-router'

import { Footer } from '@portal/components/Footer'
import { Navbar } from '@portal/components/Navbar'
import { MainContentWrapper } from '@portal/components/MainContentWrapper'

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
