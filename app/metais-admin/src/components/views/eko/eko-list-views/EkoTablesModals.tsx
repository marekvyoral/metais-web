import { ConfirmationModal } from '@isdd/idsk-ui-kit/confirmation-modal/ConfirmationDialogModal'
import { EkoCode, EkoCodeList } from '@isdd/metais-common/api/generated/tco-swagger'
import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { ReponseErrorCodeEnum } from '@isdd/metais-common/constants'
import { AdminRouteNames } from '@isdd/metais-common/navigation/routeNames'
import { useActionSuccess } from '@isdd/metais-common/contexts/actionSuccess/actionSuccessContext'

import { TEkoCodeDecorated } from '@/components/views/eko/ekoCodes'
import { IResultApiCall } from '@/components/views/eko/ekoHelpers'

export interface IEkoTableModalsProps {
    invalidateCodes: (ekoCodes: EkoCodeList) => Promise<void>
    deleteCodes: (ekoCodes: EkoCodeList) => Promise<void>
    setLoading: (isLoading: boolean) => void
    setResultApiCall: (data: IResultApiCall) => void
    closeConfirmationModal: () => void
    closeDeleteModal: () => void
    checkedToInvalidate: TEkoCodeDecorated[]
    checkedToDelete: TEkoCodeDecorated[]
    isOpenConfirmationModal: boolean
    isOpenDeleteConfirmationModal: boolean
    setRowSelection: React.Dispatch<React.SetStateAction<Record<string, TEkoCodeDecorated>>>
}

export const EkoTableModals = ({
    isOpenConfirmationModal,
    isOpenDeleteConfirmationModal,
    invalidateCodes,
    deleteCodes,
    setLoading,
    setResultApiCall,
    closeConfirmationModal,
    closeDeleteModal,
    checkedToInvalidate,
    checkedToDelete,
    setRowSelection,
}: IEkoTableModalsProps) => {
    const { t } = useTranslation()

    const getPayloadForHandler = useCallback((codes: TEkoCodeDecorated[]): EkoCodeList => {
        const ekoCodes: Array<EkoCode> = codes.map((code) => code as EkoCode)
        return { ekoCodes: ekoCodes, ekoCodesCount: ekoCodes.length }
    }, [])

    const { setIsActionSuccess, clearAction } = useActionSuccess()

    const getErrorMessage = useCallback(
        (type: string) => {
            switch (type) {
                case ReponseErrorCodeEnum.GNR403:
                    return t(`errors.${ReponseErrorCodeEnum.GNR403}`)
                case ReponseErrorCodeEnum.EKO_CODE_USED:
                    return t(`errors.${ReponseErrorCodeEnum.EKO_CODE_USED}`)
                default:
                    return t(`errors.${ReponseErrorCodeEnum.DEFAULT}`)
            }
        },
        [t],
    )

    const handlerInvalidateCodes = useCallback(
        async (codes: TEkoCodeDecorated[]) => {
            await invalidateCodes(getPayloadForHandler(codes))
                .then(() => {
                    setIsActionSuccess({ value: true, path: AdminRouteNames.EKO, additionalInfo: { type: 'invalidate' } })
                    setRowSelection([])
                })
                .catch((mutationError) => {
                    clearAction()
                    const errorResponse = JSON.parse(mutationError.message)
                    setResultApiCall({
                        isError: true,
                        isSuccess: false,
                        message: getErrorMessage(errorResponse.type),
                    })
                })
                .finally(() => {
                    setLoading(false)
                })
        },
        [clearAction, getErrorMessage, getPayloadForHandler, invalidateCodes, setIsActionSuccess, setLoading, setResultApiCall, setRowSelection],
    )

    const handlerDeleteCodes = useCallback(
        async (codes: TEkoCodeDecorated[]) => {
            await deleteCodes(getPayloadForHandler(codes))
                .then(() => {
                    setIsActionSuccess({ value: true, path: AdminRouteNames.EKO, additionalInfo: { type: 'delete' } })
                    setRowSelection([])
                })
                .catch((mutationError) => {
                    clearAction()
                    const errorResponse = JSON.parse(mutationError.message)
                    setResultApiCall({
                        isError: true,
                        isSuccess: false,
                        message: getErrorMessage(errorResponse.type),
                    })
                })
                .finally(() => {
                    setLoading(false)
                })
        },
        [clearAction, deleteCodes, getErrorMessage, getPayloadForHandler, setIsActionSuccess, setLoading, setResultApiCall, setRowSelection],
    )

    const handleCancelConfirmationModal = () => {
        closeConfirmationModal()
    }
    const handleOkConfirmationModal = () => {
        setLoading(true)
        closeConfirmationModal()
        handlerInvalidateCodes(checkedToInvalidate)
    }

    const handleCancelDeleteConfirmationModal = () => {
        closeDeleteModal()
    }
    const handleOkDeleteConfirmationModal = () => {
        setLoading(true)
        closeDeleteModal()
        handlerDeleteCodes(checkedToDelete)
    }
    return (
        <>
            <ConfirmationModal
                isOpen={isOpenConfirmationModal}
                title={t('eko.invalidateModalTitle')}
                content={
                    <div>
                        {t('eko.invalidateModalContent')}
                        <ul>
                            {checkedToInvalidate.map((code) => {
                                return <li key={code.ekoCode}>{`${code.ekoCode} - ${code.name}`}</li>
                            })}
                        </ul>
                    </div>
                }
                okButtonLabel={t('eko.invalidateModalOkButtonLabel')}
                onClose={handleCancelConfirmationModal}
                onConfirm={handleOkConfirmationModal}
            />
            <ConfirmationModal
                isOpen={isOpenDeleteConfirmationModal}
                title={t('eko.deleteModalTitle')}
                content={
                    <div>
                        {t('eko.deleteModalContent')}
                        <ul>
                            {checkedToDelete.map((code) => {
                                return <li key={code.ekoCode}>{`${code.ekoCode} - ${code.name}`}</li>
                            })}
                        </ul>
                    </div>
                }
                okButtonLabel={t('eko.deleteModalOkButtonLabel')}
                onClose={handleCancelDeleteConfirmationModal}
                onConfirm={handleOkDeleteConfirmationModal}
            />
        </>
    )
}
