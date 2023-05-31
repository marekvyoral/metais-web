export const getEntityRelationsTypeCount = (id: string) => {
    return fetch(`https://metais.vicepremier.gov.sk/cmdb/read/ci/${id}/neighbourscount?includeInvalidated=false`).then((res) => res.json())
}

export const getEntityRelationTypeData = (id: string, type: string) => {
    return fetch(
        `https://metais.vicepremier.gov.sk/cmdb/read/relations/neighbourswithallrels/${id}?ciTypes=${type}&page=1&perPage=5&state=DRAFT`,
    ).then((res) => res.json())
}
