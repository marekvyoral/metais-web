import { AttributeProfile, useGetAttributeOverrides, useGetCiType, useGetSummarizingCard } from '@isdd/metais-common/api/generated/types-repo-swagger'

export const createTabNamesAndValuesMap = (profileAttributes: AttributeProfile[] | undefined) => {
    const keysToDisplay = new Map<string, AttributeProfile | undefined>()
    profileAttributes?.map((attribute) => {
        keysToDisplay.set(attribute?.name ?? '', attribute)
    })
    return keysToDisplay
}

export const useEntityProfiles = (technicalName: string) => {
    const { data: ciTypeData, isLoading: isCiTypeDataLoading, isError: isCiTypeDataError, refetch: ciTypeDataRefetch } = useGetCiType(technicalName)

    const {
        data: summarizingCardData,
        isLoading: isSummarizingCardLoading,
        isError: isSummarizingCardError,
        refetch: summarizingCardRefetch,
    } = useGetSummarizingCard(technicalName)

    const {
        data: attributesOverridesData,
        isLoading: attributesOverridesLoading,
        isError: attributesOverridesError,
        refetch: attributesOverridesRefetch,
    } = useGetAttributeOverrides(technicalName)

    const refetch = () => {
        ciTypeDataRefetch()
        summarizingCardRefetch()
        attributesOverridesRefetch()
    }

    const keysToDisplay = createTabNamesAndValuesMap(ciTypeData?.attributeProfiles)

    return {
        isLoading: isCiTypeDataLoading || isSummarizingCardLoading || attributesOverridesLoading,
        isError: isCiTypeDataError || isSummarizingCardError || attributesOverridesError,
        ciTypeData,
        summarizingCardData,
        attributesOverridesData,
        keysToDisplay,
        refetch,
    }
}
