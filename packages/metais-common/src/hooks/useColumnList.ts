interface Attribute {
    name?: string
    order?: number
}

interface MetaAttribute {
    name?: string
    order?: number
}

export interface IColumn {
    id?: number
    ciType?: string
    attributes?: Attribute[]
    metaAttributes?: MetaAttribute[]
}
