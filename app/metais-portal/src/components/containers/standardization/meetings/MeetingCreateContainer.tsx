import { NavigationSubRoutes } from '@isdd/metais-common/navigation/routeNames'
import React, { useCallback, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FieldValues } from 'react-hook-form'
import { useCreateMeeting } from '@isdd/metais-common/api/generated/standards-swagger'
import { useActionSuccess } from '@isdd/metais-common/contexts/actionSuccess/actionSuccessContext'
import { IFileUploadRef } from '@isdd/metais-common/components/FileUpload/FileUpload'
import { formatDateTimeForAPI } from '@isdd/metais-common/index'

import { MeetingCreateEditView } from '@/components/views/standardization/meetings/MeetingCreateEditView'
import { MeetingFormEnum } from '@/components/views/standardization/meetings/meetingSchema'
import { mapUploadedFilesToApiAttachment } from '@/components/views/standardization/votes/VoteComposeForm/functions/voteEditFunc'

export const MeetingCreateContainer: React.FC = () => {
    const navigate = useNavigate()
    const { setIsActionSuccess } = useActionSuccess()
    const goBack = () => {
        navigate(NavigationSubRoutes.ZOZNAM_ZASADNUTI)
    }
    const fileUploadRef = useRef<IFileUploadRef>(null)

    const handleUploadData = useCallback(() => {
        fileUploadRef.current?.startUploading()
    }, [])

    const [meetingId, setMeetingId] = useState(0)
    const [creatingFilesLoading, setCreatingFilesLoading] = useState(false)

    const {
        mutate: createMeeting,
        isLoading,
        isError,
    } = useCreateMeeting({
        mutation: {
            onSuccess(data) {
                setMeetingId(data.id ?? 0)
                setCreatingFilesLoading(true)
                setTimeout(() => {
                    if (fileUploadRef.current?.getFilesToUpload()?.length ?? 0 > 0) {
                        handleUploadData()
                    }
                }, 100)
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
        setIsActionSuccess({ value: true, path: NavigationSubRoutes.ZOZNAM_ZASADNUTI })
        goBack()
    }

    const handleUploadSuccess = () => {
        setCreatingFilesLoading(false)
        setIsActionSuccess({ value: true, path: NavigationSubRoutes.ZOZNAM_ZASADNUTI })
        goBack()
    }

    return (
        <MeetingCreateEditView
            onSubmit={onSubmit}
            goBack={goBack}
            infoData={undefined}
            fileUploadRef={fileUploadRef}
            handleDeleteSuccess={handleDeleteSuccess}
            handleUploadSuccess={handleUploadSuccess}
            isEdit={false}
            isLoading={isLoading || creatingFilesLoading}
            isError={isError}
            id={meetingId.toString()}
        />
    )
}
