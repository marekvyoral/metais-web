import { Button, ButtonGroupRow, CheckBox, GridCol, GridRow, SimpleSelect, TextArea } from '@isdd/idsk-ui-kit/index'
import { KrisToBeRights, NoteVersionUi, useGetEvaluations } from '@isdd/metais-common/api/generated/kris-swagger'
import { InformationGridRow } from '@isdd/metais-common/components/info-grid-row/InformationGridRow'
import { QueryFeedback } from '@isdd/metais-common/index'
import React, { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import debounce from 'lodash/debounce'

import styles from '@/components/views/evaluation/evaluationView.module.scss'
import { EContainerType } from '@/components/containers/CiEvaluationContainer'

interface IGoalsEvaluationAccordionProps {
    entityId: string
    versionData?: NoteVersionUi[]
    dataRights?: KrisToBeRights
    onApproveGoals: (approve: boolean, note: string, type: EContainerType, refetchData: () => void) => Promise<void>
    onResponseGoals: (note: string, refetchData: () => void) => Promise<void>
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
    onApproveGoals,
    onResponseGoals,
}) => {
    const { t } = useTranslation()
    const [isApprove, setApprove] = useState<boolean>(false)
    const [note, setNote] = useState<string>('')
    const [response, setResponse] = useState<string>('')
    const [changeValidate, setChangeValidate] = useState<boolean>(false)
    const [selectedVersion, setSelectedVersion] = useState<NoteVersionUi>()
    const [goalsViewData, setGoalsViewData] = useState<IGolasViewData>()
    const { data: dataCommon, isError, isLoading, refetch, isFetching } = useGetEvaluations(entityId, entityId, EContainerType.GOALS)

    const debouncedHandlerEvaluation = useRef(
        debounce((value) => {
            setNote(value)
        }, 300),
    ).current

    const debouncedHandlerResponse = useRef(
        debounce((value) => {
            setResponse(value)
        }, 300),
    ).current

    useEffect(() => {
        setSelectedVersion(versionData?.[0])
    }, [versionData])

    useEffect(() => {
        return () => {
            debouncedHandlerEvaluation.cancel()
            debouncedHandlerResponse.cancel()
        }
    }, [debouncedHandlerEvaluation, debouncedHandlerResponse])

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

    const refetchData = () => {
        refetch()
    }

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
                            disabled={!changeValidate || dataRights?.inProgress}
                            onChange={(e) => {
                                setApprove(e.target.checked)
                            }}
                            label={t('evaluation.evaluatSection')}
                            id={'evaluatSection'}
                            name={'evaluatSection'}
                        />
                    </div>
                    {!changeValidate ? (
                        <Button label={t('evaluation.changeBtn')} onClick={() => setChangeValidate(!changeValidate)} />
                    ) : (
                        <ButtonGroupRow>
                            <Button
                                label={t('evaluation.saveBtn')}
                                onClick={() => {
                                    if (dataRights?.inEvaluation) {
                                        onApproveGoals(isApprove, note, EContainerType.GOALS, refetchData)
                                    } else if (dataRights?.inProgress) {
                                        onResponseGoals(response, refetchData)
                                    }
                                    setChangeValidate(false)
                                }}
                            />
                            <Button variant="secondary" label={t('evaluation.cancelBtn')} onClick={() => setChangeValidate(false)} />
                        </ButtonGroupRow>
                    )}
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
                                    label={''}
                                    name={'response'}
                                    rows={3}
                                    defaultValue={goalsViewData?.currentResponse}
                                    onChange={(e) => {
                                        debouncedHandlerResponse(e.target.value)
                                    }}
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
                                <TextArea
                                    label={''}
                                    name={'note'}
                                    rows={3}
                                    defaultValue={goalsViewData?.currentNote}
                                    onChange={(e) => {
                                        debouncedHandlerEvaluation(e.target.value)
                                    }}
                                />
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
