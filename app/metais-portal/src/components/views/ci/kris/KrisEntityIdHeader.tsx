import { ButtonGroupRow, ButtonPopup, LoadingIndicator, TextHeading, TextWarning } from '@isdd/idsk-ui-kit'
import { ButtonLink } from '@isdd/idsk-ui-kit/button-link/ButtonLink'
import { Tooltip } from '@isdd/idsk-ui-kit/tooltip/Tooltip'
import {
    ApiError,
    ConfigurationItemUi,
    ConfigurationItemUiAttributes,
    getReadNeighboursConfigurationItemsQueryKey,
    useGetRequestStatusHook,
    useGetRoleParticipant,
    useGetUuidHook,
    useReadCiHistoryVersionsHook,
    useReadCiList1Hook,
    useReadNeighboursConfigurationItems,
} from '@isdd/metais-common/api/generated/cmdb-swagger'
import { Role, useAddOrGetGroupHook, useFindAll11Hook, useIsInPoByGidHook, useIsOwnerByGid } from '@isdd/metais-common/api/generated/iam-swagger'
import {
    GraphRequestUi,
    useGetKris,
    useRecycleConfigurationItemBiznisMdulesHook,
    useStoreRequestHook,
} from '@isdd/metais-common/api/generated/kris-swagger'
import { useGetKrisFuturePdfHook } from '@isdd/metais-common/api/generated/pdf-creator'
import { IApproveFormData, useUpdateKirtColumnsHook } from '@isdd/metais-common/api/userConfigKvKrit'
import { downloadBlobAsFile } from '@isdd/metais-common/componentHelpers/download/downloadHelper'
import styles from '@isdd/metais-common/components/entity-header/ciEntityHeader.module.scss'
import { useAuth } from '@isdd/metais-common/contexts/auth/authContext'
import { Can } from '@isdd/metais-common/hooks/permissions/useAbilityContext'
import { Actions } from '@isdd/metais-common/hooks/permissions/useUserAbility'
import { IBulkActionResult, useBulkAction } from '@isdd/metais-common/hooks/useBulkAction'
import { useScroll } from '@isdd/metais-common/hooks/useScroll'
import { ATTRIBUTE_NAME, InvalidateBulkModal, MutationFeedback } from '@isdd/metais-common/index'
import { QueryObserverResult, RefetchOptions, RefetchQueryFilters, useQueryClient } from '@tanstack/react-query'
import classNames from 'classnames'
import React, { useCallback, useEffect, useState } from 'react'
import { FieldValues } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { ReValidateModal } from './Modals/ReValidateModal'

import {
    FILTER_PARAM,
    createNewKrisAttributes,
    getBaseGraphApprove,
    getBaseGraphReturnToWorkout,
    getBaseGraphSendToApproving,
    getOriginalOwner,
} from '@/components/views/ci/kris/KrisEntityHelper'
import { ApproveModal } from '@/components/views/ci/kris/Modals/ApproveModal'
import { GeneratePdfModal, IGeneratePdfFormData } from '@/components/views/ci/kris/Modals/GeneratePdfModal'
import { IReturnToWorkoutFormData, ReturnToWorkoutModal } from '@/components/views/ci/kris/Modals/ReturnToWorkoutModal'
import { useOutletContext } from '@/pages/ci/KRIS/[entityId]'

interface Props {
    entityName: string
    entityId: string
    entityItemName: string
    entityData?: ConfigurationItemUi
    isInvalidated: boolean
    refetchCi: <TPageData>(
        options?: (RefetchOptions & RefetchQueryFilters<TPageData>) | undefined,
    ) => Promise<QueryObserverResult<ConfigurationItemUi, ApiError>>
    isRelation?: boolean
    isEvaluation: boolean
    editButton: React.ReactNode
}

