import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { useBulkActionHelpers } from './useBulkActionHelpers'
import { useAddFavorite } from './useAddFavorite'

import { ApiError, ConfigurationItemUi, useReadCiNeighboursHook } from '@isdd/metais-common/api/generated/cmdb-swagger'
import { Confirm200, ReturnProject200, useConfirm, useReturnProject } from '@isdd/metais-common/api/generated/kris-swagger'
import { APPROVAL_PROCESS, ATTRIBUTE_NAME, PROJECT_STATE_ENUM } from '@isdd/metais-common/index'
import { ENTITY_AS, ENTITY_KS } from '@isdd/metais-common/constants'
import { FollowedItemItemType } from '@isdd/metais-common/api/generated/user-config-swagger'

export interface IBulkActionResult {
    isSuccess: boolean
    isError: boolean
    successMessage?: string
    errorMessage?: string
    additionalInfo?: { [key: string]: string }
}

export const useBulkAction = (isRelation?: boolean) => {
    const { t } = useTranslation()

    const { bulkCheck, bulkRelationCheck, checkChangeOfOwner, ciInvalidFilter, hasOwnerRights } = useBulkActionHelpers()
    const { addFavoriteAsync } = useAddFavorite()

    const [errorMessage, setErrorMessage] = useState<string | undefined>()
    const [isBulkLoading, setBulkLoading] = useState<boolean>(false)

    const { mutateAsync: confirmProjectMutate } = useConfirm()
    const { mutateAsync: mutateReturnProject } = useReturnProject()
    const getCiNeighbours = useReadCiNeighboursHook()

    const handleInvalidate = async (items: ConfigurationItemUi[], onSuccess: () => void, onError: () => void, isDocTypeValid?: boolean) => {
        setBulkLoading(true)
        const isValid = items.every((item) => !ciInvalidFilter(item))

        if (!isValid) {
            setBulkLoading(false)
            setErrorMessage(t('tooltip.rights.invalidSelectedList'))
            return onError()
        }

        if (isDocTypeValid !== undefined && !isDocTypeValid) {
            setErrorMessage(t('tooltip.rights.missingPermission'))
            setBulkLoading(false)
            return onError()
        }
        try {
            const hasRights = await hasOwnerRights(items)

            if (hasRights) {
                setErrorMessage(undefined)
                return onSuccess()
            } else {
                setBulkLoading(false)
                setErrorMessage(t('tooltip.rights.missingPermission'))
                return onError()
            }
        } catch (e) {
            setErrorMessage(t('tooltip.rights.notFoundPO'))
            return onError()
        } finally {
            setBulkLoading(false)
        }
    }

    const handleDeleteFile = async (items: ConfigurationItemUi[], onSuccess: () => void, onError: () => void, isDocTypeValid?: boolean) => {
        setBulkLoading(true)

        if (isDocTypeValid !== undefined && !isDocTypeValid) {
            setErrorMessage(t('tooltip.rights.missingPermission'))
            setBulkLoading(false)
            return onError()
        }
        try {
            const hasRights = await hasOwnerRights(items)

            if (hasRights) {
                setErrorMessage(undefined)
                return onSuccess()
            } else {
                setBulkLoading(false)
                setErrorMessage(t('tooltip.rights.missingPermission'))
                return onError()
            }
        } catch (e) {
            setErrorMessage(t('tooltip.rights.notFoundPO'))
            return onError()
        } finally {
            setBulkLoading(false)
        }
    }

    const handleUpdateFile = async (items: ConfigurationItemUi[], onSuccess: () => void, onError: () => void) => {
        setBulkLoading(true)
        try {
            const hasRights = await hasOwnerRights(items)

            if (hasRights) {
                setErrorMessage(undefined)
                return onSuccess()
            } else {
                setBulkLoading(false)
                setErrorMessage(t('tooltip.rights.missingPermission'))
                return onError()
            }
        } catch (e) {
            setErrorMessage(t('tooltip.rights.notFoundPO'))
            return onError()
        } finally {
            setBulkLoading(false)
        }
    }

    const handleReInvalidate = async (items: ConfigurationItemUi[], onSuccess: () => void, onError: () => void) => {
        setBulkLoading(true)
        const isValid = items.every((item) => ciInvalidFilter(item))
        if (!isValid) {
            setErrorMessage(t('tooltip.rights.validSelectedList'))
            setBulkLoading(false)
            return onError()
        }

        let canReInvalidate = undefined
        if (isRelation) {
            canReInvalidate = await bulkRelationCheck(items)
        } else {
            canReInvalidate = await bulkCheck(items)
        }

        setBulkLoading(false)
        if (canReInvalidate) {
            setErrorMessage(undefined)
            return onSuccess()
        } else return setErrorMessage(t('tooltip.rights.missingPermission'))
    }

    const handleChangeOwner = async (items: ConfigurationItemUi[], onSuccess: () => void, onError: () => void) => {
        setBulkLoading(true)
        const isValid = !items.every((item) => ciInvalidFilter(item))

        if (!isValid) {
            setErrorMessage(t('tooltip.rights.invalidSelectedList'))
            setBulkLoading(false)
            return onError()
        }

        const ownerGids = await checkChangeOfOwner(items)

        const hasRights = items.every(function (item) {
            return ownerGids[item.metaAttributes?.owner ?? '']
        })
        setBulkLoading(false)
        if (hasRights) {
            setErrorMessage(undefined)
            return onSuccess()
        } else {
            setErrorMessage(t('tooltip.rights.missingPermission'))
            return onError()
        }
    }

    const confirmProjectApproved = async (
        uuid: string,
        order: number,
        approvalProcess: string,
        handleResult: (actionResult: IBulkActionResult) => void,
    ) => {
        setBulkLoading(true)
        await confirmProjectMutate(
            { uuid, params: { order, approvalProcess } },
            {
                onSuccess: (data: Confirm200) => {
                    if (data.newStatus === PROJECT_STATE_ENUM.c_stav_projektu_5) {
                        handleResult({ isSuccess: true, isError: false, successMessage: t('ciType.messages.successReturned') })
                    } else {
                        handleResult({ isSuccess: true, isError: false, successMessage: t('ciType.messages.success') })
                    }
                },
                onError: (error: ApiError) => {
                    const errorData = JSON.parse(error.message ?? '')
                    let m = 'ciType.messages.error'
                    if (errorData.message === 'not_created_documents') {
                        m = 'ciType.messages.errorDocuments'
                    } else if (errorData.message === 'not_created_relations') {
                        m = 'ciType.messages.errorRelations'
                    } else if (errorData.message === 'not_approved_ks') {
                        m = 'ciType.messages.errorNotApprovedKS'
                    } else if (errorData.message === 'not_allowed_approve') {
                        m = 'ciType.messages.errorNotAllowedApprove'
                    }
                    return handleResult({ isSuccess: false, isError: true, errorMessage: t(m) })
                },
                onSettled: () => setBulkLoading(false),
            },
        )
    }

    const handleConfirmProject = async (
        order: number,
        entityData: ConfigurationItemUi,
        handleResult: (actionResult: IBulkActionResult) => void,
        onError: () => void,
    ) => {
        const projectStatus = entityData?.attributes?.[ATTRIBUTE_NAME.EA_Profil_Projekt_status]
        const typeOfApprovalProcess =
            entityData?.attributes?.[ATTRIBUTE_NAME.EA_Profil_Projekt_schvalovaci_proces] ?? APPROVAL_PROCESS.OPTIONAL_APPROVAL

        if ((projectStatus === PROJECT_STATE_ENUM.c_stav_projektu_4 || projectStatus == PROJECT_STATE_ENUM.c_stav_projektu_11) && order == 0) {
            if (
                !entityData?.attributes?.[ATTRIBUTE_NAME.Financny_Profil_Projekt_schvalene_rocne_naklady] &&
                !entityData?.attributes?.[ATTRIBUTE_NAME.Financny_Profil_Projekt_schvaleny_rozpocet]
            ) {
                setErrorMessage(t('ciType.actions.error.approvedBudget'))
                return onError()
            } else {
                confirmProjectApproved(entityData?.uuid ?? '', order, typeOfApprovalProcess, handleResult)
            }
        } else {
            confirmProjectApproved(entityData?.uuid ?? '', order, typeOfApprovalProcess, handleResult)
        }
    }

    const handleProjectReturn = async (entityId: string, handleResult: (actionResult: IBulkActionResult) => void) => {
        setBulkLoading(true)
        await mutateReturnProject(
            { uuid: entityId },
            {
                onSuccess: (data: ReturnProject200) => {
                    if (data.newStatus === PROJECT_STATE_ENUM.c_stav_projektu_7)
                        handleResult({ isSuccess: true, isError: false, successMessage: t('ciType.messages.successProjectCanceled') })
                    else handleResult({ isSuccess: true, isError: false, successMessage: t('ciType.messages.successProjectReturn') })
                },
                onError: () => {
                    handleResult({ isSuccess: false, isError: true, errorMessage: t('ciType.messages.error') })
                },
                onSettled: () => setBulkLoading(false),
            },
        )
    }

    const handleClone = async (entityData: ConfigurationItemUi | undefined, onSuccess: () => void, onError: () => void) => {
        setBulkLoading(true)

        if (entityData && ciInvalidFilter(entityData)) {
            setErrorMessage(t('tooltip.rights.invalidItem'))
            setBulkLoading(false)
            return onError()
        }

        try {
            const result = await getCiNeighbours(entityData?.uuid ?? '', {
                neighboursFilter: {
                    metaAttributes: { state: ['DRAFT'] },
                    relType: ['AS_ma_verziu_AS', 'KS_prenajima_KS', 'KS_realizuje_KS'],
                    ciType: [ENTITY_AS, ENTITY_KS],
                },
                page: 1,
                perpage: 10,
            })

            if (result.toNodes?.pagination?.totaltems === 0) {
                setErrorMessage(undefined)
                return onSuccess()
            } else {
                setErrorMessage(t('tooltip.rights.notToClone'))
                setBulkLoading(false)
                return onError()
            }
        } catch {
            setErrorMessage(t('feedback.queryErrorTitle'))
            setBulkLoading(false)
            return onError()
        }
    }

    const handleAddToFavorite = async (ids: string[], type: FollowedItemItemType, onSuccess: (result: IBulkActionResult) => void) => {
        setBulkLoading(true)
        addFavoriteAsync(ids, type)
            .then(() => {
                return onSuccess({
                    isSuccess: true,
                    isError: false,
                    successMessage: t('userProfile.notifications.feedback.addSuccess', { count: ids.length }),
                })
            })
            .catch(() => {
                return onSuccess({ isSuccess: false, isError: true, errorMessage: t('feedback.queryErrorTitle') })
            })
            .finally(() => {
                setBulkLoading(false)
            })
    }

    return {
        errorMessage,
        isBulkLoading,
        handleInvalidate,
        handleReInvalidate,
        handleChangeOwner,
        handleDeleteFile,
        handleUpdateFile,
        handleConfirmProject,
        handleProjectReturn,
        handleClone,
        handleAddToFavorite,
    }
}
