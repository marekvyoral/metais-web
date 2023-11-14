import { useTranslation } from 'react-i18next'
import { AnyObject, ObjectSchema, object, string } from 'yup'

import { TEkoCodeDecorated } from '@/components/views/eko/ekoCodes'

interface IOutput {
    schema: ObjectSchema<
        {
            name: string
            ekoCode: string
        },
        AnyObject,
        {
            name: undefined
            ekoCode: undefined
        },
        ''
    >
}

export const useValidationSchemaForm = (data: TEkoCodeDecorated[]): IOutput => {
    const { t } = useTranslation()
    const schema = object().shape({
        name: string().required(t('eko.validation.requiredField')),
        ekoCode: string()
            .required(t('eko.validation.requiredField'))
            .length(6, t('eko.validation.exactLength', { length: 6 }))
            .notOneOf(
                data?.map((item) => item.ekoCode),
                t('eko.validation.uniqueEkoCode'),
            ),
    })

    return {
        schema,
    }
}
