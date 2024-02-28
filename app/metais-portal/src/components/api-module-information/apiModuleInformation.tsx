import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { InformationGridRow } from '@isdd/metais-common/components/info-grid-row/InformationGridRow'
import { QueryFeedback } from '@isdd/metais-common/index'

interface ApiModuleInformationProps {
    moduleName: string
}

const ApiModuleInformation: React.FC<ApiModuleInformationProps> = ({ moduleName }) => {
    const { t } = useTranslation()
    const [apiModule, setApiModule] = useState<{ chart: { version: string } }>()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false)

    useEffect(() => {
        setLoading(true)
        fetch(`${import.meta.env.VITE_API_BASE_URL}/${moduleName}/endpoints/info`)
            .then((response) => response.json())
            .then((json) => {
                setApiModule(json)
                setLoading(false)
            })
            .catch((fetchError) => {
                setLoading(false)
                setError(!!fetchError)
            })
    }, [moduleName])

    return (
        <QueryFeedback loading={loading} error={error} withChildren>
            <InformationGridRow key={moduleName} label={t('aboutApp.version', { apiModul: moduleName })} value={apiModule?.chart?.version} hideIcon />
        </QueryFeedback>
    )
}
export default ApiModuleInformation
