import * as yup from 'yup'
import { AttributeProfile } from '@isdd/metais-common/api/generated/types-repo-swagger'
import { TFunction } from 'i18next'

export const generateSchemaForCreateAttribute = (t: TFunction<'translation', undefined, 'translation'>) => {
    return yup.object().shape({
        name: yup.string().required(t('egov.create.requiredField')),
        engName: yup.string().required(),
        technicalName: yup
            .string()
            .required(t('egov.create.requiredField'))
            .min(2)
            .matches(/^[a-z-A-Z_]+$/, t('egov.create.technicalNameRegex')),
        order: yup.number().required(t('egov.create.requiredField')),
        description: yup.string().required(t('egov.create.requiredField')),
        engDescription: yup.string(),
        attributeProfiles: yup.mixed<AttributeProfile[]>(),
        type: yup.string(),
        units: yup.string(),
        defaultValue: yup.mixed<boolean | string | number>(),
        constraints: yup.mixed(),
    })
}
