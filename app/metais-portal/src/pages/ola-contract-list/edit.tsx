import { BreadCrumbs, HomeIcon } from '@isdd/idsk-ui-kit/index'
import { RouteNames, RouterRoutes } from '@isdd/metais-common/navigation/routeNames'
import { useTranslation } from 'react-i18next'

import { OlaContractEditContainer } from '@/components/containers/OlaContractEditContainer'
import { OlaContractSaveView } from '@/components/views/ola-contract-list/OlaContractSaveView'

export const OlaContractEdit = () => {
    const { t } = useTranslation()
    document.title = `${t('olaContracts.headingEdit')} | MetaIS`

    return (
        <>
            <BreadCrumbs
                withWidthContainer
                links={[
                    { label: t('breadcrumbs.home'), href: RouteNames.HOME, icon: HomeIcon },
                    { label: t('olaContracts.heading'), href: RouterRoutes.OLA_CONTRACT_LIST },
                    { label: t('olaContracts.headingEdit'), href: RouterRoutes.OLA_CONTRACT_ADD },
                ]}
            />
            <OlaContractEditContainer View={(props) => <OlaContractSaveView {...props} />} />
        </>
    )
}
