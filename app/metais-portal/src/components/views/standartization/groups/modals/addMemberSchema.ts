import { TFunction } from 'i18next'
import { boolean, object, string } from 'yup'

export enum AddMemberEnum {
    MEMBER = 'member',
    ORGANIZATION = 'organization',
    ROLE = 'role',
    ADD_TO_SESSIONS = 'addToSessions',
    ADD_TO_POLLS = 'addToPolls',
    CAN_SEE_EMAILS = 'canSeeEmails',
}

export const addMemberSchema = (t: TFunction<'translation', undefined, 'translation'>) => {
    return object().shape({
        [AddMemberEnum.MEMBER]: string().required('member req error'),
        [AddMemberEnum.ORGANIZATION]: string(),
        [AddMemberEnum.ROLE]: string().required(t('codelists.descriptionError')),
        [AddMemberEnum.ADD_TO_SESSIONS]: boolean(),
        [AddMemberEnum.ADD_TO_POLLS]: boolean(),
        [AddMemberEnum.CAN_SEE_EMAILS]: boolean(),
    })
}
