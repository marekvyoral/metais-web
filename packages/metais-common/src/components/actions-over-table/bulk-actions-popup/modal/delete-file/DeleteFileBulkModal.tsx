import { BaseModal, LoadingIndicator } from '@isdd/idsk-ui-kit'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { FieldValues, useForm } from 'react-hook-form'

import { DeleteFileBulkView } from './DeleteFileBulkView'

import {
    AttributeUi,
    ConfigurationItemUi,
    RelationshipUi,
    useDeleteRelationship,
    useInvalidateSet,
} from '@isdd/metais-common/api/generated/cmdb-swagger'
import { useDeleteDocuments } from '@isdd/metais-common/api/generated/dms-swagger'
import { IBulkActionResult } from '@isdd/metais-common/hooks/useBulkAction'
import { useGetStatus } from '@isdd/metais-common/hooks/useGetRequestStatus'
import { transformJsonToArray } from '@isdd/metais-common/utils/utils'

export interface IDeleteFileBulkModalProps {
    open: boolean
    onClose: () => void
    onSubmit: (result: IBulkActionResult) => void
    items: ConfigurationItemUi[] | RelationshipUi[]
    ci?: ConfigurationItemUi
    isRelation?: boolean
}

export const DeleteFileBulkModal: React.FC<IDeleteFileBulkModalProps> = ({ items, open, onClose, onSubmit, isRelation }) => {
    const { t } = useTranslation()
    const { register, handleSubmit, reset } = useForm()
    const { mutateAsync: invalidateCiSet, isLoading: isListLoading } = useInvalidateSet()
    const { mutateAsync: deleteRelation, isLoading: isDeleteProcessing } = useDeleteRelationship()
    const { getRequestStatus, isLoading: isRequestProcessing } = useGetStatus()
    const { isLoading, mutateAsync: deleteFile } = useDeleteDocuments({
        mutation: {
            onSuccess() {
                reset()
                onSubmit({ isSuccess: true, isError: false, successMessage: t('bulkActions.deleteFile.success') })
            },
            onError() {
                onSubmit({ isSuccess: false, isError: true, successMessage: t('bulkActions.deleteFile.success') })
            },
        },
    })

    const mapAttributes = (itemsTmp: ConfigurationItemUi[]) => {
        return itemsTmp.map((i) => ({ ...i, attributes: transformJsonToArray(i.attributes) }))
    }

    const handleDeleteFile = async (fieldValues: FieldValues) => {
        if (isRelation) {
            ;(items as RelationshipUi[]).forEach((item) =>
                deleteRelation({ data: { ...item, attributes: transformJsonToArray(item.attributes) as AttributeUi[] } })
                    .then((resp) => {
                        if (resp.requestId) {
                            getRequestStatus(resp.requestId, () =>
                                deleteFile({ data: { fileItemSet: items.map((it) => (it as RelationshipUi).endUuid || '') } }),
                            )
                        }
                    })
                    .catch(() => onSubmit({ isSuccess: false, isError: true, successMessage: t('bulkActions.deleteFile.success') })),
            )
        } else {
            invalidateCiSet({ data: { configurationItemSet: mapAttributes(items), invalidateReason: { comment: fieldValues.reason } } })
                .then((resp) => {
                    if (resp.requestId) {
                        getRequestStatus(resp.requestId, () => deleteFile({ data: { fileItemSet: items.map((item) => item.uuid || '') } }))
                    }
                })
                .catch(() => onSubmit({ isSuccess: false, isError: true, successMessage: t('bulkActions.deleteFile.success') }))
        }
    }

    return (
        <BaseModal isOpen={open} close={onClose}>
            {(isLoading || isListLoading || isRequestProcessing || isDeleteProcessing) && <LoadingIndicator label={t('form.waitSending')} />}
            <DeleteFileBulkView items={items} register={register} onClose={onClose} onSubmit={handleSubmit(handleDeleteFile)} />
        </BaseModal>
    )
}
