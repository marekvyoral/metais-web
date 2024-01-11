import { BreadCrumbs, HomeIcon } from '@isdd/idsk-ui-kit/index'
import { RouteNames, RouterRoutes } from '@isdd/metais-common/navigation/routeNames'
import { useTranslation } from 'react-i18next'
import { IFilterParams } from '@isdd/metais-common/hooks/useFilter'

import { ProvIntegrationListContainer } from '@/components/containers/ProvIntegrationListContainer'
import { ProvIntegrationListView } from '@/components/views/prov-integration/ProvIntegrationListView'

//in generated type were [] in key names which were not put into url by filter
export type CustomListIntegrationLinksParams = IFilterParams & {
    integrationName?: string
    consumingProjects?: string[]
    providingProjects?: string[]
    consumingIsvs?: string[]
    providingIsvs?: string[]
    consumingPo?: string[]
    providingPo?: string[]
    itemState?: string
    dizState?: string
}

export const ProvIntegrationList = () => {
    const { t } = useTranslation()
    const defaultFilterValues: CustomListIntegrationLinksParams = {
        integrationName: '',
        itemState: '',
        dizState: '',
        providingProjects: [],
        consumingProjects: [],
        consumingIsvs: [],
        providingIsvs: [],
        consumingPo: [],
        providingPo: [],
    }

    return (
        <>
            <BreadCrumbs
                withWidthContainer
                links={[
                    { label: t('breadcrumbs.home'), href: RouteNames.HOME, icon: HomeIcon },
                    { label: t('integrationLinks.heading'), href: RouterRoutes.INTEGRATION_LIST },
                ]}
            />
            <ProvIntegrationListContainer defaultFilterValues={defaultFilterValues} View={(props) => <ProvIntegrationListView {...props} />} />
        </>
    )
}
