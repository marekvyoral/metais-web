import { IPageConfig } from '@/hooks/useEntityRelations'

export const getEntityRelationsTypeCount = (id: string) => {
    return fetch(`https://metais.vicepremier.gov.sk/cmdb/read/ci/${id}/neighbourscount?includeInvalidated=false`).then((res) => res.json())
}

export const getEntityRelationTypeData = (id: string, type: string, pageConfig: IPageConfig) => {
    return fetch(
        `https://metais.vicepremier.gov.sk/cmdb/read/relations/neighbourswithallrels/${id}?&ciTypes=${type}&page=${pageConfig.page}&perPage=${pageConfig.perPage}&state=DRAFT`,
    ).then((res) => res.json())
}
