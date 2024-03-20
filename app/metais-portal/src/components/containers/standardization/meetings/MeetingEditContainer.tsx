import React, { useCallback, useRef, useState } from 'react'
import { FieldValues } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import {
    ApiAttachment,
    ApiLink,
    ApiMeetingRequest,
    getGetMeetingRequestDetailQueryKey,
    useGetMeetingRequestDetail,
    useUpdateMeetingRequest,
} from '@isdd/metais-common/api/generated/standards-swagger'
import { useActionSuccess } from '@isdd/metais-common/contexts/actionSuccess/actionSuccessContext'
import { NavigationSubRoutes } from '@isdd/metais-common/navigation/routeNames'
import { useQueryClient } from '@tanstack/react-query'
import { FileUploadData, IFileUploadRef } from '@isdd/metais-common/components/FileUpload/FileUpload'
import { formatDateTimeForAPI } from '@isdd/metais-common/index'
import { v4 as uuidV4 } from 'uuid'

import { MeetingCreateEditView } from '@/components/views/standardization/meetings/MeetingCreateEditView'
import { MeetingFormEnum } from '@/components/views/standardization/meetings/meetingSchema'
import { IExistingFilesHandlerRef } from '@/components/views/standardization/votes/VoteComposeForm/components/ExistingFilesHandler/ExistingFilesHandler'
import {
    mapProcessedExistingFilesToApiAttachment,
    mapUploadedFilesToApiAttachment,
} from '@/components/views/standardization/votes/VoteComposeForm/functions/voteEditFunc'

export interface IMeetingForm {
    name: string
    beginDate: string
    endDate: string
    description: string
    place: string
}

export interface IMeetingEditViewParams {
    onSubmit: (formData: FieldValues, attachments: ApiAttachment[]) => void
    infoData: ApiMeetingRequest | undefined
    isEdit?: boolean
    id?: string
    isLoading: boolean
    isError: boolean
    fileUploadRef: React.RefObject<IFileUploadRef>
    existingFilesProcessRef?: React.RefObject<IExistingFilesHandlerRef>
    handleUploadSuccess: (data: FileUploadData[]) => void
    handleDeleteSuccess: () => void
}

interface IMeetingEditContainer {
    id?: string
    View: React.FC<IMeetingEditViewParams>
}

