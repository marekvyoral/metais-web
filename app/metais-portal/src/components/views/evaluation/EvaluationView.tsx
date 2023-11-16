import { QueryFeedback } from '@isdd/metais-common/index'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { AccordionContainer, Button, CheckBox, GridCol, GridRow, SimpleSelect } from '@isdd/idsk-ui-kit/index'
import { InformationGridRow } from '@isdd/metais-common/components/info-grid-row/InformationGridRow'
import { KrisToBeRights, NoteVersionUi } from '@isdd/metais-common/api/generated/kris-swagger'

import { GoalsEvaluationAccordion } from './components/GoalsEvaluationAccordion'
import styles from './evaluationView.module.scss'

interface IEvaluationView {
    versionData?: NoteVersionUi[]
    dataRights?: KrisToBeRights
    entityId?: string
    isLoading: boolean
    isError: boolean
    entityName: string
    onApprove: (approve: boolean) => Promise<void>
    onApproveGoals: (approve: boolean, note: string, refetchData: () => void) => Promise<void>
    onResponseGoals: (note: string, refetchData: () => void) => Promise<void>
}

export const EvaluationView: React.FC<IEvaluationView> = ({
    entityId,
    isError,
    isLoading,
    entityName,
    versionData,
    dataRights,
    onApprove,
    onApproveGoals,
    onResponseGoals,
}) => {
    const { t } = useTranslation()
    const [selectedVersion, setSelectedVersion] = useState<NoteVersionUi>()
    const [changeValidateAll, setChangeValidateAll] = useState<boolean>()

    useEffect(() => {
        versionData?.length && setSelectedVersion(versionData[0])
    }, [versionData])

    return (
        <QueryFeedback loading={isLoading} error={isError} withChildren>
            <>
                <GridRow className={styles.heading}>
                    <GridCol setWidth="one-half">
                        <InformationGridRow hideIcon key={'evaluatedBy'} label={t('evaluation.evaluatedBy')} value={selectedVersion?.evaluatedBy} />
                    </GridCol>
                    <GridCol setWidth="one-half">
                        <InformationGridRow hideIcon key={'created'} label={t('evaluation.created')} value={selectedVersion?.created} />
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
                        <InformationGridRow hideIcon key={'key4'} label={t('evaluation.evaluated')} value={selectedVersion?.evaluated} />
                    </GridCol>
                    <GridCol>
                        <div className="govuk-checkboxes govuk-checkboxes--small">
                            <CheckBox
                                disabled={!changeValidateAll}
                                label={t('evaluation.evaluatAll')}
                                id={'evaluatAll'}
                                name={'evaluatAll'}
                                onChange={(val) => {
                                    setChangeValidateAll(false)
                                    onApprove(val.target.checked)
                                }}
                            />
                        </div>
                        {!changeValidateAll ? (
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
                        )}
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
                                />
                            ),
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
            </>
        </QueryFeedback>
    )
}
