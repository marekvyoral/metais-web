import { RelatedCiTypePreview } from '@isdd/metais-common/api'
import { JOIN_OPERATOR } from '@isdd/metais-common/constants'
import { TFunction } from 'i18next'

export const createSelectRelationTypesOptions = (
    relatedListAsSources: RelatedCiTypePreview[] | undefined,
    relatedListAsTargets: RelatedCiTypePreview[] | undefined,
    t: TFunction<'translation', undefined, 'translation'>,
) => {
    const isSourceArray = relatedListAsSources && relatedListAsSources?.length > 0
    const sourceArray = [
        {
            label: t('newRelation.selectSource'),
            value: '',
            disabled: true,
        },
        ...(relatedListAsSources?.map((item) => ({
            label: `${item.relationshipTypeName} (${item.ciTypeTechnicalName})` ?? '',
            value: `${item.relationshipTypeTechnicalName}${JOIN_OPERATOR}${item.ciTypeTechnicalName}` ?? '',
        })) ?? []),
    ]
    const isTargetArray = relatedListAsTargets && relatedListAsTargets?.length > 0
    const targetArray = [
        { label: t('newRelation.selectTarget'), value: '', disabled: true },
        ...(relatedListAsTargets?.map((item) => ({
            label: `${item.relationshipTypeName} (${item.ciTypeTechnicalName})` ?? '',
            value: `${item.relationshipTypeTechnicalName}${JOIN_OPERATOR}${item.ciTypeTechnicalName}` ?? '',
        })) ?? []),
    ]

    const combinedOptions = [...(isSourceArray ? sourceArray : []), ...(isTargetArray ? targetArray : [])]

    return combinedOptions
}
