import { Gui_Profil_Standardy } from '@isdd/metais-common/api'
import { Group, useFindByUuid3 } from '@isdd/metais-common/api/generated/iam-swagger'
import {
    ApiStandardRequest,
    getGetStandardRequestDetailQueryKey,
    useGetStandardRequestDetail,
    useUpdateStandardRequest,
} from '@isdd/metais-common/api/generated/standards-swagger'
import { Attribute, useGetAttributeProfile } from '@isdd/metais-common/api/generated/types-repo-swagger'
import { guiProfilStandardRequestMap } from '@isdd/metais-common/api/hooks/containers/containerHelpers'
import { FileUploadData, IFileUploadRef } from '@isdd/metais-common/components/FileUpload/FileUpload'
import { useActionSuccess } from '@isdd/metais-common/contexts/actionSuccess/actionSuccessContext'
import { NavigationSubRoutes } from '@isdd/metais-common/navigation/routeNames'
import React, { useCallback, useMemo, useRef, useState } from 'react'
import { FieldValues } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { v4 as uuidV4 } from 'uuid'
import { useQueryClient } from '@tanstack/react-query'

import { mapUploadedFilesToApiAttachment } from '@/components/views/standardization/votes/VoteComposeForm/functions/voteEditFunc'

export interface IView {
    data: {
        requestData?: ApiStandardRequest
        guiAttributes?: Attribute[]
        workGroup?: Group
    }
    isLoading: boolean
    isError: boolean
    fileUploadRef: React.RefObject<IFileUploadRef>
    handleUploadSuccess: (data: FileUploadData[]) => void
    onFileUploadFailed: () => void
    onSubmit: (values: FieldValues) => void
}
interface IReportsDetailContainer {
    entityId?: string
    View: React.FC<IView>
}
export const DraftsListFormContainer: React.FC<IReportsDetailContainer> = ({ entityId, View }) => {
    const { setIsActionSuccess } = useActionSuccess()
    const navigate = useNavigate()
    const { isLoading: dataIsLoading, isError: dataIsError, data: requestData } = useGetStandardRequestDetail(parseInt(entityId ?? ''))
    const { isLoading: guiDataIsLoading, isError: guiDataIsError, data: guiData } = useGetAttributeProfile(Gui_Profil_Standardy)

    const fileUploadRef = useRef<IFileUploadRef>(null)

    const [creatingFilesLoading, setCreatingFilesLoading] = useState(false)
    const queryKey = getGetStandardRequestDetailQueryKey(Number(entityId))
    const queryClient = useQueryClient()
    const handleUploadData = useCallback(() => {
        fileUploadRef.current?.startUploading()
    }, [])

    const {
        mutateAsync: updateDraft,
        isError: isUpdateError,
        isLoading: isUpdateLoading,
    } = useUpdateStandardRequest({
        mutation: {
            onSuccess: (resp) => {
                if (fileUploadRef.current?.getFilesToUpload()?.length ?? 0 > 0) {
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
                    setCreatingFilesLoading(true)
                    handleUploadData()
                }
            },
        },
    })

    const guiAttributes: Attribute[] = useMemo(() => {
        return [
            ...(guiData?.attributes?.map((attr) => ({
                ...attr,
                technicalName: guiProfilStandardRequestMap?.get(attr?.technicalName ?? '') ?? attr?.technicalName,
            })) ?? []),
        ]
    }, [guiData])

    const workingGroupId = useMemo(() => requestData?.workGroupId, [requestData])
    const {
        data: workGroup,
        isLoading: workGroupIsLoading,
        isError: workGroupIsError,
    } = useFindByUuid3(workingGroupId ?? '', { query: { enabled: !!workingGroupId } })
    const isLoading = dataIsLoading || guiDataIsLoading || (workGroupIsLoading && !!workingGroupId) || isUpdateLoading || creatingFilesLoading
    const isError = dataIsError || guiDataIsError || workGroupIsError || isUpdateError

    const onSubmit = (values: FieldValues) => {
        const files = fileUploadRef.current?.getFilesToUpload()
        const fileIds = Object.values(fileUploadRef.current?.fileUuidsMapping().current ?? {})

        updateDraft({
            standardRequestId: Number(entityId) ?? 0,
            data: {
                ...values,
                attachments: requestData?.attachments?.concat(
                    mapUploadedFilesToApiAttachment(
                        files?.map((file, index) => {
                            return { ...file, fileId: fileIds[index] }
                        }) ?? [],
                    ),
                ),
            },
        })
    }

    const handleUploadSuccess = () => {
        setCreatingFilesLoading(false)
        setIsActionSuccess({ value: true, path: NavigationSubRoutes.ZOZNAM_NAVRHOV + '/' + entityId, additionalInfo: { type: 'edit' } })
        queryClient.invalidateQueries(queryKey)
        navigate(NavigationSubRoutes.ZOZNAM_NAVRHOV + '/' + entityId)
    }
    const onFileUploadFailed = () => {
        setCreatingFilesLoading(false)
    }

    return (
        <View
            data={{ requestData, guiAttributes, workGroup }}
            handleUploadSuccess={handleUploadSuccess}
            fileUploadRef={fileUploadRef}
            isLoading={isLoading}
            isError={isError}
            onSubmit={onSubmit}
            onFileUploadFailed={onFileUploadFailed}
        />
    )
}
