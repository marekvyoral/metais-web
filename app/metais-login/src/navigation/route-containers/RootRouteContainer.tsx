import * as React from 'react'
import { Outlet } from 'react-router'
import { Footer } from '@isdd/metais-common/components/footer/Footer'
import { useTranslation } from 'react-i18next'

import { Navbar } from '@/components/navbar/Navbar'
import { getLoginFooterMetaList, getLoginFooterSection } from '@/components/footer/footerLoginSections'

export const RootRouteContainer: React.FC = () => {
    const { t } = useTranslation()

    return (
        <>
            <Navbar />
            <main className="govuk-main-wrapper govuk-main-wrapper--auto-spacing govuk-width-container" id="main-content">
                <Outlet />
            </main>
            <Footer metaList={getLoginFooterMetaList(t)} sections={getLoginFooterSection(t)} />
        </>
    )
}
