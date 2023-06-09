import * as React from 'react'
import { Outlet } from 'react-router'

import { Footer } from '@admin/components/Footer'
import { Navbar } from '@admin/components/Navbar'
import { MainContentWrapper } from '@admin/components/MainContentWrapper'

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
