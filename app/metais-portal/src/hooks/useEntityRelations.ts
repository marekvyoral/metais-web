import { useReadCiNeighboursWithAllRelsUsingGET, useListRelatedCiTypesUsingGET, useReadNeighboursConfigurationItemsCountUsingGET } from '@/api'

export const useEntityRelationsTypesCount = (id: string, technicalName: string) => {
    const { isLoading, isError, data: countData } = useReadNeighboursConfigurationItemsCountUsingGET(id)
    const { isLoading: isRelatedLoading, isError: isRelatedError, data: relatedData } = useListRelatedCiTypesUsingGET(technicalName)
    console.log(countData, relatedData)

    const tabs = ['AS', 'Projekt', 'InfraSluzba', 'PO', 'osobitny_postup_ITVS', 'ISVS']
    const allRelation = [...(relatedData?.cisAsTargets ?? []), ...(relatedData?.cisAsSources ?? [])]
    const keysToDisplay = tabs?.map((tab) => {
        const typeName = allRelation.find((relation) => relation?.ciTypeTechnicalName === tab)?.ciTypeName
        const count = countData?.[tab] ?? 0
        return {
            tabName: `${typeName} (${count})`,
            technicalName: tab,
        }
    })

    return {
        isLoading: isLoading || isRelatedLoading,
        isError: isError || isRelatedError,
        data: allRelation,
        keysToDisplay,
    }
}

export interface IPageConfig {
    page: number
    perPage: number
}

export const useEntityRelationsDataList = (id: string, pageConfig: IPageConfig, name: string) => {
    const { data, isLoading, isError } = useReadCiNeighboursWithAllRelsUsingGET(
        id,
        {
            ciTypes: [name],
            page: pageConfig.page,
            perPage: pageConfig.perPage,
            state: ['DRAFT'],
        },
        {
            query: {
                enabled: !!name,
            },
        },
    )

    return {
        isLoading,
        isError,
        data,
    }
}
