import { EntityDocumentsContainer } from '@/components/containers/EntityDocumentContainer'
import { EntityRelationsListContainer, IRelationsView } from '@/components/containers/EntityRelationsListContainer'
import React, { useState } from 'react'

export const Documents: React.FC = () => {
    const Loading: React.FC = () => {
        return <div>loading</div>
    }

    const Error: React.FC = () => {
        return <div>error</div>
    }

    const View: React.FC<IRelationsView> = (props) => {
        debugger
        console.log(props)
        return <div>some view</div>
    }

    return <EntityDocumentsContainer entityId={'2555aa2f-175e-4c73-87a7-5401a5bd14d9'} View={View} LoadingView={Loading} ErrorView={Error} />
}
