import { TFunction } from 'i18next'
import { object, string, array } from 'yup'

export enum MeetingFormEnum {
    NAME = 'name',
    DATE = 'date',
    TIME_START = 'timeStart',
    TIME_END = 'timeEnd',
    PLACE = 'place',
    GROUP = 'group',
    MEETING_ACTORS = 'meetingActors',
    MEETING_EXTERNAL_ACTORS = 'meetingExternalActors',
    MEETING_EXTERNAL_ACTORS_NAME = 'meetingExternalActorsName',
    MEETING_EXTERNAL_ACTORS_EMAIL = 'meetingExternalActorsEmail',
    MEETING_EXTERNAL_ACTORS_DESCRIPTION = 'meetingExternalActorsDescription',
    DESCRIPTION = 'description',
    MEETING_ATTACHMENTS = 'meetingAttachments',
    MEETING_LINKS = 'meetingLinks',

    MEETING_PROPOSAL = 'meetingProposal',
}

export const createMeetingSchema = (t: TFunction<'translation', undefined, 'translation'>) => {
    return object().shape({
        [MeetingFormEnum.NAME]: string().required(t('meeting.errors.meetingNameRequired')),
        [MeetingFormEnum.DATE]: string().required(t('meeting.errors.meetingDateRequired')),
        [MeetingFormEnum.TIME_START]: string().required(t('meeting.errors.meetingTimeStartRequired')),
        [MeetingFormEnum.TIME_END]: string().required(t('meeting.errors.meetingTimeEndRequired')),
        [MeetingFormEnum.PLACE]: string().required(t('meeting.errors.meetingPlaceRequired')),
        [MeetingFormEnum.GROUP]: string().required(t('meeting.errors.meetingGroupRequired')),
        [MeetingFormEnum.MEETING_ACTORS]: array().of(string()).required(t('meeting.errors.meetingActorsRequired')),
        [MeetingFormEnum.MEETING_EXTERNAL_ACTORS]: array(
            object().shape({
                name: string().required(t('meeting.errors.meetingExternalActorsNameRequired')),
                email: string().required(t('meeting.errors.meetingExternalActorsEmailRequired')),
                description: string(),
            }),
        ),
        [MeetingFormEnum.DESCRIPTION]: string().required(t('meeting.errors.meetingDescriptionRequired')),
        [MeetingFormEnum.MEETING_ATTACHMENTS]: string(),
        [MeetingFormEnum.MEETING_LINKS]: string(),
        [MeetingFormEnum.MEETING_PROPOSAL]: string(),
    })
}

export const editMeetingSchema = (t: TFunction<'translation', undefined, 'translation'>) => {
    return object().shape({
        [MeetingFormEnum.NAME]: string(),
        [MeetingFormEnum.DATE]: string(),
        [MeetingFormEnum.TIME_START]: string(),
        [MeetingFormEnum.TIME_END]: string(),
        [MeetingFormEnum.PLACE]: string(),
        [MeetingFormEnum.DESCRIPTION]: string(),
        [MeetingFormEnum.MEETING_ACTORS]: array().of(string()),
        [MeetingFormEnum.MEETING_EXTERNAL_ACTORS]: array(
            object().shape({
                name: string().required(t('meeting.errors.meetingExternalActorsNameRequired')),
                email: string().required(t('meeting.errors.meetingExternalActorsEmailRequired')),
                description: string(),
            }),
        ),
        // [MeetingFormEnum.MEETING_ATTACHMENTS]: string(),
        // [MeetingFormEnum.MEETING_LINKS]: string(),
        // [MeetingFormEnum.MEETING_PROPOSAL]: string(),
    })
}
