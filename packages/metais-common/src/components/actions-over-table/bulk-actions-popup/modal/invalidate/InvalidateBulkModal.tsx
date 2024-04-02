import { BaseModal, LoadingIndicator } from '@isdd/idsk-ui-kit'
import React, { useEffect, useState } from 'react'
import { FieldValues, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { InvalidateBulkView } from './InvalidateBulkView'

import { useDeleteContentHook } from '@isdd/metais-common/api/generated/dms-swagger'
import {
    ConfigurationItemUi,
    RelationshipInvalidateUi,
    RelationshipUi,
    useInvalidateRelationship,
    useInvalidateSet,
} from '@isdd/metais-common/api/generated/cmdb-swagger'
import { IBulkActionResult } from '@isdd/metais-common/hooks/useBulkAction'
import { useGetStatus } from '@isdd/metais-common/hooks/useGetRequestStatus'
import { useInvalidateCiHistoryListCache } from '@isdd/metais-common/hooks/invalidate-cache'

export interface IInvalidateBulkModalProps {
    open: boolean
    multiple?: boolean
    onClose: () => void
    onSubmit: (result: IBulkActionResult) => void
    items: ConfigurationItemUi[] | RelationshipUi[]
    deleteFile?: boolean
    isRelation?: boolean
    isRelationList?: boolean
}

export const InvalidateBulkModal: React.FC<IInvalidateBulkModalProps> = ({
    items,
    open,
    multiple,
    onClose,
    onSubmit,
    deleteFile = false,
    isRelation,
    isRelationList,
}) => {
    const { t } = useTranslation()
    const { register, handleSubmit, reset } = useForm()
    const deleteFileHook = useDeleteContentHook()
    const successMessage = multiple ? t('mutationFeedback.successfulUpdatedList') : t('mutationFeedback.successfulUpdated')
    const { getRequestStatus, isError, isProcessedError, isTooManyFetchesError } = useGetStatus()
    const { invalidate: invalidateHistoryListCache } = useInvalidateCiHistoryListCache()
    const [isProcessing, setIsProcessing] = useState(false)

    useEffect(() => {
        if (isError || isProcessedError || isTooManyFetchesError) {
            onSubmit({ isSuccess: false, isError: true })
            reset()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isError, isProcessedError, isTooManyFetchesError])

    const mappedItems = items.map((item) => {
        const attributes = Object.entries(item.attributes || {}).map(([key, value]) => ({ name: key, value }))
        return { ...item, attributes }
    })

    const invalidateRelation = useInvalidateRelationship({
        mutation: {
            async onSuccess(data) {
                await getRequestStatus(data.requestId ?? '', () => {
                    onSubmit({ isSuccess: true, isError: false, successMessage })
                    reset()
                    mappedItems.forEach((item) => {
                        invalidateHistoryListCache(item?.uuid ?? '')
                    })
                    setIsProcessing(false)
                })
            },
            onError() {
                onSubmit({ isSuccess: false, isError: true, successMessage })
                reset()
                setIsProcessing(false)
            },
        },
    })

    const { isLoading, mutateAsync: invalidateItems } = useInvalidateSet({
        mutation: {
            async onSuccess(data) {
                if (data.requestId) {
                    await getRequestStatus(data.requestId, () => {
                        onSubmit({ isSuccess: true, isError: false, successMessage })
                        mappedItems.forEach((item) => {
                            invalidateHistoryListCache(item?.uuid ?? '')
                        })
                    })
                }
            },
        },
    })

    const handleInvalidate = async (formValues: FieldValues) => {
        if (deleteFile) {
            items.forEach(async (item) => {
                return await deleteFileHook(item.uuid ?? '')
            })
        }
        if (isRelation) {
            const relationData: RelationshipInvalidateUi = { ...mappedItems[0], invalidateReason: { comment: formValues.reason } }
            setIsProcessing(true)
            await invalidateRelation.mutateAsync({ data: relationData, params: { newState: ['INVALIDATED'] } })
        } else {
            if (isRelationList) {
                invalidateItems({ data: { relationshipSet: mappedItems, invalidateReason: { comment: formValues.reason } } })
            } else {
                invalidateItems({ data: { configurationItemSet: mappedItems, invalidateReason: { comment: formValues.reason } } })
            }
        }
    }

    return (
        <BaseModal isOpen={open} close={onClose}>
            {(isLoading || isProcessing) && <LoadingIndicator label={t('form.waitSending')} />}
            <InvalidateBulkView
                items={items}
                register={register}
                onClose={onClose}
                multiple={multiple}
                onSubmit={handleSubmit(handleInvalidate)}
                deleteFile={deleteFile}
            />
        </BaseModal>
    )
}
