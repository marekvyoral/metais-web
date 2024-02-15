import * as yup from 'yup'
import { AttributeProfile, Cardinality, CiTypePreview } from '@isdd/metais-common/api/generated/types-repo-swagger'
import { TFunction } from 'i18next'

import { DisabledInputs, HiddenInputs } from '@/types/inputs'

export const generateFormValidationSchema = (
    t: TFunction<'translation', undefined, 'translation'>,
    hiddenInputs?: Partial<HiddenInputs>,
    disabledInputsTypes?: Partial<DisabledInputs>,
) => {
    return yup.object().shape(
        {
            name: yup.string().when('name', {
                is: () => !hiddenInputs?.NAME && !disabledInputsTypes?.NAME,
                then: () => yup.string().required(t('egov.create.requiredField')),
                otherwise: () => yup.string(),
            }),
            engName: yup.string().when('engName', {
                is: () => !hiddenInputs?.ENG_NAME && !disabledInputsTypes?.ENG_NAME,
                then: () => yup.string().required(t('egov.create.requiredField')),
                otherwise: () => yup.string(),
            }),
            technicalName: yup
                .string()
                .required(t('egov.create.requiredField'))
                .min(2, t('egov.create.minCharacters', { min: 2 }))
                .matches(/^[a-z-A-Z_]+$/, t('egov.create.technicalNameRegex')),
            codePrefix: yup.string().when('codePrefix', {
                is: () => !hiddenInputs?.CODE_PREFIX && !disabledInputsTypes?.CODE_PREFIX,
                then: () =>
                    yup
                        .string()
                        .required(t('egov.create.requiredField'))
                        .matches(/^[a-z_\s]+$/, t('egov.create.codePrefixRegex')),
                otherwise: () => yup.string(),
            }),
            uriPrefix: yup.string().when('uriPrefix', {
                is: () => !hiddenInputs?.URI_PREFIX && !disabledInputsTypes?.URI_PREFIX,
                then: () => yup.string().required(t('egov.create.requiredField')),
                otherwise: () => yup.string(),
            }),
            description: yup.string(),
            engDescription: yup.string().when('engDescription', {
                is: () => !hiddenInputs?.ENG_DESCRIPTION && !disabledInputsTypes?.ENG_DESCRIPTION,
                then: () => yup.string(),
            }),
            attributeProfiles: yup.mixed<AttributeProfile[]>(),
            roleList: yup.array().of(yup.string()).min(1, t('egov.create.requiredField')).required(t('egov.create.requiredField')),
            type: yup.string().required(t('egov.create.requiredField')),
            sources: yup.mixed<CiTypePreview[]>().when('sources', {
                is: () => !hiddenInputs?.SOURCES && !disabledInputsTypes?.SOURCES,
                then: () => yup.array().required(t('egov.create.requiredField')),
            }),
            sourceCardinality: yup.mixed<Cardinality>(),
            targets: yup.mixed<CiTypePreview[]>().when('targets', {
                is: () => !hiddenInputs?.TARGETS && !disabledInputsTypes?.TARGETS,
                then: () => yup.array().required(t('egov.create.requiredField')),
            }),
            targetCardinality: yup.mixed<Cardinality>(),
        },
        [
            ['name', 'name'],
            ['uriPrefix', 'uriPrefix'],
            ['codePrefix', 'codePrefix'],
            ['sources', 'sources'],
            ['targets', 'targets'],
            ['engDescription', 'engDescription'],
            ['engName', 'engName'],
        ],
    )
}
