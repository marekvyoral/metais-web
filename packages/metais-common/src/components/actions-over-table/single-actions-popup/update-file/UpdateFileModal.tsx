import { BaseModal, LoadingIndicator } from '@isdd/idsk-ui-kit'
import React, { useState } from 'react'
import { FieldValues, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { v4 as uuidV4 } from 'uuid'

import { UpdateFileView } from './UpdateFileView'

import { ATTRIBUTE_NAME } from '@isdd/metais-common/api'
import { ConfigurationItemUi } from '@isdd/metais-common/api/generated/cmdb-swagger'
import { useAuth } from '@isdd/metais-common/contexts/auth/authContext'
import { IBulkActionResult } from '@isdd/metais-common/hooks/useBulkAction'
import { cleanFileName } from '@isdd/metais-common/utils/utils'
import { RefAttributesRefType } from '@isdd/metais-common/api/generated/dms-swagger'

export interface IUpdateFileModalProps {
    addButtonSectionName?: string
    open: boolean
    onClose: () => void
    onSubmit: (result: IBulkActionResult) => void
    item: ConfigurationItemUi
}

const changeFileName = (file: File) => {
    const name = cleanFileName(file.name)
    Object.defineProperty(file, 'name', {
        writable: true,
        value: name,
    })
    return file
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
        formData.append('x-content-uuid', uuidV4())
        formData.append(
            'refAttributes',
            new Blob(
                [
                    JSON.stringify({
                        refCiTechnicalName: item?.type,
                        refCiId: item?.uuid,
                        refCiMetaisCode: item?.attributes?.[ATTRIBUTE_NAME.Gen_Profil_kod_metais],
                        refCiOwner: item?.metaAttributes?.owner,
                        refType: RefAttributesRefType.CI,
                    }),
                ],
                { type: 'application/json' },
            ),
        )
        formData.append('file', changeFileName(formData1.file[0]), cleanFileName(formData1.file[0].name))

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
                onSubmit({ isSuccess: true, isError: false, successMessage: t('bulkActions.updateFile.success') })
            } else {
                setIsLoading(false)
                reset()
                onSubmit({ isSuccess: false, isError: true, successMessage: t('bulkActions.updateFile.success') })
            }
        } catch (e) {
            setIsLoading(false)
            onSubmit({ isSuccess: false, isError: true, successMessage: t('bulkActions.updateFile.success') })
        }
    }

    return (
        <BaseModal isOpen={open} close={onClose}>
            {isLoading && <LoadingIndicator label={t('form.waitSending')} />}
            <UpdateFileView items={[item]} register={register} onClose={onClose} onSubmit={handleSubmit(handleUpdateFile)} formState={formState} />
        </BaseModal>
    )
}
