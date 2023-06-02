import { BASE_URL } from '@/constants/constants'

export const getEntityStructure = (entityName: string) => {
    return fetch(BASE_URL + `/typesrepository/citypes/citype/${entityName}?lang=sk`).then((res) => res.json())
}

export const getColumnList = (entityName: string) => {
    return fetch(BASE_URL + `/userconfig/columns/citype/${entityName}/default`).then((res) => res.json())
}

export interface ITableDataParams {
    filter: {
        type: string[]
        metaAttributes: {
            state: string[]
        }
    }
    pageNumber: number
    pageSize: number
    sortBy: string
    sortType: string
}

export const postTableData = (params: ITableDataParams) => {
    const postData = {
        ...params,
        page: params.pageNumber,
        perpage: params.pageSize,
    }

    const proxyUrl = 'https://corsproxy.io/?'
    return fetch(proxyUrl + BASE_URL + `/cmdb/read/cilistfiltered`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
    }).then((res) => res.json())
}
