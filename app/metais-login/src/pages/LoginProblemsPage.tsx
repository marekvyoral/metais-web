import { BreadCrumbs, HomeIcon, TextBody, TextHeading } from '@isdd/idsk-ui-kit/index'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { metaisEmail, PORTAL_URL } from '@isdd/metais-common/constants'

import { LoginRouteNames } from '@/navigation/Router'
import { CenterWrapper } from '@/components/center-wrapper/CenterWrapper'

export const LoginProblemsPage = () => {
    const { t } = useTranslation()

    return (
        <>
            <BreadCrumbs
                withWidthContainer
                links={[
                    { label: t('breadcrumbs.home'), href: PORTAL_URL, icon: HomeIcon },
                    { label: t('breadcrumbs.prelogin'), href: LoginRouteNames.PRE_LOGIN },
                    { label: t('breadcrumbs.login'), href: LoginRouteNames.LOGIN },
                    { label: t('breadcrumbs.loginProblems'), href: LoginRouteNames.LOGIN_PROBLEMS },
                ]}
            />
            <CenterWrapper>
                <TextHeading size="XL">{t('loginProblems.heading')}</TextHeading>
                <TextBody>
                    {t('loginProblems.description')} <a href={`mailto:${metaisEmail}`}>{metaisEmail}</a>.
                </TextBody>
            </CenterWrapper>
        </>
    )
}
