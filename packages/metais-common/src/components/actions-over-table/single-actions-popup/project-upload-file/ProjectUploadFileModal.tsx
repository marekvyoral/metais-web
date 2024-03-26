import { BaseModal } from '@isdd/idsk-ui-kit'
import React, { useRef, useState } from 'react'
import { FieldValues, useForm } from 'react-hook-form'
import { v4 as uuidV4 } from 'uuid'

import { ProjectUploadFileView } from './ProjectUploadFileView'

import { ATTRIBUTE_NAME } from '@isdd/metais-common/api'
import { ConfigurationItemUi, useGetDocumentHook, useReadCiNeighboursHook, useStoreGraphHook } from '@isdd/metais-common/api/generated/cmdb-swagger'
import { FileUploadData, IFileUploadRef } from '@isdd/metais-common/components/FileUpload/FileUpload'
import { API_CALL_RETRY_COUNT } from '@isdd/metais-common/constants'
import { useAuth } from '@isdd/metais-common/contexts/auth/authContext'
import { IBulkActionResult } from '@isdd/metais-common/hooks/useBulkAction'
import { useGetStatus } from '@isdd/metais-common/hooks/useGetRequestStatus'
import { useIsOwnerByGidHook } from '@isdd/metais-common/src/api/generated/iam-swagger'
import { useGenerateCodeAndURLHook } from '@isdd/metais-common/src/api/generated/types-repo-swagger'
import { CiRefAttributes } from '@isdd/metais-common/src/api/generated/dms-swagger'

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
    setSuccessfullyAdded?: React.Dispatch<React.SetStateAction<string[]>>
}

const filter = {
    neighboursFilter: {
        filterType: 'CI',
        usageType: ['system', 'application'],
        metaAttributes: {
            state: ['DRAFT'],
        },
        relType: [],
        ciType: ['Dokument'],
    },
    page: 1,
    perpage: 200,
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
    setSuccessfullyAdded,
}) => {
    const { register, handleSubmit, reset, formState } = useForm()
    const fileUploadRef = useRef<IFileUploadRef>(null)
    const {
        state: { user },
    } = useAuth()
    const genetateCodeAndUrl = useGenerateCodeAndURLHook()
    const storeActivity = useStoreGraphHook()
    const [isLoading, setIsLoading] = useState(false)
    const checkIsOwnerByGid = useIsOwnerByGidHook()
    const getCiNeigboursHook = useReadCiNeighboursHook()
    const getDocument = useGetDocumentHook()

    const [note, setNote] = useState('')
    const [duplicateNames, setDuplicateNames] = useState<string[] | undefined>()
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

    const { getRequestStatus, isError, isProcessedError, isTooManyFetchesError } = useGetStatus()

    const onFileUploadSuccess = async (filesData: FileUploadData[]) => {
        const graphRequests = filesData.map(async (file) => {
            const code = await genetateCodeAndUrl('Dokument')

            return storeActivity({
                storeSet: {
                    configurationItemSet: [
                        {
                            uuid: file.fileId,
                            owner: project?.metaAttributes?.owner,
                            type: 'Dokument',
                            attributes: [
                                { name: 'Gen_Profil_zdroj', value: 'c_zdroj.1' },
                                { name: 'Gen_Profil_kod_metais', value: code.cicode },
                                { name: 'Gen_Profil_ref_id', value: code.ciurl },
                                { name: 'Gen_Profil_nazov', value: file.fileName },
                                { name: 'Gen_Profil_poznamka', value: note },
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
                            endUuid: file.fileId,
                            owner: project?.metaAttributes?.owner,
                            uuid: uuidV4(),
                        },
                    ],
                },
            })
        })
        const graphResponses = await Promise.all(graphRequests)
        const statusRequests = graphResponses.map((response, index) => {
            return getRequestStatus(response.requestId ?? '', async () => {
                await getDocumentExists(filesData[index].fileId ?? '').then((isExist) => {
                    if (isExist && setSuccessfullyAdded) {
                        setSuccessfullyAdded((prevValue: string[]) => [...prevValue, filesData[index].fileName ?? ''])
                    }
                })
            })
        })
        await Promise.all(statusRequests)

        onSubmit({ isSuccess: true, isError: false, additionalInfo: { action: 'addedDocuments' } })
        if ([isError, isProcessedError, isTooManyFetchesError].some((error) => error)) onSubmit({ isSuccess: true, isError: false })
        setIsLoading(false)
        reset()
    }

    const onFileUploadFailed = () => {
        setIsLoading(false)
    }

    const handleUploadFile = async (formData: FieldValues) => {
        setIsLoading(true)
        setSuccessfullyAdded && setSuccessfullyAdded([])
        setNote(formData.note)

        const neighbours = await getCiNeigboursHook(project?.uuid ?? '', filter)
        const docNames = fileUploadRef.current?.getFilesToUpload().map((doc) => doc.fileName)
        const duplicateDocs = neighbours.fromNodes?.neighbourPairs?.filter((node) => {
            return docNames?.includes(node.configurationItem?.attributes?.[ATTRIBUTE_NAME.Gen_Profil_nazov])
        })

        if (duplicateDocs && duplicateDocs?.length < 1) {
            const isOwner = await checkIsOwnerByGid({
                login: user?.login,
                gids: [project?.metaAttributes?.owner ?? ''],
            })
            if (isOwner.isOwner?.[0].owner) {
                fileUploadRef.current?.startUploading()
            }
        } else {
            setDuplicateNames(
                duplicateDocs?.map((doc) => {
                    return doc.configurationItem?.attributes?.[ATTRIBUTE_NAME.Gen_Profil_nazov]
                }),
            )
            setIsLoading(false)
        }
    }

    const refDmsObject: CiRefAttributes = {
        refCiTechnicalName: project?.type,
        refCiId: project?.uuid,
        refCiMetaisCode: project?.attributes?.[ATTRIBUTE_NAME.Gen_Profil_kod_metais],
        refCiOwner: project?.metaAttributes?.owner,
        refType: 'CI',
    }

    const fileMetaAttributes = {
        'x-content-uuid': uuidV4(),
        refAttributes: new Blob([JSON.stringify(refDmsObject)], { type: 'application/json' }),
    }

    return (
        <BaseModal isOpen={open} close={onClose}>
            <ProjectUploadFileView
                onFileUploadFailed={onFileUploadFailed}
                register={register}
                onClose={onClose}
                onSubmit={handleSubmit(handleUploadFile)}
                formState={formState}
                fileMetaAttributes={fileMetaAttributes}
                isLoading={isLoading}
                fileUploadRef={fileUploadRef}
                onFileUploadSuccess={onFileUploadSuccess}
                duplicateDocNames={duplicateNames}
            />
        </BaseModal>
    )
}
