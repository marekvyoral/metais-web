export const getEntityStructure = (entityName: string) => {
    return fetch(`https://metais.vicepremier.gov.sk/typesrepository/citypes/citype/${entityName}?lang=sk`).then((res) => res.json())
}

export const getColumnList = (entityName: string) => {
    return fetch(`https://metais.vicepremier.gov.sk/userconfig/columns/citype/${entityName}/default`).then((res) => res.json())
}
