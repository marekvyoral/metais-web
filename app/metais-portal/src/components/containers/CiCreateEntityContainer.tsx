import { CiCode, HierarchyRightsUi, useGenerateCodeAndURL } from '@isdd/metais-common/api'
import React, { SetStateAction } from 'react'

export interface ISelectedOrg {
    selectedOrg: HierarchyRightsUi | null
    setSelectedOrg: React.Dispatch<SetStateAction<HierarchyRightsUi | null>>
}

export interface ICiCreateEntityContainerView {
    data: CiCode | undefined
    isLoading: boolean
    isError: boolean
}
interface ICiCreateEntityContainer {
    View: React.FC<ICiCreateEntityContainerView>
    entityName: string
}

export const CiCreateEntityContainer: React.FC<ICiCreateEntityContainer> = ({ View, entityName }) => {
    const { data: generatedEntityId, isLoading, isError } = useGenerateCodeAndURL(entityName)

    return <View data={generatedEntityId} isLoading={isLoading} isError={isError} />
}
