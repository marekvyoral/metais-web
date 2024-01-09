import { BreadCrumbs, HomeIcon } from '@isdd/idsk-ui-kit/index'
import { useTranslation } from 'react-i18next'
import { useLocation, useParams } from 'react-router-dom'
import { RouteNames } from '@isdd/metais-common/navigation/routeNames'

import HowToContent from './howToContent'

import { MainContentWrapper } from '@/components/MainContentWrapper'

const HowToGenericPage = () => {
    const { t } = useTranslation()
    const location = useLocation()
    const { howToEnumType } = useParams()

    return (
        <>
            <BreadCrumbs
                withWidthContainer
                links={[
                    { label: t('breadcrumbs.home'), href: RouteNames.HOME, icon: HomeIcon },
                    { label: t(`breadcrumbs.wiki.${howToEnumType}`), href: location.pathname },
                ]}
            />
            <MainContentWrapper>
                <HowToContent howToEnumType={howToEnumType} />
            </MainContentWrapper>
        </>
    )
}

export default HowToGenericPage
