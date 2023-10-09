import { Attribute, Gui_Profil_Standardy, useGetAttributeProfile } from '@isdd/metais-common/api'
import { Group, useFindByUuid3 } from '@isdd/metais-common/api/generated/iam-swagger'
import { ApiStandardRequest, useGetStandardRequestDetail } from '@isdd/metais-common/api/generated/standards-swagger'
import { guiProfilStandardRequestMap } from '@isdd/metais-common/api/hooks/containers/containerHelpers'
import React, { useMemo } from 'react'
import { useParams } from 'react-router-dom'

export interface IView {
    data?: ApiStandardRequest
    guiAttributes?: Attribute[]
    workGroup?: Group
    isLoading: boolean
    isError: boolean
}
interface IReportsDetailContainer {
    View: React.FC<IView>
}
export const DraftsListFormContainer: React.FC<IReportsDetailContainer> = ({ View }) => {
    const { entityId } = useParams()
    const { isLoading: dataIsLoading, isError: dataIsError, data } = useGetStandardRequestDetail(parseInt(entityId ?? ''))
    const { isLoading: guiDataIsLoading, isError: guiDataIsError, data: guiData } = useGetAttributeProfile(Gui_Profil_Standardy)

    const guiAttributes: Attribute[] = useMemo(() => {
        return [
            ...(guiData?.attributes?.map((attr) => ({
                ...attr,
                technicalName: guiProfilStandardRequestMap?.get(attr?.technicalName ?? '') ?? attr?.technicalName,
            })) ?? []),
        ]
    }, [guiData])

    const workingGroupId = useMemo(() => data?.workGroupId, [data])
    const { data: workGroup, isLoading: workGroupIsLoading, isError: workGroupIsError } = useFindByUuid3(workingGroupId ?? '')
    const isLoading = dataIsLoading || guiDataIsLoading || (workGroupIsLoading && !!workingGroupId)
    const isError = dataIsError || guiDataIsError || workGroupIsError

    return <View data={data} guiAttributes={guiAttributes} workGroup={workGroup} isLoading={isLoading} isError={isError} />
}
