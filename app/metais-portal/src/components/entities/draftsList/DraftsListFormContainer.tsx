import { Attribute, Gui_Profil_Standardy, useGetAttributeProfile } from '@isdd/metais-common/api'
import { ApiStandardRequest, useGetStandardRequestDetail } from '@isdd/metais-common/api/generated/standards-swagger'
import { guiProfilStandardRequestMap } from '@isdd/metais-common/api/hooks/containers/containerHelpers'
import React from 'react'
import { useParams } from 'react-router-dom'

export interface IView {
    data?: ApiStandardRequest
    guiAttributes?: Attribute[]
    isLoading: boolean
    isError: boolean
}
interface IReportsDetailContainer {
    View: React.FC<IView>
}
export const DraftsListFormContainer: React.FC<IReportsDetailContainer> = ({ View }) => {
    const { entityId } = useParams()
    const { isLoading, isError, data } = useGetStandardRequestDetail(parseInt(entityId ?? ''))
    const { data: guiData } = useGetAttributeProfile(Gui_Profil_Standardy)

    const guiAttributes: Attribute[] = [
        ...(guiData?.attributes?.map((attr) => ({
            ...attr,
            technicalName: guiProfilStandardRequestMap?.get(attr?.technicalName ?? '') ?? attr?.technicalName,
        })) ?? []),
    ]

    return <View data={data} guiAttributes={guiAttributes} isLoading={isLoading} isError={isError} />
}
