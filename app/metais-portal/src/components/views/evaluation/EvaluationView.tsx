import {
    AccordionContainer,
    Button,
    ButtonGroupRow,
    ButtonLink,
    ButtonPopup,
    CheckBox,
    GridCol,
    GridRow,
    SimpleSelect,
} from '@isdd/idsk-ui-kit/index'
import { useExportCsv7Hook, useExportExcel7Hook, useExportXml7Hook } from '@isdd/metais-common/api/generated/impexp-cmdb-swagger'
import { KrisToBeRights, KrisUi, NoteVersionUi } from '@isdd/metais-common/api/generated/kris-swagger'
import { downloadBlobAsFile } from '@isdd/metais-common/componentHelpers/download/downloadHelper'
import { InformationGridRow } from '@isdd/metais-common/components/info-grid-row/InformationGridRow'
import { MutationFeedback, QueryFeedback, formatDateTimeForDefaultValue } from '@isdd/metais-common/index'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { EContainerType } from '@/components/containers/CiEvaluationContainer'
import { ExportModal } from '@/components/views/ci/kris/Modals/ExportModal'
import { BasicEvaluationAccordion } from '@/components/views/evaluation/components/BasicEvaluationAccordion'
import { GoalsEvaluationAccordion } from '@/components/views/evaluation/components/GoalsEvaluationAccordion'
import { IsvsEvaluationAccordion } from '@/components/views/evaluation/components/IsvsEvaluationAccordion'
import { KSEvaluationAccordion } from '@/components/views/evaluation/components/KSEvaluationAccordion'
import { SuggestionEvaluationAccordion } from '@/components/views/evaluation/components/SuggestionEvaluationAccordion'
import styles from '@/components/views/evaluation/evaluationView.module.scss'

export interface IResultCall {
    isSuccess: boolean
    message: string
}

interface IOpenModalExport {
    isOpen: boolean
    type: EContainerType
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
    const [openExport, setOpenExport] = useState<IOpenModalExport>({ isOpen: false, type: EContainerType.KRIS })
    const [changeValidateAll, setChangeValidateAll] = useState<boolean>()
    const [isLoadingApi, setIsLoadingApi] = useState<boolean>(false)
    const [isErrorApi, setIsErrorApi] = useState<boolean>(false)
    const isGlobalAllowed = krisData?.approved ?? false

    const exportXml = useExportXml7Hook()
    const exportXlsx = useExportExcel7Hook()
    const exportCsv = useExportCsv7Hook()

    const downloadFile = (res: Blob, type: string, entity: string) => {
        downloadBlobAsFile(new Blob([res]), `${entity}-${new Date().toISOString()}.${type}`, false)
    }

    useEffect(() => {
        versionData?.length && setSelectedVersion(versionData[0])
    }, [versionData])

    const exportToFile = async (type: string, selectedPo: string[]) => {
        try {
            switch (type) {
                case 'xml': {
                    const res = await exportXml(openExport.type === EContainerType.ISVS ? { ids: selectedPo } : {}, {
                        type: openExport.type,
                        version: selectedVersion?.versionNumber ?? 0,
                        uuid: entityId ?? '',
                    })
                    downloadFile(res, type, openExport.type)
                    break
                }
                case 'xlsx': {
                    const res = await exportXlsx(openExport.type === EContainerType.ISVS ? { ids: selectedPo } : {}, {
                        type: openExport.type,
                        version: selectedVersion?.versionNumber ?? 0,
                        uuid: entityId ?? '',
                    })
                    downloadFile(res, type, openExport.type)
                    break
                }
                case 'csv': {
                    const res = await exportCsv(openExport.type === EContainerType.ISVS ? { ids: selectedPo } : {}, {
                        type: openExport.type,
                        version: selectedVersion?.versionNumber ?? 0,
                        uuid: entityId ?? '',
                    })
                    downloadFile(res, type, openExport.type)
                    break
                }
            }
        } catch (error) {
            setIsErrorApi(true)
        } finally {
            setIsLoadingApi(false)
        }
    }

    return (
        <QueryFeedback loading={isLoading || isLoadingApi} error={isError || isErrorApi} withChildren>
            {versionData?.length ? (
                <>
                    <MutationFeedback
                        success={resultSuccessApiCall.isSuccess}
                        successMessage={resultSuccessApiCall.message}
                        onMessageClose={resetResultSuccessApiCall}
                    />
                    <GridRow className={styles.heading}>
                        <GridCol setWidth="one-half">
                            <InformationGridRow
                                hideIcon
                                key={'evaluatedBy'}
                                label={t('evaluation.evaluatedBy')}
                                value={selectedVersion?.evaluatedBy}
                            />
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
                                value={
                                    selectedVersion?.evaluated ? formatDateTimeForDefaultValue(selectedVersion?.evaluated, 'dd.MM.yyyy HH:mm') : ''
                                }
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
                    <ButtonGroupRow>
                        <ButtonPopup
                            buttonClassName={styles.noWrap}
                            buttonLabel={t('evaluation.exportBtn')}
                            popupPosition="right"
                            popupContent={() => {
                                return (
                                    <div className={styles.buttonLinksDiv}>
                                        <div className={styles.buttonPopupItem}>
                                            <ButtonLink
                                                onClick={() => {
                                                    setOpenExport({ isOpen: true, type: EContainerType.KRIS })
                                                }}
                                                label={t('evaluation.exportKris')}
                                            />
                                        </div>
                                        <div className={styles.buttonPopupItem}>
                                            <ButtonLink
                                                onClick={() => {
                                                    setOpenExport({ isOpen: true, type: EContainerType.ISVS })
                                                }}
                                                label={t('evaluation.exportIsvs')}
                                            />
                                        </div>
                                        <div>
                                            <ButtonLink
                                                onClick={() => {
                                                    setOpenExport({ isOpen: true, type: EContainerType.KS })
                                                }}
                                                label={t('evaluation.exportKs')}
                                            />
                                        </div>
                                    </div>
                                )
                            }}
                        />
                    </ButtonGroupRow>
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
                                content: (
                                    <IsvsEvaluationAccordion dataRights={dataRights} entityId={entityId ?? ''} isGlobalAllowed={isGlobalAllowed} />
                                ),
                            },
                            {
                                title: t('evaluation.accordion.services'),
                                content: (
                                    <KSEvaluationAccordion dataRights={dataRights} entityId={entityId ?? ''} isGlobalAllowed={isGlobalAllowed} />
                                ),
                            },
                            {
                                title: t('evaluation.accordion.projects'),
                                content: <></>,
                            },
                            {
                                title: t('evaluation.accordion.activities'),
                                content: <></>,
                            },
                            {
                                title: t('evaluation.accordion.krit'),
                                content: (
                                    <BasicEvaluationAccordion dataRights={dataRights} entityId={entityId ?? ''} isGlobalAllowed={isGlobalAllowed} />
                                ),
                            },
                        ]}
                    />
                    <ExportModal
                        open={openExport.isOpen}
                        type={openExport.type}
                        uuid={entityId ?? ''}
                        onClose={() => {
                            setOpenExport({ isOpen: false, type: EContainerType.KRIS })
                        }}
                        onExport={async (type: string, selectedPo: string[]) => {
                            setOpenExport({ isOpen: false, type: EContainerType.KRIS })
                            setIsLoadingApi(true)
                            exportToFile(type, selectedPo)
                        }}
                    />
                </>
            ) : (
                <></>
            )}
        </QueryFeedback>
    )
}
