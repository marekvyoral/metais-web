import { useQueries, useQuery } from '@tanstack/react-query'

import { getDocumentsData, postDocumentParams } from '@/api/EntityDocsListApi'

export const useDocumentData = (idList: string[]) => {
    const resultList = useQueries({
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

export const useDocumentsListData = (id: string) => {
    const {
        isLoading: isControlLoading,
        isError: isControlError,
        data,
    } = useQuery({
        queryKey: ['documentsControl'],
        queryFn: () => postDocumentParams(id),
    })

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
