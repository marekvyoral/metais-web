import React, { SetStateAction, useState } from 'react'

import { useDocumentsListData } from '@/hooks/useEntityDocsListData/useEntityDocsListData'
import { IDocument } from '@/hooks/useEntityDocsListData/entityDocsListTypes'
import { NeighboursFilterContainerUi, NeighboursFilterUi, CiWithRelsResultUi } from '@/api/generated/cmdb-swagger'

export interface IDocsConfig {
    neighboursFilter: NeighboursFilterUi
    pageNumber: number
    pageSize: number
}

export interface IDocsView {
    data: {
        documentCiData: CiWithRelsResultUi | void | undefined
        documentsList: (IDocument | undefined)[]
    }
    filterCallbacks: {
        setPageConfig: React.Dispatch<SetStateAction<NeighboursFilterContainerUi>>
    }
}

interface IDocumentsListContainer {
    entityId: string
    entityName: string
    View: React.FC<IDocsView>
}

export const DocumentsListContainer: React.FC<IDocumentsListContainer> = ({ entityId, entityName, View }) => {
    const defaultPageConfig: NeighboursFilterContainerUi = {
        neighboursFilter: {
            usageType: ['system', 'application'],
            metaAttributes: { state: ['DRAFT'] },
            relType: ['CI_HAS_DOCUMENT', 'Dokument_sa_tyka_KRIS', 'CONTROL_HAS_DOCUMENT', 'PROJECT_HAS_DOCUMENT'],
            ciType: ['Dokument'],
        },
        page: 1,
        perpage: 100,
    }

    const [pageConfig, setPageConfig] = useState<NeighboursFilterContainerUi>(defaultPageConfig)
    const { data: documentCiData, resultList } = useDocumentsListData(entityId, entityName, pageConfig)

    const documentsList = resultList.map((item) => item.data)

    return <View data={{ documentCiData, documentsList }} filterCallbacks={{ setPageConfig }} />
}
