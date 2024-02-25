import React from 'react'
import { Outlet } from 'react-router'
import { Footer } from '@isdd/metais-common/components/footer/Footer'
import { useTranslation } from 'react-i18next'
import { getPortalFooterMetaList, getPortalFooterSection } from '@isdd/metais-common/components/footer/footerSections'
import { NavAnnouncer } from '@isdd/metais-common/components/navAnnouncer/NavAnnouncer'

import { Navbar } from '@/components/Navbar'

export const RootRouteContainer: React.FC = () => {
    const { t } = useTranslation()
    return (
        <>
            <NavAnnouncer />
            <Navbar isAdmin />
            <Outlet />
            <Footer metaList={getPortalFooterMetaList(t, true)} sections={getPortalFooterSection(t, true)} />
        </>
    )
}
