export const getEntityStructure = (entityName: string) => {
    return fetch(`https://metais.vicepremier.gov.sk/typesrepository/citypes/citype/${entityName}?lang=sk`).then((res) => res.json())
}
