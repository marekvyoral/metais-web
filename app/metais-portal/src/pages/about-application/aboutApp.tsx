import { BreadCrumbs, HomeIcon, TextHeading } from '@isdd/idsk-ui-kit/index'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { FooterRouteNames } from '@isdd/metais-common/navigation/routeNames'
import { InformationGridRow } from '@isdd/metais-common/components/info-grid-row/InformationGridRow'
import { API_MODULES, API_MODULES_DEV } from '@isdd/metais-common/constants'

import { MainContentWrapper } from '@/components/MainContentWrapper'
import ApiModuleInformation from '@/components/api-module-information/apiModuleInformation'

const AboutApplicationPage = () => {
    const { t } = useTranslation()

    return (
        <>
            <BreadCrumbs
                withWidthContainer
                links={[
                    { label: t('breadcrumbs.home'), href: '/', icon: HomeIcon },
                    { label: t('footer.aboutApplication'), href: FooterRouteNames.COOKIES },
                ]}
            />
            <MainContentWrapper>
                <TextHeading size="XL">{t('aboutApp.heading')}</TextHeading>
                <InformationGridRow
                    key={import.meta.env.VITE_APP_VERSION}
                    label={t('aboutApp.portalVersion')}
                    value={import.meta.env.VITE_APP_VERSION}
                    hideIcon
                />
                {(import.meta.env.VITE_ENVIRONMENT === 'DEV' ? API_MODULES_DEV : API_MODULES).map((module) => (
                    <ApiModuleInformation key={module} moduleName={module} />
                ))}
            </MainContentWrapper>
        </>
    )
}

export default AboutApplicationPage
