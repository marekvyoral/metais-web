import { Gui_Profil_Standardy } from '@isdd/metais-common/api'
import { useCreateStandardRequest } from '@isdd/metais-common/api/generated/standards-swagger'
import { Attribute, useGetAttributeProfile } from '@isdd/metais-common/api/generated/types-repo-swagger'
import { guiProfilStandardRequestMap } from '@isdd/metais-common/api/hooks/containers/containerHelpers'
import { FileUploadData, IFileUploadRef } from '@isdd/metais-common/components/FileUpload/FileUpload'
import { useActionSuccess } from '@isdd/metais-common/contexts/actionSuccess/actionSuccessContext'
import { NavigationSubRoutes } from '@isdd/metais-common/navigation/routeNames'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { FieldValues } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { v4 as uuidV4 } from 'uuid'

import { mapUploadedFilesToApiAttachment } from '@/components/views/standardization/votes/VoteComposeForm/functions/voteEditFunc'

interface IViewProps {
    onSubmit: (values: FieldValues) => Promise<void>
    isError: boolean
    isLoading: boolean
    guiAttributes: Attribute[]
    isGuiDataLoading: boolean
    isGuiDataError: boolean
    fileUploadRef: React.RefObject<IFileUploadRef>
    handleUploadSuccess: (data: FileUploadData[]) => void
    sendData: (values: FieldValues, name?: string, email?: string, capthcaToken?: string) => Promise<void>
    id?: number
    handleUploadFailed?: () => void
}
interface DraftsListFormContainerProps {
    View: React.FC<IViewProps>
}

const baseURL = import.meta.env.VITE_REST_CLIENT_STANDARDS_TARGET_URL

export const DraftsListCreateContainer: React.FC<DraftsListFormContainerProps> = ({ View }) => {
    const navigate = useNavigate()
    const { setIsActionSuccess } = useActionSuccess()
    const fileUploadRef = useRef<IFileUploadRef>(null)

    const [draftlistId, setDraftlistId] = useState<number>()
    const [customLoading, setCustomLoading] = useState(false)
    const [customError, setCustomError] = useState(false)
    const [creatingFilesLoading, setCreatingFilesLoading] = useState(false)

    const { mutateAsync, isError, isLoading } = useCreateStandardRequest()

    useEffect(() => {
        if (draftlistId) {
            if (fileUploadRef.current?.getFilesToUpload()?.length ?? 0 > 0) {
                fileUploadRef.current?.startUploading()
            } else {
                setIsActionSuccess({
                    value: true,
                    path: NavigationSubRoutes.ZOZNAM_NAVRHOV + '/' + draftlistId,
                    additionalInfo: { type: 'create' },
                })
                navigate(NavigationSubRoutes.ZOZNAM_NAVRHOV + '/' + draftlistId)
            }
        }
    }, [draftlistId, navigate, setIsActionSuccess])

    const { data: guiData, isLoading: isGuiDataLoading, isError: isGuiDataError } = useGetAttributeProfile(Gui_Profil_Standardy)

    const guiAttributes: Attribute[] = useMemo(() => {
        return [
            ...(guiData?.attributes?.map((attr) => ({
                ...attr,
                technicalName: guiProfilStandardRequestMap?.get(attr?.technicalName ?? '') ?? attr?.technicalName,
            })) ?? []),
        ]
    }, [guiData])

    const handleSubmit = async (values: FieldValues) => {
        const resp = await mutateAsync({
            data: {
                ...values,
            },
        })
        fileUploadRef.current?.setCustomMeta({
            'x-content-uuid': uuidV4(),
            refAttributes: new Blob(
                [
                    JSON.stringify({
                        refType: 'STANDARD_REQUEST',
                        refStandardRequestId: resp.id,
                    }),
                ],
                { type: 'application/json' },
            ),
        })

        setDraftlistId(resp.id ?? 0)
    }

    const sendData = async (values: FieldValues, fullName?: string, email?: string, capthcaToken?: string) => {
        const files = fileUploadRef.current?.getFilesToUpload()
        const fileIds = Object.values(fileUploadRef.current?.fileUuidsMapping().current ?? {})

        if (capthcaToken) {
            setCustomLoading(true)
            const response = await fetch(`${baseURL}/standards/requests`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'recaptcha-response': capthcaToken },
                body: JSON.stringify({
                    ...values,
                    fullName,
                    email,
                    attachments: mapUploadedFilesToApiAttachment(
                        files?.map((file, index) => {
                            return { ...file, fileId: fileIds[index] }
                        }) ?? [],
                    ),
                }),
            })
            if (response.ok) {
                setCustomLoading(false)
                setIsActionSuccess({ value: true, path: NavigationSubRoutes.ZOZNAM_NAVRHOV, additionalInfo: { type: 'create' } })
                navigate(NavigationSubRoutes.ZOZNAM_NAVRHOV)
            } else {
                setCustomLoading(false)
                setCustomError(true)
            }
        } else {
            handleSubmit({
                ...values,
                attachments: mapUploadedFilesToApiAttachment(
                    files?.map((file, index) => {
                        return { ...file, fileId: fileIds[index] }
                    }) ?? [],
                ),
            })
        }
    }

    const handleUploadSuccess = () => {
        setCreatingFilesLoading(false)
        setIsActionSuccess({ value: true, path: NavigationSubRoutes.ZOZNAM_NAVRHOV + '/' + draftlistId, additionalInfo: { type: 'create' } })
        navigate(NavigationSubRoutes.ZOZNAM_NAVRHOV + '/' + draftlistId)
    }

    const handleUploadFailed = () => {
        setCreatingFilesLoading(false)
    }

    return (
        <View
            handleUploadFailed={handleUploadFailed}
            onSubmit={handleSubmit}
            isError={isError || customError}
            isLoading={isLoading || customLoading || creatingFilesLoading}
            guiAttributes={guiAttributes}
            isGuiDataLoading={isGuiDataLoading}
            isGuiDataError={isGuiDataError}
            fileUploadRef={fileUploadRef}
            handleUploadSuccess={handleUploadSuccess}
            sendData={sendData}
            id={draftlistId}
        />
    )
}
