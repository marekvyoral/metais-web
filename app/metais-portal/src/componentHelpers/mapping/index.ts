import {
    NeighbourPairsEntity,
    ReadCiNeighboursUsingPOST200_GeneratedType,
    AttributesEntity,
    AttributeValue,
    NeighbourPairsEntityMapped,
    ConfigurationItem,
    ConfigurationItemMapped,
} from '@/api/types/ReadCiNeighboursUsingPOST200_GeneratedType'

export const mapCiDataFrom = (documentCiData: ReadCiNeighboursUsingPOST200_GeneratedType | void): NeighbourPairsEntityMapped[] | undefined => {
    return documentCiData?.fromNodes?.neighbourPairs?.map((nP: NeighbourPairsEntity) => {
        //this should be changed after orval keyValue changes
        const keyValue = new Map<string, AttributeValue>()
        nP?.configurationItem?.attributes?.forEach((attribute: AttributesEntity) => {
            keyValue.set(attribute?.name, attribute?.value)
        })
        const attributes = Object.fromEntries(keyValue)

        return { ...nP, configurationItem: { ...nP?.configurationItem, attributes } } as NeighbourPairsEntityMapped
    })
}

export const mapCiDataTo = (documentCiData: ReadCiNeighboursUsingPOST200_GeneratedType | void): NeighbourPairsEntityMapped[] | undefined => {
    return documentCiData?.toNodes?.neighbourPairs?.map((nP: NeighbourPairsEntity) => {
        //this should be changed after orval keyValue changes
        const keyValue = new Map<string, AttributeValue>()
        nP?.configurationItem?.attributes?.forEach?.((attribute: AttributesEntity) => {
            keyValue.set(attribute?.name, attribute?.value)
        })
        const attributes = Object.fromEntries(keyValue)

        return { ...nP, configurationItem: { ...nP?.configurationItem, attributes } } as NeighbourPairsEntityMapped
    })
}

export const mapCiData = (documentCiData: ConfigurationItem | void) => {
    const keyValue = new Map<string, AttributeValue>()

    documentCiData?.attributes?.forEach?.((attribute: AttributesEntity) => {
        keyValue.set(attribute?.name, attribute?.value)
    })
    const attributes = Object.fromEntries(keyValue)
    return { ...documentCiData, attributes } as ConfigurationItemMapped
}