export const MeetingEditContainer: React.FC<IMeetingEditContainer> = ({ id }) => {
    const navigate = useNavigate()
    const { setIsActionSuccess } = useActionSuccess()
    const { data: infoData, isLoading: meetingDetailLoading, isError: meetingDetailError, refetch } = useGetMeetingRequestDetail(Number(id))
    const infoQueryKey = getGetMeetingRequestDetailQueryKey(Number(id))[0]
    const queryClient = useQueryClient()
    const fileUploadRef = useRef<IFileUploadRef>(null)
    const existingFilesProcessRef = useRef<IExistingFilesHandlerRef>(null)
    const attachmentsDataRef = useRef<ApiAttachment[]>([])

    const [creatingFilesLoading, setCreatingFilesLoading] = useState(false)
    const [deletingFilesLoading, setDeletingFilesLoading] = useState(false)

    const handleUploadData = useCallback(() => {
        fileUploadRef.current?.startUploading()
    }, [])

    const handleDeleteFiles = () => {
        existingFilesProcessRef?.current?.startFilesProcessing()
    }
    const {
        mutate: updateMeeting,
        isLoading: updateMeetingLoading,
        isError: updateMeetingError,
    } = useUpdateMeetingRequest({
        mutation: {
            onSuccess(data) {
                if (fileUploadRef.current?.getFilesToUpload()?.length ?? 0 > 0) {
                    fileUploadRef.current?.setCustomMeta({
                        'x-content-uuid': uuidV4(),
                        refAttributes: new Blob(
                            [
                                JSON.stringify({
                                    refType: 'MEETING_REQUEST',
                                    refMeetingRequestId: data.id,
                                }),
                            ],
                            { type: 'application/json' },
                        ),
                    })
                    setCreatingFilesLoading(true)
                    handleUploadData()
                } else {
                    setIsActionSuccess({ value: true, path: `${NavigationSubRoutes.ZOZNAM_ZASADNUTI}/${id}`, additionalInfo: { type: 'update' } })
                    queryClient.invalidateQueries([infoQueryKey])
                    navigate(`${NavigationSubRoutes.ZOZNAM_ZASADNUTI}/${id}`)
                }
            },
        },
    })
    const isLoading = meetingDetailLoading || updateMeetingLoading
    const isError = meetingDetailError || updateMeetingError
    const onSubmit = (formData: FieldValues) => {
        const files = fileUploadRef.current?.getFilesToUpload()
        const fileIds = Object.values(fileUploadRef.current?.fileUuidsMapping().current ?? {})
        const newFiles = mapUploadedFilesToApiAttachment(
            files?.map((file, index) => {
                return { ...file, fileId: fileIds[index] }
            }) ?? [],
        )
        const existingFiles = mapProcessedExistingFilesToApiAttachment(existingFilesProcessRef.current?.getRemainingFileList() ?? [])
        updateMeeting({
            data: {
                id: infoData?.id,
                name: formData[MeetingFormEnum.NAME],
                description: formData[MeetingFormEnum.DESCRIPTION],
                beginDate: formatDateTimeForAPI(formData[MeetingFormEnum.BEGIN_DATE]),
                endDate: formatDateTimeForAPI(formData[MeetingFormEnum.END_DATE]),
                place: formData[MeetingFormEnum.PLACE],
                meetingActors: formData[MeetingFormEnum.MEETING_ACTORS],
                standardRequestIds: formData[MeetingFormEnum.MEETING_PROPOSAL],
                descriptionOfChange: formData[MeetingFormEnum.MEETING_CHANGE_REASON],
                notifNewUsers: formData[MeetingFormEnum.NOTIF_NEW_USERS],
                ignorePersonalSettings: formData[MeetingFormEnum.IGNORE_PERSONAL_SETTINGS],
                meetingExternalActors: formData[MeetingFormEnum.MEETING_EXTERNAL_ACTORS],
                meetingLinks: formData[MeetingFormEnum.MEETING_LINKS].filter((meetingLink: ApiLink) => !!meetingLink),
                meetingAttachments: newFiles.concat(existingFiles),
            },
            meetingRequestId: infoData?.id || 0,
        })
    }
    const handleDeleteSuccess = () => {
        refetch().then(() => {
            setDeletingFilesLoading(false)
            setIsActionSuccess({ value: true, path: `${NavigationSubRoutes.ZOZNAM_ZASADNUTI}/${id}` })
            queryClient.invalidateQueries([infoQueryKey])
            navigate(`${NavigationSubRoutes.ZOZNAM_ZASADNUTI}/${id}`)
        })
    }

    const handleUploadSuccess = (data: FileUploadData[]) => {
        const attachmentsData = mapUploadedFilesToApiAttachment(data)
        if (existingFilesProcessRef.current?.hasDataToProcess()) {
            setDeletingFilesLoading(true)
            attachmentsDataRef.current = attachmentsData
            handleDeleteFiles()
        } else {
            refetch().then(() => {
                setCreatingFilesLoading(false)
                setIsActionSuccess({ value: true, path: `${NavigationSubRoutes.ZOZNAM_ZASADNUTI}/${id}` })
                queryClient.invalidateQueries([infoQueryKey])
                navigate(`${NavigationSubRoutes.ZOZNAM_ZASADNUTI}/${id}`)
            })
        }
    }

    return (
        <MeetingCreateEditView
            id={id}
            onSubmit={onSubmit}
            infoData={infoData}
            isEdit
            isLoading={isLoading || creatingFilesLoading || deletingFilesLoading}
            isError={isError}
            fileUploadRef={fileUploadRef}
            existingFilesProcessRef={existingFilesProcessRef}
            handleDeleteSuccess={handleDeleteSuccess}
            handleUploadSuccess={handleUploadSuccess}
        />
    )
}
