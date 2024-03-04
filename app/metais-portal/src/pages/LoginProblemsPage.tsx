import { BreadCrumbs, HomeIcon, TextBody, TextHeading } from '@isdd/idsk-ui-kit/index'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { metaisEmail, PORTAL_URL } from '@isdd/metais-common/constants'
import { CenterWrapper } from '@isdd/metais-common/components/center-wrapper/CenterWrapper'
import { LoginRouteNames } from '@isdd/metais-common/navigation/routeNames'
import { formatTitleString } from '@isdd/metais-common/utils/utils'

export const LoginProblemsPage = () => {
    const { t } = useTranslation()
    document.title = formatTitleString(t('breadcrumbs.loginProblems'))

    return (
        <>
            <BreadCrumbs
                withWidthContainer
                links={[
                    { label: t('breadcrumbs.home'), href: PORTAL_URL, icon: HomeIcon },
                    { label: t('breadcrumbs.prelogin'), href: '#', toLogin: true },
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
