import { BreadCrumbs, HomeIcon } from '@isdd/idsk-ui-kit/index'
import { ListSlaContractsParams } from '@isdd/metais-common/api/generated/monitoring-swagger'
import { RouteNames, RouterRoutes } from '@isdd/metais-common/navigation/routeNames'
import { useTranslation } from 'react-i18next'

import { SlaContractListContainer } from '@/components/containers/SlaContractListContainer'
import { SlaContractListView } from '@/components/views/sla-contract/SlaContractListView'

export const SlaContractList = () => {
    const { t } = useTranslation()
    const defaultFilterValues: ListSlaContractsParams = {
        name: '',
        phase: '',
        statusFilter: '',
        providerMainPersonUuid: '',
        providerProjectUuid: '',
        providerServiceUuid: '',
        consumerMainPersonUuid: '',
        consumerProjectUuid: '',
        consumerServiceUuid: '',
        intervalStart: '',
        intervalEnd: '',
    }

    return (
        <>
            <BreadCrumbs
                withWidthContainer
                links={[
                    { label: t('breadcrumbs.home'), href: RouteNames.HOME, icon: HomeIcon },
                    { label: t('slaContracts.heading'), href: RouterRoutes.SLA_CONTRACT_LIST },
                ]}
            />
            <SlaContractListContainer defaultFilterValues={defaultFilterValues} View={(props) => <SlaContractListView {...props} />} />
        </>
    )
}
