import { RelatedCiTypePreview } from '@isdd/metais-common/api'
import { TFunction } from 'i18next'

export const createSelectRelationTypeOptions = (
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
        ...(relatedListAsSources?.map((item) => ({ label: item.relationshipTypeName ?? '', value: item.relationshipTypeTechnicalName ?? '' })) ?? []),
    ]
    const isTargetArray = relatedListAsTargets && relatedListAsTargets?.length > 0
    const targetArray = [
        { label: t('newRelation.selectTarget'), value: '', disabled: true },
        ...(relatedListAsTargets?.map((item) => ({ label: item.relationshipTypeName ?? '', value: item.relationshipTypeTechnicalName ?? '' })) ?? []),
    ]

    const combinedOptions = [...(isSourceArray ? sourceArray : []), ...(isTargetArray ? targetArray : [])]

    return combinedOptions
}
export const filterRelatedList = (list: RelatedCiTypePreview[] | undefined, tabName: string) => {
    return (
        list?.filter(
            (item) =>
                tabName === item.ciTypeTechnicalName &&
                item.ciTypeValid &&
                (item.ciCategory != 'NO' || item.relationshipCategory != 'NO') &&
                (item.ciTypeUsageType != 'system' || item.relationshipTypeUsageType != 'system'),
        ) ?? []
    )
}
