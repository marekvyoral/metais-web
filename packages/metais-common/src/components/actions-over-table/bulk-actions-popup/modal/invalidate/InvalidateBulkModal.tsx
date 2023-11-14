import { BaseModal, LoadingIndicator } from '@isdd/idsk-ui-kit'
import React from 'react'
import { FieldValues, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { InvalidateBulkView } from './InvalidateBulkView'

import { useDeleteContentHook } from '@isdd/metais-common/api/generated/dms-swagger'
import {
    ConfigurationItemUi,
    RelationshipInvalidateUi,
    useInvalidateRelationship,
    useInvalidateSet,
} from '@isdd/metais-common/api/generated/cmdb-swagger'
import { IBulkActionResult } from '@isdd/metais-common/hooks/useBulkAction'

export interface IInvalidateBulkModalProps {
    open: boolean
    multiple?: boolean
    onClose: () => void
    onSubmit: (result: IBulkActionResult) => void
    items: ConfigurationItemUi[]
    deleteFile?: boolean
    isRelation?: boolean
}

export const InvalidateBulkModal: React.FC<IInvalidateBulkModalProps> = ({
    items,
    open,
    multiple,
    onClose,
    onSubmit,
    deleteFile = false,
    isRelation,
}) => {
    const { t } = useTranslation()
    const { register, handleSubmit, reset } = useForm()
    const deleteFileHook = useDeleteContentHook()
    const successMessage = multiple ? t('bulkActions.invalidate.successList') : t('bulkActions.invalidate.success')

    const invalidateRelation = useInvalidateRelationship({
        mutation: {
            onSuccess() {
                reset()
                onSubmit({ isSuccess: true, isError: false, successMessage })
            },
            onError() {
                onSubmit({ isSuccess: false, isError: true, successMessage })
            },
        },
    })

    const { isLoading, mutateAsync: invalidateItems } = useInvalidateSet({
        mutation: {
            onSuccess() {
                reset()
                onSubmit({ isSuccess: true, isError: false, successMessage })
            },
            onError() {
                onSubmit({ isSuccess: false, isError: true, successMessage })
            },
        },
    })

    const mappedItems = items.map((item) => {
        const attributes = Object.entries(item.attributes || {}).map(([key, value]) => ({ name: key, value }))
        return { ...item, attributes }
    })

    const handleInvalidate = async (formValues: FieldValues) => {
        if (deleteFile) {
            await items.forEach((item) => deleteFileHook(item.uuid ?? ''))
        }
        if (isRelation) {
            const relationData: RelationshipInvalidateUi = { ...mappedItems[0], invalidateReason: { comment: formValues.reason } }
            await invalidateRelation.mutateAsync({ data: relationData, params: { newState: ['INVALIDATED'] } })
        } else {
            await invalidateItems({ data: { configurationItemSet: mappedItems, invalidateReason: { comment: formValues.reason } } })
        }
    }

    return (
        <BaseModal isOpen={open} close={onClose}>
            {isLoading && <LoadingIndicator label={t('form.waitSending')} />}
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
