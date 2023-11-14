import * as React from 'react'
import { Outlet } from 'react-router'
import { Footer } from '@isdd/metais-common/components/footer/Footer'
import { useTranslation } from 'react-i18next'
import { getPortalFooterMetaList, getPortalFooterSection } from '@isdd/metais-common/src/components/footer/footerSections'

import { Navbar } from '@/components/navbar/Navbar'

export const RootRouteContainer: React.FC = () => {
    const { t } = useTranslation()
    return (
        <>
            <Navbar />
            <Outlet />
            <Footer metaList={getPortalFooterMetaList(t)} sections={getPortalFooterSection(t)} />
        </>
    )
}
