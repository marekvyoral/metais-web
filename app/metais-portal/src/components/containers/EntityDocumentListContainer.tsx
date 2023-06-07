import React, { SetStateAction, useState } from 'react'

import { useDocumentsListData } from '@/hooks/useEntityDocsListData/useEntityDocsListData'
import { IPageConfig } from '@/hooks/useEntityRelations'
import { IDocument, IDocumentsData } from '@/hooks/useEntityDocsListData/entityDocsListTypes'

export interface IDocsView {
    data: {
        documentCiData: IDocumentsData | undefined
        documentsList: (IDocument | undefined)[]
    }
    filterCallbacks: {
        setPageConfig: React.Dispatch<SetStateAction<IPageConfig>>
    }
}

interface IEntityDocumentsListContainer {
    entityId: string
    View: React.FC<IDocsView>
}

export const EntityDocumentsListContainer: React.FC<IEntityDocumentsListContainer> = ({ entityId, View }) => {
    const defaultPageConfig: IPageConfig = {
        page: 1,
        perPage: 100,
    }

    const [pageConfig, setPageConfig] = useState<IPageConfig>(defaultPageConfig)
    const { data: documentCiData, resultList } = useDocumentsListData(entityId, pageConfig)

    const documentsList = resultList.map((item) => item.data)

    return <View data={{ documentCiData, documentsList }} filterCallbacks={{ setPageConfig }} />
}
