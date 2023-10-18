import { RelatedCiTypePreview } from '@isdd/metais-common/api/generated/types-repo-swagger'
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

export const filterRelatedList = (list: RelatedCiTypePreview[] | undefined, tabName: string | string[]) => {
    return (
        list?.filter((item) =>
            Array.isArray(tabName)
                ? tabName.includes(item.ciTypeTechnicalName ?? '')
                : tabName === item.ciTypeTechnicalName &&
                  item.ciTypeValid &&
                  item.relationshipTypeValid &&
                  (item.ciCategory != 'NO' || item.relationshipCategory != 'NO') &&
                  (item.ciTypeUsageType != 'system' || item.relationshipTypeUsageType != 'system'),
        ) ?? []
    )
}

export const findRelationType = (relTechnicalName: string, relationsList: RelatedCiTypePreview[]) => {
    const relationType = relationsList.find((rel) => rel.relationshipTypeTechnicalName === relTechnicalName)
    return relationType
}
