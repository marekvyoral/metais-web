import React from 'react'
import { useTranslation } from 'react-i18next'

interface IGoalsEvaluationAccordionProps {
    entityId: string
}

export const GoalsEvaluationAccordion: React.FC<IGoalsEvaluationAccordionProps> = ({ entityId }) => {
    const { t } = useTranslation()

    return <>{'tretet ' + entityId}</>
}