export const KrisEntityIdHeader: React.FC<Props> = ({
    entityData,
    entityId,
    entityItemName,
    isInvalidated,
    refetchCi,
    isRelation,
    editButton,
    isEvaluation,
}) => {
    const { t } = useTranslation()
    const {
        state: { user, token },
    } = useAuth()
    const { updateButton } = useOutletContext()
    const queryClient = useQueryClient()

    const { handleInvalidate, errorMessage, isBulkLoading } = useBulkAction(isRelation)
    const updateProtokol = useUpdateKirtColumnsHook()
    const approveKris = useStoreRequestHook()
    const getCiListFIltered = useReadCiList1Hook()
    const getFindRole = useFindAll11Hook()
    const createGroup = useAddOrGetGroupHook()
    const getHistoryVersions = useReadCiHistoryVersionsHook()
    const generateUuid = useGetUuidHook()
    const getRequestStatus = useGetRequestStatusHook()
    const isInPoByGid = useIsInPoByGidHook()
    const createPdf = useGetKrisFuturePdfHook()
    const reValidateCi = useRecycleConfigurationItemBiznisMdulesHook()
    const { wrapperRef, scrollToMutationFeedback } = useScroll()

    const [showInvalidate, setShowInvalidate] = useState<boolean>(false)
    const [showGeneratePdf, setGeneratePdf] = useState<boolean>(false)
    const [showApprove, setShowApprove] = useState<boolean>(false)
    const [showRevalidate, setRevalidate] = useState<boolean>(false)
    const [showReturnToWorkout, setShowReturnToWorkout] = useState<boolean>(false)
    const [isPdfDisabled, setIsPdfDisabled] = useState<boolean | undefined>(undefined)
    const [isLoadingApi, setIsLoadingApi] = useState<boolean>(false)
    const [isError, setIsError] = useState<boolean>(false)
    const [showWarning, setShowWarning] = useState<boolean>(false)
    const [succesMessage, setSuccesMessage] = useState<string | undefined>(undefined)
    const [bulkActionResult, setBulkActionResult] = useState<IBulkActionResult>()

    const entityListData = entityData ? [entityData] : []
    const {
        data: dataNeighbours,
        isLoading: isLoadingNeighbours,
        isError: isErrorNeighbours,
    } = useReadNeighboursConfigurationItems(entityId, { nodeType: 'Dokument', relationshipType: 'Dokument_sa_tyka_KRIS' })
    const { data: dataKris, isLoading: isLoadingKris } = useGetKris(entityData?.uuid ?? '')
    const { data: isOwnerByGid } = useIsOwnerByGid(
        {
            gids: [entityData?.metaAttributes?.owner ?? ''],
            login: user?.login,
        },
        { query: { enabled: entityData?.metaAttributes?.owner !== undefined && token !== null && !!user?.uuid } },
    )
    const { data: dataPoRole, isLoading: isLoadingDataPoRole } = useGetRoleParticipant(entityData?.metaAttributes?.owner ?? '')

    const handleBulkAction = (actionResult: IBulkActionResult) => {
        setBulkActionResult(actionResult)
        refetchCi()
    }

    const handleCloseBulkModal = (actionResult: IBulkActionResult, closeFunction: (value: React.SetStateAction<boolean>) => void) => {
        closeFunction(false)
        handleBulkAction(actionResult)
    }

    const handleSave = (formData: FieldValues, close: (val: boolean) => void) => {
        setIsLoadingApi(true)
        setShowApprove(false)
        updateProtokol(`KRIS/${entityId}/protocol?shared=true&`, formData)
            .then(() => {
                close(true)
                setShowApprove(false)
                setSuccesMessage(t('feedback.approveSaved'))
            })
            .catch(() => {
                close(false)
            })
            .finally(() => {
                setIsLoadingApi(false)
            })
    }

    useEffect(() => {
        scrollToMutationFeedback()
    }, [bulkActionResult, scrollToMutationFeedback])

    const canApproveAsOwner = () => {
        const typeOfPO = dataPoRole?.configurationItemUi?.attributes?.[ATTRIBUTE_NAME.EA_Profil_PO_typ_osoby]
        const stateOfKris = entityData?.attributes?.[ATTRIBUTE_NAME.Profil_KRIS_stav_kris]
        const allowedStateOfKris = stateOfKris === 'c_stav_kris.1' || stateOfKris === 'c_stav_kris.4'

        if (allowedStateOfKris && typeOfPO === 'c_typ_osoby.c1' && isOwnerByGid?.isOwner?.[0]?.owner) {
            return true
        }
        return false
    }

    const canSignDoc = (type: string) => {
        const canSign =
            dataNeighbours?.fromCiSet?.some((item) =>
                item?.attributes?.some(
                    (element: ConfigurationItemUiAttributes) =>
                        element.name === ATTRIBUTE_NAME.Gen_Profil_kod_metais && element?.value?.startsWith(type),
                ),
            ) ?? false

        return canSign
    }

    const disableGeneratePdf = useCallback(
        async (newCi: ConfigurationItemUi | undefined) => {
            if (!dataPoRole) return true

            const res = await isInPoByGid({
                identityUuid: user?.uuid,
                cmdbId: dataPoRole?.configurationItemUi?.uuid,
            })
            let att = false
            if (newCi) {
                att = newCi.attributes?.[ATTRIBUTE_NAME.Profil_KRIS_Zavazok_ciele_principy_stav] === true
            } else {
                att = entityData?.attributes?.[ATTRIBUTE_NAME.Profil_KRIS_Zavazok_ciele_principy_stav] === true
            }
            return res === false || att === false
            // eslint-disable-next-line react-hooks/exhaustive-deps
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [dataPoRole, updateButton],
    )

    const canShowGeneratePdf = () => {
        return !isInvalidated
    }

    const canShowSignDoc = () => {
        return !isInvalidated && canSignDoc('KRIS export ')
    }

    const canShowSignDocFuture = () => {
        return !isInvalidated && canSignDoc('KRIS future state export ')
    }

    const canApprove = () => {
        return !isInvalidated && (entityData?.attributes?.[ATTRIBUTE_NAME.Profil_KRIS_stav_kris] === 'c_stav_kris.3' || canApproveAsOwner())
    }

    const canReValidate = () => {
        return isInvalidated && (isOwnerByGid?.isOwner?.[0]?.owner || user?.roles?.includes('R_ADMIN'))
    }

    const canInvalidate = () => {
        return !isInvalidated && (isOwnerByGid?.isOwner?.[0]?.owner || user?.roles?.includes('R_ADMIN'))
    }

    const canReturnToWorkout = () => {
        const manualApprove = dataKris?.manualApproved

        return !isInvalidated && !manualApprove && entityData?.attributes?.[ATTRIBUTE_NAME.Profil_KRIS_stav_kris] === 'c_stav_kris.3'
    }

    const canSendToApprove = () => {
        const stateOfKris = entityData?.attributes?.[ATTRIBUTE_NAME.Profil_KRIS_stav_kris]
        const allowedStateOfKris = stateOfKris === 'c_stav_kris.1' || stateOfKris === 'c_stav_kris.4'

        return !isInvalidated && !canApproveAsOwner() && allowedStateOfKris
    }

    const approveAndSubmitProtocolWithoutChangingOwner = async (
        formData: IApproveFormData,
        protocolUuid: string,
        relationUuid: string,
        close: (val: boolean) => void,
    ) => {
        try {
            const roleRes = await getFindRole({ name: 'KRIS_SCHVAL' })
            const role = roleRes as Role

            const groupRes = await createGroup(role?.uuid ?? '', dataPoRole?.configurationItemUi?.uuid ?? '')
            const storeGraphRequest = {
                ...getBaseGraphApprove(
                    groupRes.gid ?? '',
                    entityData?.metaAttributes?.owner ?? '',
                    formData,
                    protocolUuid,
                    relationUuid,
                    entityData?.metaAttributes,
                ),
                changeOwnerSet: {},
            }

            await approveKris(storeGraphRequest)
            setSuccesMessage(t('ciType.approveSuccess'))
            await refetchCi()
            close(true)
        } catch (error) {
            setIsError(true)
            close(false)
        } finally {
            queryClient.invalidateQueries(getReadNeighboursConfigurationItemsQueryKey(entityId, { nodeType: 'KRIS_Protokol' }))
            setIsLoadingApi(false)
        }
    }

    const approveAndSubmitProtocolWithChangingOwner = async (
        formData: IApproveFormData,
        protocolUuid: string,
        relationUuid: string,
        close: (val: boolean) => void,
    ) => {
        setIsLoadingApi(true)
        try {
            const akvsRes = await getCiListFIltered(FILTER_PARAM)
            const akvs = akvsRes?.configurationItemSet?.[0]

            const roleRes = await getFindRole({ name: 'KRIS_SCHVAL' })
            const role = roleRes as Role

            const groupRes = await createGroup(role?.uuid ?? '', akvs?.uuid ?? '')
            const historyRes = await getHistoryVersions(entityId, { page: 1, perPage: 100 })
            const originalOwner = getOriginalOwner(historyRes, entityData)

            const storeGraphRequest = {
                ...getBaseGraphApprove(groupRes.gid ?? '', originalOwner, formData, protocolUuid, relationUuid, entityData),
                changeOwnerSet: {
                    configurationItemSet: [
                        {
                            type: entityData?.type,
                            uuid: entityData?.uuid,
                            attributes: createNewKrisAttributes(entityData),
                        },
                    ],
                    relationshipSet: [],
                    changeOwnerData: {
                        newOwner: originalOwner,
                        changeReason: 'Schválenie KRIS',
                        changeDescription: 'Schválenie KRIS',
                        changeType: 'changeCmdbItem',
                    },
                },
            } as GraphRequestUi

            await approveKris(storeGraphRequest)
            setSuccesMessage(t('feedback.approveSuccess'))
            await refetchCi()
            close(true)
        } catch (error) {
            setIsError(true)
            close(false)
        } finally {
            queryClient.invalidateQueries(getReadNeighboursConfigurationItemsQueryKey(entityId, { nodeType: 'KRIS_Protokol' }))
            setIsLoadingApi(false)
        }
    }

    const handleApprove = (formData: FieldValues, close: (val: boolean) => void) => {
        setShowApprove(true)
        generateUuid().then((protocolUuid) => {
            generateUuid().then((relationUuid) => {
                if (canApproveAsOwner()) {
                    approveAndSubmitProtocolWithoutChangingOwner(formData, protocolUuid, relationUuid, close)
                } else {
                    approveAndSubmitProtocolWithChangingOwner(formData, protocolUuid, relationUuid, close)
                }
            })
        })
    }

    const handleGeneratePdf = async (formData: IGeneratePdfFormData) => {
        setIsLoadingApi(true)
        setGeneratePdf(false)
        setShowWarning(true)

        const projektsUuids = formData.project?.map((item) => item.uuid) as string[]
        const isvsUuids = formData.isvs?.map((item) => item.uuid) as string[]
        try {
            const dataFile = (await createPdf(entityId, {
                allIsvs: !isvsUuids,
                allProjects: !projektsUuids,
                isvsIds: isvsUuids,
                projectIds: projektsUuids,
            })) as unknown as Blob

            downloadBlobAsFile(new Blob([dataFile]), `KRIS_buduci_stav_${entityData?.attributes?.[ATTRIBUTE_NAME.Gen_Profil_kod_metais]}.pdf`, false)
        } catch (error) {
            setIsError(true)
        } finally {
            setIsLoadingApi(false)
        }
    }

    const handleRevvalidate = async () => {
        setRevalidate(false)
        setIsLoadingApi(true)
        try {
            await reValidateCi(entityId)
            setSuccesMessage(t('feedback.sendToRevalidate'))
            await refetchCi()
        } catch (error) {
            setIsError(true)
        } finally {
            setIsLoadingApi(false)
        }
    }

    const handleReturnToWorkout = async (formData: IReturnToWorkoutFormData) => {
        setIsLoadingApi(true)
        setShowReturnToWorkout(false)
        try {
            const protocolUuid = await generateUuid()
            const relationUuid = await generateUuid()
            const akvsRes = await getCiListFIltered(FILTER_PARAM)
            const akvs = akvsRes?.configurationItemSet?.[0]

            const roleRes = await getFindRole({ name: 'KRIS_SCHVAL' })
            const role = roleRes as Role

            const groupRes = await createGroup(role?.uuid ?? '', akvs?.uuid ?? '')
            const historyRes = await getHistoryVersions(entityId, { page: 1, perPage: 100 })
            const originalOwner = getOriginalOwner(historyRes, entityData)
            const storeGraphRequest = getBaseGraphReturnToWorkout(groupRes.gid ?? '', originalOwner, formData, protocolUuid, relationUuid, entityData)

            await approveKris(storeGraphRequest)
            setSuccesMessage(t('feedback.returnToWorkSuccess'))
            await refetchCi()
        } catch (error) {
            setIsError(true)
        } finally {
            setIsLoadingApi(false)
        }
    }

    const handleSendToApproving = async () => {
        setIsLoadingApi(true)
        try {
            const akvsRes = await getCiListFIltered(FILTER_PARAM)
            const akvs = akvsRes?.configurationItemSet?.[0]

            const roleRes = await getFindRole({ name: 'KRIS_SCHVAL' })
            const role = roleRes as Role

            const groupRes = await createGroup(role?.uuid ?? '', akvs?.uuid ?? '')
            const storeGraphRequest = getBaseGraphSendToApproving(groupRes.gid ?? '', entityData)

            const request = await approveKris(storeGraphRequest)
            await getRequestStatus(request.requestId ?? '')

            setSuccesMessage(t('feedback.sendToApprover'))
            await refetchCi()
        } catch (error) {
            setIsError(true)
        } finally {
            setIsLoadingApi(false)
        }
    }

    const handleSignDoc = async () => {
        return
    }

    const handleSignDocFuture = async () => {
        return
    }

    useEffect(() => {
        const fetchDisabledStatus = async () => {
            const newCi = (await refetchCi()).data

            const status = await disableGeneratePdf(newCi)
            setIsPdfDisabled(status)
        }
        fetchDisabledStatus()
    }, [disableGeneratePdf, queryClient, refetchCi, updateButton])

    const isLoading = [isBulkLoading, isLoadingApi, isLoadingNeighbours, isLoadingDataPoRole, isLoadingKris].some((item) => item)

    return (
        <>
            <div ref={wrapperRef}>
                <MutationFeedback
                    success={bulkActionResult?.isSuccess}
                    successMessage={bulkActionResult?.successMessage}
                    error={bulkActionResult?.isError || isError}
                    onMessageClose={() => setBulkActionResult(undefined)}
                />
            </div>
            <MutationFeedback
                success={succesMessage !== undefined}
                successMessage={succesMessage}
                error={isError || isErrorNeighbours}
                onMessageClose={() => setSuccesMessage(undefined)}
            />
            {showWarning && <TextWarning>{t('modalKris.generatePdf.docGenStart')}</TextWarning>}
            <div className={styles.headerDiv}>
                {isLoading && <LoadingIndicator fullscreen />}
                <TextHeading size="XL" className={classNames({ [styles.invalidated]: isInvalidated })}>
                    {entityItemName}
                </TextHeading>
                <ButtonGroupRow>
                    <Can I={Actions.EDIT} a={`ci.${entityId}`}>
                        {editButton}
                    </Can>
                    <ButtonPopup
                        buttonClassName={styles.noWrap}
                        buttonLabel={t('ciType.moreButton')}
                        popupPosition="right"
                        popupContent={() => {
                            return (
                                <div className={styles.buttonLinksDiv}>
                                    {canShowGeneratePdf() && (
                                        <Tooltip
                                            disabled={!isPdfDisabled}
                                            key={'pdfGenerateFuture'}
                                            descriptionElement={t('tooltip.NO_FUTURE_PDF_GOALS')}
                                            position={'top center'}
                                            tooltipContent={() => (
                                                <ButtonLink
                                                    disabled={isPdfDisabled}
                                                    onClick={() => {
                                                        setGeneratePdf(true)
                                                    }}
                                                    label={t('ciType.pdfGenerateFuture')}
                                                />
                                            )}
                                        />
                                    )}
                                    {canInvalidate() && (
                                        <Tooltip
                                            key={'invalidateItem'}
                                            descriptionElement={errorMessage}
                                            position={'top center'}
                                            tooltipContent={(open) => (
                                                <ButtonLink
                                                    disabled={isInvalidated}
                                                    onClick={() => handleInvalidate(entityListData, () => setShowInvalidate(true), open)}
                                                    label={t('ciType.invalidateItem')}
                                                />
                                            )}
                                        />
                                    )}
                                    {canReValidate() && (
                                        <Tooltip
                                            key={'reInvalidateCi'}
                                            descriptionElement={errorMessage}
                                            position={'top center'}
                                            tooltipContent={() => (
                                                <ButtonLink
                                                    disabled={!isInvalidated}
                                                    onClick={() => setRevalidate(true)}
                                                    label={t('ciType.reInvalidateCi')}
                                                />
                                            )}
                                        />
                                    )}
                                    <Can I={Actions.APPROVE_KRIS} a={`ci.${entityId}`}>
                                        {canApprove() && (
                                            <Tooltip
                                                key={'approve'}
                                                descriptionElement={errorMessage}
                                                position={'top center'}
                                                tooltipContent={() => (
                                                    <ButtonLink
                                                        disabled={!isOwnerByGid?.isOwner?.[0]?.owner}
                                                        onClick={() => setShowApprove(true)}
                                                        label={t('ciType.approve')}
                                                    />
                                                )}
                                            />
                                        )}
                                    </Can>

                                    {canReturnToWorkout() && (
                                        <Tooltip
                                            key={'return_to_workout'}
                                            descriptionElement={errorMessage}
                                            position={'top center'}
                                            tooltipContent={() => (
                                                <ButtonLink
                                                    disabled={!isEvaluation}
                                                    onClick={() => setShowReturnToWorkout(true)}
                                                    label={t('ciType.return_to_workout')}
                                                />
                                            )}
                                        />
                                    )}
                                    <Can I={Actions.KRIS_SEND_APPROVING} a={`ci.${entityId}`}>
                                        {canSendToApprove() && (
                                            <Tooltip
                                                key={'sentToApprove'}
                                                descriptionElement={errorMessage}
                                                position={'top center'}
                                                tooltipContent={() => (
                                                    <ButtonLink
                                                        disabled={!isOwnerByGid?.isOwner?.[0]?.owner}
                                                        onClick={handleSendToApproving}
                                                        label={t('ciType.sendToApprove')}
                                                    />
                                                )}
                                            />
                                        )}
                                    </Can>
                                    <Can I={Actions.KRIS_SUBSCRIBE} a={`ci.${entityId}`}>
                                        {canShowSignDoc() && (
                                            <Tooltip
                                                key={'signDocument'}
                                                descriptionElement={errorMessage}
                                                position={'top center'}
                                                tooltipContent={() => (
                                                    <ButtonLink
                                                        disabled={!isOwnerByGid?.isOwner?.[0]?.owner}
                                                        onClick={handleSignDoc}
                                                        label={t('ciType.signDocument')}
                                                    />
                                                )}
                                            />
                                        )}
                                    </Can>
                                    <Can I={Actions.KRIS_SUBSCRIBE} a={`ci.${entityId}`}>
                                        {canShowSignDocFuture() && (
                                            <Tooltip
                                                key={'signDocumentFuture'}
                                                descriptionElement={errorMessage}
                                                position={'top center'}
                                                tooltipContent={() => (
                                                    <ButtonLink
                                                        disabled={!isOwnerByGid?.isOwner?.[0]?.owner}
                                                        onClick={handleSignDocFuture}
                                                        label={t('ciType.signDocumentFuture')}
                                                    />
                                                )}
                                            />
                                        )}
                                    </Can>
                                </div>
                            )
                        }}
                    />
                </ButtonGroupRow>
                <GeneratePdfModal
                    open={showGeneratePdf}
                    orgId={entityId}
                    onClose={() => {
                        setGeneratePdf(false)
                    }}
                    onSend={(formData) => {
                        handleGeneratePdf(formData)
                    }}
                />
                <ReturnToWorkoutModal
                    open={showReturnToWorkout}
                    onClose={() => {
                        setShowReturnToWorkout(false)
                    }}
                    onSend={(formData) => handleReturnToWorkout(formData)}
                />
                <ReValidateModal
                    open={showRevalidate}
                    onClose={() => {
                        setRevalidate(false)
                    }}
                    onSend={handleRevvalidate}
                />
                <ApproveModal
                    user={user}
                    uuid={entityId}
                    open={showApprove}
                    onClose={() => {
                        setShowApprove(false)
                    }}
                    onSave={(formData: FieldValues, close: (val: boolean) => void) => handleSave(formData, close)}
                    onApproveKris={(formData, close: (val: boolean) => void) => handleApprove(formData, close)}
                />
                <InvalidateBulkModal
                    items={entityListData}
                    open={showInvalidate}
                    onSubmit={(actionResponse) => handleCloseBulkModal(actionResponse, setShowInvalidate)}
                    onClose={() => setShowInvalidate(false)}
                    isRelation={isRelation}
                />
            </div>
        </>
    )
}
