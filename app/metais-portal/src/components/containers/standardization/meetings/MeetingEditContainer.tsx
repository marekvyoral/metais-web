import React from 'react'
import { FieldValues } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import {
    ApiAttachment,
    ApiMeetingRequest,
    useGetMeetingRequestDetail,
    useUpdateMeetingRequest,
} from '@isdd/metais-common/api/generated/standards-swagger'
import { useActionSuccess } from '@isdd/metais-common/contexts/actionSuccess/actionSuccessContext'
import { NavigationSubRoutes } from '@isdd/metais-common/navigation/routeNames'

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
    onSubmit: (formData: FieldValues, attachments: ApiAttachment[]) => void
    goBack: () => void
    infoData: ApiMeetingRequest | undefined
    isEdit?: boolean
    id?: string
    isLoading: boolean
    isError: boolean
}

interface IMeetingEditContainer {
    id?: string
    View: React.FC<IMeetingEditViewParams>
}

export const MeetingEditContainer: React.FC<IMeetingEditContainer> = ({ id }) => {
    const navigate = useNavigate()
    const { setIsActionSuccess } = useActionSuccess()
    const { data: infoData, isLoading: meetingDetailLoading, isError: meetingDetailError } = useGetMeetingRequestDetail(Number(id))

    const goBack = () => {
        navigate(`${NavigationSubRoutes.ZOZNAM_ZASADNUTI}/${id}`)
    }
    const {
        mutate: updateMeeting,
        isLoading: updateMeetingLoading,
        isError: updateMeetingError,
    } = useUpdateMeetingRequest({
        mutation: {
            onSuccess() {
                setIsActionSuccess({ value: true, path: `${NavigationSubRoutes.ZOZNAM_ZASADNUTI}/${id}` })
                goBack()
            },
        },
    })
    const isLoading = meetingDetailLoading || updateMeetingLoading
    const isError = meetingDetailError || updateMeetingError
    const onSubmit = (formData: FieldValues, attachments: ApiAttachment[]) => {
        updateMeeting({
            data: {
                id: infoData?.id,
                name: formData[MeetingFormEnum.NAME],
                description: formData[MeetingFormEnum.DESCRIPTION],
                beginDate: `${formData[MeetingFormEnum.DATE]}T${formData[MeetingFormEnum.TIME_START]}:00.000Z`,
                endDate: `${formData[MeetingFormEnum.DATE]}T${formData[MeetingFormEnum.TIME_END]}:00.000Z`,
                place: formData[MeetingFormEnum.PLACE],
                meetingActors: formData[MeetingFormEnum.MEETING_ACTORS],
                standardRequestIds: formData[MeetingFormEnum.MEETING_PROPOSAL],
                descriptionOfChange: formData[MeetingFormEnum.MEETING_CHANGE_REASON],
                notifNewUsers: formData[MeetingFormEnum.NOTIF_NEW_USERS],
                ignorePersonalSettings: formData[MeetingFormEnum.IGNORE_PERSONAL_SETTINGS],
                meetingExternalActors: formData[MeetingFormEnum.MEETING_EXTERNAL_ACTORS],
                meetingLinks: formData[MeetingFormEnum.MEETING_LINKS],
                meetingAttachments: attachments,
            },
            meetingRequestId: infoData?.id || 0,
        })
    }

    return <MeetingCreateEditView onSubmit={onSubmit} goBack={goBack} infoData={infoData} isEdit isLoading={isLoading} isError={isError} />
}
