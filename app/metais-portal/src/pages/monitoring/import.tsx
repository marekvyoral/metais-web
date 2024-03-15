import { BreadCrumbs, HomeIcon } from '@isdd/idsk-ui-kit/index'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { RouteNames, RouterRoutes } from '@isdd/metais-common/navigation/routeNames'
import { HowTo } from '@isdd/metais-common/constants'
import { getHowToTranslate } from '@isdd/metais-common/utils/utils'

import { ImportParametersView } from '@/components/views/monitoring/services/ImportParameters'

const ImportParametersPage: React.FC = () => {
    const { t } = useTranslation()

    return (
        <>
            <BreadCrumbs
                withWidthContainer
                links={[
                    { label: t('breadcrumbs.home'), href: '/', icon: HomeIcon },
                    { label: getHowToTranslate(HowTo.MONITORING_HOWTO, t), href: RouteNames.HOW_TO_MONITORING },
                    { label: t('navMenu.lists.monitoringImport') ?? '', href: RouterRoutes.IMPORT_MONITORING_PARAMETERS },
                ]}
            />
            <ImportParametersView />
        </>
    )
}

export default ImportParametersPage
