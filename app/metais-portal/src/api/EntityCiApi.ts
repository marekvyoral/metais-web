import { BASE_URL } from '@/constants/constants'

export const getEntityCiData = (entityName: string) => {
    return fetch(BASE_URL + `/typesrepository/citypes/citype/${entityName}?lang=sk`).then((res) => res.json())
}

export const getEntityCiAttributesToDisplay = (entityId: string) => {
    return fetch(BASE_URL + `/cmdb/read/ci/${entityId}`).then((res) => res.json())
}
