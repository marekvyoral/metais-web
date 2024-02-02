import { MutationFeedback, QueryFeedback, formatDateTimeForDefaultValue } from '@isdd/metais-common/index'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { AccordionContainer, Button, CheckBox, GridCol, GridRow, SimpleSelect } from '@isdd/idsk-ui-kit/index'
import { InformationGridRow } from '@isdd/metais-common/components/info-grid-row/InformationGridRow'
import { KrisToBeRights, KrisUi, NoteVersionUi } from '@isdd/metais-common/api/generated/kris-swagger'

import { BasicEvaluationAccordion } from '@/components/views/evaluation/components/BasicEvaluationAccordion'
import { KSEvaluationAccordion } from '@/components/views/evaluation/components/KSEvaluationAccordion'
import styles from '@/components/views/evaluation/evaluationView.module.scss'
import { GoalsEvaluationAccordion } from '@/components/views/evaluation/components/GoalsEvaluationAccordion'
import { SuggestionEvaluationAccordion } from '@/components/views/evaluation/components/SuggestionEvaluationAccordion'
import { IsvsEvaluationAccordion } from '@/components/views/evaluation/components/IsvsEvaluationAccordion'
import { EContainerType } from '@/components/containers/CiEvaluationContainer'

export interface IResultCall {
    isSuccess: boolean
    message: string
}

interface IEvaluationView {
    versionData?: NoteVersionUi[]
    dataRights?: KrisToBeRights
    krisData?: KrisUi
    entityId?: string
    isLoading: boolean
    isError: boolean
    entityName: string
    resultSuccessApiCall: IResultCall
    resetResultSuccessApiCall: () => void
    onApprove: (approve: boolean) => void
    onApproveGoals: (approve: boolean, note: string, type: EContainerType, refetchData: () => void) => void
    onResponseGoals: (note: string, refetchData: () => void) => void
}

export const EvaluationView: React.FC<IEvaluationView> = ({
    entityId,
    isError,
    isLoading,
    krisData,
    versionData,
    dataRights,
    resultSuccessApiCall,
    onApprove,
    onApproveGoals,
    onResponseGoals,
    resetResultSuccessApiCall,
}) => {
    const { t } = useTranslation()
    const [selectedVersion, setSelectedVersion] = useState<NoteVersionUi>()
    const [changeValidateAll, setChangeValidateAll] = useState<boolean>()
    const isGlobalAllowed = krisData?.approved ?? false

    useEffect(() => {
        versionData?.length && setSelectedVersion(versionData[0])
    }, [versionData])

    return (
        <QueryFeedback loading={isLoading} error={isError} withChildren>
            <>
                {resultSuccessApiCall.isSuccess && (
                    <MutationFeedback
                        success={resultSuccessApiCall.isSuccess}
                        successMessage={resultSuccessApiCall.message}
                        error={undefined}
                        onMessageClose={resetResultSuccessApiCall}
                    />
                )}
                <GridRow className={styles.heading}>
                    <GridCol setWidth="one-half">
                        <InformationGridRow hideIcon key={'evaluatedBy'} label={t('evaluation.evaluatedBy')} value={selectedVersion?.evaluatedBy} />
                    </GridCol>
                    <GridCol setWidth="one-half">
                        <InformationGridRow
                            hideIcon
                            key={'created'}
                            label={t('evaluation.created')}
                            value={selectedVersion?.created ? formatDateTimeForDefaultValue(selectedVersion?.created, 'dd.MM.yyyy HH:mm') : ''}
                        />
                    </GridCol>
                </GridRow>
                <GridRow className={styles.heading}>
                    <GridCol setWidth="one-half">
                        <InformationGridRow
                            hideIcon
                            key={'versionRow'}
                            label={t('evaluation.version')}
                            value={
                                <SimpleSelect
                                    isClearable={false}
                                    label={''}
                                    name={'version'}
                                    onChange={(value) => {
                                        setSelectedVersion(versionData?.find((item) => item.versionNumber == value))
                                    }}
                                    defaultValue={versionData?.[0]?.versionNumber?.toString() ?? ''}
                                    options={
                                        versionData?.map((item) => ({
                                            label: item.versionNumber?.toString() ?? '',
                                            value: item.versionNumber?.toString() ?? '',
                                        })) ?? []
                                    }
                                />
                            }
                        />
                    </GridCol>
                    <GridCol setWidth="one-half">
                        <InformationGridRow
                            hideIcon
                            key={'key4'}
                            label={t('evaluation.evaluated')}
                            value={selectedVersion?.evaluated ? formatDateTimeForDefaultValue(selectedVersion?.evaluated, 'dd.MM.yyyy HH:mm') : ''}
                        />
                    </GridCol>
                    <GridCol>
                        <div className="govuk-checkboxes govuk-checkboxes--small">
                            <CheckBox
                                disabled={!changeValidateAll}
                                label={t('evaluation.evaluatAll')}
                                id={'evaluatAll'}
                                name={'evaluatAll'}
                                checked={isGlobalAllowed}
                                onChange={(val) => {
                                    setChangeValidateAll(false)
                                    onApprove(val.target.checked)
                                }}
                            />
                        </div>
                        {dataRights?.inEvaluation &&
                            (!changeValidateAll ? (
                                <Button
                                    label={t('evaluation.changeBtn')}
                                    onClick={() => {
                                        setChangeValidateAll(!changeValidateAll)
                                    }}
                                />
                            ) : (
                                <Button
                                    variant="secondary"
                                    label={t('evaluation.cancelBtn')}
                                    onClick={() => {
                                        setChangeValidateAll(!changeValidateAll)
                                    }}
                                />
                            ))}
                    </GridCol>
                </GridRow>
                <AccordionContainer
                    sections={[
                        {
                            title: t('evaluation.accordion.goals'),
                            content: (
                                <GoalsEvaluationAccordion
                                    entityId={entityId ?? ''}
                                    versionData={versionData}
                                    onApproveGoals={onApproveGoals}
                                    onResponseGoals={onResponseGoals}
                                    dataRights={dataRights}
                                    isGlobalAllowed={isGlobalAllowed}
                                />
                            ),
                        },
                        {
                            title: t('evaluation.accordion.suggestion'),
                            content: (
                                <SuggestionEvaluationAccordion
                                    versionData={versionData}
                                    onApproveGoals={onApproveGoals}
                                    dataRights={dataRights}
                                    entityId={entityId ?? ''}
                                    isGlobalAllowed={isGlobalAllowed}
                                />
                            ),
                        },
                        {
                            title: t('evaluation.accordion.isvs'),
                            content: <IsvsEvaluationAccordion dataRights={dataRights} entityId={entityId ?? ''} isGlobalAllowed={isGlobalAllowed} />,
                        },
                        {
                            title: t('evaluation.accordion.services'),
                            content: <KSEvaluationAccordion dataRights={dataRights} entityId={entityId ?? ''} isGlobalAllowed={isGlobalAllowed} />,
                        },
                        {
                            title: t('evaluation.accordion.krit'),
                            content: <BasicEvaluationAccordion dataRights={dataRights} entityId={entityId ?? ''} isGlobalAllowed={isGlobalAllowed} />,
                        },
                    ]}
                />
            </>
        </QueryFeedback>
    )
}
