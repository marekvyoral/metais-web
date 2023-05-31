export const postDocumentParams = (id: string) => {
    //proxy for production - CORS was blocking access
    const proxyUrl = 'https://corsproxy.io/?'
    const url = `https://metais.vicepremier.gov.sk/cmdb/read/relations/neighbours/${id}`

    const params = {
        neighboursFilter: {
            usageType: ['system', 'application'],
            metaAttributes: { state: ['DRAFT'] },
            relType: ['CI_HAS_DOCUMENT', 'Dokument_sa_tyka_KRIS', 'CONTROL_HAS_DOCUMENT', 'PROJECT_HAS_DOCUMENT'],
            ciType: ['Dokument'],
        },
        page: 1,
        perpage: 100,
    }

    return fetch(proxyUrl + url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
    }).then((res) => res.json())
}

export const getDocumentsData = (id: string) => {
    return fetch(`https://metais.vicepremier.gov.sk/dms/file/meta/${id}`).then((res) => res.json())
}
