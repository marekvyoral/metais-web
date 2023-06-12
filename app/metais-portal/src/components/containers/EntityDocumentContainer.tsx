import React, { SetStateAction, useState } from 'react'

import { IPageConfig } from '@/hooks/useEntityRelations'
import { NeighboursFilterContainerUi, ReadCiNeighboursUsingPOST200, useReadCiNeighboursUsingPOST } from '@/api'

interface IView {
    data: object
    setPageConfig: React.Dispatch<SetStateAction<IPageConfig>>
    isLoading: boolean
    isError: boolean
}

interface IEntityDocumentsContainer {
    configurationItemId?: string
    View: React.FC<IView>
}

export const EntityDocumentsContainer: React.FC<IEntityDocumentsContainer> = ({ configurationItemId, View }) => {
    const defaultPageConfig: IPageConfig = {
        page: 1,
        perPage: 100,
    }
    const [pageConfig, setPageConfig] = useState<IPageConfig>(defaultPageConfig)

    const filter: NeighboursFilterContainerUi = {
        neighboursFilter: {
            ciType: ['Dokument'],
            metaAttributes: { state: ['DRAFT'] },
            relType: ['CI_HAS_DOCUMENT', 'Dokument_sa_tyka_KRIS', 'CONTROL_HAS_DOCUMENT', 'PROJECT_HAS_DOCUMENT'],
            usageType: ['system', 'application'],
        },
        ...pageConfig,
    }

    if (!configurationItemId) return <View data={{}} setPageConfig={setPageConfig} isLoading={false} isError={true} />

    const { isLoading, isError, data: documentCiData } = useReadCiNeighboursUsingPOST(configurationItemId, filter, {})
    const data = mapCiData(documentCiData)

    return <View data={{ data }} setPageConfig={setPageConfig} isLoading={isLoading} isError={isError} />
}

const mapCiData = (documentCiData: ReadCiNeighboursUsingPOST200 | void) => {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    return documentCiData?.fromNodes?.neighbourPairs?.map((nP: any) => {
        //todo check this after orval keyValue changes
        const keyValue = new Map<string, string>()
        nP?.configurationItem?.attributes?.forEach((attribute: any) => {
            keyValue.set(attribute?.name, attribute?.value)
        })
        const attributes = Object.fromEntries(keyValue)

        return { attributes, metaAttributes: { ...nP?.configurationItem?.metaAttributes } }
    })
}
