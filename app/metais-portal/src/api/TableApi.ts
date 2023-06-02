export const getEntityStructure = (entityName: string) => {
    return fetch(`https://metais.vicepremier.gov.sk/typesrepository/citypes/citype/${entityName}?lang=sk`).then((res) => res.json())
}

export const getColumnList = (entityName: string) => {
    return fetch(`https://metais.vicepremier.gov.sk/userconfig/columns/citype/${entityName}/default`).then((res) => res.json())
}

export interface ITableDataParams {
    filter: {
        type: string[]
        metaAttributes: {
            state: string[]
        }
    }
    page: number
    perpage: number
    sortBy: string
    sortType: string
}

//NEEDS what exactly to call this with
export const postTableData = (params: ITableDataParams) => {
    const proxyUrl = 'https://corsproxy.io/?'
    return fetch(proxyUrl + `https://metais.vicepremier.gov.sk/cmdb/read/cilistfiltered`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
    }).then((res) => res.json())
}
