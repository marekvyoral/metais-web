import { BreadCrumbs, BreadCrumbsItemProps, HomeIcon } from '@isdd/idsk-ui-kit/index'
import { useTranslation } from 'react-i18next'
import { useLocation, useParams } from 'react-router-dom'
import { RouteNames } from '@isdd/metais-common/navigation/routeNames'
import { HowTo } from '@isdd/metais-common/constants'
import { formatTitleString, getHowToTranslate } from '@isdd/metais-common/utils/utils'

import HowToContent from './howToContent'

import { MainContentWrapper } from '@/components/MainContentWrapper'

const HowToGenericPage = () => {
    const { t } = useTranslation()
    const location = useLocation()
    const { howToEnumType } = useParams()

    document.title = formatTitleString(getHowToTranslate(howToEnumType ?? '', t))

    const getParentHowToBreadCrumb = (): BreadCrumbsItemProps[] => {
        switch (howToEnumType) {
            case HowTo.SPK_HOWTO: {
                return [{ label: getHowToTranslate(HowTo.EGOV_HOWTO, t), href: RouteNames.HOW_TO_EGOV_COMPONENTS }]
            }
            case HowTo.CODELISTS_HOWTO: {
                return [{ label: getHowToTranslate(HowTo.REF_REG_HOWTO, t), href: RouteNames.HOW_TO_DATA_OBJECTS }]
            }
            case HowTo.URI_HOWTO: {
                return [{ label: getHowToTranslate(HowTo.REF_REG_HOWTO, t), href: RouteNames.HOW_TO_DATA_OBJECTS }]
            }
            default: {
                return []
            }
        }
    }

    return (
        <>
            <BreadCrumbs
                withWidthContainer
                links={[
                    { label: t('breadcrumbs.home'), href: RouteNames.HOME, icon: HomeIcon },
                    ...getParentHowToBreadCrumb(),
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
