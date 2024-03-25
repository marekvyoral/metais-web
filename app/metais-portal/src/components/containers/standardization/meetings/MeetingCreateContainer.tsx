import { NavigationSubRoutes } from '@isdd/metais-common/navigation/routeNames'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FieldValues } from 'react-hook-form'
import { useCreateMeeting } from '@isdd/metais-common/api/generated/standards-swagger'
import { useActionSuccess } from '@isdd/metais-common/contexts/actionSuccess/actionSuccessContext'
import { IFileUploadRef } from '@isdd/metais-common/components/FileUpload/FileUpload'
import { formatDateTimeForAPI } from '@isdd/metais-common/index'
import { v4 as uuidV4 } from 'uuid'

import { MeetingCreateEditView } from '@/components/views/standardization/meetings/MeetingCreateEditView'
import { MeetingFormEnum } from '@/components/views/standardization/meetings/meetingSchema'
import { mapUploadedFilesToApiAttachment } from '@/components/views/standardization/votes/VoteComposeForm/functions/voteEditFunc'

export const MeetingCreateContainer: React.FC = () => {
    const navigate = useNavigate()
    const { setIsActionSuccess } = useActionSuccess()

    const fileUploadRef = useRef<IFileUploadRef>(null)

    const handleUploadData = useCallback(() => {
        fileUploadRef.current?.startUploading()
    }, [])

    const [meetingId, setMeetingId] = useState(0)
    const [creatingFilesLoading, setCreatingFilesLoading] = useState(false)

    useEffect(() => {
        if (meetingId != 0 && (fileUploadRef.current?.getFilesToUpload()?.length ?? 0 > 0)) {
            setCreatingFilesLoading(true)
            handleUploadData()
        } else if (meetingId != 0) {
            setIsActionSuccess({ value: true, path: `${NavigationSubRoutes.ZOZNAM_ZASADNUTI}/${meetingId}`, additionalInfo: { type: 'create' } })
            navigate(`${NavigationSubRoutes.ZOZNAM_ZASADNUTI}/${meetingId}`)
        }
    }, [handleUploadData, meetingId, navigate, setIsActionSuccess])

    const {
        mutateAsync: createMeeting,
        isLoading,
        isError,
        error: actionError,
    } = useCreateMeeting({
        mutation: {
            onSuccess(data) {
                setMeetingId(data.id ?? 0)
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
            },
        },
    })

    const onSubmit = (formData: FieldValues) => {
        const files = fileUploadRef.current?.getFilesToUpload()
        const fileIds = Object.values(fileUploadRef.current?.fileUuidsMapping().current ?? {})
        createMeeting({
            data: {
                name: formData[MeetingFormEnum.NAME],
                description: formData[MeetingFormEnum.DESCRIPTION],
                beginDate: formatDateTimeForAPI(formData[MeetingFormEnum.BEGIN_DATE]),
                endDate: formatDateTimeForAPI(formData[MeetingFormEnum.END_DATE]),
                place: formData[MeetingFormEnum.PLACE],
                groups: formData[MeetingFormEnum.GROUP],
                meetingActors: formData[MeetingFormEnum.MEETING_ACTORS],
                ...(formData[MeetingFormEnum.MEETING_PROPOSAL]?.length > 0 && { standardRequestIds: formData[MeetingFormEnum.MEETING_PROPOSAL] }),
                ...(formData[MeetingFormEnum.MEETING_EXTERNAL_ACTORS]?.length > 0 && {
                    meetingExternalActors: formData[MeetingFormEnum.MEETING_EXTERNAL_ACTORS],
                }),
                meetingLinks: formData[MeetingFormEnum.MEETING_LINKS],
                meetingAttachments: mapUploadedFilesToApiAttachment(
                    files?.map((file, index) => {
                        return { ...file, fileId: fileIds[index] }
                    }) ?? [],
                ),
            },
        })
    }

    const handleDeleteSuccess = () => {
        setIsActionSuccess({ value: true, path: `${NavigationSubRoutes.ZOZNAM_ZASADNUTI}/${meetingId}`, additionalInfo: { type: 'create' } })
        navigate(`${NavigationSubRoutes.ZOZNAM_ZASADNUTI}/${meetingId}`)
    }

    const handleUploadSuccess = () => {
        setCreatingFilesLoading(false)
        setIsActionSuccess({ value: true, path: `${NavigationSubRoutes.ZOZNAM_ZASADNUTI}/${meetingId}`, additionalInfo: { type: 'create' } })
        navigate(`${NavigationSubRoutes.ZOZNAM_ZASADNUTI}/${meetingId}`)
    }

    return (
        <MeetingCreateEditView
            onSubmit={onSubmit}
            infoData={undefined}
            fileUploadRef={fileUploadRef}
            handleDeleteSuccess={handleDeleteSuccess}
            handleUploadSuccess={handleUploadSuccess}
            isEdit={false}
            isLoading={isLoading || creatingFilesLoading}
            isActionError={isError}
            actionError={actionError}
            id={meetingId.toString()}
        />
    )
}
