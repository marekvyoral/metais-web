import { ConfirmationModal } from '@isdd/idsk-ui-kit/confirmation-modal/ConfirmationDialogModal'
import { EkoCode, EkoCodeList } from '@isdd/metais-common/api/generated/tco-swagger'
import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { ReponseErrorCodeEnum } from '@isdd/metais-common/constants'

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
}: IEkoTableModalsProps) => {
    const { t } = useTranslation()

    const getPayloadForHandler = useCallback((codes: TEkoCodeDecorated[]): EkoCodeList => {
        const ekoCodes: Array<EkoCode> = codes.map((code) => code as EkoCode)
        return { ekoCodes: ekoCodes, ekoCodesCount: ekoCodes.length }
    }, [])

    const handlerInvalidateCodes = useCallback(
        async (codes: TEkoCodeDecorated[]) => {
            await invalidateCodes(getPayloadForHandler(codes))
                .then(() => {
                    setResultApiCall({ isError: false, isSuccess: true, message: undefined })
                })
                .catch((mutationError) => {
                    const errorResponse = JSON.parse(mutationError.message)
                    setResultApiCall({
                        isError: true,
                        isSuccess: false,
                        message:
                            errorResponse?.type === ReponseErrorCodeEnum.GNR403
                                ? t(`errors.${ReponseErrorCodeEnum.GNR403}`)
                                : t(`errors.${ReponseErrorCodeEnum.DEFAULT}`),
                    })
                })
                .finally(() => {
                    setLoading(false)
                })
        },
        [getPayloadForHandler, invalidateCodes, setLoading, setResultApiCall, t],
    )

    const handlerDeleteCodes = useCallback(
        async (codes: TEkoCodeDecorated[]) => {
            await deleteCodes(getPayloadForHandler(codes))
                .then(() => {
                    setResultApiCall({ isError: false, isSuccess: true, message: undefined })
                })
                .catch((mutationError) => {
                    const errorResponse = JSON.parse(mutationError.message)
                    setResultApiCall({
                        isError: true,
                        isSuccess: false,
                        message:
                            errorResponse?.type === ReponseErrorCodeEnum.GNR403
                                ? t(`errors.${ReponseErrorCodeEnum.GNR403}`)
                                : t(`errors.${ReponseErrorCodeEnum.DEFAULT}`),
                    })
                })
                .finally(() => {
                    setLoading(false)
                })
        },
        [deleteCodes, getPayloadForHandler, setLoading, setResultApiCall, t],
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
        handlerDeleteCodes(checkedToInvalidate)
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
