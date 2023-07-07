import { AttributeProfile, useGetCiTypeUsingGET, useGetSummarizingCardUsingGET } from '../api'

export const createTabNamesAndValuesMap = (profileAttributes: AttributeProfile[] | undefined) => {
    const keysToDisplay = new Map<string, AttributeProfile | undefined>()
    profileAttributes?.map((attribute) => {
        keysToDisplay.set(attribute?.name ?? '', attribute)
    })
    return keysToDisplay
}

export const useEntityProfiles = (technicalName: string) => {
    const { data: ciTypeData, isLoading: isCiTypeDataLoading, isError: isCiTypeDataError } = useGetCiTypeUsingGET(technicalName)

    const {
        data: summarizingCardData,
        isLoading: isSummarizingCardLoading,
        isError: isSummarizingCardError,
    } = useGetSummarizingCardUsingGET(technicalName)

    const keysToDisplay = createTabNamesAndValuesMap(ciTypeData?.attributeProfiles)

    return {
        isLoading: isCiTypeDataLoading || isSummarizingCardLoading,
        isError: isCiTypeDataError || isSummarizingCardError,
        ciTypeData,
        summarizingCardData,
        keysToDisplay,
    }
}
