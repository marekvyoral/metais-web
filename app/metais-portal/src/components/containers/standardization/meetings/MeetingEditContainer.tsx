import React from 'react'
import { QueryFeedback } from '@isdd/metais-common/index'
import { FieldValues } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { ApiMeetingRequest, useGetMeetingRequestDetail, useUpdateMeetingRequest } from '@isdd/metais-common/api/generated/standards-swagger'

import { MeetingCreateEditView } from '@/components/views/standardization/meetings/MeetingCreateEditView'
import { MeetingFormEnum } from '@/components/views/standardization/meetings/meetingSchema'

export interface IMeetingForm {
    name: string
    beginDate: string
    endDate: string
    description: string
    place: string
}

export interface IMeetingEditViewParams {
    onSubmit: (formData: FieldValues) => void
    goBack: () => void
    infoData: ApiMeetingRequest | undefined
    isEdit?: boolean
    id?: string
}

interface IMeetingEditContainer {
    id?: string
    View: React.FC<IMeetingEditViewParams>
}

export const MeetingEditContainer: React.FC<IMeetingEditContainer> = ({ id }) => {
    const navigate = useNavigate()

    const { data: infoData, isLoading, isError } = useGetMeetingRequestDetail(Number(id))

    const goBack = () => {
        navigate(-1)
    }
    const { mutate: updateMeeting } = useUpdateMeetingRequest({
        mutation: {
            onSuccess() {
                goBack()
            },
        },
    })

    const onSubmit = (formData: FieldValues) => {
        //console.log('dadt', formData)
        updateMeeting({
            data: {
                id: infoData?.id,
                name: formData[MeetingFormEnum.NAME],
                // description: formData[MeetingFormEnum.DESCRIPTION],
                // beginDate: formData[MeetingFormEnum.DATE],
                // // + formData[MeetingFormEnum.TIME_START]
                // endDate: formData[MeetingFormEnum.DATE],
                // // + formData[MeetingFormEnum.TIME_END]
                // // state: ,
                // place: formData[MeetingFormEnum.PLACE],
                // groups: formData[MeetingFormEnum.GROUP],
                // meetingActors: formData[MeetingFormEnum.MEETING_ACTORS],
                // meetingExternalActors: formData[MeetingFormEnum.MEETING_EXTERNAL_ACTORS_NAME],
                // // formData[MeetingFormEnum.MEETING_EXTERNAL_ACTORS_EMAIL],
                // // formData[MeetingFormEnum.MEETING_EXTERNAL_ACTORS_DESCRIPTION],
                // meetingAttachments: formData[MeetingFormEnum.MEETING_ATTACHMENTS],
                // meetingLinks: formData[MeetingFormEnum.MEETING_LINKS],
            },
            meetingRequestId: 1, /// change
        })
    }

    return (
        <QueryFeedback loading={isLoading} error={isError}>
            <MeetingCreateEditView onSubmit={onSubmit} goBack={goBack} infoData={infoData} isEdit />
        </QueryFeedback>
    )
}
