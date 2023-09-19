import { NeighbourPairUi } from '@isdd/metais-common/api'

export const downloadFile = (link: string, fileName: string) => {
    const anchor: HTMLAnchorElement = document.createElement('a')
    anchor.href = link
    anchor.target = '_blank'
    anchor.download = fileName
    anchor.click()
}
const updatableDocuments = ['CI_HAS_DOCUMENT', 'CONTROL_HAS_DOCUMENT', 'PROJECT_HAS_DOCUMENT', 'Dokument_sa_tyka_KRIS']

export const isDocumentUpdatable = (document: NeighbourPairUi) => {
    if (document.relationship?.type !== undefined) {
        return updatableDocuments.includes(document.relationship?.type)
    } else {
        return false
    }
}

export const isDocumentsUpdatable = (documents: NeighbourPairUi[]) => {
    return documents.every((document) => isDocumentUpdatable(document))
}
