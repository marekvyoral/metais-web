import { BaseModal, LoadingIndicator } from '@isdd/idsk-ui-kit'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { ReInvalidateView } from './ReInvalidateBulkView'

import {
    ConfigurationItemUi,
    RelationshipUi,
    useRecycleInvalidatedCisBiznis,
    useRecycleInvalidatedRels,
} from '@isdd/metais-common/api/generated/cmdb-swagger'
import { IBulkActionResult } from '@isdd/metais-common/hooks/useBulkAction'
import { useGetStatus } from '@isdd/metais-common/hooks/useGetRequestStatus'
import { useInvalidateCiHistoryListCache } from '@isdd/metais-common/hooks/invalidate-cache'

export interface IReInvalidateBulkModalProps {
    open: boolean
    multiple?: boolean
    onClose: () => void
    onSubmit: (result: IBulkActionResult) => void
    items: ConfigurationItemUi[] | RelationshipUi[]
    isRelation?: boolean
}

export const ReInvalidateBulkModal: React.FC<IReInvalidateBulkModalProps> = ({ items, open, multiple, onSubmit, onClose, isRelation }) => {
    const { t } = useTranslation()
    const { getRequestStatus, isError, isProcessedError, isTooManyFetchesError } = useGetStatus()
    const { invalidate: invalidateHistoryListCache } = useInvalidateCiHistoryListCache()
    const [isProcessing, setIsProcessing] = useState(false)
    const successMessage = multiple ? t('mutationFeedback.successfulUpdatedList') : t('mutationFeedback.successfulUpdated')

    const recycleRelation = useRecycleInvalidatedRels({
        mutation: {
            async onSuccess(data) {
                await getRequestStatus(data.requestId ?? '', () => {
                    onSubmit({ isSuccess: true, isError: false, successMessage })
                    items.forEach((item) => invalidateHistoryListCache(item.uuid ?? ''))
                })
                setIsProcessing(false)
            },
            onError() {
                onSubmit({ isSuccess: false, isError: true })
                setIsProcessing(false)
            },
        },
    })

    useEffect(() => {
        if (isError || isProcessedError || isTooManyFetchesError) {
            onSubmit({ isSuccess: false, isError: true })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isError, isProcessedError, isTooManyFetchesError])

    const { isLoading, mutateAsync: reInvalidate } = useRecycleInvalidatedCisBiznis({
        mutation: {
            async onSuccess(data) {
                if (data.requestId) {
                    await getRequestStatus(data.requestId, () => {
                        onSubmit({ isSuccess: true, isError: false, successMessage })
                        items.forEach((item) => invalidateHistoryListCache(item.uuid ?? ''))
                    })
                }
            },
        },
    })

    const handleReInvalidate = async () => {
        if (isRelation) {
            setIsProcessing(true)
            await recycleRelation.mutateAsync({ data: { relIdList: items.map((item) => item.uuid || '') } })
        } else {
            await reInvalidate({ data: { ciIdList: items.map((item) => item.uuid || '') } })
        }
    }

    return (
        <BaseModal isOpen={open} close={onClose}>
            {(isLoading || isProcessing) && <LoadingIndicator label={t('form.waitSending')} />}
            <ReInvalidateView items={items} onClose={onClose} onSubmit={() => handleReInvalidate()} />
        </BaseModal>
    )
}
