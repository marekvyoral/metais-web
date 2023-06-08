import React, { SetStateAction, useState } from 'react'

import { IPageConfig } from '@/hooks/useEntityRelations'
import { NeighboursFilterContainerUi, useReadCiNeighboursUsingPOST } from '@/api'
import { useParams } from 'react-router-dom'

interface IView {
    data: object
    setPageConfig: React.Dispatch<SetStateAction<IPageConfig>>
}

interface IEntityDocumentsContainer {
    View: React.FC<IView>
    LoadingView: React.FC
    ErrorView: React.FC
}

export const EntityDocumentsContainer: React.FC<IEntityDocumentsContainer> = ({ View, LoadingView, ErrorView }) => {
    const defaultPageConfig: IPageConfig = {
        page: 1,
        perPage: 100,
    }

    const { id } = useParams()
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

    const { isLoading, isError, data: documentCiData } = useReadCiNeighboursUsingPOST(id, filter, {})

    //const { isLoading, isError, data: documentCiData, resultList: documentsList } = useDocumentsListData(entityId, pageConfig)

    if (isLoading) {
        return <LoadingView />
    }

    if (isError) {
        return <ErrorView />
    }

    const mapCiData = (documentCiData) => {
        return documentCiData?.fromNodes?.neighbourPairs?.map((nP) => {
            let keyValue = []
            nP?.configurationItem?.attributes?.forEach((a) => {
                keyValue.push([a?.name, a?.value])
            })
            const attributes = Object.fromEntries(keyValue)

            return { attributes, metaAttributes: { ...nP?.configurationItem?.metaAttributes } }
        })
    }
    const data = mapCiData(documentCiData)
    console.log('data', data)
    return <View data={{ data }} setPageConfig={setPageConfig} />
}
