import { TFunction } from 'i18next'
import { boolean, number, object, string } from 'yup'

export enum CodelistDetailEnum {
    CODE = 'code',
    VALUE = 'value',
    ENG_VALUE = 'engValue',
    DESCRIPTION = 'description',
    ENG_DESCRIPTION = 'engDescription',
    VALIDITY = 'valid',
    ORDER = 'orderList',
}

const MAX_DESCRIPTION_CHAR_NUMBER = 255

export const codeListDetailCreateSchema = (t: TFunction<'translation', undefined, 'translation'>, itemCodes: Array<string | undefined>) => {
    const regexPattern = /^[A-Z_]+$/
    return object().shape({
        [CodelistDetailEnum.ORDER]: number(),
        [CodelistDetailEnum.CODE]: string()
            .matches(regexPattern, t('codelists.wrongRegex', { letters: 'A-Z', signs: '_' }))
            .notOneOf(itemCodes, t('codelists.codeExist'))
            .required(t('codelists.codeError')),
        [CodelistDetailEnum.VALUE]: string().required(t('codelists.valueError')),
        [CodelistDetailEnum.ENG_VALUE]: string().required(t('codelists.engValueError')),
        [CodelistDetailEnum.DESCRIPTION]: string()
            .required(t('codelists.descriptionError'))
            .max(MAX_DESCRIPTION_CHAR_NUMBER, t('codelists.descriptionMaxError', { charNumber: MAX_DESCRIPTION_CHAR_NUMBER })),
        [CodelistDetailEnum.ENG_DESCRIPTION]: string()
            .required(t('codelists.engDescriptionError'))
            .max(MAX_DESCRIPTION_CHAR_NUMBER, t('codelists.descriptionMaxError', { charNumber: MAX_DESCRIPTION_CHAR_NUMBER })),
        [CodelistDetailEnum.VALIDITY]: boolean(),
    })
}
