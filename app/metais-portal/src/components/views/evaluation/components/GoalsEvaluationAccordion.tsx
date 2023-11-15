import { useGetEvaluations } from '@isdd/metais-common/api/generated/kris-swagger'
import { QueryFeedback } from '@isdd/metais-common/index'
import React from 'react'
import { useTranslation } from 'react-i18next'

interface IGoalsEvaluationAccordionProps {
    entityId: string
}

export const GoalsEvaluationAccordion: React.FC<IGoalsEvaluationAccordionProps> = ({ entityId }) => {
    const { t } = useTranslation()
    const { data: dataCommon, isError, isLoading } = useGetEvaluations(entityId, entityId, 'GOALS')

    return (
        <QueryFeedback loading={isLoading} error={isError} withChildren>
            <>{'tretet ' + dataCommon?.state?.values?.length}</>
        </QueryFeedback>
    )
}
