import { BaseModal, LoadingIndicator } from '@isdd/idsk-ui-kit'
import React, { useState } from 'react'
import { FieldValues, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { v4 as uuidV4 } from 'uuid'

import { ProjectUploadFileView } from './ProjectUploadFileView'

import { ConfigurationItemUi, useGetDocumentHook, useGetRequestStatusHook, useStoreGraphHook } from '@isdd/metais-common/api/generated/cmdb-swagger'
import { IBulkActionResult } from '@isdd/metais-common/hooks/useBulkAction'
import { useIsOwnerByGidHook } from '@isdd/metais-common/src/api/generated/iam-swagger'
import { useGenerateCodeAndURLHook } from '@isdd/metais-common/src/api/generated/types-repo-swagger'
import { API_CALL_RETRY_COUNT } from '@isdd/metais-common/constants'
import { useAuth } from '@isdd/metais-common/contexts/auth/authContext'

export interface IDocType extends ConfigurationItemUi {
    confluence?: boolean
    pdType?: string
    name?: string
}

export interface IProjectUploadFileModalProps {
    open: boolean
    onClose: () => void
    onSubmit: (result: IBulkActionResult) => void
    item?: IDocType
    configurationItemId?: string
    addButtonSectionName?: string
    docNumber: string
    project?: ConfigurationItemUi
    isCi?: boolean
}

export const ProjectUploadFileModal: React.FC<IProjectUploadFileModalProps> = ({
    item,
    open,
    onClose,
    onSubmit,
    addButtonSectionName,
    docNumber,
    project,
    isCi,
}) => {
    const { t } = useTranslation()
    const { register, handleSubmit, reset, formState } = useForm()
    const baseURL = import.meta.env.VITE_REST_CLIENT_DMS_TARGET_URL
    const {
        state: { user, token },
    } = useAuth()
    const genetateCodeAndUrl = useGenerateCodeAndURLHook()
    const storeActivity = useStoreGraphHook()
    const [isLoading, setIsLoading] = useState(false)
    const checkIsOwnerByGid = useIsOwnerByGidHook()
    const requestStatus = useGetRequestStatusHook()
    const getDocument = useGetDocumentHook()
    const getStatus = async (requestId: string) => {
        let done = false
        for (let index = 0; index < API_CALL_RETRY_COUNT; index++) {
            const status = await requestStatus(requestId)
            if (status.processed) {
                done = true
                break
            }

            if (index < API_CALL_RETRY_COUNT - 1) {
                const delay = 500
                await new Promise((resolve) => setTimeout(resolve, delay))
            }
        }
        return done
    }
    const getDocumentExists = async (docId: string) => {
        let done = false
        for (let index = 0; index < API_CALL_RETRY_COUNT; index++) {
            const status = await getDocument(docId)
            if (status.isExist) {
                done = true
                break
            }

            if (index < API_CALL_RETRY_COUNT - 1) {
                const delay = 500
                await new Promise((resolve) => setTimeout(resolve, delay))
            }
        }
        return done
    }

    const handleUploadFile = async (formData1: FieldValues) => {
        setIsLoading(true)
        const id = uuidV4()
        const formData = new FormData()
        formData.append('file', formData1.file[0])
        try {
            let docExists = false
            const isOwner = await checkIsOwnerByGid({
                login: user?.login,
                gids: [project?.metaAttributes?.owner ?? ''],
            })
            if (isOwner.isOwner?.[0].owner) {
                const response = await fetch(baseURL + '/file/' + id, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })

                if (response.ok) {
                    const code = await genetateCodeAndUrl('Dokument')
                    const graphResponse = await storeActivity({
                        storeSet: {
                            configurationItemSet: [
                                {
                                    uuid: id,
                                    owner: project?.metaAttributes?.owner,
                                    type: 'Dokument',
                                    attributes: [
                                        { name: 'Gen_Profil_zdroj', value: 'c_zdroj.1' },
                                        { name: 'Gen_Profil_kod_metais', value: code.cicode },
                                        { name: 'Gen_Profil_ref_id', value: code.ciurl },
                                        { name: 'Gen_Profil_nazov', value: item?.name ?? formData1.file[0].name },
                                        { name: 'Gen_Profil_poznamka', ...(formData1?.note && { value: formData1?.note }) },
                                        {
                                            name: 'Profil_Dokument_Projekt_typ_dokumentu',
                                            ...(!!item?.pdType && { value: item?.pdType }),
                                            ...(!!addButtonSectionName &&
                                                !item?.pdType &&
                                                addButtonSectionName != 'all' && { value: addButtonSectionName + docNumber }),
                                        },
                                    ],
                                },
                            ],
                            relationshipSet: [
                                {
                                    type: isCi ? 'CI_HAS_DOCUMENT' : 'PROJECT_HAS_DOCUMENT',
                                    attributes: [],
                                    startUuid: project?.uuid,
                                    endUuid: id,
                                    owner: project?.metaAttributes?.owner,
                                    uuid: uuidV4(),
                                },
                            ],
                        },
                    })

                    const status = graphResponse.requestId && (await getStatus(graphResponse.requestId))
                    if (status) {
                        docExists = await getDocumentExists(id)
                    }
                }
                // if (response.status === 413) {
                //     setIsLoading(false)
                //     reset()
                //     onSubmit({
                //         isSuccess: false,
                //         isError: true,
                //         successMessage: t('bulkActions.addFile.success'),
                //         errorMessage: t('bulkActions.addFile.tooLargeError'),
                //     })
                // }

                if (docExists) {
                    setIsLoading(false)
                    reset()
                    onSubmit({ isSuccess: true, isError: false, successMessage: t('bulkActions.addFile.success') })
                } else {
                    setIsLoading(false)
                    reset()
                    onSubmit({ isSuccess: false, isError: true, successMessage: t('bulkActions.addFile.success') })
                }
            }
        } catch (e) {
            setIsLoading(false)
            onSubmit({ isSuccess: false, isError: true, successMessage: t('bulkActions.addFile.success') })
        }
    }

    return (
        <BaseModal isOpen={open} close={onClose}>
            {isLoading && <LoadingIndicator label={t('form.waitSending')} />}
            <ProjectUploadFileView register={register} onClose={onClose} onSubmit={handleSubmit(handleUploadFile)} formState={formState} />
        </BaseModal>
    )
}
