import { ApiAttachment } from '@isdd/metais-common/api/generated/standards-swagger'
import { TFunction } from 'i18next'
import * as yup from 'yup'

export const generateSchemaForEditDraft = (t: TFunction<'translation', undefined, 'translation'>) => {
    return yup.object().shape(
        {
            attachments: yup.array<ApiAttachment>(),
            links: yup.array().of(
                yup.object().shape({
                    linkDescription: yup.string().required(t('validation.required')),
                    url: yup.string().required(t('validation.required')),
                    linkType: yup.string().nullable(),
                    linkSize: yup.string().nullable(),
                    name: yup.string().nullable(),
                    id: yup.number(),
                    type: yup.string().nullable(),
                }),
            ),
        },
        [['links', 'links']],
    )
}
