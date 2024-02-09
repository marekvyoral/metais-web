import { BreadCrumbs, HomeIcon } from '@isdd/idsk-ui-kit/index'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { ENTITY_AS } from '@isdd/metais-common/constants'

import { MonitoringFilterData, MonitoringServiceListContainer } from '@/components/containers/MonitoringServiceListContainer'
import { ServicesView } from '@/components/views/monitoring/services/ServicesView'

const ServicesListPage: React.FC = () => {
    const { t } = useTranslation()
    const defaultFilterValues: MonitoringFilterData = { serviceType: ENTITY_AS, intervalStart: '', intervalEnd: '', isvs: '', liableEntity: '' }

    return (
        <>
            <BreadCrumbs
                withWidthContainer
                links={[
                    { label: t('breadcrumbs.home'), href: '/', icon: HomeIcon },
                    { label: t('titles.monitoringServices') ?? '', href: `/monitoring/services` },
                ]}
            />
            <MonitoringServiceListContainer defaultFilterValues={defaultFilterValues} View={(props) => <ServicesView {...props} />} />
        </>
    )
}

export default ServicesListPage
