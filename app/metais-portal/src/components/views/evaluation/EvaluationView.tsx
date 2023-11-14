import { QueryFeedback } from '@isdd/metais-common/index'
import React from 'react'
import { useTranslation } from 'react-i18next'

interface IEvaluationView {
    entityId?: string
    isLoading: boolean
    isError: boolean
    entityName: string
}

export const EvaluationView: React.FC<IEvaluationView> = ({ entityId, isError, isLoading, entityName }) => {
    const { t } = useTranslation()

    return (
        <QueryFeedback loading={isLoading} error={isError} withChildren>
            <>{'evaluated'}</>
        </QueryFeedback>
    )
}
