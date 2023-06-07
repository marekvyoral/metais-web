
import { urlBase } from './constants';

export const getEntityCiData = (entityName: string) => {
    return fetch(urlBase + `/typesrepository/citypes/citype/${entityName}?lang=sk`).then((res) => res.json())
}

export const getEntityCiAttributesToDisplay = (entityId: string) => {
    return fetch(urlBase + `/cmdb/read/ci/${entityId}`).then((res) => res.json())
}
