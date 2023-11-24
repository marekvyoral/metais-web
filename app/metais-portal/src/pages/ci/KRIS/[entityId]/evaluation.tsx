import React from 'react'
import { shouldEntityNameBePO } from '@isdd/metais-common/componentHelpers/ci/entityNameHelpers'
import { TextWarning } from '@isdd/idsk-ui-kit/index'
import { useTranslation } from 'react-i18next'

import { useGetEntityParamsFromUrl } from '@/componentHelpers/ci'
import { CiEvaluationContainer } from '@/components/containers/CiEvaluationContainer'
import { EvaluationView } from '@/components/views/evaluation/EvaluationView'

const EvaluationAccordionPage: React.FC = () => {
    const { t } = useTranslation()
    const { entityId } = useGetEntityParamsFromUrl()
    let { entityName } = useGetEntityParamsFromUrl()
    entityName = shouldEntityNameBePO(entityName ?? '')

    return entityId ? (
        <CiEvaluationContainer
            entityId={entityId ?? ''}
            View={(props) => {
                return (
                    <EvaluationView
                        entityName={entityName ?? ''}
                        entityId={entityId}
                        isError={props.isError}
                        isLoading={props.isLoading}
                        versionData={props.versionData}
                        dataRights={props.dataRights}
                        onApprove={props.onApprove}
                        onApproveGoals={props.onApproveGoals}
                        onResponseGoals={props.onResponseGoals}
                        krisData={props.krisData}
                        resultSuccessApiCall={props.resultSuccessApiCall}
                    />
                )
            }}
        />
    ) : (
        <TextWarning>{t('errors.invalidEntityId')}</TextWarning>
    )
}

export default EvaluationAccordionPage
