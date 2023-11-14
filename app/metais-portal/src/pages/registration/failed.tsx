import React from 'react'
import { BreadCrumbs, HomeIcon } from '@isdd/idsk-ui-kit/index'
import { RegistrationRoutes } from '@isdd/metais-common/navigation/routeNames'
import { useTranslation } from 'react-i18next'
import { CenterWrapper } from '@isdd/metais-common/components/center-wrapper/CenterWrapper'

import { MainContentWrapper } from '@/components/MainContentWrapper'
import { RegistrationFailed } from '@/components/views/registration/RegistrationFailed'

const Failed = () => {
    const { t } = useTranslation()
    return (
        <>
            <BreadCrumbs
                withWidthContainer
                links={[
                    { label: t('breadcrumbs.home'), href: '/', icon: HomeIcon },
                    { label: t('registration.title'), href: RegistrationRoutes.REGISTRATION },
                ]}
            />
            <MainContentWrapper noSideMenu>
                <CenterWrapper>
                    <RegistrationFailed />
                </CenterWrapper>
            </MainContentWrapper>
        </>
    )
}

export default Failed
