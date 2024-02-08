import { BreadCrumbs, HomeIcon, TextBody, TextHeading } from '@isdd/idsk-ui-kit/index'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { FooterRouteNames } from '@isdd/metais-common/navigation/routeNames'
import sanitizeHtml from 'sanitize-html'

import { MainContentWrapper } from '@/components/MainContentWrapper'

const CookiesInfoPage = () => {
    const { t } = useTranslation()
    return (
        <>
            <BreadCrumbs
                withWidthContainer
                links={[
                    { label: t('breadcrumbs.home'), href: '/', icon: HomeIcon },
                    { label: t('cookies.info.heading1'), href: FooterRouteNames.COOKIES },
                ]}
            />
            <MainContentWrapper>
                <TextHeading size="XL">
                    <span dangerouslySetInnerHTML={{ __html: sanitizeHtml(t('cookies.info.heading1')) }} />
                </TextHeading>
                <TextBody size="L">
                    <span dangerouslySetInnerHTML={{ __html: sanitizeHtml(t('cookies.info.description1')) }} />
                </TextBody>
                <TextHeading size="M">
                    <span dangerouslySetInnerHTML={{ __html: sanitizeHtml(t('cookies.info.heading2')) }} />
                </TextHeading>
                <TextBody size="L">
                    <span dangerouslySetInnerHTML={{ __html: sanitizeHtml(t('cookies.info.description2')) }} />
                </TextBody>
                <TextHeading size="M">
                    <span dangerouslySetInnerHTML={{ __html: sanitizeHtml(t('cookies.info.heading3')) }} />
                </TextHeading>
                <TextBody size="L">
                    <span dangerouslySetInnerHTML={{ __html: sanitizeHtml(t('cookies.info.description3')) }} />
                </TextBody>
                <TextHeading size="M">
                    <span dangerouslySetInnerHTML={{ __html: sanitizeHtml(t('cookies.info.heading4')) }} />
                </TextHeading>
                <TextBody size="L">
                    <span dangerouslySetInnerHTML={{ __html: sanitizeHtml(t('cookies.info.description4')) }} />
                </TextBody>
                <TextHeading size="M">
                    <span dangerouslySetInnerHTML={{ __html: sanitizeHtml(t('cookies.info.heading5')) }} />
                </TextHeading>
                <TextBody size="L">
                    <span dangerouslySetInnerHTML={{ __html: sanitizeHtml(t('cookies.info.description5')) }} />
                </TextBody>
            </MainContentWrapper>
        </>
    )
}

export default CookiesInfoPage
