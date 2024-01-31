import { BreadCrumbs, HomeIcon } from '@isdd/idsk-ui-kit/index'
import { RouteNames, RouterRoutes } from '@isdd/metais-common/navigation/routeNames'
import { useTranslation } from 'react-i18next'

import { IAdditionalFilterField, OlaContractListContainer } from '@/components/containers/OlaContractListContainer'
import { OlaContractListView } from '@/components/views/ola-contract-list/OlaContractListView'

export const OlaContractList = () => {
    const { t } = useTranslation()
    const defaultFilterValues: IAdditionalFilterField = {
        name: '',
        contractCode: '',
        validityStart: '',
        validityEnd: '',
        contractorIsvsUuid: '',
        liableEntities: [],
        metaIsCode: '',
    }

    return (
        <>
            <BreadCrumbs
                withWidthContainer
                links={[
                    { label: t('breadcrumbs.home'), href: RouteNames.HOME, icon: HomeIcon },
                    { label: t('olaContracts.heading'), href: RouterRoutes.OLA_CONTRACT_LIST },
                ]}
            />
            <OlaContractListContainer defaultFilterValues={defaultFilterValues} View={(props) => <OlaContractListView {...props} />} />
        </>
    )
}
