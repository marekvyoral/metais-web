import { UseQueryResult, useQueries, useQuery } from '@tanstack/react-query'

import { IDocument } from './entityDocsListTypes'

import { NeighboursFilterContainerUi } from '@/api/generated/cmdb-swagger'
import { getDocumentsData, postDocumentParams } from '@/api/EntityDocsListApi'

export const useDocumentData = (idList: string[]) => {
    const resultList: UseQueryResult<IDocument, unknown>[] = useQueries({
        queries: idList.map((value) => {
            return {
                queryKey: ['documentsData', value],
                queryFn: () => getDocumentsData(value),
                enabled: !!value,
            }
        }),
    })

    const isLoading = resultList.some((item) => item.isLoading)
    const isError = resultList.some((item) => item.isError)

    return {
        isLoading,
        isError,
        resultList,
    }
}

export const useDocumentsListData = (id: string, entityName: string, pageConfig: NeighboursFilterContainerUi) => {
    //orval hook throwing error
    /*  const documentListData = useReadCiNeighbours(
        id,
        pageConfig,
        {},
        {
            query: {
                keepPreviousData: true,
                queryKey: [id, pageConfig.page, pageConfig.perpage, pageConfig.neighboursFilter?.ciType, entityName],
            },
        },
    ) */

    const {
        isLoading: isControlLoading,
        isError: isControlError,
        data,
    } = useQuery({
        queryKey: [id, pageConfig.page, pageConfig.perpage, pageConfig.neighboursFilter?.ciType, entityName],
        queryFn: () => postDocumentParams(id, pageConfig),
    })

    /* eslint-disable @typescript-eslint/no-explicit-any */
    const fromNodesConfigItemUuids = data?.fromNodes.neighbourPairs.map((item: any) => item.configurationItem.uuid) ?? []
    const toNodesConfigItemUuids = data?.toNodes.neighbourPairs.map((item: any) => item.configurationItem.uuid) ?? []

    const uuidsArray = [...fromNodesConfigItemUuids, ...toNodesConfigItemUuids]

    const { isLoading: isResultListLoading, isError: isResultListError, resultList } = useDocumentData(uuidsArray)

    const isLoading = [isControlLoading, isResultListLoading].some((item) => item)
    const isError = [isControlError, isResultListError].some((item) => item)

    return {
        isLoading,
        isError,
        resultList,
        data,
    }
}
