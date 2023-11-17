import { NavigationSubRoutes } from '@isdd/metais-common/navigation/routeNames'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { FieldValues } from 'react-hook-form'
import { useCreateVote1 } from '@isdd/metais-common/api/generated/standards-swagger'
import { useActionSuccess } from '@isdd/metais-common/contexts/actionSuccess/actionSuccessContext'

import { MeetingCreateEditView } from '@/components/views/standardization/meetings/MeetingCreateEditView'
import { MeetingFormEnum } from '@/components/views/standardization/meetings/meetingSchema'

export const MeetingCreateContainer: React.FC = () => {
    const navigate = useNavigate()
    const { setIsActionSuccess } = useActionSuccess()
    const goBack = () => {
        navigate(NavigationSubRoutes.ZOZNAM_ZASADNUTI)
    }

    const {
        mutate: createMeeting,
        isLoading,
        isError,
    } = useCreateVote1({
        mutation: {
            onSuccess() {
                setIsActionSuccess({ value: true, path: NavigationSubRoutes.ZOZNAM_ZASADNUTI })
                goBack()
            },
        },
    })

    const onSubmit = (formData: FieldValues) => {
        createMeeting({
            data: {
                name: formData[MeetingFormEnum.NAME],
                description: formData[MeetingFormEnum.DESCRIPTION],
                beginDate: `${formData[MeetingFormEnum.DATE]}T${formData[MeetingFormEnum.TIME_START]}:00.000`,
                endDate: `${formData[MeetingFormEnum.DATE]}T${formData[MeetingFormEnum.TIME_END]}:00.000`,
                place: formData[MeetingFormEnum.PLACE],
                groups: formData[MeetingFormEnum.GROUP],
                meetingActors: formData[MeetingFormEnum.MEETING_ACTORS],
                ...(formData[MeetingFormEnum.MEETING_PROPOSAL]?.length > 0 && { standardRequestIds: formData[MeetingFormEnum.MEETING_PROPOSAL] }),
                ...(formData[MeetingFormEnum.MEETING_EXTERNAL_ACTORS]?.length > 0 && {
                    meetingExternalActors: formData[MeetingFormEnum.MEETING_EXTERNAL_ACTORS],
                }),
            },
        })
    }
    return <MeetingCreateEditView onSubmit={onSubmit} goBack={goBack} infoData={undefined} isEdit={false} isLoading={isLoading} isError={isError} />
}
