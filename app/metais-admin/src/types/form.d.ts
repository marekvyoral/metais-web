export interface CreateEntityForm {
    name: string
    engName: string | undefined
    technicalName: string
    codePrefix: string | undefined
    uriPrefix: string | undefined
    description: string
    engDescription: string | undefined
    attributeProfiles: AttributeProfile[] | undefined
    roleList: (string | undefined)[] | undefined
    type: string
    sources: CiTypePreview[] | undefined
    sourceCardinality?: Cardinality | undefined
    targets: CiTypePreview[] | undefined
    targetCardinality?: Cardinality | undefined
}
