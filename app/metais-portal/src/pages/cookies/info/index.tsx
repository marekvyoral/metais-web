import { BreadCrumbs, HomeIcon, TextBody, TextHeading } from '@isdd/idsk-ui-kit/index'
import React from 'react'
import { useTranslation } from 'react-i18next'

import { MainContentWrapper } from '@/components/MainContentWrapper'

const CookiesInfoPage = () => {
    const { t } = useTranslation()
    return (
        <>
            <BreadCrumbs withWidthContainer links={[{ label: t('breadcrumbs.home'), href: '/', icon: HomeIcon }]} />
            <MainContentWrapper>
                <TextHeading size="XL">{t('cookies.heading')}</TextHeading>
                <TextHeading size="L">{t('cookies.cookies')}</TextHeading>
                <TextBody size="L">{t('cookies.cookiesDesc')}</TextBody>
                <TextHeading size="L">{t('cookies.whatAreCookies')}</TextHeading>
                <TextBody size="L">{t('cookies.whatAreCookiesDesc')}</TextBody>
                <TextHeading size="L">{t('cookies.howDoWeUseCookies')}</TextHeading>
                <TextBody size="L">{t('cookies.howDoWeUseCookiesDesc')}</TextBody>
                <TextHeading size="L">{t('cookies.howToControlCookies')}</TextHeading>
                <TextBody size="L">{t('cookies.howToControlCookiesDesc')}</TextBody>
                <TextHeading size="L">{t('cookies.howRefuseTheUseOfCookies')}</TextHeading>
                <TextBody size="L">{t('cookies.howRefuseTheUseOfCookiesDesc')}</TextBody>
            </MainContentWrapper>
        </>
    )
}

export default CookiesInfoPage
