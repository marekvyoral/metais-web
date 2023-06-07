import { UseQueryResult, useQueries, useQuery } from '@tanstack/react-query'

import { IPageConfig } from '../useEntityRelations'

import { getDocumentsData, postDocumentParams } from '@/api/EntityDocsListApi'
import { IDocument, IDocumentsData } from './entityDocsListTypes'

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
    console.log(resultList)
    const isLoading = resultList.some((item) => item.isLoading)
    const isError = resultList.some((item) => item.isError)

    return {
        isLoading,
        isError,
        resultList,
    }
}

export const useDocumentsListData = (id: string, pageConfig: IPageConfig) => {
    const documentListData: UseQueryResult<IDocumentsData, unknown> = useQuery({
        queryKey: ['documentsControl'],
        queryFn: () => postDocumentParams(id, pageConfig),
    })

    const { isLoading: isControlLoading, isError: isControlError, data } = documentListData

    const fromNodesConfigItemUuids = data?.fromNodes.neighbourPairs.map((item) => item.configurationItem.uuid) ?? []
    const toNodesConfigItemUuids = data?.toNodes.neighbourPairs.map((item) => item.configurationItem.uuid) ?? []

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
