export const getEntityCiData = (entityName: string) => {
    return fetch(`https://metais.vicepremier.gov.sk/typesrepository/citypes/citype/${entityName}?lang=sk`).then((res) => res.json())
}

export const getEntityCiAttributesToDisplay = (entityId: string) => {
    return fetch(`https://metais.vicepremier.gov.sk/cmdb/read/ci/${entityId}`).then((res) => res.json())
}
