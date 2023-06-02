import { BASE_URL } from '@/constants/constants'
import { IPageConfig } from '@/hooks/useEntityRelations'

export const getEntityRelationsTypeCount = (id: string) => {
    return fetch(BASE_URL + `/cmdb/read/ci/${id}/neighbourscount?includeInvalidated=false`).then((res) => res.json())
}

export const getEntityRelationTypeData = (id: string, type: string, pageConfig: IPageConfig) => {
    return fetch(
        BASE_URL +
            `/cmdb/read/relations/neighbourswithallrels/${id}?&ciTypes=${type}&page=${pageConfig.page}&perPage=${pageConfig.perPage}&state=DRAFT`,
    ).then((res) => res.json())
}
