export const getEntityStructure = (entityName: string) => {
    return fetch(`https://metais.vicepremier.gov.sk/typesrepository/citypes/citype/${entityName}?lang=sk`).then((res) => res.json())
}

export const getColumnList = (entityName: string) => {
    return fetch(`https://metais.vicepremier.gov.sk/userconfig/columns/citype/${entityName}/default`).then((res) => res.json())
}

export const postTableData = () => {
    const proxyUrl = 'https://corsproxy.io/?'

    const data = {
        filter: { type: ['Program'], metaAttributes: { state: ['DRAFT'] } },
        page: 1,
        perpage: 10000,
        sortBy: 'Gen_Profil_nazov',
        sortType: 'ASC',
    }

    return fetch(proxyUrl + `https://metais.vicepremier.gov.sk/cmdb/read/cilistfiltered`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    }).then((res) => res.json())
}
