import { BreadCrumbs, HomeIcon } from '@isdd/idsk-ui-kit/index'
import { RouteNames, RouterRoutes } from '@isdd/metais-common/navigation/routeNames'
import { useTranslation } from 'react-i18next'
import { META_IS_TITLE } from '@isdd/metais-common/constants'

import { OlaContractSaveView } from '@/components/views/ola-contract-list/OlaContractSaveView'
import { OlaContractAddContainer } from '@/components/containers/OlaContractAddContainer'

export const OlaContractAdd = () => {
    const { t } = useTranslation()
    document.title = `${t('olaContracts.headingAdd')} ${META_IS_TITLE}`
    return (
        <>
            <BreadCrumbs
                withWidthContainer
                links={[
                    { label: t('breadcrumbs.home'), href: RouteNames.HOME, icon: HomeIcon },
                    { label: t('olaContracts.heading'), href: RouterRoutes.OLA_CONTRACT_LIST },
                    { label: t('olaContracts.headingAdd'), href: RouterRoutes.OLA_CONTRACT_ADD },
                ]}
            />
            <OlaContractAddContainer View={(props) => <OlaContractSaveView {...props} />} />
        </>
    )
}
