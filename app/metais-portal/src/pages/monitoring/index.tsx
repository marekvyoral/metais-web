import React from 'react'

import { MonitoringContainer } from '@/components/containers/MonitoringContainer'
import { MonitoringView } from '@/components/views/monitoring/MonitoringView'
import { useTranslation } from 'react-i18next'

const MonitoringPage: React.FC = () => {
    const { t } = useTranslation()

    document.title = `${t('titles.monitoring')} | MetaIS`

    return (
        <MonitoringContainer
            View={(props) => (
                <MonitoringView
                    data={props.data}
                />
            )}
        />
    )
}

export default MonitoringPage
