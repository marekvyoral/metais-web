import { urlBase } from './constants'
import { CiListFilterContainerUi } from './generated/cmdb-swagger'

export const getEntityStructure = (entityName: string) => {
    return fetch(urlBase + `/typesrepository/citypes/citype/${entityName}?lang=sk`).then((res) => res.json())
}

export const getColumnList = (entityName: string, userConfig: string) => {
    return fetch(urlBase + `/${userConfig}/columns/citype/${entityName}/default`).then((res) => res.json())
}

export const postTableData = (params: CiListFilterContainerUi) => {
    const proxyUrl = 'https://corsproxy.io/?'

    //maju to asi vymenene v swaggery? page vs perpage
    const postData = {
        filter: params.filter,
        perpage: params.page,
        page: params.perpage,
        sortBy: params.sortBy,
        sortType: params.sortType,
    }

    return fetch(proxyUrl + urlBase + `/cmdb/read/cilistfiltered`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
    }).then((res) => res.json())
}
