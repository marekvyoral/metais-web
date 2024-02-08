import { BreadCrumbs, HomeIcon } from '@isdd/idsk-ui-kit/index'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { RouterRoutes } from '@isdd/metais-common/navigation/routeNames'

import { ImportParametersView } from '@/components/views/monitoring/services/ImportParameters'

const ImportParametersPage: React.FC = () => {
    const { t } = useTranslation()

    return (
        <>
            <BreadCrumbs
                withWidthContainer
                links={[
                    { label: t('breadcrumbs.home'), href: '/', icon: HomeIcon },
                    { label: t('titles.monitoringServices') ?? '', href: RouterRoutes.MONITORING_SERVICES },
                ]}
            />
            <ImportParametersView />
        </>
    )
}

export default ImportParametersPage
