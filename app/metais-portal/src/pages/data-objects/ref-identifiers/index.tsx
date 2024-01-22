import { BreadCrumbs, HomeIcon } from '@isdd/idsk-ui-kit/index'
import { RouteNames } from '@isdd/metais-common/navigation/routeNames'
import { useTranslation } from 'react-i18next'

import { MainContentWrapper } from '@/components/MainContentWrapper'
import { RefIdentifiersContainer } from '@/components/containers/ref-identifiers/RefIdentifiersContainer'
import { RefIdentifierListView } from '@/components/views/ref-identifiers/RefIdentifierListView'

const RefIdentifiersPage = () => {
    const { t } = useTranslation()

    document.title = `${t('titles.refIdentifiers')} | MetaIS`

    return (
        <>
            <BreadCrumbs
                withWidthContainer
                links={[
                    { label: t('breadcrumbs.home'), href: RouteNames.HOME, icon: HomeIcon },
                    { label: t('breadcrumbs.dataObjects'), href: RouteNames.HOW_TO_DATA_OBJECTS },
                    { label: t('breadcrumbs.refIdentifiers'), href: RouteNames.REFERENCE_REGISTERS },
                ]}
            />
            <MainContentWrapper>
                <RefIdentifiersContainer View={(props) => <RefIdentifierListView {...props} />} />
            </MainContentWrapper>
        </>
    )
}

export default RefIdentifiersPage
