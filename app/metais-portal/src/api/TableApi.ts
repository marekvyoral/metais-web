import { baseUrl } from './constants'

export const getEntityStructure = (entityName: string) => {
    return fetch(baseUrl + `/typesrepository/citypes/citype/${entityName}?lang=sk`).then((res) => res.json())
}

export const getColumnList = (entityName: string) => {
    return fetch(baseUrl + `/userconfig/columns/citype/${entityName}/default`).then((res) => res.json())
}

export interface IListQueryArgs {
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

export const postTableData = (params: IListQueryArgs) => {
    const proxyUrl = 'https://corsproxy.io/?'

    const postData = {
        filter: params.filter,
        perpage: params.pageSize,
        page: params.pageNumber,
        sortBy: params.sortBy,
        sortType: params.sortType,
    }

    return fetch(proxyUrl + baseUrl + `/cmdb/read/cilistfiltered`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
    }).then((res) => res.json())
}
