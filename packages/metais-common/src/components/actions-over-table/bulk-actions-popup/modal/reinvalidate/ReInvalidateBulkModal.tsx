import { BaseModal, LoadingIndicator } from '@isdd/idsk-ui-kit'
import React from 'react'
import { useTranslation } from 'react-i18next'

import { ReInvalidateView } from './ReInvalidateBulkView'

import { ConfigurationItemUi, useRecycleInvalidatedCisBiznis, useRecycleInvalidatedRels } from '@isdd/metais-common/api/generated/cmdb-swagger'
import { IBulkActionResult } from '@isdd/metais-common/hooks/useBulkAction'

export interface IReInvalidateBulkModalProps {
    open: boolean
    multiple?: boolean
    onClose: () => void
    onSubmit: (result: IBulkActionResult) => void
    items: ConfigurationItemUi[]
    isRelation?: boolean
}

export const ReInvalidateBulkModal: React.FC<IReInvalidateBulkModalProps> = ({ items, open, multiple, onSubmit, onClose, isRelation }) => {
    const { t } = useTranslation()

    const successMessage = multiple ? t('bulkActions.reInvalidate.successList') : t('bulkActions.reInvalidate.success')

    const recycleRelation = useRecycleInvalidatedRels({
        mutation: {
            onSuccess() {
                onSubmit({ isSuccess: true, isError: false, successMessage })
            },
            onError() {
                onSubmit({ isSuccess: false, isError: true, successMessage })
            },
        },
    })

    const { isLoading, mutateAsync: reInvalidate } = useRecycleInvalidatedCisBiznis({
        mutation: {
            onSuccess() {
                onSubmit({ isSuccess: true, isError: false, successMessage })
            },
            onError() {
                onSubmit({ isSuccess: false, isError: true, successMessage })
            },
        },
    })

    const handleReInvalidate = async () => {
        if (isRelation) {
            await recycleRelation.mutateAsync({ data: { relIdList: items.map((item) => item.uuid || '') } })
        } else {
            await reInvalidate({ data: { ciIdList: items.map((item) => item.uuid || '') } })
        }
    }

    return (
        <BaseModal isOpen={open} close={onClose}>
            {isLoading && <LoadingIndicator label={t('form.waitSending')} />}
            <ReInvalidateView items={items} onClose={onClose} onSubmit={() => handleReInvalidate()} />
        </BaseModal>
    )
}
