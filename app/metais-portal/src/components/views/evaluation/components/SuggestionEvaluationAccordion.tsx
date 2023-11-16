import { Button, ButtonGroupRow, CheckBox, GridCol, GridRow, TextArea } from '@isdd/idsk-ui-kit/index'
import { KrisToBeRights, NoteVersionUi, useGetEvaluations } from '@isdd/metais-common/api/generated/kris-swagger'
import { InformationGridRow } from '@isdd/metais-common/components/info-grid-row/InformationGridRow'
import { QueryFeedback } from '@isdd/metais-common/index'
import React, { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import debounce from 'lodash/debounce'

import { EContainerType } from '@/components/containers/CiEvaluationContainer'

interface ISuggestionEvaluationAccordionProps {
    entityId: string
    versionData?: NoteVersionUi[]
    dataRights?: KrisToBeRights
    onApproveGoals: (approve: boolean, note: string, type: EContainerType, refetchData: () => void) => Promise<void>
}

export const SuggestionEvaluationAccordion: React.FC<ISuggestionEvaluationAccordionProps> = ({
    entityId,
    versionData,
    dataRights,
    onApproveGoals,
}) => {
    const { t } = useTranslation()
    const [isApprove, setApprove] = useState<boolean>(false)
    const [note, setNote] = useState<string>('')
    const [changeValidate, setChangeValidate] = useState<boolean>(false)
    const [selectedVersion, setSelectedVersion] = useState<NoteVersionUi>()
    const { data: dataCommon, isError, isLoading, refetch, isFetching } = useGetEvaluations(entityId, entityId, EContainerType.COMMON)

    const debouncedHandlerEvaluation = useRef(
        debounce((value) => {
            setNote(value)
        }, 300),
    ).current

    useEffect(() => {
        setSelectedVersion(versionData?.[0])
    }, [versionData])

    useEffect(() => {
        return () => {
            debouncedHandlerEvaluation.cancel()
        }
    }, [debouncedHandlerEvaluation])

    useEffect(() => {
        const currentSuggestion =
            dataCommon?.evaluations?.find((item) => item.noteVersionUi?.versionNumber === (versionData?.length ?? 0))?.values?.[0]?.value ?? ''

        setNote(currentSuggestion)
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
                        key={'suggestion'}
                        label={t('evaluation.suggestionNote')}
                        value={
                            dataRights?.inEvaluation && changeValidate ? (
                                <TextArea
                                    label={''}
                                    name={'suggestion'}
                                    rows={3}
                                    defaultValue={note}
                                    onChange={(e) => {
                                        debouncedHandlerEvaluation(e.target.value)
                                    }}
                                />
                            ) : (
                                <span>{note}</span>
                            )
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
                    {dataRights?.inEvaluation &&
                        (!changeValidate ? (
                            <Button label={t('evaluation.changeBtn')} onClick={() => setChangeValidate(!changeValidate)} />
                        ) : (
                            <ButtonGroupRow>
                                <Button
                                    label={t('evaluation.saveBtn')}
                                    onClick={() => {
                                        if (dataRights?.inEvaluation) {
                                            onApproveGoals(isApprove, note, EContainerType.COMMON, refetchData)
                                        }
                                        setChangeValidate(false)
                                    }}
                                />
                                <Button variant="secondary" label={t('evaluation.cancelBtn')} onClick={() => setChangeValidate(false)} />
                            </ButtonGroupRow>
                        ))}
                </GridCol>
            </GridRow>
        </QueryFeedback>
    )
}
