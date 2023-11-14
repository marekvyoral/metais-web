import { BaseModal, LoadingIndicator } from '@isdd/idsk-ui-kit'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FieldValues, useForm } from 'react-hook-form'

import { UpdateFileView } from './UpdateFileView'

import { ConfigurationItemUi } from '@isdd/metais-common/api/generated/cmdb-swagger'
import { IBulkActionResult } from '@isdd/metais-common/hooks/useBulkAction'
import { useAuth } from '@isdd/metais-common/contexts/auth/authContext'

export interface IUpdateFileModalProps {
    addButtonSectionName?: string
    open: boolean
    onClose: () => void
    onSubmit: (result: IBulkActionResult) => void
    item: ConfigurationItemUi
}

export const UpdateFileModal: React.FC<IUpdateFileModalProps> = ({ item, open, onClose, onSubmit }) => {
    const { t } = useTranslation()
    const { register, handleSubmit, reset, formState } = useForm()
    const baseURL = import.meta.env.VITE_REST_CLIENT_DMS_TARGET_URL
    const {
        state: { token },
    } = useAuth()
    const [isLoading, setIsLoading] = useState(false)
    const handleUpdateFile = async (formData1: FieldValues) => {
        setIsLoading(true)
        const formData = new FormData()
        formData.append('file', formData1.file[0])
        try {
            const response = await fetch(baseURL + '/file/' + item.uuid, {
                method: 'POST',
                body: formData,
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            if (response.ok) {
                setIsLoading(false)
                reset()
                onSubmit({ isSuccess: true, isError: false, successMessage: t('bulkActions.deleteFile.success') })
            } else {
                setIsLoading(false)
                reset()
                onSubmit({ isSuccess: false, isError: true, successMessage: t('bulkActions.deleteFile.success') })
            }
        } catch (e) {
            setIsLoading(false)
            onSubmit({ isSuccess: false, isError: true, successMessage: t('bulkActions.deleteFile.success') })
        }
    }

    return (
        <BaseModal isOpen={open} close={onClose}>
            {isLoading && <LoadingIndicator label={t('form.waitSending')} />}
            <UpdateFileView items={[item]} register={register} onClose={onClose} onSubmit={handleSubmit(handleUpdateFile)} formState={formState} />
        </BaseModal>
    )
}
