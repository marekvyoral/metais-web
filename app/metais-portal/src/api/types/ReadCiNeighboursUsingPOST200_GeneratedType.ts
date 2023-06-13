export type AttributeValue = string | number | boolean
export interface MetaAttributes {
    owner: string
    state: string
    createdBy: string
    createdAt: string
    lastModifiedBy: string
    lastModifiedAt: string
}
export interface AttributesEntity {
    name: string
    value: AttributeValue
}

export interface ConfigurationItem {
    type: string
    uuid: string
    attributes?: AttributesEntity[] | null
    metaAttributes: MetaAttributes
}
export interface Relationship {
    type: string
    uuid: string
    startUuid: string
    endUuid: string
    attributes?: null[] | null
    metaAttributes: MetaAttributes
}
export interface NeighbourPairsEntity {
    relationship: Relationship
    configurationItem: ConfigurationItem
}
export interface Pagination {
    page: number
    perPage: number
    totalPages: number
    totaltems: number
}
export interface ToNodes {
    pagination: Pagination
    neighbourPairs?: NeighbourPairsEntity[] | null
}

export interface FromNodes {
    pagination: Pagination
    neighbourPairs?: NeighbourPairsEntity[] | null
}
export interface ReadCiNeighboursUsingPOST200_GeneratedType {
    fromNodes: FromNodes
    toNodes: ToNodes
}

export interface ConfigurationItemMapped {
    type: string
    uuid: string
    attributes?: { [key: string]: AttributeValue } | null
    metaAttributes: MetaAttributes
}
