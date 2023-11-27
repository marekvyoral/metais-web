import { RelatedCiTypePreview, RelationshipType } from '@isdd/metais-common/api/generated/types-repo-swagger'
import { TFunction } from 'i18next'

type CreateSelectRelationTypeOptionsProps = {
    relatedListAsSources: RelatedCiTypePreview[] | undefined
    relatedListAsTargets: RelatedCiTypePreview[] | undefined
    t: TFunction<'translation', undefined, 'translation'>
    currentRole: string
}

type SimpleSelectRelationTypeOptionsProps = {
    relatedList: RelationshipType[] | undefined
}

export const createSelectRelationTypeOptions = ({
    relatedListAsSources,
    relatedListAsTargets,
    t,
    currentRole,
}: CreateSelectRelationTypeOptionsProps) => {
    const isSourceArray = relatedListAsSources && relatedListAsSources?.length > 0

    const sourceArray = [
        {
            label: t('newRelation.selectTarget'),
            value: '',
            disabled: true,
        },
        ...(relatedListAsSources
            ?.filter((rel) => rel.relationshipRoleList?.includes(currentRole))
            .map((item) => ({ label: item.relationshipTypeName ?? '', value: item.relationshipTypeTechnicalName ?? '' })) ?? []),
    ]
    const isTargetArray = relatedListAsTargets && relatedListAsTargets?.length > 0
    const targetArray = [
        { label: t('newRelation.selectSource'), value: '', disabled: true },
        ...(relatedListAsTargets
            ?.filter((rel) => rel.relationshipRoleList?.includes(currentRole))
            .map((item) => ({ label: item.relationshipTypeName ?? '', value: item.relationshipTypeTechnicalName ?? '' })) ?? []),
    ]

    const combinedOptions = [...(isTargetArray ? targetArray : []), ...(isSourceArray ? sourceArray : [])]

    return combinedOptions
}

export const createSimpleSelectRelationTypeOptions = ({ relatedList }: SimpleSelectRelationTypeOptionsProps) =>
    relatedList?.map((item) => ({ label: item.name ?? '', value: item.technicalName ?? '' })) ?? []

export const filterRelatedList = (list: RelatedCiTypePreview[] | undefined, tabName: string) => {
    return (
        list?.filter(
            (item) =>
                tabName === item.ciTypeTechnicalName &&
                item.ciTypeValid &&
                item.relationshipTypeValid &&
                (item.ciCategory != 'NO' || item.relationshipCategory != 'NO') &&
                (item.ciTypeUsageType != 'system' || item.relationshipTypeUsageType != 'system'),
        ) ?? []
    )
}

export const filterRelatedListByRelType = (list: RelatedCiTypePreview[] | undefined, technicalNames: string[]) => {
    return (
        list?.filter(
            (item) =>
                item.relationshipTypeTechnicalName &&
                technicalNames.includes(item.relationshipTypeTechnicalName) &&
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
