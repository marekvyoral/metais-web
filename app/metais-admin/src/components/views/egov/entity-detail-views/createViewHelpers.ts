import * as yup from 'yup'
import { AttributeProfile, Cardinality, CiTypePreview } from '@isdd/metais-common/api'
import { TFunction } from 'i18next'

import { HiddenInputs } from '@/types/inputs'

export const generateFormValidationSchema = (t: TFunction<'translation', undefined, 'translation'>, hiddenInputs?: Partial<HiddenInputs>) => {
    return yup.object().shape(
        {
            name: yup.string().required(t('egov.create.requiredField')),
            engName: yup.string().required(t('egov.create.requiredField')),
            technicalName: yup
                .string()
                .required(t('egov.create.requiredField'))
                .min(2)
                .matches(/^[a-z-A-Z]+$/, t('egov.create.technicalNameRegex')),
            codePrefix: yup.string().when('codePrefix', {
                is: () => !hiddenInputs?.CODE_PREFIX,
                then: () =>
                    yup
                        .string()
                        .required(t('egov.create.requiredField'))
                        .matches(/^[a-z_\s]+$/, t('egov.create.codePrefixRegex')),
                otherwise: () => yup.string(),
            }),
            uriPrefix: yup.string().when('uriPrefix', {
                is: () => !hiddenInputs?.URI_PREFIX,
                then: () => yup.string().required(t('egov.create.requiredField')),
                otherwise: () => yup.string(),
            }),
            description: yup.string().required(t('egov.create.requiredField')),
            engDescription: yup.string().when('engDescription', {
                is: () => !hiddenInputs?.ENG_DESCRIPTION,
                then: () => yup.string().required(t('egov.create.requiredField')),
            }),
            attributeProfiles: yup.mixed<AttributeProfile[]>(),
            roleList: yup.array().of(yup.string()).required(t('egov.create.requiredField')),
            type: yup.string().required(t('egov.create.requiredField')),
            sources: yup.mixed<CiTypePreview[]>().when('sources', {
                is: () => !hiddenInputs?.SOURCES,
                then: () => yup.array().required(t('egov.create.requiredField')),
            }),
            sourceCardinality: yup.mixed<Cardinality>(),
            targets: yup.mixed<CiTypePreview[]>().when('targets', {
                is: () => !hiddenInputs?.TARGETS,
                then: () => yup.array().required(t('egov.create.requiredField')),
            }),
            targetCardinality: yup.mixed<Cardinality>(),
        },
        [
            ['uriPrefix', 'uriPrefix'],
            ['codePrefix', 'codePrefix'],
            ['sources', 'sources'],
            ['targets', 'targets'],
            ['engDescription', 'engDescription'],
        ],
    )
}
