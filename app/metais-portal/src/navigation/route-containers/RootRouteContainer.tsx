import { Footer } from '@isdd/metais-common/components/footer/Footer'
import { CookiesPopup } from '@isdd/metais-common/src/components/cookies-popup/CookiesPopup'
import { getPortalFooterMetaList, getPortalFooterSection } from '@isdd/metais-common/src/components/footer/footerSections'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Outlet } from 'react-router'

import { Navbar } from '@/components/navbar/Navbar'

export const RootRouteContainer: React.FC = () => {
    const { t } = useTranslation()
    return (
        <>
            <Navbar />
            <Outlet />
            <Footer metaList={getPortalFooterMetaList(t)} sections={getPortalFooterSection(t)} />
            <CookiesPopup />
        </>
    )
}
