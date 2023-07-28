import React from 'react'
import { Metadata, useGetMeta } from '@isdd/metais-common/api'

export interface IView {
    data?: Metadata
    isLoading: boolean
    isError: boolean
}

interface IDocumentMetaContainer {
    documentId?: string
    View: React.FC<IView>
}

export const DocumentMetaContainer: React.FC<IDocumentMetaContainer> = ({ documentId, View }) => {
    const { isLoading, isError, data } = useGetMeta(documentId ?? '')

    return documentId ? <View data={data} isLoading={isLoading} isError={isError} /> : <View isLoading={false} isError />
}
