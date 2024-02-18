import { BreadCrumbs, HomeIcon } from '@isdd/idsk-ui-kit/index'
import { RouteNames, RouterRoutes } from '@isdd/metais-common/navigation/routeNames'
import { useTranslation } from 'react-i18next'
import { META_IS_TITLE } from '@isdd/metais-common/constants'

import { MainContentWrapper } from '@/components/MainContentWrapper'
import { RefIdentifiersContainer } from '@/components/containers/ref-identifiers/RefIdentifiersContainer'
import { RefIdentifierListView } from '@/components/views/ref-identifiers/RefIdentifierListView'

const RefIdentifiersPage = () => {
    const { t } = useTranslation()

    document.title = `${t('titles.refIdentifiers')} ${META_IS_TITLE}`

    return (
        <>
            <BreadCrumbs
                withWidthContainer
                links={[
                    { label: t('breadcrumbs.home'), href: RouteNames.HOME, icon: HomeIcon },
                    { label: t('breadcrumbs.dataObjects'), href: RouteNames.HOW_TO_DATA_OBJECTS },
                    { label: t('breadcrumbs.refIdentifiers'), href: RouterRoutes.DATA_OBJECT_REF_IDENTIFIERS },
                ]}
            />
            <MainContentWrapper>
                <RefIdentifiersContainer View={(props) => <RefIdentifierListView {...props} />} />
            </MainContentWrapper>
        </>
    )
}

export default RefIdentifiersPage
