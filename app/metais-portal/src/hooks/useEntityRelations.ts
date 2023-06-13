import { useReadCiNeighboursWithAllRelsUsingGET, useReadNeighboursConfigurationItemsCountUsingGET } from '@/api/generated/cmdb-swagger'

export const useEntityRelationsTypesCount = (id: string) => {
    const { isLoading, isError, data } = useReadNeighboursConfigurationItemsCountUsingGET(id)

    const keysToDisplay = (data && Object.keys(data).filter((item) => data[item] > 0)) ?? []

    return {
        isLoading,
        isError,
        data,
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
