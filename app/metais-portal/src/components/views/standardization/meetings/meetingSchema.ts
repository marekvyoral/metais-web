import { ApiAttachment, ApiLink, ApiMeetingActor } from '@isdd/metais-common/api/generated/standards-swagger'
import { TFunction } from 'i18next'
import { object, string, array, mixed } from 'yup'

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
    MEETING_LINKS = 'documentLinks',
    MEETING_CHANGE_REASON = 'descriptionOfChange',
    MEETING_PROPOSAL = 'meetingProposal',
    NOTIF_NEW_USERS = 'notifNewUsers',
    IGNORE_PERSONAL_SETTINGS = 'ignorePersonalSettings',
}

export const createMeetingSchema = (t: TFunction<'translation', undefined, 'translation'>) => {
    return object().shape({
        [MeetingFormEnum.NAME]: string().required(t('meetings.errors.meetingNameRequired')),
        [MeetingFormEnum.DATE]: string()
            .required(t('meetings.errors.meetingDateRequired'))
            .test('timeStartValidation', t('meetings.errors.meetingDateRequired'), (value) => value.length > 0 && value != 'Invalid DateTime'),
        [MeetingFormEnum.TIME_START]: string()
            .required(t('meetings.errors.meetingTimeStartRequired'))
            .test('timeStartValidation', t('meetings.errors.meetingTimeStartRequired'), (value) => value.length > 0 && value != 'Invalid DateTime'),
        [MeetingFormEnum.TIME_END]: string()
            .required(t('meetings.errors.meetingTimeEndRequired'))
            .test('timeStartValidation', t('meetings.errors.meetingTimeEndRequired'), (value) => value.length > 0 && value != 'Invalid DateTime'),
        [MeetingFormEnum.PLACE]: string().required(t('meetings.errors.meetingPlaceRequired')),
        [MeetingFormEnum.GROUP]: array().of(string()),
        [MeetingFormEnum.MEETING_ACTORS]: mixed<ApiMeetingActor[]>().test({
            message: t('meetings.errors.meetingActorsRequired'),
            test: (value) => Array.isArray(value) && value.length > 0,
        }),
        [MeetingFormEnum.MEETING_EXTERNAL_ACTORS]: array(
            object().shape({
                name: string().required(t('meetings.errors.meetingExternalActorsNameRequired')),
                email: string().email(t('validation.invalidEmail')).required(t('meetings.errors.meetingExternalActorsEmailRequired')),
                description: string(),
            }),
        ),
        [MeetingFormEnum.DESCRIPTION]: string().required(t('meetings.errors.meetingDescriptionRequired')),
        [MeetingFormEnum.MEETING_PROPOSAL]: array().of(string()),
        [MeetingFormEnum.MEETING_ATTACHMENTS]: mixed<ApiAttachment[]>(),
        [MeetingFormEnum.MEETING_LINKS]: mixed<ApiLink[]>(),
    })
}

export const editMeetingSchema = (t: TFunction<'translation', undefined, 'translation'>) => {
    return object().shape({
        [MeetingFormEnum.NAME]: string().required(t('meetings.errors.meetingNameRequired')),
        [MeetingFormEnum.DATE]: string()
            .required(t('meetings.errors.meetingDateRequired'))
            .test('timeStartValidation', t('meetings.errors.meetingDateRequired'), (value) => value.length > 0 && value != 'Invalid DateTime'),
        [MeetingFormEnum.TIME_START]: string()
            .required(t('meetings.errors.meetingTimeStartRequired'))
            .test('timeStartValidation', t('meetings.errors.meetingTimeStartRequired'), (value) => value.length > 0 && value != 'Invalid DateTime'),
        [MeetingFormEnum.TIME_END]: string()
            .required(t('meetings.errors.meetingTimeEndRequired'))
            .test('timeStartValidation', t('meetings.errors.meetingTimeEndRequired'), (value) => value.length > 0 && value != 'Invalid DateTime'),
        [MeetingFormEnum.PLACE]: string().required(t('meetings.errors.meetingPlaceRequired')),
        [MeetingFormEnum.GROUP]: array().of(string()),
        [MeetingFormEnum.MEETING_ACTORS]: mixed<ApiMeetingActor[]>().test({
            message: t('meetings.errors.meetingActorsRequired'),
            test: (value) => Array.isArray(value) && value.length > 0,
        }),
        [MeetingFormEnum.MEETING_EXTERNAL_ACTORS]: array(
            object().shape({
                name: string().required(t('meetings.errors.meetingExternalActorsNameRequired')),
                email: string().required(t('meetings.errors.meetingExternalActorsEmailRequired')),
                description: string(),
            }),
        ),
        [MeetingFormEnum.DESCRIPTION]: string().required(t('meetings.errors.meetingDescriptionRequired')),
        [MeetingFormEnum.MEETING_PROPOSAL]: array().of(string()),
        [MeetingFormEnum.MEETING_ATTACHMENTS]: mixed<ApiAttachment[]>(),
        [MeetingFormEnum.MEETING_LINKS]: mixed<ApiLink[]>(),
    })
}
