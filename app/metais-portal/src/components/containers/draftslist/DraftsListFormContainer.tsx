import { Gui_Profil_Standardy } from '@isdd/metais-common/api'
import { Group, useFindByUuid3 } from '@isdd/metais-common/api/generated/iam-swagger'
import { ApiStandardRequest, useGetStandardRequestDetail } from '@isdd/metais-common/api/generated/standards-swagger'
import { Attribute, useGetAttributeProfile } from '@isdd/metais-common/api/generated/types-repo-swagger'
import { guiProfilStandardRequestMap } from '@isdd/metais-common/api/hooks/containers/containerHelpers'
import React, { useMemo } from 'react'

export interface IView {
    data: {
        requestData?: ApiStandardRequest
        guiAttributes?: Attribute[]
        workGroup?: Group
    }
    isLoading: boolean
    isError: boolean
}
interface IReportsDetailContainer {
    entityId?: string
    View: React.FC<IView>
}
export const DraftsListFormContainer: React.FC<IReportsDetailContainer> = ({ entityId, View }) => {
    const { isLoading: dataIsLoading, isError: dataIsError, data: requestData } = useGetStandardRequestDetail(parseInt(entityId ?? ''))
    const { isLoading: guiDataIsLoading, isError: guiDataIsError, data: guiData } = useGetAttributeProfile(Gui_Profil_Standardy)

    const guiAttributes: Attribute[] = useMemo(() => {
        return [
            ...(guiData?.attributes?.map((attr) => ({
                ...attr,
                technicalName: guiProfilStandardRequestMap?.get(attr?.technicalName ?? '') ?? attr?.technicalName,
            })) ?? []),
        ]
    }, [guiData])

    const workingGroupId = useMemo(() => requestData?.workGroupId, [requestData])
    const {
        data: workGroup,
        isLoading: workGroupIsLoading,
        isError: workGroupIsError,
    } = useFindByUuid3(workingGroupId ?? '', { query: { enabled: !!workingGroupId } })
    const isLoading = dataIsLoading || guiDataIsLoading || (workGroupIsLoading && !!workingGroupId)
    const isError = dataIsError || guiDataIsError || workGroupIsError

    return <View data={{ requestData, guiAttributes, workGroup }} isLoading={isLoading} isError={isError} />
}
