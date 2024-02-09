import { BreadCrumbs, HomeIcon } from '@isdd/idsk-ui-kit/index'
import { RouteNames, RouterRoutes } from '@isdd/metais-common/navigation/routeNames'
import { useTranslation } from 'react-i18next'

import { OlaContractDetailView } from '@/components/views/ola-contract-list/OlaContractDetailView'
import { OlaContractDetailContainer } from '@/components/containers/OlaContractDetailContainer'

export const OlaContractDetail = () => {
    const { t } = useTranslation()
    document.title = `${t('olaContracts.detail.heading')} | MetaIS`
    return (
        <>
            <BreadCrumbs
                withWidthContainer
                links={[
                    { label: t('breadcrumbs.home'), href: RouteNames.HOME, icon: HomeIcon },
                    { label: t('olaContracts.heading'), href: RouterRoutes.OLA_CONTRACT_LIST },
                    { label: t('olaContracts.detail.heading'), href: '#' },
                ]}
            />
            <OlaContractDetailContainer View={(props) => <OlaContractDetailView {...props} />} />
        </>
    )
}
