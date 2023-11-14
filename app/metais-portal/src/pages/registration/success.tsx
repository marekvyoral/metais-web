import { BreadCrumbs, HomeIcon } from '@isdd/idsk-ui-kit/index'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { RegistrationRoutes } from '@isdd/metais-common/navigation/routeNames'
import { CenterWrapper } from '@isdd/metais-common/components/center-wrapper/CenterWrapper'

import { MainContentWrapper } from '@/components/MainContentWrapper'
import { RegistrationSuccess } from '@/components/views/registration/RegistrationSuccess'

const Success = () => {
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
                    <RegistrationSuccess />
                </CenterWrapper>
            </MainContentWrapper>
        </>
    )
}

export default Success
