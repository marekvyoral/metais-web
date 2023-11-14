import { TFunction } from 'i18next'
import { boolean, object, string } from 'yup'

export enum CodelistEnum {
    CODE = 'code',
    NAME = 'name',
    DESCRIPTION = 'description',
    VALIDITY = 'valid',
    CATEGORY = 'category',
}

export const codeListCreateSchema = (t: TFunction<'translation', undefined, 'translation'>) => {
    const regexPattern = /^[A-Z_]+$/
    return object().shape({
        [CodelistEnum.CODE]: string()
            .matches(regexPattern, t('codelists.wrongRegex', { letters: 'A-Z', signs: '_' }))
            .required(t('codelists.codeError')),
        [CodelistEnum.NAME]: string().required(t('codelists.nameError')),
        [CodelistEnum.DESCRIPTION]: string().required(t('codelists.descriptionError')),
        [CodelistEnum.VALIDITY]: boolean(),
        [CodelistEnum.CATEGORY]: string(),
    })
}
