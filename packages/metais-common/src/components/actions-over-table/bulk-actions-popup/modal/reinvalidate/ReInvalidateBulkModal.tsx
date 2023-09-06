import { BaseModal, LoadingIndicator } from '@isdd/idsk-ui-kit'
import React from 'react'
import { useTranslation } from 'react-i18next'

import { ReInvalidateView } from './ReInvalidateBulkView'

import { ConfigurationItemUi, useRecycleInvalidatedCisBiznis } from '@isdd/metais-common/api'
import { IBulkActionResult } from '@isdd/metais-common/hooks/useBulkAction'

export interface IReInvalidateBulkModalProps {
    open: boolean
    onClose: () => void
    onSubmit: (result: IBulkActionResult) => void
    items: ConfigurationItemUi[]
}

export const ReInvalidateBulkModal: React.FC<IReInvalidateBulkModalProps> = ({ items, open, onSubmit, onClose }) => {
    const { t } = useTranslation()
    const { isLoading, mutateAsync: reInvalidate } = useRecycleInvalidatedCisBiznis({
        mutation: {
            onSuccess() {
                onSubmit({ isSuccess: true, isError: false, successMessage: t('bulkActions.invalidate.success') })
            },
            onError() {
                onSubmit({ isSuccess: false, isError: true, successMessage: t('bulkActions.invalidate.success') })
            },
        },
    })

    const handleReInvalidate = async () => {
        await reInvalidate({ data: { ciIdList: items.map((item) => item.uuid || '') } })
    }

    return (
        <BaseModal isOpen={open} close={onClose}>
            {isLoading && <LoadingIndicator label={t('form.waitSending')} />}
            <ReInvalidateView items={items} onClose={onClose} onSubmit={() => handleReInvalidate()} />
        </BaseModal>
    )
}
