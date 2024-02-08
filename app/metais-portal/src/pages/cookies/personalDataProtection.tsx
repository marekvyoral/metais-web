import { BreadCrumbs, HomeIcon, TextBody, TextHeading } from '@isdd/idsk-ui-kit/index'
import { FooterRouteNames } from '@isdd/metais-common/navigation/routeNames'
import { useTranslation } from 'react-i18next'
import sanitizeHtml from 'sanitize-html'

import { MainContentWrapper } from '@/components/MainContentWrapper'

const PersonalDataInfoPage = () => {
    const { t } = useTranslation()
    return (
        <>
            <BreadCrumbs
                withWidthContainer
                links={[
                    { label: t('breadcrumbs.home'), href: '/', icon: HomeIcon },
                    { label: t('cookies.personalDataProtection.heading1'), href: FooterRouteNames.PERSONAL_DATA_PROTECTION },
                ]}
            />
            <MainContentWrapper>
                <TextHeading size="XL">
                    <span dangerouslySetInnerHTML={{ __html: sanitizeHtml(t('cookies.personalDataProtection.heading1')) }} />
                </TextHeading>
                <TextBody size="L">
                    <span dangerouslySetInnerHTML={{ __html: sanitizeHtml(t('cookies.personalDataProtection.description1')) }} />
                </TextBody>
                <TextHeading size="M">
                    <span dangerouslySetInnerHTML={{ __html: sanitizeHtml(t('cookies.personalDataProtection.heading2')) }} />
                </TextHeading>
                <TextBody size="L">
                    <span dangerouslySetInnerHTML={{ __html: sanitizeHtml(t('cookies.personalDataProtection.description2')) }} />
                </TextBody>
                <TextHeading size="M">
                    <span dangerouslySetInnerHTML={{ __html: sanitizeHtml(t('cookies.personalDataProtection.heading3')) }} />
                </TextHeading>
                <TextBody size="L">
                    <span dangerouslySetInnerHTML={{ __html: sanitizeHtml(t('cookies.personalDataProtection.description3')) }} />
                </TextBody>
                <TextHeading size="M">
                    <span dangerouslySetInnerHTML={{ __html: sanitizeHtml(t('cookies.personalDataProtection.heading4')) }} />
                </TextHeading>
                <TextBody size="L">
                    <span dangerouslySetInnerHTML={{ __html: sanitizeHtml(t('cookies.personalDataProtection.description4')) }} />
                </TextBody>
                <TextHeading size="M">
                    <span dangerouslySetInnerHTML={{ __html: sanitizeHtml(t('cookies.personalDataProtection.heading5')) }} />
                </TextHeading>
                <TextBody size="L">
                    <span dangerouslySetInnerHTML={{ __html: sanitizeHtml(t('cookies.personalDataProtection.description5')) }} />
                </TextBody>
                <TextHeading size="M">
                    <span dangerouslySetInnerHTML={{ __html: sanitizeHtml(t('cookies.personalDataProtection.heading6')) }} />
                </TextHeading>
                <TextBody size="L">
                    <span dangerouslySetInnerHTML={{ __html: sanitizeHtml(t('cookies.personalDataProtection.description6')) }} />
                </TextBody>
                <TextHeading size="M">
                    <span dangerouslySetInnerHTML={{ __html: sanitizeHtml(t('cookies.personalDataProtection.heading7')) }} />
                </TextHeading>
                <TextBody size="L">
                    <span dangerouslySetInnerHTML={{ __html: sanitizeHtml(t('cookies.personalDataProtection.description7')) }} />
                </TextBody>
                <TextHeading size="M">
                    <span dangerouslySetInnerHTML={{ __html: sanitizeHtml(t('cookies.personalDataProtection.heading8')) }} />
                </TextHeading>
                <TextBody size="L">
                    <span dangerouslySetInnerHTML={{ __html: sanitizeHtml(t('cookies.personalDataProtection.description8')) }} />
                </TextBody>
                <TextHeading size="M">
                    <span dangerouslySetInnerHTML={{ __html: sanitizeHtml(t('cookies.personalDataProtection.heading9')) }} />
                </TextHeading>
                <TextBody size="L">
                    <span dangerouslySetInnerHTML={{ __html: sanitizeHtml(t('cookies.personalDataProtection.description9')) }} />
                </TextBody>
                <TextHeading size="M">
                    <span dangerouslySetInnerHTML={{ __html: sanitizeHtml(t('cookies.personalDataProtection.heading10')) }} />
                </TextHeading>
                <TextBody size="L">
                    <span dangerouslySetInnerHTML={{ __html: sanitizeHtml(t('cookies.personalDataProtection.description10')) }} />
                </TextBody>
                <TextHeading size="M">
                    <span dangerouslySetInnerHTML={{ __html: sanitizeHtml(t('cookies.personalDataProtection.heading11')) }} />
                </TextHeading>
                <TextBody size="L">
                    <span dangerouslySetInnerHTML={{ __html: sanitizeHtml(t('cookies.personalDataProtection.description11')) }} />
                </TextBody>
                <TextHeading size="M">
                    <span dangerouslySetInnerHTML={{ __html: sanitizeHtml(t('cookies.personalDataProtection.heading12')) }} />
                </TextHeading>
                <TextBody size="L">
                    <span dangerouslySetInnerHTML={{ __html: sanitizeHtml(t('cookies.personalDataProtection.description12')) }} />
                </TextBody>
                <TextHeading size="M">
                    <span dangerouslySetInnerHTML={{ __html: sanitizeHtml(t('cookies.personalDataProtection.heading13')) }} />
                </TextHeading>
                <TextBody size="L">
                    <span dangerouslySetInnerHTML={{ __html: sanitizeHtml(t('cookies.personalDataProtection.description13')) }} />
                </TextBody>
                <TextHeading size="M">
                    <span dangerouslySetInnerHTML={{ __html: sanitizeHtml(t('cookies.personalDataProtection.heading14')) }} />
                </TextHeading>
                <TextBody size="L">
                    <span dangerouslySetInnerHTML={{ __html: sanitizeHtml(t('cookies.personalDataProtection.description14')) }} />
                </TextBody>
                <TextHeading size="M">
                    <span dangerouslySetInnerHTML={{ __html: sanitizeHtml(t('cookies.personalDataProtection.heading15')) }} />
                </TextHeading>
                <TextBody size="L">
                    <span dangerouslySetInnerHTML={{ __html: sanitizeHtml(t('cookies.personalDataProtection.description15')) }} />
                </TextBody>
                <TextHeading size="M">
                    <span dangerouslySetInnerHTML={{ __html: sanitizeHtml(t('cookies.personalDataProtection.heading16')) }} />
                </TextHeading>
                <TextBody size="L">
                    <span dangerouslySetInnerHTML={{ __html: sanitizeHtml(t('cookies.personalDataProtection.description16')) }} />
                </TextBody>
                <TextHeading size="M">
                    <span dangerouslySetInnerHTML={{ __html: sanitizeHtml(t('cookies.personalDataProtection.heading17')) }} />
                </TextHeading>
                <TextBody size="L">
                    <span dangerouslySetInnerHTML={{ __html: sanitizeHtml(t('cookies.personalDataProtection.description17')) }} />
                </TextBody>
                <TextHeading size="M">
                    <span dangerouslySetInnerHTML={{ __html: sanitizeHtml(t('cookies.personalDataProtection.heading18')) }} />
                </TextHeading>
                <TextBody size="L">
                    <span dangerouslySetInnerHTML={{ __html: sanitizeHtml(t('cookies.personalDataProtection.description18')) }} />
                </TextBody>
            </MainContentWrapper>
        </>
    )
}

export default PersonalDataInfoPage
