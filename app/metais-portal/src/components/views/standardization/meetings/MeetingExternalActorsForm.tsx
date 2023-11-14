import { Input, TextHeading } from '@isdd/idsk-ui-kit'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { FieldErrors } from 'react-hook-form'

import { MeetingFormEnum } from './meetingSchema'

interface IMeetingExternalActorsForm {
    meetingActor: Record<string, string>
    // setValue?: UseFormSetValue<ApiMeetingExternalActor[]>
    index: number
    errors?: FieldErrors<{
        [x: string]: string | number | boolean | Date | null | undefined
    }>
}

export const MeetingExternalActorsForm = ({ meetingActor, index }: IMeetingExternalActorsForm) => {
    const { t } = useTranslation()

    return (
        <>
            <TextHeading size={'S'}>
                {t('meetings.guestNumber')} {index + 1}:
            </TextHeading>
            <Input
                label={`${t('meetings.form.externalActorName')} (${t('meetings.mandatory')}):`}
                // error={errors[MeetingFormEnum.MEETING_EXTERNAL_ACTORS_NAME]?.message}
                name={`${MeetingFormEnum.MEETING_EXTERNAL_ACTORS}[${index}].name`}
                defaultValue={meetingActor?.name}
            />
            <Input
                label={`${t('meetings.form.externalActorEmail')} (${t('meetings.mandatory')}):`}
                //error={errors[MeetingFormEnum.MEETING_EXTERNAL_ACTORS_EMAIL]?.message}
                name={`${MeetingFormEnum.MEETING_EXTERNAL_ACTORS}[${index}].email`}
                defaultValue={meetingActor?.email}
            />
            <Input
                label={`${t('meetings.form.externalActorDescription')}:`}
                //error={errors[MeetingFormEnum.MEETING_EXTERNAL_ACTORS_DESCRIPTION]?.message}
                name={`${MeetingFormEnum.MEETING_EXTERNAL_ACTORS}[${index}].description`}
                defaultValue={meetingActor?.description}
            />
        </>
    )
}
