import { AttributeProfile, useGetCiTypeUsingGET, useGetSummarizingCardUsingGET } from '../api'

export const useEntityProfiles = (technicalName: string) => {
    const { data: ciTypeData, isLoading: isCiTypeDataLoading, isError: isCiTypeDataError } = useGetCiTypeUsingGET(technicalName)

    const {
        data: summarizingCardData,
        isLoading: isSummarizingCardLoading,
        isError: isSummarizingCardError,
    } = useGetSummarizingCardUsingGET(technicalName)

    const keysToDisplay = new Map<string, AttributeProfile | undefined>()
    ciTypeData?.attributeProfiles?.map((attribute) => {
        keysToDisplay.set(attribute?.name ?? '', attribute)
    })

    return {
        isLoading: isCiTypeDataLoading || isSummarizingCardLoading,
        isError: isCiTypeDataError || isSummarizingCardError,
        ciTypeData,
        summarizingCardData,
        keysToDisplay,
    }
}
