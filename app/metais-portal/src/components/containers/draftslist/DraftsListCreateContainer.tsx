import { Gui_Profil_Standardy } from '@isdd/metais-common/api'
import { useCreateStandardRequest } from '@isdd/metais-common/api/generated/standards-swagger'
import { Attribute, useGetAttributeProfile } from '@isdd/metais-common/api/generated/types-repo-swagger'
import { guiProfilStandardRequestMap } from '@isdd/metais-common/api/hooks/containers/containerHelpers'
import React, { useMemo } from 'react'
import { FieldValues } from 'react-hook-form'

interface IViewProps {
    onSubmit: (values: FieldValues) => Promise<void>
    isSuccess: boolean
    isError: boolean
    isLoading: boolean
    guiAttributes: Attribute[]
    isGuiDataLoading: boolean
    isGuiDataError: boolean
}
interface DraftsListFormContainerProps {
    View: React.FC<IViewProps>
}
export const DraftsListCreateContainer: React.FC<DraftsListFormContainerProps> = ({ View }) => {
    const { mutateAsync, isSuccess, isError, isLoading } = useCreateStandardRequest()
    const { data: guiData, isLoading: isGuiDataLoading, isError: isGuiDataError } = useGetAttributeProfile(Gui_Profil_Standardy)

    const guiAttributes: Attribute[] = useMemo(() => {
        return [
            ...(guiData?.attributes?.map((attr) => ({
                ...attr,
                technicalName: guiProfilStandardRequestMap?.get(attr?.technicalName ?? '') ?? attr?.technicalName,
            })) ?? []),
        ]
    }, [guiData])

    const handleSubmit = async (values: FieldValues) => {
        await mutateAsync({
            data: {
                ...values,
            },
        })
    }

    return (
        <View
            onSubmit={handleSubmit}
            isSuccess={isSuccess}
            isError={isError}
            isLoading={isLoading}
            guiAttributes={guiAttributes}
            isGuiDataLoading={isGuiDataLoading}
            isGuiDataError={isGuiDataError}
        />
    )
}
