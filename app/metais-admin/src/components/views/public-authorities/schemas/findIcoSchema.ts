import * as yup from 'yup'
import { TFunction } from 'i18next'

export const generateFindIcoSchema = (t: TFunction<'translation', undefined, 'translation'>) => {
    return yup.object().shape({
        ico: yup
            .string()
            .required(t('publicAuthorities.find.icoRequired'))
            .matches(/^[0-9]{8}$|^[0-9]{12}$/, t('publicAuthorities.find.icoRegex')),
    })
}
