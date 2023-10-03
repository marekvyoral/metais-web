import { ApiAttachment } from '@isdd/metais-common/api/generated/standards-swagger'
import { TFunction } from 'i18next'
import * as yup from 'yup'

export const generateSchemaForCreateDraft = (t: TFunction<'translation', undefined, 'translation'>) => {
    return yup.object().shape({
        srName: yup.string().required(t('egov.create.requiredField')),
        srDescription1: yup.string().required(t('egov.create.requiredField')),
        attachments: yup.array<ApiAttachment>(),
        proposalDescription2: yup.string(),
        proposalDescription3: yup.string(),
        impactDescription1: yup.string(),
        impactDescription5: yup.string(),
        impactDescription7: yup.string(),
    })
}
