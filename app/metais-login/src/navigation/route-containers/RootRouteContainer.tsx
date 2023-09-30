import * as React from 'react'
import { Outlet } from 'react-router'
import { Footer } from '@isdd/metais-common/components/footer/Footer'

import { Navbar } from '@/components/navbar/Navbar'

export const RootRouteContainer: React.FC = () => {
    return (
        <>
            <Navbar />
            <main className="govuk-main-wrapper govuk-main-wrapper--auto-spacing govuk-width-container" id="main-content">
                <Outlet />
            </main>
            <Footer />
        </>
    )
}
