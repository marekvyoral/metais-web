import React from 'react'
import { BreadCrumbs, HomeIcon } from '@isdd/idsk-ui-kit/index'
import { useTranslation } from 'react-i18next'
import { RegistrationRoutes } from '@isdd/metais-common/navigation/routeNames'
import { CenterWrapper } from '@isdd/metais-common/components/center-wrapper/CenterWrapper'
import { formatTitleString } from '@isdd/metais-common/utils/utils'

import { RegistrationForm } from '@/components/views/registration/RegistrationForm'
import { MainContentWrapper } from '@/components/MainContentWrapper'

const Registration = () => {
    const { t } = useTranslation()
    document.title = formatTitleString(t('registration.title'))
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
                    <RegistrationForm isError={false} isFetching={false} />
                </CenterWrapper>
            </MainContentWrapper>
        </>
    )
}
export default Registration
