import { urlBase } from './constants'
import { NeighboursFilterContainerUi } from './generated/cmdb-swagger'

export const getDocumentsData = (id: string) => {
    return fetch(urlBase + `/dms/file/meta/${id}`).then((res) => res.json())
}
export const postDocumentParams = (id: string, pageConfig: NeighboursFilterContainerUi) => {
    const proxyUrl = 'https://corsproxy.io/?'
    const url = urlBase + `/cmdb/read/relations/neighbours/${id}`

    const params = {
        neighboursFilter: {
            usageType: ['system', 'application'],
            metaAttributes: { state: ['DRAFT'] },
            relType: ['CI_HAS_DOCUMENT', 'Dokument_sa_tyka_KRIS', 'CONTROL_HAS_DOCUMENT', 'PROJECT_HAS_DOCUMENT'],
            ciType: ['Dokument'],
        },
        page: pageConfig.page,
        perpage: pageConfig.perpage,
    }

    return fetch(proxyUrl + url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
    }).then((res) => res.json())
}
