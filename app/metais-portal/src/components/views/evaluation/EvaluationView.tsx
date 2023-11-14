import { QueryFeedback } from '@isdd/metais-common/index'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { AccordionContainer } from '@isdd/idsk-ui-kit/index'

import { GoalsEvaluationAccordion } from './components/GoalsEvaluationAccordion'

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
            <AccordionContainer
                sections={[
                    {
                        title: t('evaluation.accordion.goals'),
                        content: <GoalsEvaluationAccordion entityId={entityId ?? ''} />,
                    },
                    {
                        title: t('evaluation.accordion.suggestion'),
                        content: <>{'tretet 2 ' + entityId}</>,
                    },
                    {
                        title: t('evaluation.accordion.isvs'),
                        content: <>{'tretet 2 ' + entityId}</>,
                    },
                    {
                        title: t('evaluation.accordion.services'),
                        content: <>{'tretet 2 ' + entityId}</>,
                    },
                    {
                        title: t('evaluation.accordion.krit'),
                        content: <>{'tretet 2 ' + entityId}</>,
                    },
                ]}
            />
        </QueryFeedback>
    )
}
