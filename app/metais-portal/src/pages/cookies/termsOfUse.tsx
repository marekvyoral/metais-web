import { BreadCrumbs, HomeIcon, TextBody, TextHeading } from '@isdd/idsk-ui-kit/index'
import { FooterRouteNames } from '@isdd/metais-common/navigation/routeNames'
import { useTranslation } from 'react-i18next'
import sanitizeHtml from 'sanitize-html'

import { MainContentWrapper } from '@/components/MainContentWrapper'

const TermsOfUsePage = () => {
    const { t } = useTranslation()
    return (
        <>
            <BreadCrumbs
                withWidthContainer
                links={[
                    { label: t('breadcrumbs.home'), href: '/', icon: HomeIcon },
                    { label: t('cookies.termsOfUse.heading1'), href: FooterRouteNames.PERSONAL_DATA_PROTECTION },
                ]}
            />
            <MainContentWrapper>
                <TextHeading size="XL">
                    <span dangerouslySetInnerHTML={{ __html: sanitizeHtml(t('cookies.termsOfUse.heading1')) }} />
                </TextHeading>
                <TextBody size="L">
                    <span dangerouslySetInnerHTML={{ __html: sanitizeHtml(t('cookies.termsOfUse.description1')) }} />
                </TextBody>
                <TextHeading size="M">
                    <span dangerouslySetInnerHTML={{ __html: sanitizeHtml(t('cookies.termsOfUse.heading2')) }} />
                </TextHeading>
                <TextBody size="L">
                    <span dangerouslySetInnerHTML={{ __html: sanitizeHtml(t('cookies.termsOfUse.description2')) }} />
                </TextBody>
                <TextHeading size="M">
                    <span dangerouslySetInnerHTML={{ __html: sanitizeHtml(t('cookies.termsOfUse.heading3')) }} />
                </TextHeading>
                <TextBody size="L">
                    <span dangerouslySetInnerHTML={{ __html: sanitizeHtml(t('cookies.termsOfUse.description3')) }} />
                </TextBody>
                <TextHeading size="M">
                    <span dangerouslySetInnerHTML={{ __html: sanitizeHtml(t('cookies.termsOfUse.heading4')) }} />
                </TextHeading>
                <TextBody size="L">
                    <span dangerouslySetInnerHTML={{ __html: sanitizeHtml(t('cookies.termsOfUse.description4')) }} />
                </TextBody>
            </MainContentWrapper>
        </>
    )
}

export default TermsOfUsePage
