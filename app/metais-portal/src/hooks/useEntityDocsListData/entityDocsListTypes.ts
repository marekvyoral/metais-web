export interface IDocument {
    uuid: string
    status: string
    version: string
    mimeType: string
    encoding: string | null
    filename: string
    contentLength: number
    created: string
    createdBy: string
    lastModified: string
    lastModifiedBy: string
}

interface Pagination {
    page: number
    perPage: number
    totalPages: number
    totalItems: number
}

interface MetaAttributes {
    owner: string
    state: string
    createdBy: string
    createdAt: string
    lastModifiedBy: string
    lastModifiedAt: string
}

interface Attribute {
    name: string
    value: string
}

interface Relationship {
    type: string
    uuid: string
    startUuid: string
    endUuid: string
    attributes: Attribute[]
    metaAttributes: MetaAttributes
}

interface ConfigurationItem {
    type: string
    uuid: string
    attributes: Attribute[]
    metaAttributes: MetaAttributes
}

interface NeighbourPair {
    relationship: Relationship
    configurationItem: ConfigurationItem
}

interface FromNodes {
    pagination: Pagination
    neighbourPairs: NeighbourPair[]
}

interface ToNodes {
    pagination: Pagination
    neighbourPairs: NeighbourPair[]
}

export interface IDocumentsData {
    fromNodes: FromNodes
    toNodes: ToNodes
}
