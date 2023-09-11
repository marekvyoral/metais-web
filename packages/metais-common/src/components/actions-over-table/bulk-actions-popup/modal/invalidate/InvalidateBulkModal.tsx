import { BaseModal, LoadingIndicator } from '@isdd/idsk-ui-kit'
import React from 'react'
import { FieldValues, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { InvalidateBulkView } from './InvalidateBulkView'

import { ConfigurationItemUi, useInvalidateSet } from '@isdd/metais-common/index'
import { IBulkActionResult } from '@isdd/metais-common/hooks/useBulkAction'

export interface IInvalidateBulkModalProps {
    open: boolean
    onClose: () => void
    onSubmit: (result: IBulkActionResult) => void
    items: ConfigurationItemUi[]
}

export const InvalidateBulkModal: React.FC<IInvalidateBulkModalProps> = ({ items, open, onClose, onSubmit }) => {
    const { t } = useTranslation()
    const { register, handleSubmit, reset } = useForm()

    const { isLoading, mutateAsync: invalidateItems } = useInvalidateSet({
        mutation: {
            onSuccess() {
                reset()
                onSubmit({ isSuccess: true, isError: false, successMessage: t('bulkActions.invalidate.success') })
            },
            onError() {
                onSubmit({ isSuccess: false, isError: true, successMessage: t('bulkActions.invalidate.success') })
            },
        },
    })
    const mappedItems = items.map((item) => {
        const attributes = Object.entries(item.attributes || {}).map(([key, value]) => ({ name: key, value }))
        return { ...item, attributes }
    })

    const handleInvalidate = async (formValues: FieldValues) => {
        await invalidateItems({ data: { configurationItemSet: mappedItems, invalidateReason: { comment: formValues.reason } } })
    }

    return (
        <BaseModal isOpen={open} close={onClose}>
            {isLoading && <LoadingIndicator label={t('form.waitSending')} />}
            <InvalidateBulkView items={items} register={register} onClose={onClose} onSubmit={handleSubmit(handleInvalidate)} />
        </BaseModal>
    )
}
