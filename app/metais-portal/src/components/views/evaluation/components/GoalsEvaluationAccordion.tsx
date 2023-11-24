import { Button, ButtonGroupRow, CheckBox, GridCol, GridRow, SimpleSelect, TextArea } from '@isdd/idsk-ui-kit/index'
import { KrisToBeRights, NoteVersionUi, useGetEvaluations } from '@isdd/metais-common/api/generated/kris-swagger'
import { InformationGridRow } from '@isdd/metais-common/components/info-grid-row/InformationGridRow'
import { QueryFeedback } from '@isdd/metais-common/index'
import React, { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

import styles from '@/components/views/evaluation/evaluationView.module.scss'
import { EContainerType } from '@/components/containers/CiEvaluationContainer'

interface IGoalsEvaluationAccordionProps {
    entityId: string
    versionData?: NoteVersionUi[]
    dataRights?: KrisToBeRights
    isGlobalAllowed: boolean
    onApproveGoals: (approve: boolean, note: string, type: EContainerType, refetchData: () => void) => void
    onResponseGoals: (note: string, refetchData: () => void) => void
}

interface IGolasViewData {
    currentNote: string
    currentResponse: string
    selectedNote: string
    currentApprove: boolean
    selectedApprove: boolean
}

export const GoalsEvaluationAccordion: React.FC<IGoalsEvaluationAccordionProps> = ({
    entityId,
    versionData,
    dataRights,
    isGlobalAllowed,
    onApproveGoals,
    onResponseGoals,
}) => {
    const { t } = useTranslation()
    const [isApprove, setApprove] = useState<boolean>(false)
    const [changeValidate, setChangeValidate] = useState<boolean>(false)
    const [selectedVersion, setSelectedVersion] = useState<NoteVersionUi>()
    const [goalsViewData, setGoalsViewData] = useState<IGolasViewData>()
    const { data: dataCommon, isError, isLoading, refetch, isFetching } = useGetEvaluations(entityId, entityId, EContainerType.GOALS)

    const currentNoteTA = useRef<HTMLTextAreaElement | null>(null)
    const currentResponseTA = useRef<HTMLTextAreaElement | null>(null)

    useEffect(() => {
        setSelectedVersion(versionData?.[0])
    }, [versionData])

    useEffect(() => {
        const currentResponse =
            dataCommon?.responses?.find((item) => item.noteVersionUi?.versionNumber === (versionData?.length ? versionData?.length - 1 : 0))
                ?.values?.[0]?.value ?? ''

        const currentNote =
            dataCommon?.evaluations?.find((item) => item.noteVersionUi?.versionNumber === (versionData?.length ?? 0))?.values?.[0]?.value ?? ''

        const selectedNote =
            dataCommon?.evaluations?.find((item) => item.noteVersionUi?.versionNumber === selectedVersion?.versionNumber)?.values?.[0]?.value ?? ''

        const currentApprove = dataCommon?.state?.values?.[(selectedVersion?.versionNumber ?? 0) - 1]?.value ?? false
        const selectedApprove = dataCommon?.state?.values?.[versionData?.length ?? 0]?.value ?? false

        setGoalsViewData({
            currentApprove,
            currentNote,
            selectedApprove,
            selectedNote,
            currentResponse,
        })
    }, [selectedVersion, dataCommon, versionData?.length])

    return (
        <QueryFeedback loading={isLoading || isFetching} error={isError} withChildren>
            <GridRow>
                <GridCol setWidth="one-half">
                    <InformationGridRow
                        hideIcon
                        key={'versionCommonRow'}
                        label={t('evaluation.version')}
                        value={
                            <SimpleSelect
                                label={''}
                                isClearable={false}
                                name={'versionCommon'}
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
                    <div className="govuk-checkboxes govuk-checkboxes--small">
                        <CheckBox
                            label={t('evaluation.evaluatSection')}
                            id={'evaluatSection'}
                            name={'evaluatSection'}
                            disabled={!changeValidate || dataRights?.inProgress}
                            defaultChecked={dataCommon?.state?.values?.[dataCommon?.state?.values?.length - 1]?.value ?? false}
                            onChange={(e) => {
                                setApprove(e.target.checked)
                            }}
                        />
                    </div>
                    {!isGlobalAllowed &&
                        (!changeValidate ? (
                            <Button label={t('evaluation.changeBtn')} onClick={() => setChangeValidate(!changeValidate)} />
                        ) : (
                            <ButtonGroupRow>
                                <Button
                                    label={t('evaluation.saveBtn')}
                                    onClick={() => {
                                        if (dataRights?.inEvaluation) {
                                            onApproveGoals(isApprove, currentNoteTA.current?.value ?? '', EContainerType.GOALS, refetch)
                                        } else if (dataRights?.inProgress) {
                                            onResponseGoals(currentResponseTA.current?.value ?? '', refetch)
                                        }
                                        setChangeValidate(false)
                                    }}
                                />
                                <Button variant="secondary" label={t('evaluation.cancelBtn')} onClick={() => setChangeValidate(false)} />
                            </ButtonGroupRow>
                        ))}
                </GridCol>
            </GridRow>
            <GridRow className={styles.heading}>
                <GridCol setWidth="one-half">
                    <InformationGridRow hideIcon key={'evaluatedBy'} label={t('evaluation.lastVerUPPVII')} value={goalsViewData?.selectedNote} />
                </GridCol>
            </GridRow>
            <GridRow className={styles.heading}>
                <GridCol setWidth="one-half">
                    <InformationGridRow
                        hideIcon
                        key={'response'}
                        label={t('evaluation.editor')}
                        value={
                            dataRights?.inProgress && changeValidate ? (
                                <TextArea
                                    ref={currentResponseTA}
                                    label={''}
                                    name={'response'}
                                    rows={3}
                                    defaultValue={goalsViewData?.currentResponse}
                                />
                            ) : (
                                <span>{goalsViewData?.currentResponse}</span>
                            )
                        }
                    />
                </GridCol>
                <GridCol setWidth="one-half">
                    <InformationGridRow
                        hideIcon
                        key={'evaluatedBy'}
                        label={t('evaluation.evalUPPVII')}
                        value={
                            dataRights?.inEvaluation && changeValidate ? (
                                <TextArea ref={currentNoteTA} label={''} name={'note'} rows={3} defaultValue={goalsViewData?.currentNote} />
                            ) : (
                                <span>{goalsViewData?.currentNote}</span>
                            )
                        }
                    />
                </GridCol>
            </GridRow>
        </QueryFeedback>
    )
}
