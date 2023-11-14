import { BaseModal, LoadingIndicator } from '@isdd/idsk-ui-kit'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useForm } from 'react-hook-form'

import { DeleteFileBulkView } from './DeleteFileBulkView'

import { ConfigurationItemUi } from '@isdd/metais-common/api/generated/cmdb-swagger'
import { useDeleteDocuments } from '@isdd/metais-common/api/generated/dms-swagger'
import { IBulkActionResult } from '@isdd/metais-common/hooks/useBulkAction'

export interface IDeleteFileBulkModalProps {
    open: boolean
    onClose: () => void
    onSubmit: (result: IBulkActionResult) => void
    items: ConfigurationItemUi[]
}

export const DeleteFileBulkModal: React.FC<IDeleteFileBulkModalProps> = ({ items, open, onClose, onSubmit }) => {
    const { t } = useTranslation()
    const { register, handleSubmit, reset } = useForm()

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

    const handleDeleteFile = async () => {
        await deleteFile({ data: { fileItemSet: items.map((item) => item.uuid || '') } })
    }

    return (
        <BaseModal isOpen={open} close={onClose}>
            {isLoading && <LoadingIndicator label={t('form.waitSending')} />}
            <DeleteFileBulkView items={items} register={register} onClose={onClose} onSubmit={handleSubmit(handleDeleteFile)} />
        </BaseModal>
    )
}
