import { IPageConfig } from './../hooks/useEntityRelations'
import { urlBase } from './constants'

export const getEntityRelationsTypeCount = (id: string) => {
    return fetch(urlBase + `/cmdb/read/ci/${id}/neighbourscount?includeInvalidated=false`).then((res) => res.json())
}

export const getEntityRelationTypeData = (id: string, type: string, pageConfig: IPageConfig) => {
    return fetch(
        urlBase +
            `/cmdb/read/relations/neighbourswithallrels/${id}?&ciTypes=${type}&page=${pageConfig.page}&perPage=${pageConfig.perPage}&state=DRAFT`,
    ).then((res) => res.json())
}
