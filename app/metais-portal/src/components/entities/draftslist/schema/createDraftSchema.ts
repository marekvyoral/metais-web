import { ApiAttachment } from '@isdd/metais-common/api/generated/standards-swagger'
import { TFunction } from 'i18next'
import * as yup from 'yup'

export const generateSchemaForCreateDraft = (t: TFunction<'translation', undefined, 'translation'>) => {
    return yup.object().shape({
        name: yup.string().required(t('validation.required')),
        description: yup.string().required(t('validation.required')),
        attachments: yup.array<ApiAttachment>(),
        placementProposal: yup.string().required(t('validation.required')),
        legislativeTextProposal: yup.string().required(t('validation.required')),
        financialImpact: yup.string().required(t('validation.required')),
        securityImpact: yup.string().required(t('validation.required')),
        privacyImpact: yup.string().required(t('validation.required')),
        links: yup.array().of(
            yup.object().shape({
                linkDescription: yup.string().required(t('validation.required')),
                url: yup.string().required(t('validation.required')),
                linkType: yup.string(),
                linkSize: yup.string(),
                name: yup.string(),
                id: yup.number(),
                type: yup.string(),
            }),
        ),
        email: yup.string(),
        actionDesription: yup.string(),
    })
}
