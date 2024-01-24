import { TFunction } from 'i18next'
import { object, string } from 'yup'

export enum GroupFormEnum {
    NAME = 'name',
    SHORT_NAME = 'shortName',
    DESCRIPTION = 'description',
    USER = 'user',
    ORGANIZATION = 'organization',
}

export const createGroupSchema = (t: TFunction<'translation', undefined, 'translation'>) => {
    return object().shape({
        [GroupFormEnum.NAME]: string().required(t('groups.errors.groupNameRequired')),
        [GroupFormEnum.SHORT_NAME]: string().required(t('groups.errors.groupShortNameRequired')),
        [GroupFormEnum.DESCRIPTION]: string().required(t('groups.errors.descriptionRequired')),
        [GroupFormEnum.USER]: string().required(t('groups.errors.chairmanRequired')),
        [GroupFormEnum.ORGANIZATION]: string().required(t('groups.errors.organizationRequired')),
    })
}

export const editGroupSchema = (t: TFunction<'translation', undefined, 'translation'>) => {
    return object().shape({
        [GroupFormEnum.NAME]: string().required(t('groups.errors.groupNameRequired')),
        [GroupFormEnum.SHORT_NAME]: string().required(t('groups.errors.groupShortNameRequired')),
        [GroupFormEnum.DESCRIPTION]: string().required(t('groups.errors.descriptionRequired')),
        [GroupFormEnum.USER]: string(),
        [GroupFormEnum.ORGANIZATION]: string(),
    })
}
